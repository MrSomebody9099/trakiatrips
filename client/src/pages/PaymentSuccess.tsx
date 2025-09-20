import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { CheckCircle, Home, Calendar, Loader2 } from 'lucide-react';
import Navigation from '../components/Navigation';

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        
        // Get session ID from URL if present
        const urlParams = new URLSearchParams(window.location.search);
        const session = urlParams.get('session_id');
        if (session) {
          setSessionId(session);
        }

        // Get booking ID from localStorage (set by BookingFlow)
        const storedData = localStorage.getItem('pendingBookingData');
        if (!storedData) {
          setError('No booking information found');
          return;
        }

        const parsedData = JSON.parse(storedData);
        const bookingId = parsedData.bookingId;

        if (!bookingId) {
          setError('Booking ID not found');
          return;
        }

        // Fetch booking details from database
        const response = await fetch(`/api/booking/${bookingId}`);
        const result = await response.json();

        if (!response.ok) {
          setError(result.error || 'Failed to fetch booking details');
          return;
        }

        // NOTE: Booking status should be updated to 'paid' by secure Stripe webhooks, not client-side
        // This is a placeholder - in production, the webhook would handle this
        console.log(`Payment successful for booking ${bookingId} - status should be updated by webhook`);

        // Set booking details with payment information
        setBookingDetails({
          booking: result.booking,
          paymentAmount: parsedData.paymentAmount,
          totalPrice: parsedData.totalPrice,
          paymentType: parsedData.bookingData.paymentPlan
        });

        // Clear pending booking data since payment is complete
        localStorage.removeItem('pendingBookingData');

      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Failed to load booking information');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6 border-4 border-green-500">
              <Loader2 className="h-12 w-12 text-green-600 animate-spin" />
            </div>
            <h1 className="font-heading font-bold text-2xl text-foreground mb-4">
              Processing Your Payment...
            </h1>
            <p className="text-muted-foreground">Please wait while we confirm your booking.</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-red-50 to-white">
        <Navigation />
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto text-center py-16">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-red-100 mb-6 border-4 border-red-500">
              <CheckCircle className="h-12 w-12 text-red-600" />
            </div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl text-foreground mb-4">
              Error Loading Booking
            </h1>
            <p className="text-muted-foreground text-lg mb-8">{error}</p>
            <Button 
              onClick={() => setLocation('/')}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Return Home
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
                      <span className="font-medium">Booking ID:</span>
                      <span className="text-xs text-muted-foreground">{bookingDetails.booking.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Package:</span>
                      <span>{bookingDetails.booking.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Dates:</span>
                      <span>{bookingDetails.booking.dates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Guests:</span>
                      <span>{bookingDetails.booking.numberOfGuests}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Room Type:</span>
                      <span>{bookingDetails.booking.roomType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Payment:</span>
                      <span>
                        {bookingDetails.paymentType === 'installment' 
                          ? `€${parseFloat(bookingDetails.paymentAmount).toFixed(2)} (Deposit)` 
                          : `€${parseFloat(bookingDetails.totalPrice).toFixed(2)} (Full Payment)`}
                      </span>
                    </div>
                    {bookingDetails.paymentType === 'installment' && (
                      <div className="flex justify-between text-amber-600">
                        <span className="font-medium">Balance Due (Jan 6):</span>
                        <span>€{(parseFloat(bookingDetails.totalPrice) - parseFloat(bookingDetails.paymentAmount)).toFixed(2)}</span>
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
                data-testid="button-return-home"
              >
                <Home className="h-4 w-4" />
                Return Home
              </Button>
              <Button 
                onClick={() => setLocation('/my-bookings')}
                className="flex items-center gap-2 bg-primary hover:bg-primary/90"
                data-testid="button-view-bookings"
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