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
  
  // Coupon system state
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState<any>(null);
  const [groupSize, setGroupSize] = useState(1);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  // Fetch user, package and experiences data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock data for now - this should be replaced with actual API calls
        setUser({ id: 'user-1', email: 'user@example.com' });
        
        // Mock package data - use Package A as default
        setPackageData({
          id: packageId,
          name: packageId === 'package-a' ? 'Package A' : 'Package B',
          price: packageId === 'package-a' ? 185 : 245,
          payment_deadline: '2026-01-06'
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

  // Calculate final amount after discount
  const calculateFinalAmount = () => {
    if (!appliedDiscount) return totalAmount;

    if (appliedDiscount.percent_off) {
      return totalAmount * (1 - appliedDiscount.percent_off / 100);
    }
    if (appliedDiscount.amount_off) {
      return Math.max(0, totalAmount - (appliedDiscount.amount_off / 100));
    }
    return totalAmount;
  };

  const finalAmount = calculateFinalAmount();

  const handlePaymentModeChange = (value: string) => {
    setPaymentMode(value);
  };

  // Coupon validation function
  const validateCoupon = async () => {
    if (!couponCode.trim()) return;

    setIsValidatingCoupon(true);
    setCouponError('');

    try {
      const response = await fetch('/api/stripe/validate-coupon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          couponCode: couponCode.trim(),
          groupSize: groupSize,
          paymentMode: paymentMode
        }),
      });

      const data = await response.json();

      if (response.ok && data.valid) {
        // Successfully validated coupon
        setAppliedDiscount({
          id: data.promotionCode.id,
          code: data.promotionCode.code,
          name: data.coupon.name,
          percent_off: data.coupon.percent_off,
          amount_off: data.coupon.amount_off,
          remaining_redemptions: data.coupon.remaining_redemptions
        });
        setCouponError('');
      } else {
        // Validation failed
        setCouponError(data.error || 'Invalid coupon code');
        setAppliedDiscount(null);
        
        // Show suggestion if it's about group size
        if (data.suggestion) {
          setCouponError(data.suggestion);
        }
      }
    } catch (error) {
      console.error('Error validating coupon:', error);
      setCouponError('Failed to validate coupon. Please try again.');
      setAppliedDiscount(null);
    }

    setIsValidatingCoupon(false);
  };

  // Remove applied coupon
  const removeCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode('');
    setCouponError('');
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
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageName: packageData.name,
          packageType: packageData.name,
          paymentMode,
          totalAmount: totalAmount,
          depositAmount: packageData.name === 'Package A' ? 50 : 74,
          couponCode: appliedDiscount ? couponCode : null,
          groupSize: groupSize,
          bookingData: {
            userEmail: user.email,
            userName: user.name || user.email,
            dates: '6-9 March 2025',
            numberOfGuests: groupSize,
            roomType: 'standard',
            addOns: []
          }
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
                        Pay deposit ({formatPrice(packageData.name === 'Package A' ? 5600 : 7400)}) now, remaining ({formatPrice(packageData.name === 'Package A' ? 12900 : 17100)}) due Jan 6, 2026
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                
                <div className="border-b pb-4">
                  <h3 className="font-medium mb-2">Total</h3>
                  
                  {/* Show final amount */}
                  <div className="flex justify-between font-bold">
                    <span>
                      {paymentMode === 'full' ? 'Final Amount' : 'Deposit (30%)'}
                    </span>
                    <span>
                      {paymentMode === 'full' 
                        ? formatPrice(totalAmount * 100) 
                        : formatPrice(packageData.name === 'Package A' ? 5000 : 7400)}
                    </span>
                  </div>
                  
                  {/* Show savings amount */}
                  {appliedDiscount && (
                    <div className="flex justify-between text-sm text-green-600 mt-1">
                      <span>You save:</span>
                      <span>
                        {paymentMode === 'full' 
                          ? formatPrice((totalAmount - finalAmount) * 100)
                          : formatPrice(((packageData.name === 'Package A' ? 50 : 74) * (appliedDiscount.percent_off || 0) / 100) * 100)}
                      </span>
                    </div>
                  )}
                  
                  {paymentMode === 'installment' && (
                    <div className="text-sm text-gray-500 mt-1">
                      Remaining balance of {formatPrice(packageData.name === 'Package A' ? 13500 : 17100)} due January 6, 2026
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