import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

// Load environment variables only in development
import dotenv from "dotenv";
if (process.env.NODE_ENV === "development") {
  dotenv.config({ path: ".env.local" });
}

const app = express();

// Configure raw body parsing for Stripe webhook BEFORE express.json()
app.use('/api/stripe/webhook', express.raw({type: 'application/json'}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      // Log only basic request info to avoid leaking sensitive data
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      log(logLine);
    }
  });

  next();
});

// Comprehensive startup health check
const performHealthCheck = () => {
  console.log('[Health Check] Starting system validation...');
  
  // Check environment variables
  const requiredEnvVars = [
    'DATABASE_URL',
    'STRIPE_SECRET_KEY', 
    'STRIPE_PUBLISHABLE_KEY',
    'VITE_STRIPE_PUBLIC_KEY',
    'SUPABASE_URL',
    'SUPABASE_ANON_KEY',
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_ANON_KEY'
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('[Health Check] ❌ Missing environment variables:', missingVars);
    console.warn('[Health Check] ⚠️  Application may not function correctly in production');
  } else {
    console.log('[Health Check] ✅ All required environment variables present');
  }
  
  // Validate Stripe key formats
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  if (stripeSecret && !stripeSecret.startsWith('sk_')) {
    console.error('[Health Check] ❌ Invalid STRIPE_SECRET_KEY format');
  }
  
  const stripePublishable = process.env.STRIPE_PUBLISHABLE_KEY;
  if (stripePublishable && !stripePublishable.startsWith('pk_')) {
    console.error('[Health Check] ❌ Invalid STRIPE_PUBLISHABLE_KEY format');
  }
  
  console.log('[Health Check] System validation complete');
};

(async () => {
  // Run health check before starting server
  performHealthCheck();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})();
