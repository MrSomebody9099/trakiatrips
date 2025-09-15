import MarqueeTape from "../components/MarqueeTape";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#DDF9F1'}}>
      <MarqueeTape />
      <Navigation />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto py-16 md:py-24">
          <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-blue-600 font-medium mb-8">
              Our Story
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-8xl xl:text-9xl text-foreground mb-8 md:mb-12 leading-tight">
              ABOUT
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                TRAKIA TRIPS
              </span>
            </h1>
            <p className="font-body text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Crafting epic mountain adventures where skiing meets celebration
            </p>
          </div>
          
          <div className="space-y-12 md:space-y-16 animate-fade-in-up animate-delay-200">
            {/* Hero Story Section */}
            <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-blue-100/20 backdrop-blur-xl border border-blue-200/50 rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-blue-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-3xl md:rounded-[3rem]"></div>
              
              <div className="relative space-y-8">
                <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-foreground leading-tight">
                  Creating <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">EPIC</span> Adventures
                </h2>
                
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6">
                    <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Trakia Trips was born from a passion for bringing people together through unforgettable mountain experiences. 
                      We believe that the best adventures happen when skiing meets celebration, when mountain peaks become dance floors, 
                      and when strangers become lifelong friends.
                    </p>
                    <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Our team curates every detail of your adventure - from the pristine slopes of Bansko to the epic pool parties 
                      that light up the Bulgarian nights. We're not just organizing trips; we're creating memories that last forever.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">100+</div>
                      <div className="text-sm font-medium text-muted-foreground">Bookings</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-600/10 to-blue-700/20 rounded-2xl p-6 text-center">
                      <div className="text-3xl md:text-4xl font-black text-blue-600 mb-2">4</div>
                      <div className="text-sm font-medium text-muted-foreground">Epic Days</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Why Choose Us Section */}
            <div className="relative bg-gradient-to-br from-blue-500/5 to-blue-600/15 backdrop-blur-xl border border-blue-300/30 rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-blue-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-3xl md:rounded-[3rem]"></div>
              
              <div className="relative">
                <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-12 text-center">
                  Why Choose <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">TRAKIA TRIPS</span>?
                </h2>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground">Premium Experience</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">Carefully selected venues, accommodations, and activities</p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mx-auto">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground">Epic Community</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">Join adventurers from across Europe for unforgettable connections</p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-700 to-blue-800 rounded-2xl flex items-center justify-center mx-auto">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-700 rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground">Perfect Balance</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">Adventure by day, celebration by night</p>
                  </div>
                  
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-800 to-blue-900 rounded-2xl flex items-center justify-center mx-auto">
                      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-800 rounded-full"></div>
                      </div>
                    </div>
                    <h3 className="font-heading font-bold text-xl text-foreground">Hassle-Free</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">Everything organized, just show up and adventure</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-300/15 to-blue-400/15 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}