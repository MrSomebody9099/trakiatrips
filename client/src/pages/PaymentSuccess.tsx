import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Calendar } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  useEffect(() => {
    // Get session ID from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const session = urlParams.get('session_id');
    if (session) {
      setSessionId(session);
    }

    // Get booking details from localStorage
    const storedData = localStorage.getItem('pendingBookingData');
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setBookingDetails(parsedData);
      
      // Create mock booking with unique ID
      const mockBooking = {
        id: 'booking-' + Date.now(),
        ...parsedData.bookingData,
        guests: parsedData.guests,
        status: 'confirmed',
        paymentStatus: 'paid',
        createdAt: new Date().toISOString(),
        paymentAmount: parsedData.paymentAmount,
        actualTotalAmount: parsedData.totalPrice
      };

      // Store booking data
      const existingBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
      existingBookings.push(mockBooking);
      localStorage.setItem('bookings', JSON.stringify(existingBookings));
      
      // Clear pending booking data
      localStorage.removeItem('pendingBookingData');
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
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
            <div className="text-muted-foreground text-lg mb-8">
              <p>Thank you for booking with Trakia Trips!</p>
              <p className="mt-2">Your booking has been confirmed and you will receive a confirmation email shortly.</p>
              
              {bookingDetails && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-green-200">
                  <h2 className="font-heading text-xl mb-4">Booking Summary</h2>
                  <div className="text-left space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Package:</span>
                      <span>{bookingDetails.bookingData.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dates:</span>
                      <span>{bookingDetails.bookingData.dates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Guests:</span>
                      <span>{bookingDetails.bookingData.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Payment:</span>
                      <span>
                        {bookingDetails.bookingData.paymentPlan === 'installment' 
                          ? `€${bookingDetails.paymentAmount.toFixed(2)} (Deposit)` 
                          : `€${bookingDetails.totalPrice.toFixed(2)} (Full Payment)`}
                      </span>
                    </div>
                    {bookingDetails.bookingData.paymentPlan === 'installment' && (
                      <div className="flex justify-between text-amber-600">
                        <span className="font-medium">Balance Due (Jan 6):</span>
                        <span>€{(bookingDetails.totalPrice - bookingDetails.paymentAmount).toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => setLocation('/')}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
              <Button 
                onClick={() => setLocation('/my-bookings')}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
              >
                <Calendar className="h-4 w-4" />
                View My Bookings
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}