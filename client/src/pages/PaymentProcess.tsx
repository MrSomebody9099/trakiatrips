import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, CreditCard } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function PaymentProcess() {
  const [, setLocation] = useLocation();
  const [bookingData, setBookingData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [autoRedirectAttempted, setAutoRedirectAttempted] = useState(false);

  useEffect(() => {
    // Retrieve booking data from localStorage
    const storedData = localStorage.getItem("pendingBookingData");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setBookingData(parsedData);
      } catch (err) {
        console.error("Error parsing booking data:", err);
        setError("Invalid booking data. Please try again.");
        setLocation("/");
      }
    } else {
      // Redirect if no booking data is found
      setLocation("/");
    }
  }, [setLocation]);

  // States for simulated payment process
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  
  // Function to handle payment process
  const redirectToStripeCheckout = async () => {
    if (!bookingData) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          packageName: bookingData.bookingData.packageName,
          packageType: bookingData.bookingData.dates,
          paymentMode: bookingData.bookingData.paymentPlan,
          totalAmount: bookingData.paymentAmount,
          depositAmount: Math.round(bookingData.paymentAmount * 0.3),
          bookingData: bookingData
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      
      // Redirect to Stripe Checkout
      window.location.href = url;
      
    } catch (err: any) {
      console.error('Error initializing payment:', err);
      setError('Failed to initialize payment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to process payment
  const processPayment = () => {
    setProcessingPayment(true);
    
    // Simulate payment processing with a timeout
    setTimeout(() => {
      // Store completed booking data
      localStorage.setItem("completedBookingData", JSON.stringify(bookingData));
      
      // Redirect to success page
      window.location.href = "/success";
    }, 2000);
  };

  // Auto-redirect to Stripe on component mount, but only once
  useEffect(() => {
    if (bookingData && !autoRedirectAttempted && !error) {
      setAutoRedirectAttempted(true);
      redirectToStripeCheckout();
    }
  }, [bookingData, autoRedirectAttempted]);

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <p>Loading booking information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navigation />
      <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Order Summary */}
          <div>
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
              <CardHeader className="border-b border-primary/10 pb-6">
                <CardTitle className="text-2xl font-heading">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-heading text-xl mb-2">{bookingData.bookingData.packageName}</h3>
                    <p className="text-muted-foreground">{bookingData.bookingData.dates}</p>
                  </div>

                  <div className="border-t border-primary/10 pt-4">
                    <h4 className="font-medium mb-2">Booking Details</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex justify-between">
                        <span>Guests:</span>
                        <span className="font-medium">{bookingData.bookingData.numberOfGuests} people</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Room Type:</span>
                        <span className="font-medium">{bookingData.bookingData.roomType}</span>
                      </li>
                      {bookingData.bookingData.addOns && bookingData.bookingData.addOns.length > 0 && (
                        <li>
                          <span className="block mb-1">Add-ons:</span>
                          <ul className="pl-4 space-y-1">
                            {bookingData.bookingData.addOns.map((addon: string, index: number) => (
                              <li key={index} className="text-xs">• {addon}</li>
                            ))}
                          </ul>
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="border-t border-primary/10 pt-4">
                    <h4 className="font-medium mb-2">Payment Plan</h4>
                    <p className="text-sm">
                      {bookingData.bookingData.paymentPlan === 'installment' 
                        ? 'Installment (30% deposit now)' 
                        : 'Full Payment'}
                    </p>
                  </div>

                  <div className="border-t border-primary/10 pt-4">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>€{bookingData.totalPrice.toFixed(2)}</span>
                    </div>
                    {bookingData.bookingData.paymentPlan === 'installment' && (
                      <div className="flex justify-between text-sm mt-1">
                        <span>Deposit (30%):</span>
                        <span>€{bookingData.paymentAmount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-heading text-lg mt-4">
                      <span>Total due now:</span>
                      <span>€{bookingData.paymentAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Stripe Checkout Redirect */}
          <div>
            <Card>
              <CardHeader className="border-b pb-6">
                <CardTitle className="text-2xl font-heading">Redirecting to Secure Payment</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center space-y-6">
                  {error ? (
                    <div className="text-destructive mb-4">
                      {error}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                          <CreditCard className="h-8 w-8 text-primary" />
                        </div>
                        <p>You are being redirected to our secure payment page...</p>
                      </div>
                      
                      <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span>Secure payment powered by Stripe</span>
                      </div>
                    </>
                  )}
                  
                  {error && (
                    <Button 
                      onClick={redirectToStripeCheckout} 
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Try Again"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}