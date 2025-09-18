import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, CreditCard } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { stripePromise, formatPrice } from '@/lib/stripe';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface PaymentFormProps {
  packageId: string;
  experienceIds?: string[];
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function PaymentForm({ packageId, experienceIds = [], onSuccess, onCancel }: PaymentFormProps) {
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [packageData, setPackageData] = useState<any>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('full');
  const [user, setUser] = useState<any>(null);

  // Fetch user, package and experiences data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - this should be replaced with actual API calls
        setUser({ id: 'user-1', email: 'user@example.com' });
        
        // Mock package data
        setPackageData({
          id: packageId,
          name: 'Ski Festival Package',
          price: 499,
          payment_deadline: '2025-02-28'
        });
        
        // Mock experiences data if any
        if (experienceIds.length > 0) {
          const mockExperiences = experienceIds.map((id, index) => ({
            id,
            name: `Experience ${index + 1}`,
            price: 99
          }));
          setExperiences(mockExperiences);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load booking details');
      }
    };
    
    fetchData();
  }, [packageId, experienceIds]);

  // Calculate total amount
  useEffect(() => {
    if (packageData) {
      let total = packageData.price || 0;
      experiences.forEach(exp => {
        total += exp.price || 0;
      });
      setTotalAmount(total);
    }
  }, [packageData, experiences]);

  const handlePaymentModeChange = (value: string) => {
    setPaymentMode(value);
  };

  const handleCheckout = async () => {
    if (!user) {
      setError('Please log in to continue');
      return;
    }

    setIsSubmitting(true);
    setError('');
    
    try {
      // Call our API to create a Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageId,
          experienceIds,
          userId: user.id,
          paymentMode
        }),
      });
      
      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      setError('Failed to initiate checkout. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-xl font-heading">Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md text-sm">
              {error}
            </div>
          )}
          
          {packageData ? (
            <>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Your Package</h3>
                  <div className="flex justify-between">
                    <span>{packageData.name}</span>
                    <span>{formatPrice(packageData.price)}</span>
                  </div>
                </div>
                
                {experiences.length > 0 && (
                  <div className="border-b pb-4">
                    <h3 className="font-medium mb-2">Selected Experiences</h3>
                    {experiences.map((exp) => (
                      <div key={exp.id} className="flex justify-between mb-1">
                        <span>{exp.name}</span>
                        <span>{formatPrice(exp.price)}</span>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Payment Options</h3>
                  <RadioGroup 
                    defaultValue="full" 
                    value={paymentMode}
                    onValueChange={handlePaymentModeChange}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="full" id="full" />
                      <Label htmlFor="full">
                        Pay in full ({formatPrice(totalAmount)})
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="installment" id="installment" />
                      <Label htmlFor="installment">
                        Pay deposit ({formatPrice(totalAmount * 0.3)}) now, remainder later
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Total</h3>
                  <div className="flex justify-between font-bold">
                    <span>
                      {paymentMode === 'full' ? 'Full Amount' : 'Deposit (30%)'}
                    </span>
                    <span>
                      {paymentMode === 'full' 
                        ? formatPrice(totalAmount) 
                        : formatPrice(totalAmount * 0.3)}
                    </span>
                  </div>
                  {paymentMode === 'installment' && (
                    <div className="text-sm text-gray-500 mt-1">
                      Remaining balance of {formatPrice(totalAmount * 0.7)} due by {packageData.payment_deadline || 'trip date'}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col space-y-3">
                <Button 
                  onClick={handleCheckout}
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? 'Processing...' : 'Proceed to Checkout'}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onCancel}
                  className="w-full"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Loading booking details...</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}