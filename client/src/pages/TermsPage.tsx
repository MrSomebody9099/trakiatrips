import MarqueeTape from "../components/MarqueeTape";
import Navigation from "../components/Navigation";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <MarqueeTape />
      <Navigation />
      
      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto py-16">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-blue-600 font-medium mb-6">
              📋 Legal Information
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 md:mb-8">
              TERMS &
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CONDITIONS
              </span>
            </h1>
          </div>
          
          <div className="space-y-8 animate-fade-in-up animate-delay-200">
            <div className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-500/10">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">
                Booking Terms
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="font-body text-lg leading-relaxed">
                  <strong>Payment:</strong> Full payment is required upon booking to secure your spot on the trip. 
                  Early bird discounts apply for bookings made before February 15th, 2025.
                </p>
                <p className="font-body text-lg leading-relaxed">
                  <strong>Cancellation:</strong> Cancellations made more than 30 days before the trip are eligible for a full refund. 
                  Cancellations within 30 days are subject to a 50% cancellation fee.
                </p>
                <p className="font-body text-lg leading-relaxed">
                  <strong>What's Included:</strong> 4★ hotel accommodation, breakfast & dinner, premium bus transport, 
                  club events, and pool party access for the first 60 bookings.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 backdrop-blur-xl border border-blue-300/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-500/20">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">
                Adventure Guidelines
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p className="font-body text-lg leading-relaxed">
                  <strong>Age Requirement:</strong> Participants must be 18+ years old. Valid ID required for all activities.
                </p>
                <p className="font-body text-lg leading-relaxed">
                  <strong>Safety First:</strong> All adventure activities include safety briefings and proper equipment. 
                  Participation in activities is at your own risk.
                </p>
                <p className="font-body text-lg leading-relaxed">
                  <strong>Code of Conduct:</strong> We maintain a respectful and inclusive environment. 
                  Disruptive behavior may result in removal from the trip without refund.
                </p>
                <p className="font-body text-lg leading-relaxed">
                  <strong>Travel Insurance:</strong> Highly recommended but not included. Participants are responsible 
                  for their own travel and medical insurance coverage.
                </p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-500/10">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">
                Contact Information
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                For questions about these terms or your booking, contact us through our official Instagram 
                <a href="https://www.instagram.com/trakiatrips/" className="text-blue-600 hover:text-blue-800 underline ml-1">@trakiatrips</a> 
                or through our booking system.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}