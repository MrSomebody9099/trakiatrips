import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { storage } from '../storage';

// Load environment variables
import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Admin authentication middleware
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const password = req.headers.authorization?.replace('Bearer ', '');
  if (password !== 'MO1345') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
};

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

const router = Router();

// Create Stripe coupons and promotion codes - ADMIN PROTECTED
router.post('/create-coupons', adminAuth, async (req, res) => {
  try {
    const results: any = { coupons: {}, promotionCodes: {} };

    // Helper function to create coupon if it doesn't exist
    const createCouponIfNotExists = async (couponId: string, couponData: any) => {
      try {
        const coupon = await stripe.coupons.retrieve(couponId);
        return coupon;
      } catch (error: any) {
        if (error.code === 'resource_missing') {
          return await stripe.coupons.create({ id: couponId, ...couponData });
        }
        throw error;
      }
    };

    // Helper function to create promotion code if it doesn't exist
    const createPromotionCodeIfNotExists = async (code: string, couponId: string) => {
      try {
        const existingCodes = await stripe.promotionCodes.list({ code });
        if (existingCodes.data.length > 0) {
          return existingCodes.data[0];
        }
        return await stripe.promotionCodes.create({
          coupon: couponId,
          code,
        });
      } catch (error) {
        throw error;
      }
    };

    // Create 10% discount coupon for returning customers
    const beenHereCoupon = await createCouponIfNotExists('beenhereb4-coupon', {
      name: 'Returning Customer Discount',
      percent_off: 10,
      duration: 'once',
      metadata: {
        description: '10% discount for returning customers',
        type: 'percentage_discount'
      }
    });
    results.coupons.beenHereB4 = beenHereCoupon;

    // Create 10% discount coupon for groups of 4+
    const groupCoupon = await createCouponIfNotExists('4ormore-coupon', {
      name: 'Group Discount',
      percent_off: 10,
      duration: 'once',
      metadata: {
        description: '10% discount for groups of 4 or more people',
        type: 'group_discount'
      }
    });
    results.coupons.fourOrMore = groupCoupon;


    // Create promotion codes
    results.promotionCodes.beenHereB4 = await createPromotionCodeIfNotExists('BEENHEREB4', beenHereCoupon.id);
    results.promotionCodes.fourOrMore = await createPromotionCodeIfNotExists('4ORMORE', groupCoupon.id);

    res.json({
      success: true,
      message: 'Coupons and promotion codes created successfully',
      ...results
    });
  } catch (error: any) {
    console.error('Error creating coupons:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create coupons' });
  }
});

// Validate promotion code
router.post('/validate-coupon', async (req, res) => {
  try {
    const { couponCode, groupSize, paymentMode } = req.body;

    // Find promotion code
    const promotionCodes = await stripe.promotionCodes.list({ code: couponCode, active: true });
    
    if (promotionCodes.data.length === 0) {
      return res.status(404).json({ error: 'Coupon code not found' });
    }

    const promotionCode = promotionCodes.data[0];
    // Retrieve the coupon using the coupon ID from the promotion code
    const couponId = typeof promotionCode.coupon === 'string' ? promotionCode.coupon : promotionCode.coupon.id;
    const coupon = await stripe.coupons.retrieve(couponId);
    
    // Special validation for 4ORMORE coupon
    if (couponCode === '4ORMORE' && groupSize < 4) {
      return res.status(400).json({ 
        error: 'This coupon is only valid for groups of 4 or more people',
        suggestion: `You have ${groupSize} people. Add ${4 - groupSize} more to use this discount!`
      });
    }


    // Check if promotion code is active
    if (!promotionCode.active) {
      return res.status(400).json({ error: 'This coupon is no longer active' });
    }

    // Check if coupon is still valid
    if (!coupon.valid) {
      return res.status(400).json({ error: 'This coupon is no longer valid' });
    }

    // Check redemption limits
    if (promotionCode.max_redemptions && promotionCode.times_redeemed >= promotionCode.max_redemptions) {
      return res.status(400).json({ error: 'This coupon has reached its usage limit' });
    }

    if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
      return res.status(400).json({ error: 'This coupon has reached its usage limit' });
    }


    res.json({
      valid: true,
      promotionCode: {
        id: promotionCode.id,
        code: promotionCode.code,
        active: promotionCode.active,
        times_redeemed: promotionCode.times_redeemed,
        max_redemptions: promotionCode.max_redemptions
      },
      coupon: {
        id: coupon.id,
        name: coupon.name,
        percent_off: coupon.percent_off,
        amount_off: coupon.amount_off,
        metadata: coupon.metadata,
        remaining_redemptions: coupon.max_redemptions ? coupon.max_redemptions - coupon.times_redeemed : null
      }
    });
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to validate coupon' });
  }
});

// Create a checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { packageName, packageType, paymentMode, totalAmount, depositAmount, bookingData, couponCode, groupSize } = req.body;

    // Determine the amount to charge based on payment mode
    const amount = paymentMode === 'full' ? totalAmount : depositAmount;
    
    // Format the amount for Stripe (in cents)
    const stripeAmount = Math.round(amount * 100);

    // Prepare checkout session options
    const sessionOptions: any = {
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: packageName,
              description: `${packageType} - ${paymentMode === 'full' ? 'Full Payment' : 'Deposit Payment'}`,
            },
            unit_amount: stripeAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.origin || req.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || req.get('origin')}/payment-process`,
      payment_intent_data: {
        metadata: {
          bookingData: JSON.stringify(bookingData),
          paymentMode: paymentMode,
          totalAmount: totalAmount.toString(),
          depositAmount: depositAmount.toString(),
          ...(couponCode && { couponCode }),
          ...(groupSize && { groupSize: groupSize.toString() }),
        },
      },
      // Customize the appearance of the checkout page
      custom_text: {
        submit: {
          message: 'Trakia Trips will process your payment securely through Stripe.',
        },
      },
    };

    // For installment payments, setup future usage to save the payment method
    if (paymentMode === 'installment') {
      sessionOptions.payment_intent_data.setup_future_usage = 'off_session';
      sessionOptions.customer_creation = 'always';
    }

    // Server-side validation and application of coupon/promotion code
    if (couponCode) {
      try {
        // Re-validate the coupon code on server side
        const promotionCodes = await stripe.promotionCodes.list({ code: couponCode, active: true });
        
        if (promotionCodes.data.length === 0) {
          return res.status(400).json({ error: 'Invalid coupon code' });
        }

        const promotionCode = promotionCodes.data[0];
        // Retrieve the coupon using the coupon ID from the promotion code
        const couponId = typeof promotionCode.coupon === 'string' ? promotionCode.coupon : promotionCode.coupon.id;
        const coupon = await stripe.coupons.retrieve(couponId);

        // Validate group size for 4ORMORE coupon
        if (couponCode === '4ORMORE' && (!groupSize || groupSize < 4)) {
          return res.status(400).json({ 
            error: 'This coupon is only valid for groups of 4 or more people',
            suggestion: groupSize ? `You have ${groupSize} people. Add ${4 - groupSize} more to use this discount!` : 'Please specify group size'
          });
        }

        // Check if promotion code and coupon are still valid
        if (!promotionCode.active || !coupon.valid) {
          return res.status(400).json({ error: 'This coupon is no longer valid' });
        }

        // Check redemption limits
        if (promotionCode.max_redemptions && promotionCode.times_redeemed >= promotionCode.max_redemptions) {
          return res.status(400).json({ error: 'This coupon has reached its usage limit' });
        }

        if (coupon.max_redemptions && coupon.times_redeemed >= coupon.max_redemptions) {
          return res.status(400).json({ error: 'This coupon has reached its usage limit' });
        }

        // Apply the promotion code
        sessionOptions.discounts = [{
          promotion_code: promotionCode.id,
        }];

      } catch (error: any) {
        console.error('Error validating coupon for checkout:', error);
        return res.status(400).json({ error: 'Failed to validate coupon code' });
      }
    }

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionOptions);

    res.json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create checkout session' });
  }
});

// Webhook to handle successful payments
router.post('/webhook', async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(payload, sig as string, process.env.STRIPE_WEBHOOK_SECRET || '');
    
    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('Payment successful:', session.id);
      
      // Get payment intent to access metadata and payment method
      const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent as string);
      const metadata = paymentIntent.metadata;
      
      if (!metadata.bookingData) {
        console.error('No booking data found in payment metadata');
        return res.status(400).send('No booking data found');
      }
      
      const bookingData = JSON.parse(metadata.bookingData);
      const paymentMode = metadata.paymentMode;
      const totalAmount = parseFloat(metadata.totalAmount);
      const depositAmount = parseFloat(metadata.depositAmount);
      
      // Calculate remaining amount for installments
      const remainingAmount = paymentMode === 'installment' ? totalAmount - depositAmount : 0;
      
      // Create the booking record
      const bookingRecord = {
        userEmail: bookingData.email,
        leadBookerName: bookingData.name,
        leadBookerPhone: bookingData.phone,
        packageName: bookingData.packageName,
        packagePrice: bookingData.packagePrice.toString(),
        dates: bookingData.dates,
        numberOfGuests: bookingData.numberOfGuests,
        roomType: bookingData.roomType,
        addOns: bookingData.addOns || [],
        totalAmount: totalAmount.toString(),
        paymentStatus: paymentMode === 'full' ? 'paid' : 'partial',
        paymentPlan: paymentMode,
        depositPaid: true,
        stripeCustomerId: session.customer as string,
        stripePaymentMethodId: paymentIntent.payment_method as string,
        stripeSessionId: session.id,
        remainingAmount: remainingAmount > 0 ? remainingAmount.toString() : null,
        balanceDueDate: paymentMode === 'installment' ? '2026-01-06' : null,
        flightNumber: bookingData.flightNumber,
        installmentStatus: paymentMode === 'installment' ? 
          JSON.stringify({ deposit: 'paid', balance: 'pending', dueDate: '2026-01-06' }) : null
      };
      
      try {
        // Create the booking in the database
        const createdBooking = await storage.createBooking(bookingRecord);
        
        // Create payment transaction record with the booking ID
        const transactionRecord = {
          bookingId: createdBooking.id,
          stripePaymentIntentId: paymentIntent.id,
          amount: depositAmount.toString(),
          paymentType: paymentMode === 'full' ? 'full' : 'deposit',
          status: 'succeeded',
          paymentProvider: 'stripe',
          stripeResponse: JSON.stringify({
            session_id: session.id,
            payment_intent_id: paymentIntent.id,
            customer_id: session.customer,
            payment_method_id: paymentIntent.payment_method
          }),
          processedAt: new Date()
        };
        
        await storage.createPaymentTransaction(transactionRecord);
        
        console.log(`Booking ${createdBooking.id} and payment transaction created successfully`);
        
      } catch (dbError: any) {
        console.error('Database error:', dbError);
        // Continue - don't fail the webhook for DB issues
      }
    }
    
    res.status(200).send();
  } catch (error: any) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

// Suggest coupon for group bookings
router.post('/suggest-coupon', async (req, res) => {
  try {
    const { groupSize } = req.body;

    if (groupSize >= 4) {
      return res.json({
        suggestion: true,
        couponCode: '4ORMORE',
        message: `Great! Since you're booking for ${groupSize} people, you qualify for our group discount. Use coupon code "4ORMORE" to get 10% off your total booking!`,
        discount: '10% off'
      });
    }

    return res.json({
      suggestion: false,
      message: `You're booking for ${groupSize} people. Book for 4 or more to qualify for our group discount!`
    });
  } catch (error: any) {
    console.error('Error suggesting coupon:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to suggest coupon' });
  }
});

// Function to charge remaining balance for installment bookings
async function chargeRemainingBalance(booking: any) {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(parseFloat(booking.remainingAmount) * 100), // Convert to cents
      currency: 'eur',
      customer: booking.stripeCustomerId,
      payment_method: booking.stripePaymentMethodId,
      off_session: true,
      confirm: true,
      metadata: {
        bookingId: booking.id,
        paymentType: 'balance',
      },
    });

    // Update booking status to fully paid
    await storage.updateBooking(booking.id, {
      paymentStatus: 'paid',
      installmentStatus: JSON.stringify({ deposit: 'paid', balance: 'paid', dueDate: '2026-01-06' })
    });

    // Create payment transaction record
    const transactionRecord = {
      bookingId: booking.id,
      stripePaymentIntentId: paymentIntent.id,
      amount: booking.remainingAmount,
      paymentType: 'balance',
      status: 'succeeded',
      paymentProvider: 'stripe',
      stripeResponse: JSON.stringify(paymentIntent),
      processedAt: new Date()
    };

    console.log(`Successfully charged remaining balance for booking ${booking.id}`);
    return { success: true, paymentIntent };

  } catch (error: any) {
    console.error(`Failed to charge remaining balance for booking ${booking.id}:`, error);
    
    // Create payment link as fallback
    const paymentLink = await createPaymentLinkForFailedCharge(booking);
    
    return { success: false, error, paymentLink };
  }
}

// Create payment link for failed auto-charges
async function createPaymentLinkForFailedCharge(booking: any) {
  try {
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${booking.packageName} - Final Payment`,
              description: 'Final installment payment for your Trakia Trips booking',
            },
            unit_amount: Math.round(parseFloat(booking.remainingAmount) * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        bookingId: booking.id,
        paymentType: 'balance',
        fallbackPayment: 'true',
      },
    });

    console.log(`Created payment link for booking ${booking.id}: ${paymentLink.url}`);
    return paymentLink;

  } catch (error: any) {
    console.error(`Failed to create payment link for booking ${booking.id}:`, error);
    return null;
  }
}

// Endpoint to process balance payments (to be called on Jan 6th)
router.post('/process-balance-payments', adminAuth, async (req, res) => {
  try {
    // Find all bookings with outstanding balances due today or overdue
    const targetDate = req.body.dueDate || '2026-01-06'; // Allow override for testing
    
    const results = {
      processed: 0,
      succeeded: 0,
      failed: 0,
      errors: [] as any[]
    };

    console.log(`Processing balance payments for date: ${targetDate}`);
    
    // Get bookings due for payment
    const outstandingBookings = await storage.getBookingsDueForPayment(targetDate);
    
    console.log(`Found ${outstandingBookings.length} bookings due for payment`);
    
    for (const booking of outstandingBookings) {
      results.processed++;
      console.log(`Processing booking ${booking.id} for user ${booking.userEmail}`);
      
      const result = await chargeRemainingBalance(booking);
      
      if (result.success) {
        results.succeeded++;
        console.log(`Successfully charged ${booking.userEmail} for booking ${booking.id}`);
      } else {
        results.failed++;
        results.errors.push({
          bookingId: booking.id,
          userEmail: booking.userEmail,
          error: result.error?.message,
          paymentLink: result.paymentLink?.url
        });
        console.error(`Failed to charge ${booking.userEmail} for booking ${booking.id}: ${result.error?.message}`);
      }
    }

    res.json({
      success: true,
      message: `Processed ${results.processed} bookings. ${results.succeeded} succeeded, ${results.failed} failed.`,
      ...results
    });

  } catch (error: any) {
    console.error('Error processing balance payments:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to process balance payments' });
  }
});

// Manual payment link generation for customers
router.post('/create-balance-payment-link', adminAuth, async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ error: 'Booking ID is required' });
    }

    const booking = await storage.getBooking(bookingId);
    
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    
    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ error: 'Booking is already fully paid' });
    }
    
    if (booking.paymentPlan !== 'installment') {
      return res.status(400).json({ error: 'This booking is not an installment payment' });
    }
    
    const paymentLink = await createPaymentLinkForFailedCharge(booking);
    
    if (!paymentLink) {
      return res.status(500).json({ error: 'Failed to create payment link' });
    }

    res.json({
      success: true,
      paymentLink: paymentLink.url,
      message: 'Payment link created successfully'
    });

  } catch (error: any) {
    console.error('Error creating payment link:', error);
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to create payment link' });
  }
});

export default router;