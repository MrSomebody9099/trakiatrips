import React from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home } from 'lucide-react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function SuccessPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 border-4 border-green-500">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Payment Successful!
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Your payment was successfully processed.
            </p>
            <Button 
              className="mt-6 bg-blue-600 hover:bg-blue-700 w-full max-w-xs" 
              size="lg"
              onClick={() => setLocation('/')}
            >
              <Home className="mr-2 h-5 w-5" /> Back to Home
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}