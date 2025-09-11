import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import skiPhoto from "@assets/WhatsApp Image 2025-09-09 at 18.02.52_8921f211_1757579817544.jpg";
import celebratePhoto from "@assets/WhatsApp Image 2025-09-09 at 18.02.53_e23d55a8_1757579817549.jpg";

interface HeroProps {
  onBookingClick?: () => void;
}

export default function Hero({ onBookingClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Split Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/60 to-blue-600/40"></div>
        <div 
          className="absolute left-0 top-0 w-3/5 h-full bg-cover bg-center opacity-30"
          style={{ backgroundImage: `url(${skiPhoto})` }}
        />
        <div 
          className="absolute right-0 top-0 w-2/5 h-full bg-cover bg-center opacity-20"
          style={{ backgroundImage: `url(${celebratePhoto})` }}
        />
      </div>
      
      {/* Floating Content Grid */}
      <div className="relative z-10 px-4 max-w-7xl mx-auto w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen py-20">
          
          {/* Left Column - Main Hero */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <div className="inline-block bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 text-white/90 font-medium animate-fade-in-up">
                🎿 March 6-9, 2025 • Bansko
              </div>
              
              <h1 className="font-heading text-6xl md:text-7xl xl:text-8xl font-black text-white leading-tight animate-fade-in-up animate-delay-100">
                EPIC
                <br />
                <span className="bg-gradient-to-r from-blue-300 to-blue-100 bg-clip-text text-transparent">
                  ADVENTURES
                </span>
                <br />
                <span className="text-4xl md:text-5xl xl:text-6xl font-light">await</span>
              </h1>
            </div>
            
            <p className="font-body text-xl md:text-2xl text-white/90 max-w-lg animate-fade-in-up animate-delay-200">
              Where alpine skiing meets après-ski parties. Experience Bulgaria's most exclusive winter festival.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 animate-fade-in-up animate-delay-300">
              <Button 
                size="lg" 
                className="font-heading text-lg px-10 py-7 bg-blue-500 hover:bg-blue-600 text-white shadow-2xl shadow-blue-500/30"
                onClick={onBookingClick}
                data-testid="button-book-adventure"
              >
                Book Your Spot
                <span className="ml-2 text-sm bg-white/20 px-2 py-1 rounded">€175</span>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline" 
                className="font-heading text-lg px-10 py-7 bg-white/5 backdrop-blur border-white/30 text-white hover:bg-white/10 group"
                data-testid="button-watch-video"
              >
                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                Watch Adventures
              </Button>
            </div>
          </div>
          
          {/* Right Column - Premium Blue-tinted Glass Panel */}
          <div className="relative lg:ml-12">
            <div className="relative bg-gradient-to-br from-blue-500/20 to-blue-600/30 backdrop-blur-xl border border-blue-300/30 rounded-3xl p-12 shadow-2xl shadow-blue-500/20 animate-fade-in-up animate-delay-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent rounded-3xl"></div>
              
              <div className="relative z-10 text-center">
                <h2 className="font-heading text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                  <span className="block">Ski.</span>
                  <span className="block text-blue-200">Adventure.</span>
                  <span className="block text-blue-100">Celebrate.</span>
                </h2>
                
                <div className="space-y-4 text-white/90">
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span className="font-body text-lg">World-class ski slopes</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span className="font-body text-lg">Pool party experiences</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span className="font-body text-lg">ATV mountain adventures</span>
                  </div>
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-2 h-2 bg-blue-300 rounded-full"></div>
                    <span className="font-body text-lg">Afrobeats & House DJs</span>
                  </div>
                </div>
                
                <div className="mt-8 pt-6 border-t border-blue-300/30">
                  <p className="text-blue-100 font-medium text-sm">
                    Limited to 100 adventurers
                  </p>
                </div>
              </div>
            </div>
            
            {/* Floating accent elements */}
            <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/30 to-blue-500/30 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-blue-400/20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}