import MarqueeTape from "../components/MarqueeTape";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <MarqueeTape />
      <Navigation />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto py-16 md:py-24">
          <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-blue-600 font-medium mb-8">
              Legal Information
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-8xl xl:text-9xl text-foreground mb-8 md:mb-12 leading-tight">
              TERMS &
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CONDITIONS
              </span>
            </h1>
            <p className="font-body text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Clear guidelines for your epic adventure experience
            </p>
          </div>
          
          <div className="space-y-12 md:space-y-16 animate-fade-in-up animate-delay-200">
            <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 backdrop-blur-xl border border-blue-200/50 rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-3xl md:rounded-[3rem]"></div>
              
              <div className="relative">
                <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-8 text-center">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">BOOKING</span> Terms
                </h2>
                
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-6 border border-green-200/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">Payment</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Full payment required upon booking. Early bird discounts apply for bookings before February 15th, 2025.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-6 border border-orange-200/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">Cancellation</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      Full refund for cancellations 30+ days before trip. 50% fee for cancellations within 30 days.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-6 border border-blue-200/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">What's Included</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      4★ hotel, meals, transport, club events, and pool party access for first 60 bookings.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-blue-500/5 to-blue-600/15 backdrop-blur-xl border border-blue-300/30 rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-3xl md:rounded-[3rem]"></div>
              
              <div className="relative">
                <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-8 text-center">
                  <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">ADVENTURE</span> Guidelines
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center mt-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Age Requirement</h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          Participants must be 18+ years old. Valid ID required for all activities.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mt-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Safety First</h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          All activities include safety briefings and proper equipment. Participation at your own risk.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mt-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Code of Conduct</h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          Respectful and inclusive environment. Disruptive behavior may result in removal without refund.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mt-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Travel Insurance</h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          Highly recommended but not included. You're responsible for your own coverage.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-300/15 to-blue-400/15 rounded-full blur-xl"></div>
            </div>
            
            <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 backdrop-blur-xl border border-blue-200/50 rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-blue-500/10 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-3xl md:rounded-[3rem]"></div>
              
              <div className="relative">
                <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-8">
                  Questions? <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">LET'S TALK</span>
                </h2>
                <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
                  For questions about these terms or your booking, reach out through our official channels
                </p>
                
                <div className="flex justify-center">
                  <a
                    href="https://www.instagram.com/trakiatrips/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-2xl px-8 py-4 text-white font-heading font-bold text-lg transition-all duration-300 hover-elevate"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                    <span>@trakiatrips</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}