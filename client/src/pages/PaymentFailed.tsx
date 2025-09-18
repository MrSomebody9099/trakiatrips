import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home, RefreshCw, CreditCard } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function PaymentFailed() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6 border-4 border-red-500">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Payment Failed
            </h1>
            <div className="text-muted-foreground text-lg mb-8">
              <p className="mb-4">We're sorry, but your payment could not be processed successfully. This could be due to:</p>
              <ul className="text-left space-y-2 mb-6 mx-auto max-w-xs">
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Insufficient funds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Card declined by your bank</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Incorrect card information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>Temporary technical issue</span>
                </li>
              </ul>
              <p>No charges have been made to your card. You can try again with a different payment method or contact your bank for more information.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                className="bg-blue-600 hover:bg-blue-700" 
                size="lg"
                onClick={() => window.history.back()}
              >
                <RefreshCw className="mr-2 h-5 w-5" /> Try Again
              </Button>
              <Button 
                variant="outline"
                size="lg"
                onClick={() => setLocation('/')}
              >
                <Home className="mr-2 h-5 w-5" /> Back to Home
              </Button>
            </div>
            <div className="mt-8 p-4 bg-blue-50 rounded-md border border-blue-100 text-sm">
              <p className="font-medium text-blue-700 mb-2">For testing purposes, you can use these Stripe test cards:</p>
              <p className="font-medium mt-2">Success: 4242 4242 4242 4242</p>
              <p className="font-medium">Decline: 4000 0000 0000 0002</p>
              <div className="text-xs text-blue-600 mt-2 flex items-center justify-center">
                <CreditCard className="h-3 w-3 mr-1" />
                Secure payments powered by Stripe
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}