import MarqueeTape from "../components/MarqueeTape";
import Navigation from "../components/Navigation";

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <MarqueeTape />
      <Navigation />
      
      <main className="pt-24 px-4">
        <div className="max-w-4xl mx-auto py-16">
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-blue-600 font-medium mb-6">
              🏔️ Our Story
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 md:mb-8">
              ABOUT
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                TRAKIA TRIPS
              </span>
            </h1>
          </div>
          
          <div className="space-y-8 animate-fade-in-up animate-delay-200">
            <div className="bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 md:p-12 shadow-xl shadow-blue-500/10">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">
                Creating Epic Adventures Since Day One
              </h2>
              <p className="font-body text-lg text-muted-foreground leading-relaxed mb-6">
                Trakia Trips was born from a passion for bringing people together through unforgettable mountain experiences. 
                We believe that the best adventures happen when skiing meets celebration, when mountain peaks become dance floors, 
                and when strangers become lifelong friends.
              </p>
              <p className="font-body text-lg text-muted-foreground leading-relaxed">
                Our team curates every detail of your adventure - from the pristine slopes of Bansko to the epic pool parties 
                that light up the Bulgarian nights. We're not just organizing trips; we're creating memories that last forever.
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/20 backdrop-blur-xl border border-blue-300/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-500/20">
              <h2 className="font-heading font-bold text-2xl md:text-3xl text-foreground mb-6">
                Why Choose Trakia Trips?
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">Premium Experiences</h3>
                      <p className="font-body text-muted-foreground">Carefully selected venues, accommodations, and activities</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">Epic Community</h3>
                      <p className="font-body text-muted-foreground">Join adventurers from across Europe for unforgettable connections</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">Perfect Balance</h3>
                      <p className="font-body text-muted-foreground">Adventure by day, celebration by night</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-400 rounded-full mt-2"></div>
                    <div>
                      <h3 className="font-heading font-semibold text-lg text-foreground">Hassle-Free</h3>
                      <p className="font-body text-muted-foreground">Everything organized, just show up and adventure</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}