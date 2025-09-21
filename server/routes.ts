import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertGuestSchema, insertPaymentTransactionSchema, insertLeadSchema } from "../shared/schema";
import crypto from "crypto";
import Stripe from "stripe";
import stripeRoutes from "./routes/stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Stripe with environment variable - javascript_stripe integration
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // Register Stripe coupon routes
  app.use('/api/stripe', stripeRoutes);

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

  // Raw body parsing for Stripe webhook is configured in server/index.ts

  // Email collection API endpoint
  app.post('/api/collect-email', async (req, res) => {
    try {
      const { email, status = 'email_only' } = req.body;

      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }

      // Validate email format
      const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
      }

      // Check if email already exists
      const existingLead = await storage.getLeadByEmail(email);
      if (existingLead) {
        return res.json({ 
          success: true, 
          message: 'Email already collected',
          lead: existingLead
        });
      }

      // Create new lead
      const newLead = await storage.createLead({ email, status });
      
      return res.json({ 
        success: true, 
        message: 'Email collected successfully',
        lead: newLead
      });

    } catch (error) {
      console.error('Error collecting email:', error);
      return res.status(500).json({ error: 'Failed to save email. Please try again.' });
    }
  });

  // Create pending booking endpoint - saves booking data immediately when user clicks "Proceed to Pay"
  app.post('/api/create-pending-booking', async (req, res) => {
    try {
      const { userEmail, packageName, packagePrice, dates, numberOfGuests, roomType, addOns, totalAmount, paymentPlan, flightNumber, guests } = req.body;

      if (!userEmail || !packageName || !totalAmount) {
        return res.status(400).json({ error: 'Required fields missing: userEmail, packageName, totalAmount' });
      }

      // Check for existing pending bookings with same email - reactivate if found
      const existingPendingBookings = await storage.getPendingBookingsByEmail(userEmail);
      
      if (existingPendingBookings.length > 0) {
        // Reactivate the most recent pending booking
        const latestBooking = existingPendingBookings.sort((a, b) => 
          new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
        )[0];
        
        const reactivatedBooking = await storage.reactivatePendingBooking(latestBooking.id);
        
        // Update lead status to link to this booking
        await storage.updateLeadStatus(userEmail, 'booking_started', reactivatedBooking?.id);
        
        console.log(`Reactivated existing pending booking ${reactivatedBooking?.id} for ${userEmail}`);
        
        return res.json({ 
          success: true, 
          message: 'Existing booking reactivated',
          booking: reactivatedBooking,
          reactivated: true
        });
      }

      // Create new pending booking
      const bookingData = {
        userEmail,
        packageName,
        packagePrice,
        dates,
        numberOfGuests,
        roomType,
        addOns: addOns || [],
        totalAmount,
        paymentStatus: 'pending',
        paymentPlan: paymentPlan || 'full',
        flightNumber
      };

      const newBooking = await storage.createBooking(bookingData);
      
      // Update lead status to link to this booking
      await storage.updateLeadStatus(userEmail, 'booking_started', newBooking.id);

      // Create guest records if provided
      if (guests && guests.length > 0) {
        for (const guest of guests) {
          await storage.createGuest({
            bookingId: newBooking.id,
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            dateOfBirth: guest.date_of_birth
          });
        }
      }

      console.log(`Created pending booking ${newBooking.id} for ${userEmail}`);
      
      return res.json({ 
        success: true, 
        message: 'Pending booking created successfully',
        booking: newBooking,
        reactivated: false
      });

    } catch (error) {
      console.error('Error creating pending booking:', error);
      return res.status(500).json({ error: 'Failed to create pending booking' });
    }
  });

  // Get booking details by ID - for PaymentSuccess page
  app.get('/api/booking/:id', async (req, res) => {
    try {
      const bookingId = req.params.id;
      
      if (!bookingId) {
        return res.status(400).json({ error: 'Booking ID is required' });
      }

      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      // Get guests for this booking
      const guests = await storage.getGuestsByBookingId(bookingId);
      
      return res.json({ 
        success: true,
        booking: {
          ...booking,
          guests
        }
      });

    } catch (error) {
      console.error('Error fetching booking:', error);
      return res.status(500).json({ error: 'Failed to fetch booking details' });
    }
  });

  // Update booking payment status - RESTRICTED for security (only allows 'failed' status from client)
  app.post('/api/booking/:id/status', async (req, res) => {
    try {
      const bookingId = req.params.id;
      const { paymentStatus } = req.body;
      
      if (!bookingId || !paymentStatus) {
        return res.status(400).json({ error: 'Booking ID and payment status are required' });
      }

      // SECURITY: Only allow 'failed' status from client. 'paid' status must come from secure webhooks
      if (!['failed'].includes(paymentStatus)) {
        return res.status(400).json({ error: 'Invalid payment status. Only failed payments can be updated by client.' });
      }

      const updatedBooking = await storage.updateBookingStatusById(bookingId, paymentStatus);
      
      if (!updatedBooking) {
        return res.status(404).json({ error: 'Booking not found' });
      }

      console.log(`Updated booking ${bookingId} status to ${paymentStatus}`);
      
      return res.json({ 
        success: true,
        message: 'Booking status updated successfully',
        booking: updatedBooking
      });

    } catch (error) {
      console.error('Error updating booking status:', error);
      return res.status(500).json({ error: 'Failed to update booking status' });
    }
  });

  // Create a Stripe checkout session with subscription support for installments
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { packageName, paymentMode, bookingData } = req.body;

      // Validate package name and get canonical pricing
      const packagePricing = PACKAGE_PRICING[packageName as keyof typeof PACKAGE_PRICING];
      if (!packagePricing) {
        return res.status(400).json({ error: 'Invalid package selected' });
      }

      if (paymentMode === 'full') {
        // Full payment - single charge
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          allow_promotion_codes: true,
          line_items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: packageName,
                  description: `${packageName} - Full Payment`,
                },
                unit_amount: packagePricing.total * 100, // Convert to cents
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          success_url: `${req.protocol}://${req.get('host')}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=full`,
          cancel_url: `${req.protocol}://${req.get('host')}/payment-process`,
          metadata: {
            paymentMode: 'full',
            packageName: packageName,
            totalAmount: packagePricing.total.toString(),
            bookingId: bookingData.bookingId,
            userEmail: bookingData.userEmail,
          },
        });

        return res.json({ url: session.url });
      } 
      
      if (paymentMode === 'installment') {
        // Installment payment using Stripe Subscription Schedules
        
        // Create or retrieve customer
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

        // Create checkout session for subscription with deposit payment
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          allow_promotion_codes: true,
          mode: 'subscription',
          customer: customer.id,
          line_items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: packageName,
                  description: `${packageName} - Installment Plan\nDeposit: €${packagePricing.deposit} (charged today)\nRemaining: €${packagePricing.remaining} (due Jan 6, 2026)`,
                },
                unit_amount: packagePricing.deposit * 100, // Deposit amount in cents
                recurring: {
                  interval: 'month'
                }
              },
              quantity: 1,
            },
          ],
          metadata: {
            paymentMode: 'installment',
            packageName: packageName,
            totalAmount: packagePricing.total.toString(),
            depositAmount: packagePricing.deposit.toString(),
            remainingAmount: packagePricing.remaining.toString(),
            bookingId: bookingData.bookingId,
            userEmail: bookingData.userEmail,
            customerId: customer.id,
          },
          success_url: `${req.protocol}://${req.get('host')}/payment-success?session_id={CHECKOUT_SESSION_ID}&type=installment`,
          cancel_url: `${req.protocol}://${req.get('host')}/payment-process`,
        });

        return res.json({ url: session.url });
      }

      return res.status(400).json({ error: 'Invalid payment mode' });
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

      // Handle checkout session completion for full payments
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id, 'Payment mode:', session.metadata?.paymentMode);
        
        if (session.metadata?.paymentMode === 'full') {
          // Full payment completed - create booking record
          await handleFullPaymentSuccess(session);
        } else if (session.metadata?.paymentMode === 'installment') {
          // Handle deposit payment for installment subscriptions
          await handleInstallmentDepositSuccess(session);
        }
      }

      // Handle subscription creation for installment payments
      if (event.type === 'customer.subscription.created') {
        const subscription = event.data.object;
        console.log('Subscription created:', subscription.id);
        
        // CRITICAL FIX: Subscriptions don't inherit metadata from sessions
        // Always check if this is an installment subscription by looking up the session
        await handleInstallmentSubscriptionCreated(subscription, stripe);
      }

      // Handle successful payment of scheduled subscription invoice (final installment)
      if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        
        // Check if this is our scheduled final payment from subscription schedule
        // Look for final_installment in line item metadata since Stripe doesn't promote item metadata to invoice metadata
        const isFinalInstallment = (invoice as any).subscription && invoice.lines?.data?.some(
          (line: any) => line.metadata?.paymentType === 'final_installment'
        );
        
        if (isFinalInstallment) {
          await handleFinalInstallmentSuccess(invoice, stripe);
        }
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Stripe webhook error:', error);
      res.status(400).json({ error: 'Webhook handler failed' });
    }
  });

  // API endpoint to list subscription schedules (for debugging/monitoring) - DEVELOPMENT ONLY
  app.get('/api/subscription-schedules', async (req, res) => {
    // Only allow in development environment
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ error: 'Not found' });
    }
    try {
      if (!stripe) {
        return res.status(503).json({ error: 'Payment processing is not configured' });
      }

      const schedules = await stripe.subscriptionSchedules.list({
        limit: 50,
        expand: ['data.subscription']
      });
      
      res.json({ 
        schedules: schedules.data.map(schedule => ({
          id: schedule.id,
          status: schedule.status,
          customer: schedule.customer,
          created: schedule.created,
          phases: schedule.phases.map(phase => ({
            start_date: phase.start_date,
            end_date: phase.end_date,
            items: phase.items
          }))
        }))
      });
    } catch (error) {
      console.error('Error fetching subscription schedules:', error);
      res.status(500).json({ error: 'Failed to fetch subscription schedules' });
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

// Helper function to handle successful full payment
async function handleFullPaymentSuccess(session: any): Promise<void> {
  try {
    const bookingId = session.metadata.bookingId;
    
    if (!bookingId) {
      console.error('No bookingId found in session metadata');
      return;
    }
    
    // Idempotency check: check if booking is already paid
    const existingBooking = await storage.getBooking(bookingId);
    if (existingBooking?.paymentStatus === 'paid') {
      console.log(`Booking ${bookingId} already marked as paid, skipping duplicate processing`);
      return;
    }
    
    // Update existing booking to paid status
    const updatedBooking = await storage.updateBookingStatusById(bookingId, 'paid');
    
    if (!updatedBooking) {
      console.error(`Booking ${bookingId} not found for payment completion`);
      return;
    }

    // Use authoritative Stripe amount (in cents) converted to euros
    const actualAmount = session.amount_total ? (session.amount_total / 100).toString() : session.metadata.totalAmount;

    // Create payment transaction record
    await storage.createPaymentTransaction({
      bookingId: bookingId,
      stripePaymentIntentId: session.payment_intent,
      amount: actualAmount,
      paymentType: 'full',
      status: 'succeeded',
      paymentProvider: 'stripe',
      processedAt: new Date(),
    });

    console.log(`Full payment completed for booking ${bookingId}, amount: €${actualAmount}`);
  } catch (error) {
    console.error('Error handling full payment success:', error);
    throw error;
  }
}

// Helper function to handle deposit payment for installment subscriptions
async function handleInstallmentDepositSuccess(session: any): Promise<void> {
  try {
    const bookingId = session.metadata.bookingId;
    
    if (!bookingId) {
      console.error('No bookingId found in session metadata for installment deposit');
      return;
    }
    
    // Idempotency check: check if booking already has deposit paid status
    const existingBooking = await storage.getBooking(bookingId);
    if (existingBooking?.paymentStatus === 'deposit_paid') {
      console.log(`Booking ${bookingId} already has deposit paid, skipping duplicate processing`);
      return;
    }
    
    // Update booking to deposit_paid status
    const updatedBooking = await storage.updateBookingStatusById(bookingId, 'deposit_paid');
    
    if (!updatedBooking) {
      console.error(`Booking ${bookingId} not found for deposit payment completion`);
      return;
    }

    // Use authoritative Stripe amount for deposit (in cents) converted to euros
    const actualDepositAmount = session.amount_total ? (session.amount_total / 100).toString() : session.metadata.depositAmount;

    // Create payment transaction record for deposit
    await storage.createPaymentTransaction({
      bookingId: bookingId,
      stripePaymentIntentId: session.payment_intent,
      amount: actualDepositAmount,
      paymentType: 'deposit',
      status: 'succeeded',
      paymentProvider: 'stripe',
      processedAt: new Date(),
    });

    console.log(`Installment deposit completed for booking ${bookingId}, amount: €${actualDepositAmount}`);
  } catch (error) {
    console.error('Error handling installment deposit success:', error);
    throw error;
  }
}

// Helper function to handle subscription creation for installment payments
async function handleInstallmentSubscriptionCreated(subscription: any, stripe: any): Promise<void> {
  try {
    // Find the checkout session that created this subscription
    const sessions = await stripe.checkout.sessions.list({
      subscription: subscription.id,
      limit: 1
    });
    
    if (sessions.data.length === 0) {
      console.error('No checkout session found for subscription:', subscription.id);
      return; // Skip if not an installment subscription
    }
    
    const session = sessions.data[0];
    
    // Check if this is actually an installment subscription
    if (session.metadata?.paymentMode !== 'installment') {
      console.log('Subscription is not for installment payment, skipping:', subscription.id);
      return;
    }
    
    console.log('Subscription created, checking for installment payment session...');
    
    // Find the checkout session to get booking information
    const subscriptionSessions = await stripe.checkout.sessions.list({
      subscription: subscription.id,
      limit: 1
    });
    
    if (subscriptionSessions.data.length === 0 || subscriptionSessions.data[0].metadata?.paymentMode !== 'installment') {
      console.log('Subscription is not for installment payment, skipping');
      return;
    }
    
    const subscriptionSession = subscriptionSessions.data[0];
    const bookingId = subscriptionSession.metadata.bookingId;
    
    if (!bookingId) {
      console.error('No bookingId found in session metadata');
      return;
    }
    
    // Check if this subscription was already processed
    const existingBooking = await storage.getBooking(bookingId);
    if (existingBooking?.stripeCustomerId === subscription.customer) {
      console.log(`Subscription ${subscription.id} already processed for booking ${bookingId}`);
      return;
    }
    
    // Get pricing from the metadata
    const depositAmount = parseFloat(subscriptionSession.metadata.depositAmount);
    const remainingAmount = parseFloat(subscriptionSession.metadata.remainingAmount);
    
    console.log(`Processing installment subscription for ${subscriptionSession.metadata.packageName}, deposit: €${depositAmount}, remaining: €${remainingAmount}`);
    
    // Update existing booking with subscription details
    const updatedBooking = await storage.updateBooking(bookingId, {
      stripeCustomerId: subscription.customer,
      installmentStatus: JSON.stringify({
        deposit: 'paid',
        balance: 'pending', 
        dueDate: '2026-01-06'
      }),
      balanceDueDate: '2026-01-06',
    });
    
    if (!updatedBooking) {
      console.error(`Booking ${bookingId} not found for installment subscription setup`);
      return;
    }
    
    const booking = updatedBooking;

    // Create payment transaction record for the deposit
    await storage.createPaymentTransaction({
      bookingId: booking.id,
      amount: session.metadata.depositAmount,
      paymentType: 'deposit',
      status: 'succeeded',
      paymentProvider: 'stripe',
      processedAt: new Date(),
    });

    // Create subscription schedule with two phases
    await createSubscriptionSchedule(subscription, depositAmount, remainingAmount, session.metadata.packageName, booking.id, stripe);

    console.log(`Installment booking created ${booking.id}, scheduled final payment for 2026-01-06`);
  } catch (error) {
    console.error('Error handling installment subscription creation:', error);
    throw error;
  }
}

// Helper function to create subscription schedule with 2 phases
async function createSubscriptionSchedule(subscription: any, depositAmount: number, remainingAmount: number, packageName: string, bookingId: string, stripe: any): Promise<void> {
  try {
    const finalPaymentDate = Math.floor(new Date('2026-01-06').getTime() / 1000); // Convert to Unix timestamp
    
    // Create subscription schedule
    const schedule = await stripe.subscriptionSchedules.create({
      customer: subscription.customer,
      start_date: subscription.current_period_start,
      end_behavior: 'cancel', // Cancel subscription after final payment
      phases: [
        {
          // Phase 1: Deposit (immediate)
          items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: packageName,
                  description: `${packageName} - Deposit Payment`
                },
                unit_amount: Math.round(depositAmount * 100), // Convert to cents
                recurring: {
                  interval: 'month'
                }
              },
              quantity: 1
            }
          ],
          end_date: finalPaymentDate
        },
        {
          // Phase 2: Final payment (Jan 6, 2026)
          items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: packageName,
                  description: `${packageName} - Final Payment`
                },
                unit_amount: Math.round(remainingAmount * 100), // Convert to cents
                recurring: {
                  interval: 'month'
                }
              },
              quantity: 1,
              metadata: {
                paymentType: 'final_installment',
                bookingId: bookingId
              }
            }
          ]
        }
      ],
      metadata: {
        bookingId: bookingId,
        packageName: packageName,
        paymentType: 'installment_schedule'
      }
    });
    
    // Replace the original subscription with the scheduled one
    await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true // This will be managed by the schedule
    });
    
    console.log(`Created subscription schedule ${schedule.id} for booking ${bookingId}, final payment on 2026-01-06`);
  } catch (error) {
    console.error('Error creating subscription schedule:', error);
    throw error;
  }
}

// Helper function to handle final installment payment success
async function handleFinalInstallmentSuccess(invoice: any, stripe: any): Promise<void> {
  try {
    // Check if this invoice has booking metadata or get it from subscription schedule
    let bookingId = invoice.metadata?.bookingId;
    
    if (!bookingId && invoice.subscription) {
      // Try to find booking ID from subscription schedule
      const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
      if (subscription.schedule) {
        const schedule = await stripe.subscriptionSchedules.retrieve(subscription.schedule);
        bookingId = schedule.metadata?.bookingId;
      }
    }
    
    if (!bookingId) {
      console.log('No booking ID found in invoice or subscription schedule metadata');
      return;
    }

    // Update booking status to fully paid
    await storage.updateBookingStatusById(bookingId, 'paid');
    
    // Update installment status
    const booking = await storage.getBooking(bookingId);
    if (booking) {
      await storage.updateBooking(booking.id, {
        installmentStatus: JSON.stringify({
          deposit: 'paid',
          balance: 'paid',
          dueDate: '2026-01-06'
        })
      });

      // Create payment transaction record for the final payment
      await storage.createPaymentTransaction({
        bookingId: booking.id,
        stripePaymentIntentId: invoice.payment_intent,
        amount: (invoice.amount_paid / 100).toString(),
        paymentType: 'final_installment',
        status: 'succeeded',
        paymentProvider: 'stripe',
        stripeResponse: JSON.stringify(invoice),
        processedAt: new Date(),
      });

      console.log(`Final installment payment completed for booking ${booking.id}`);
    }
  } catch (error) {
    console.error('Error handling final installment success:', error);
    throw error;
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
