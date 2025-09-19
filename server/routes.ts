import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertGuestSchema, insertPaymentTransactionSchema } from "../shared/schema.js";
import crypto from "crypto";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Stripe with environment variable - javascript_stripe integration
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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
            bookingData: JSON.stringify(bookingData),
          },
        });

        return res.json({ url: session.url });
      } 
      
      if (paymentMode === 'installment') {
        // Installment payment using deposit + scheduled invoice approach
        
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

        // Create checkout session for deposit with setup_future_usage
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          customer: customer.id,
          line_items: [
            {
              price_data: {
                currency: 'eur',
                product_data: {
                  name: packageName,
                  description: `${packageName} - Deposit Payment\nDeposit: €${packagePricing.deposit} (charged today)\nRemaining: €${packagePricing.remaining} (due Jan 6, 2026)`,
                },
                unit_amount: packagePricing.deposit * 100, // Deposit amount in cents
              },
              quantity: 1,
            },
          ],
          payment_intent_data: {
            setup_future_usage: 'off_session', // Save payment method for future use
            metadata: {
              paymentType: 'deposit',
              finalPaymentAmount: packagePricing.remaining.toString(),
              finalPaymentDate: '2026-01-06',
            },
          },
          metadata: {
            paymentMode: 'installment',
            packageName: packageName,
            totalAmount: packagePricing.total.toString(),
            depositAmount: packagePricing.deposit.toString(),
            remainingAmount: packagePricing.remaining.toString(),
            bookingData: JSON.stringify(bookingData),
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

      // Handle checkout session completion for both full and installment payments
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        console.log('Checkout session completed:', session.id, 'Payment mode:', session.metadata?.paymentMode);
        
        if (session.metadata?.paymentMode === 'full') {
          // Full payment completed - create booking record
          await handleFullPaymentSuccess(session);
        } else if (session.metadata?.paymentMode === 'installment') {
          // Installment deposit payment completed - create booking and schedule final payment
          await handleInstallmentDepositSuccess(session, stripe);
        }
      }

      // Handle successful payment of scheduled invoice (final installment)
      if (event.type === 'invoice.payment_succeeded') {
        const invoice = event.data.object;
        
        // Check if this is our scheduled final payment
        if (invoice.metadata?.paymentType === 'final_installment') {
          await handleFinalInstallmentSuccess(invoice);
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
          // TODO: Implement manual processing if needed for legacy scheduled payments
          results.push({ bookingId: booking.id, success: false, message: 'Manual processing not implemented - using subscription schedules' });
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

// Helper function to handle successful full payment
async function handleFullPaymentSuccess(session: any): Promise<void> {
  try {
    const bookingData = JSON.parse(session.metadata.bookingData);
    
    // Create booking record for full payment
    const booking = await storage.createBooking({
      userEmail: bookingData.userEmail,
      packageName: session.metadata.packageName,
      packagePrice: session.metadata.totalAmount,
      dates: bookingData.dates,
      numberOfGuests: bookingData.numberOfGuests,
      roomType: bookingData.roomType,
      addOns: bookingData.addOns || [],
      totalAmount: session.metadata.totalAmount,
      paymentStatus: 'paid',
      paymentPlan: 'full',
      stripeSessionId: session.id,
    });

    // Create payment transaction record
    await storage.createPaymentTransaction({
      bookingId: booking.id,
      stripePaymentIntentId: session.payment_intent,
      amount: session.metadata.totalAmount,
      paymentType: 'full',
      status: 'succeeded',
      paymentProvider: 'stripe',
      processedAt: new Date(),
    });

    console.log(`Full payment completed for booking ${booking.id}`);
  } catch (error) {
    console.error('Error handling full payment success:', error);
    throw error;
  }
}

// Helper function to handle installment deposit payment success
async function handleInstallmentDepositSuccess(session: any, stripe: any): Promise<void> {
  try {
    const bookingData = JSON.parse(session.metadata.bookingData);
    const paymentIntent = await stripe.paymentIntents.retrieve(session.payment_intent);
    
    // Create booking record for installment payment
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
        dueDate: '2026-01-06'
      }),
      stripeSessionId: session.id,
      stripeCustomerId: session.metadata.customerId,
      stripePaymentMethodId: paymentIntent.payment_method,
      remainingAmount: session.metadata.remainingAmount,
      balanceDueDate: '2026-01-06',
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

    // Create scheduled invoice for the final payment
    await scheduleFinalInstallment(booking, stripe);

    console.log(`Installment booking created ${booking.id}, scheduled final payment for 2026-01-06`);
  } catch (error) {
    console.error('Error handling installment deposit success:', error);
    throw error;
  }
}

// Helper function to schedule the final installment payment
async function scheduleFinalInstallment(booking: any, stripe: any): Promise<void> {
  try {
    const finalPaymentDate = new Date('2026-01-06');
    const remainingAmount = parseFloat(booking.remainingAmount);
    
    // Create an invoice item for the final payment
    await stripe.invoiceItems.create({
      customer: booking.stripeCustomerId,
      amount: Math.round(remainingAmount * 100), // Convert to cents
      currency: 'eur',
      description: `${booking.packageName} - Final Payment`,
      metadata: {
        bookingId: booking.id,
        paymentType: 'final_installment',
        packageName: booking.packageName,
      },
    });

    // Create invoice and schedule auto-payment  
    const invoice = await stripe.invoices.create({
      customer: booking.stripeCustomerId,
      collection_method: 'charge_automatically',
      default_payment_method: booking.stripePaymentMethodId,
      metadata: {
        bookingId: booking.id,
        paymentType: 'final_installment',
        packageName: booking.packageName,
      },
      auto_advance: true, // Attempt to charge automatically
    });

    console.log(`Final installment invoice created for booking ${booking.id}: ${invoice.id}`);
  } catch (error) {
    console.error('Error scheduling final installment:', error);
    throw error;
  }
}

// Helper function to handle final installment payment success
async function handleFinalInstallmentSuccess(invoice: any): Promise<void> {
  try {
    const bookingId = invoice.metadata?.bookingId;
    if (!bookingId) {
      console.error('No booking ID found in final installment invoice metadata');
      return;
    }

    // Update booking status to fully paid
    await storage.updateBookingStatusById(bookingId, 'paid');

    // Create payment transaction record for the final payment
    await storage.createPaymentTransaction({
      bookingId: bookingId,
      amount: (invoice.amount_paid / 100).toString(), // Convert from cents
      paymentType: 'final_installment',
      status: 'succeeded',
      paymentProvider: 'stripe',
      stripeResponse: JSON.stringify(invoice),
      processedAt: new Date(),
    });

    console.log(`Final installment payment completed for booking ${bookingId}`);
  } catch (error) {
    console.error('Error handling final installment success:', error);
    throw error;
  }
}

// Helper function to generate Fondy signature
function generateFondySignature(params: Record<string, any>, secretKey: string): string {
  // Remove signature and empty values, sort alphabetically
  const filteredParams = Object.entries(params)
    .filter(([key, value]) => key !== 'signature' && value !== '' && value !== null && value !== undefined)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, value]) => value)
    .join('|');

  const stringToSign = `${secretKey}|${filteredParams}`;
  return crypto.createHash('sha1').update(stringToSign).digest('hex');
}