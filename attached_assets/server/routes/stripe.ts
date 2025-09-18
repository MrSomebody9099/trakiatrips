import { Router } from 'express';
import Stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

// Initialize Stripe with the secret key from environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

// Create a checkout session
router.post('/create-checkout-session', async (req, res) => {
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
      success_url: `${req.headers.origin || req.get('origin')}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin || req.get('origin')}/payment-process`,
      payment_intent_data: {
        metadata: {
          bookingData: JSON.stringify(bookingData),
          paymentMode: paymentMode,
          totalAmount: totalAmount.toString(),
          depositAmount: depositAmount.toString(),
        },
      },
      // Customize the appearance of the checkout page
      custom_text: {
        submit: {
          message: 'Trakia Trips will process your payment securely through Stripe.',
        },
      },
    });

    res.json({ url: session.url });
  } catch (error) {
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
    event = stripe.webhooks.constructEvent(payload, sig, process.env.STRIPE_WEBHOOK_SECRET || '');
    
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
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});

export default router;