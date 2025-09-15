import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
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
  app.post('/webhook', (req, res) => {
    console.log('Fondy webhook received:', req.body);
    
    const merchantId = process.env.FONDY_MERCHANT_ID;
    const secretKey = process.env.FONDY_SECRET_KEY;
    
    if (!merchantId || !secretKey) {
      console.error('Fondy credentials not configured');
      return res.status(500).json({ error: 'Payment configuration error' });
    }

    // TODO: Implement proper signature verification
    // TODO: Update booking status in database
    
    res.status(200).json({ success: true });
  });

  // API endpoint to create Fondy checkout
  app.post('/api/create-payment', (req, res) => {
    const { bookingData, totalAmount } = req.body;
    
    const merchantId = process.env.FONDY_MERCHANT_ID;
    const secretKey = process.env.FONDY_SECRET_KEY;
    
    if (!merchantId || !secretKey) {
      return res.status(500).json({ error: 'Payment configuration not found' });
    }

    // Generate unique order ID
    const orderId = `trakia-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // For demo purposes, return a mock Fondy checkout URL
    // In production, you would create a proper Fondy checkout session
    const fondyCheckoutData = {
      checkout_url: `https://pay.fondy.eu/merchants/${merchantId}/default/index.html?order_id=${orderId}&amount=${totalAmount * 100}&currency=EUR&order_desc=Trakia+Trips+Booking&response_url=${process.env.REPLIT_URL || 'http://localhost:5000'}/success&server_callback_url=${process.env.REPLIT_URL || 'http://localhost:5000'}/webhook`,
      order_id: orderId
    };
    
    console.log('Created payment for order:', orderId, 'Amount:', totalAmount);
    
    res.json(fondyCheckoutData);
  });

  const httpServer = createServer(app);

  return httpServer;
}
