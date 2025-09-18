import { Button } from "@/components/ui/button";
import Navigation from "@/components/Navigation";
import { CheckCircle, ArrowRight } from "lucide-react";

export default function TransactionSuccess() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navigation />
      
      <main className="pt-32 pb-16 px-4 max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-blue-900 mb-4">
            Transaction Successful!
          </h1>
          
          <p className="text-slate-600 text-lg mb-8">
            Your booking has been confirmed. Thank you for choosing Trakia Trips!
          </p>
          
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <h2 className="font-heading text-xl font-semibold text-blue-800 mb-4">
              What's Next?
            </h2>
            
            <ul className="text-left space-y-3 mb-6">
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Check your email for booking confirmation details</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>View your booking in your profile page</span>
              </li>
              <li className="flex items-start">
                <ArrowRight className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <span>Get ready for an amazing adventure!</span>
              </li>
            </ul>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => window.location.href = '/'}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Back to Home
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = '/profile'}
              className="border-blue-300 text-blue-700 hover:bg-blue-50"
            >
              View My Bookings
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}