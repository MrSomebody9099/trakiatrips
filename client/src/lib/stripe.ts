import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key from environment variable
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Robust validation for Stripe publishable key
const validateStripeKey = () => {
  if (!STRIPE_PUBLISHABLE_KEY) {
    throw new Error('VITE_STRIPE_PUBLIC_KEY is required but not found in environment variables');
  }
  
  if (!STRIPE_PUBLISHABLE_KEY.startsWith('pk_')) {
    throw new Error('Invalid VITE_STRIPE_PUBLIC_KEY format. Must start with pk_test_ or pk_live_');
  }
  
  console.log(`[Stripe Client] Using publishable key: ${STRIPE_PUBLISHABLE_KEY.substring(0, 12)}...`);
};

// Validate key on module load
try {
  validateStripeKey();
} catch (error) {
  console.error('[Stripe Client] Configuration error:', error);
}

// Package prices
export const PACKAGES = {
  PACKAGE_A: {
    name: 'Package A',
    fullAmount: 19500, // €195 in cents
    deposit: 5000,     // €50 in cents
    remaining: 14500,  // €145 in cents
    dueDate: '2026-01-06'
  },
  PACKAGE_B: {
    name: 'Package B',
    fullAmount: 25500, // €255 in cents
    deposit: 7500,     // €75 in cents
    remaining: 18000,  // €180 in cents
    dueDate: '2026-01-06'
  }
};

// Payment modes
export const PAYMENT_MODES = {
  FULL: 'full',
  INSTALLMENT: 'installment'
};

// Initialize Stripe only if publishable key is available
export const stripePromise = STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

// Helper function to format price in EUR
export const formatPrice = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2
  }).format(amount / 100);
};

// Test cards for Stripe
export const TEST_CARDS = {
  success: {
    number: '4242 4242 4242 4242',
    expiry: 'Any future date',
    cvc: 'Any 3 digits',
    description: 'Payment succeeds'
  },
  decline: {
    number: '4000 0000 0000 0002',
    expiry: 'Any future date',
    cvc: 'Any 3 digits',
    description: 'Payment declined'
  },
  authenticationRequired: {
    number: '4000 0025 0000 3155',
    expiry: 'Any future date',
    cvc: 'Any 3 digits',
    description: 'Requires authentication'
  }
};