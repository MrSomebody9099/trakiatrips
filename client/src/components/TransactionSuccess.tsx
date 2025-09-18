import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navigation from "./Navigation";

export default function TransactionSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navigation />
      <div className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-8">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            Transaction Successful!
          </h1>
          
          <p className="font-body text-xl text-muted-foreground mb-8">
            Your booking has been confirmed and your payment has been processed successfully.
            You will receive a confirmation email shortly.
          </p>
          
          <div className="bg-accent/30 rounded-xl p-8 mb-8">
            <h2 className="font-heading font-semibold text-2xl mb-4">What's Next?</h2>
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-medium">1</span>
                </span>
                <span>Check your email for booking confirmation details</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-medium">2</span>
                </span>
                <span>View your booking details in your profile dashboard</span>
              </li>
              <li className="flex items-start">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full mr-3 flex-shrink-0">
                  <span className="text-blue-600 font-medium">3</span>
                </span>
                <span>Contact our support team if you have any questions</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => window.location.href = '/'}
              className="hover-elevate"
            >
              Return to Home
            </Button>
            <Button 
              variant="outline"
              onClick={() => window.location.href = '/profile'}
              className="hover-elevate"
            >
              View My Bookings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}