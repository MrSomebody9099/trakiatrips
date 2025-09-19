import { loadStripe } from '@stripe/stripe-js';

// Stripe publishable key from environment variable
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

// Validate that the Stripe publishable key is available
if (!STRIPE_PUBLISHABLE_KEY) {
  console.error('Missing VITE_STRIPE_PUBLISHABLE_KEY environment variable');
}

// Package prices
export const PACKAGES = {
  TWO_DAY_DEAL: {
    name: '2 Day Deal',
    fullAmount: 18500, // €185 in cents
    deposit: 5600,     // €56 in cents
    remaining: 12900,  // €129 in cents
    dueDate: '2025-01-06'
  },
  FULL_WEEKEND: {
    name: 'Full Weekend Package',
    fullAmount: 24500, // €245 in cents
    deposit: 7400,     // €74 in cents
    remaining: 17100,  // €171 in cents
    dueDate: '2025-01-06'
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