import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertGuestSchema, insertPaymentTransactionSchema } from "@shared/schema";
import crypto from "crypto";
import Stripe from "stripe";

export async function registerRoutes(app: Express): Promise<Server> {
  // Initialize Stripe with environment variable - javascript_stripe integration
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  // Create a Stripe checkout session
  app.post('/api/create-checkout-session', async (req, res) => {
    try {
      const { packageName, packageType, paymentMode, totalAmount, depositAmount, bookingData } = req.body;

      // Determine the amount to charge based on payment mode
      const amount = paymentMode === 'full' ? totalAmount : depositAmount;
      
      // Format the amount for Stripe (in cents)
      const stripeAmount = Math.round(amount * 100);

      // Create a Stripe checkout session
      const session = await stripe.checkout.sessions.create({
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
        success_url: `${req.protocol}://${req.get('host')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.protocol}://${req.get('host')}/payment-process`,
        metadata: {
          paymentMode: paymentMode,
          totalAmount: totalAmount.toString(),
          depositAmount: depositAmount.toString(),
        },
      });

      res.json({ url: session.url });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({ error: 'Failed to create checkout session' });
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
        return res.status(500).json({ error: 'Payment configuration error' });
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
        return res.status(500).json({ error: 'Payment configuration not found' });
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
