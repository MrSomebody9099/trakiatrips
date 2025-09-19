import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertGuestSchema, insertPaymentTransactionSchema } from "../../shared/schema.js";
import crypto from "crypto";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Stripe with environment variable - javascript_stripe integration
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });

  // Canonical server-side package pricing (amounts in EUR)
  const PACKAGE_PRICING = {
    '2 Day Deal': {
      total: 185,
      deposit: 56,
      remaining: 129
    },
    'Full Weekend Package': {
      total: 245,
      deposit: 74,
      remaining: 171
    }
  } as const;

  // Configure raw body parsing for Stripe webhook
  app.use('/api/stripe/webhook', express.raw({type: 'application/json'}));

  // Create a Stripe checkout session
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing is not configured. Please contact support.' });
      }

      const { packageName, paymentMode, bookingData } = req.body;

      // Validate package name and get canonical pricing
      const packagePricing = PACKAGE_PRICING[packageName as keyof typeof PACKAGE_PRICING];
      if (!packagePricing) {
        return res.status(400).json({ error: 'Invalid package selected' });
      }

      // Determine the amount to charge based on payment mode using server-side pricing
      const amount = paymentMode === 'full' ? packagePricing.total : packagePricing.deposit;
      
      // Format the amount for Stripe (in cents)
      const stripeAmount = Math.round(amount * 100);

      // For installment payments, we need to save payment method for future use
      const sessionParams: any = {
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'eur',
              product_data: {
                name: packageName,
                description: `${packageName} - ${paymentMode === 'full' ? 'Full Payment' : 'Deposit Payment'}`,
              },
              unit_amount: stripeAmount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/payment-process`,
        metadata: {
          paymentMode: paymentMode,
          packageName: packageName,
          totalAmount: packagePricing.total.toString(),
          depositAmount: packagePricing.deposit.toString(),
          remainingAmount: packagePricing.remaining.toString(),
          bookingData: JSON.stringify(bookingData),
        },
      };

      // For installment payments, set up customer and payment method saving
      if (paymentMode === 'installment') {
        // Create or retrieve Stripe customer
        let customer;
        try {
          const existingCustomers = await stripe.customers.list({
            email: bookingData.userEmail,
            limit: 1
          });
          
          if (existingCustomers.data.length > 0) {
            customer = existingCustomers.data[0];
          } else {
            customer = await stripe.customers.create({
              email: bookingData.userEmail,
              name: bookingData.userName || bookingData.userEmail,
            });
          }
        } catch (customerError) {
          console.error('Error creating/retrieving customer:', customerError);
          return res.status(500).json({ error: 'Failed to set up installment payment' });
        }

        // Configure session to save payment method for future use
        sessionParams.customer = customer.id;
        sessionParams.payment_intent_data = {
          setup_future_usage: 'off_session',
          metadata: {
            paymentType: 'deposit',
            bookingEmail: bookingData.userEmail,
            remainingAmount: packagePricing.remaining.toString(),
          }
        };
      }

      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create(sessionParams);

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
    }
  });

  // Stripe webhook endpoint for handling successful payments and scheduling remaining payments
  app.post('/api/stripe/webhook', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing is not configured' });
      }

      const sig = req.headers['stripe-signature'] as string;
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!endpointSecret) {
        console.error('Stripe webhook secret not configured');
        return res.status(500).json({ error: 'Webhook configuration error' });
      }

      let event;
      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err: any) {
        console.error(`Webhook signature verification failed:`, err.message);
        return res.status(400).json({ error: 'Webhook signature verification failed' });
      }

      // Handle the checkout session completion
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        
        if (session.metadata && session.metadata.paymentMode === 'installment') {
          // This was an installment deposit payment - schedule the remaining payment
          await scheduleRemainingPayment(session, stripe);
        }
      }

      // Handle successful payment intents for scheduled payments
      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        
        if (paymentIntent.metadata && paymentIntent.metadata.paymentType === 'balance') {
          // This was a scheduled remaining balance payment
          await handleScheduledPaymentSuccess(paymentIntent);
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Stripe webhook error:', error);
      res.status(400).json({ error: 'Webhook handler failed' });
    }
  });

  // API endpoint to process scheduled installment payments (can be called by cron job)
  app.post('/api/process-scheduled-payments', async (req, res) => {
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing is not configured' });
      }

      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Find all bookings with scheduled payments due today
      const dueBookings = await storage.getBookingsDueForPayment(today);
      
      const results: Array<{bookingId: string, success: boolean, message: string}> = [];
      
      for (const booking of dueBookings) {
        try {
          const result = await processScheduledPayment(booking, stripe);
          results.push({ bookingId: booking.id, success: result.success, message: result.message });
        } catch (error) {
          console.error(`Failed to process scheduled payment for booking ${booking.id}:`, error);
          results.push({ 
            bookingId: booking.id, 
            success: false, 
            message: error instanceof Error ? error.message : 'Unknown error' 
          });
        }
      }

      res.json({ 
        processed: results.length, 
        successful: results.filter(r => r.success).length,
        results 
      });
    } catch (error) {
      console.error('Error processing scheduled payments:', error);
      res.status(500).json({ error: 'Failed to process scheduled payments' });
    }
  });

  // put application routes here
  // prefix all routes with /api

  // use storage to perform CRUD operations on the storage interface
  // e.g. storage.insertUser(user) or storage.getUserByUsername(username)

  // Fondy payment success page
  app.get('/success', (req, res) => {
    console.log('Payment success callback:', req.query);
    res.redirect('/?payment=success');
  });

  // Fondy payment failed page
  app.get('/failed', (req, res) => {
    console.log('Payment failed callback:', req.query);
    res.redirect('/?payment=failed');
  });

  // Fondy webhook for payment verification
  app.post('/webhook', async (req, res) => {
    try {
      console.log('Fondy webhook received:', req.body);
      
      const merchantId = process.env.FONDY_MERCHANT_ID;
      const secretKey = process.env.FONDY_SECRET_KEY;
      
      if (!merchantId || !secretKey) {
        console.error('Fondy credentials not configured');
        return res.status(503).json({ error: 'Fondy payment processing is not configured. Please contact support.' });
      }

      const webhookData = req.body;
      const { order_id: orderId, order_status, amount, signature: receivedSignature } = webhookData;
      
      if (!orderId || !receivedSignature) {
        console.error('Invalid webhook data: missing order_id or signature');
        return res.status(400).json({ error: 'Invalid webhook data' });
      }

      // Verify webhook signature
      const expectedSignature = generateFondySignature(
        { ...webhookData, signature: undefined }, 
        secretKey
      );
      
      if (receivedSignature !== expectedSignature) {
        console.error('Invalid webhook signature:', { received: receivedSignature, expected: expectedSignature });
        return res.status(401).json({ error: 'Invalid signature' });
      }

      // Update booking status
      const paymentStatus = order_status === 'approved' ? 'paid' : 'failed';
      const updatedBooking = await storage.updateBookingPaymentStatus(orderId, paymentStatus);
      
      if (!updatedBooking) {
        console.error('Booking not found for order:', orderId);
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Update payment transaction
      const transaction = await storage.getPaymentTransactionByFondyOrderId(orderId);
      if (transaction) {
        await storage.updatePaymentTransaction(transaction.id, {
          status: order_status,
          fondyResponse: webhookData
        });
      }
      
      console.log(`Payment ${paymentStatus} for booking ${updatedBooking.id}, order ${orderId}`);
      
      res.status(200).json({ success: true });
      
    } catch (error) {
      console.error('Webhook processing error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // API endpoint to create booking and Fondy payment
  app.post('/api/create-payment', async (req, res) => {
    try {
      const { bookingData, guests } = req.body;
      
      const merchantId = process.env.FONDY_MERCHANT_ID;
      const secretKey = process.env.FONDY_SECRET_KEY;
      
      if (!merchantId || !secretKey) {
        return res.status(503).json({ error: 'Fondy payment processing is not configured. Please contact support.' });
      }

      // Validate booking data
      const validatedBooking = insertBookingSchema.parse(bookingData);
      
      // Generate unique order ID
      const orderId = `trakia-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Create booking in database
      const booking = await storage.createBooking({
        ...validatedBooking,
        fondyOrderId: orderId,
      });

      // Create guests
      if (guests && guests.length > 0) {
        for (const guestData of guests) {
          const validatedGuest = insertGuestSchema.parse({
            ...guestData,
            bookingId: booking.id
          });
          await storage.createGuest(validatedGuest);
        }
      }

      // Calculate payment amount based on payment plan
      const fullAmount = parseFloat(validatedBooking.totalAmount);
      const isInstallment = validatedBooking.paymentPlan === 'installment';
      const paymentAmount = isInstallment ? Math.ceil(fullAmount * 0.3) : fullAmount;
      const amountInCents = Math.round(paymentAmount * 100);

      // Create payment transaction record
      await storage.createPaymentTransaction({
        bookingId: booking.id,
        fondyOrderId: orderId,
        amount: paymentAmount.toString(),
        paymentType: validatedBooking.paymentPlan === 'installment' ? 'deposit' : 'full',
        status: 'pending'
      });

      // Create Fondy checkout parameters
      const baseUrl = process.env.REPLIT_URL || 'http://localhost:5000';
      const checkoutParams = {
        order_id: orderId,
        merchant_id: merchantId,
        order_desc: `Trakia Trips - ${validatedBooking.packageName}`,
        amount: amountInCents,
        currency: 'EUR',
        response_url: `${baseUrl}/success`,
        server_callback_url: `${baseUrl}/webhook`,
        sender_email: validatedBooking.userEmail,
        product_id: validatedBooking.packageName.replace(/\s+/g, '_').toLowerCase(),
        payment_systems: 'card,banklinks_eu',
        default_payment_system: 'card'
      };

      // Generate signature for Fondy
      const signature = generateFondySignature(checkoutParams, secretKey);
      
      // Build checkout URL
      const checkoutUrl = `https://pay.fondy.eu/merchants/${merchantId}/default/index.html?` + 
        Object.entries({ ...checkoutParams, signature })
          .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
          .join('&');
      
      console.log('Created booking:', booking.id, 'Order:', orderId, 'Amount:', paymentAmount);
      
      res.json({
        checkout_url: checkoutUrl,
        order_id: orderId,
        booking_id: booking.id
      });
      
    } catch (error) {
      console.error('Payment creation error:', error);
      res.status(400).json({ error: error instanceof Error ? error.message : 'Invalid booking data' });
    }
  });

  // API endpoint to get user bookings
  app.get('/api/bookings/:email', async (req, res) => {
    try {
      const { email } = req.params;
      const bookings = await storage.getBookingsByUserEmail(email);
      
      // Fetch guests for each booking
      const bookingsWithGuests = await Promise.all(
        bookings.map(async (booking) => {
          const guests = await storage.getGuestsByBookingId(booking.id);
          return { ...booking, guests };
        })
      );
      
      res.json(bookingsWithGuests);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  // Admin route - Get all bookings for admin dashboard
  app.get('/api/admin/bookings', async (req, res) => {
    try {
      const allBookings = await storage.getAllBookings();
      
      // Fetch guests for each booking and format for admin dashboard
      const bookingsWithGuests = await Promise.all(
        allBookings.map(async (booking) => {
          const guests = await storage.getGuestsByBookingId(booking.id);
          return {
            id: booking.id,
            leadBooker: guests.length > 0 ? guests[0].name : 'Unknown',
            email: booking.userEmail,
            phone: guests.length > 0 ? guests[0].phone : '',
            package: booking.packageName,
            guests: booking.numberOfGuests,
            amount: parseInt(booking.totalAmount),
            date: booking.dates,
            status: booking.paymentStatus
          };
        })
      );
      
      res.json(bookingsWithGuests);
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      res.status(500).json({ error: 'Failed to fetch bookings' });
    }
  });

  // API endpoint to update guest information
  app.put('/api/guests/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const guestUpdates = req.body;
      
      const updatedGuest = await storage.updateGuest(id, guestUpdates);
      
      if (!updatedGuest) {
        return res.status(404).json({ error: 'Guest not found' });
      }
      
      res.json(updatedGuest);
    } catch (error) {
      console.error('Error updating guest:', error);
      res.status(500).json({ error: 'Failed to update guest' });
    }
  });

  // API endpoint to update booking (flight number, etc.)
  app.put('/api/bookings/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const bookingUpdates = req.body;
      
      const updatedBooking = await storage.updateBooking(id, bookingUpdates);
      
      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }
      
      res.json(updatedBooking);
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ error: 'Failed to update booking' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}

// Helper function to schedule remaining payment for installment
async function scheduleRemainingPayment(session: any, stripe: any): Promise<void> {
  try {
    const bookingData = JSON.parse(session.metadata.bookingData);
    const remainingAmount = parseFloat(session.metadata.remainingAmount); // Use pre-calculated server-side amount
    
    // Check for existing booking to prevent duplicates
    const existingBooking = await storage.getBookingByStripeSession(session.id);
    if (existingBooking) {
      console.log(`Booking already exists for session ${session.id}, skipping duplicate creation`);
      return;
    }
    
    // Get the payment intent from the session
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
    const paymentMethodId = paymentIntent.payment_method;
    const customerId = session.customer;
    
    // Calculate due date (January 6th, 2025)
    const dueDate = '2025-01-06';
    
    // Create booking record with Stripe info for scheduled payment
    const booking = await storage.createBooking({
      userEmail: bookingData.userEmail,
      packageName: session.metadata.packageName,
      packagePrice: session.metadata.depositAmount,
      dates: bookingData.dates,
      numberOfGuests: bookingData.numberOfGuests,
      roomType: bookingData.roomType,
      addOns: bookingData.addOns || [],
      totalAmount: session.metadata.totalAmount,
      paymentStatus: 'deposit_paid',
      paymentPlan: 'installment',
      installmentStatus: JSON.stringify({
        deposit: 'paid',
        balance: 'pending',
        dueDate: dueDate
      }),
      stripeCustomerId: customerId,
      stripePaymentMethodId: paymentMethodId,
      stripeSessionId: session.id,
      remainingAmount: remainingAmount.toString(),
      balanceDueDate: dueDate,
    });

    // Create payment transaction record for the deposit
    await storage.createPaymentTransaction({
      bookingId: booking.id,
      stripePaymentIntentId: session.payment_intent,
      amount: session.metadata.depositAmount,
      paymentType: 'deposit',
      status: 'succeeded',
      paymentProvider: 'stripe',
      stripeResponse: JSON.stringify(paymentIntent),
      processedAt: new Date(),
    });

    // Create a scheduled payment transaction record for the remaining balance
    const scheduledDate = new Date(dueDate);
    await storage.createPaymentTransaction({
      bookingId: booking.id,
      amount: remainingAmount.toString(),
      paymentType: 'balance',
      status: 'scheduled',
      paymentProvider: 'stripe',
      scheduledAt: scheduledDate,
    });

    console.log(`Scheduled remaining payment of €${remainingAmount} for booking ${booking.id} on ${dueDate}`);
  } catch (error) {
    console.error('Error scheduling remaining payment:', error);
    throw error;
  }
}

// Helper function to handle successful scheduled payment
async function handleScheduledPaymentSuccess(paymentIntent: any): Promise<void> {
  try {
    const bookingId = paymentIntent.metadata.bookingId;
    
    // Find the booking and update status
    const booking = await storage.getBooking(bookingId);
    if (booking && booking.paymentPlan === 'installment') {
      // Update booking payment status using correct method
      await storage.updateBookingStatusById(booking.id, 'paid');
      
      // Update installment status
      await storage.updateBooking(booking.id, {
        installmentStatus: JSON.stringify({
          deposit: 'paid',
          balance: 'paid',
          dueDate: booking.balanceDueDate
        })
      });

      // Update the scheduled payment transaction
      await storage.updatePaymentTransactionByStripeIntent(paymentIntent.id, {
        status: 'succeeded',
        stripeResponse: JSON.stringify(paymentIntent),
        processedAt: new Date(),
      });
    }

    console.log(`Successfully processed scheduled payment for booking ${bookingId}`);
  } catch (error) {
    console.error('Error handling scheduled payment success:', error);
    throw error;
  }
}

// Helper function to process a scheduled payment
async function processScheduledPayment(booking: any, stripe: any): Promise<{ success: boolean; message: string }> {
  try {
    if (!booking.stripeCustomerId || !booking.stripePaymentMethodId || !booking.remainingAmount) {
      return { success: false, message: 'Missing required payment information' };
    }

    const amountInCents = Math.round(parseFloat(booking.remainingAmount) * 100);

    // Create payment intent for the remaining balance
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'eur',
      customer: booking.stripeCustomerId,
      payment_method: booking.stripePaymentMethodId,
      confirm: true,
      off_session: true, // Indicates this is for a saved payment method
      metadata: {
        paymentType: 'balance',
        bookingId: booking.id,
        bookingEmail: booking.userEmail,
        originalBookingAmount: booking.totalAmount,
      },
      description: `${booking.packageName} - Remaining Balance Payment`,
    });

    if (paymentIntent.status === 'succeeded') {
      // Payment succeeded immediately
      await handleScheduledPaymentSuccess(paymentIntent);
      return { success: true, message: 'Payment processed successfully' };
    } else {
      return { success: false, message: `Payment status: ${paymentIntent.status}` };
    }
  } catch (error: any) {
    console.error(`Error processing scheduled payment for booking ${booking.id}:`, error);
    
    // Handle specific Stripe errors
    if (error.code === 'authentication_required') {
      return { success: false, message: 'Payment requires customer authentication' };
    } else if (error.code === 'card_declined') {
      return { success: false, message: 'Card was declined' };
    } else {
      return { success: false, message: error.message || 'Payment processing failed' };
    }
  }
}

// Helper function to generate Fondy signature
function generateFondySignature(params: Record<string, any>, secretKey: string): string {
  // Remove signature from params if it exists
  const { signature, ...cleanParams } = params;
  
  // Sort parameters by key and create signature string
  const sortedKeys = Object.keys(cleanParams).sort();
  const signatureString = sortedKeys
    .filter(key => cleanParams[key] !== undefined && cleanParams[key] !== null)
    .map(key => `${key}=${cleanParams[key]}`)
    .join('|');
  
  // Add secret key to the end
  const fullString = `${secretKey}|${signatureString}`;
  
  // Generate SHA1 hash
  return crypto.createHash('sha1').update(fullString).digest('hex');
}
