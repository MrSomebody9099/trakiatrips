import { Router } from 'express';
import Stripe from 'stripe';

const router = Router();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

// Create Stripe coupons and promotion codes
router.post('/create-coupons', async (req, res) => {
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

    // Create fixed amount coupon for pool party extra (€30 off)
    const poolPartyCoupon = await createCouponIfNotExists('early60-coupon', {
      name: 'Early Bird Pool Party',
      amount_off: 3000, // €30 in cents
      currency: 'eur',
      duration: 'once',
      max_redemptions: 60,
      metadata: {
        description: 'Free pool party extra for early bookings (€30 value)',
        type: 'pool_party_free'
      }
    });
    results.coupons.early60 = poolPartyCoupon;

    // Create promotion codes
    results.promotionCodes.beenHereB4 = await createPromotionCodeIfNotExists('BEENHEREB4', beenHereCoupon.id);
    results.promotionCodes.fourOrMore = await createPromotionCodeIfNotExists('4ORMORE', groupCoupon.id);
    results.promotionCodes.early60 = await createPromotionCodeIfNotExists('EARLY60', poolPartyCoupon.id);

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
    const { couponCode, groupSize } = req.body;

    // Find promotion code
    const promotionCodes = await stripe.promotionCodes.list({ code: couponCode, active: true });
    
    if (promotionCodes.data.length === 0) {
      return res.status(404).json({ error: 'Coupon code not found' });
    }

    const promotionCode = promotionCodes.data[0];
    const coupon = await stripe.coupons.retrieve(promotionCode.coupon as string);
    
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

    // Server-side validation and application of coupon/promotion code
    if (couponCode) {
      try {
        // Re-validate the coupon code on server side
        const promotionCodes = await stripe.promotionCodes.list({ code: couponCode, active: true });
        
        if (promotionCodes.data.length === 0) {
          return res.status(400).json({ error: 'Invalid coupon code' });
        }

        const promotionCode = promotionCodes.data[0];
        const coupon = await stripe.coupons.retrieve(promotionCode.coupon.toString());

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
      const session = event.data.object;
      
      // Process the successful payment
      console.log('Payment successful:', session);
      
      // Here you would typically:
      // 1. Update your database with the booking information
      // 2. Send confirmation emails
      // 3. Update inventory/availability
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

export default router;