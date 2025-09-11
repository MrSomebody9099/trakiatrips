import { Button } from "@/components/ui/button";
import heroBackground from "@assets/Washington-Ski-Resorts-Backcountry-1-scaled-1-1920x1080_1757580505748.jpg";
import skiPhoto from "@assets/WhatsApp Image 2025-09-09 at 18.02.52_8921f211_1757579817544.jpg";
import celebratePhoto from "@assets/WhatsApp Image 2025-09-09 at 18.02.53_e23d55a8_1757579817549.jpg";
import enjoyingSkiingVideo from "@assets/enjoying skiing video_1757583705145.mp4";
import poolPartyVideo from "@assets/night Pool party video_1757583705146.mp4";
import skiingDownhillVideo from "@assets/skiing downhill video_1757583705147.mp4";

interface HeroProps {
  onBookingClick?: () => void;
}

export default function Hero({ onBookingClick }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Premium Mountain Background */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBackground})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 via-blue-800/70 to-blue-600/50"></div>
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
            
            <div className="flex justify-center lg:justify-start animate-fade-in-up animate-delay-300">
              <Button 
                size="lg" 
                className="font-heading text-xl px-12 py-8 bg-blue-500 hover:bg-blue-600 text-white shadow-2xl shadow-blue-500/30 transform hover:scale-105 transition-all duration-300"
                onClick={onBookingClick}
                data-testid="button-book-adventure"
              >
                Book Your Adventure
              </Button>
            </div>
          </div>
          
          {/* Right Column - Adventure Videos */}
          <div className="relative lg:ml-12 space-y-4 md:space-y-6">
            {/* Live Adventure Videos Grid */}
            <div className="grid grid-cols-2 gap-3 md:gap-4">
              {/* Skiing Video */}
              <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[3/4] hover-elevate transition-all duration-500 animate-fade-in-up animate-delay-200">
                <video
                  src={enjoyingSkiingVideo}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent">
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white">
                    <h3 className="font-heading font-bold text-sm md:text-lg mb-1 md:mb-2">
                      Epic Skiing
                    </h3>
                    <p className="font-body text-xs md:text-sm text-white/90">
                      Premium slopes & powder
                    </p>
                  </div>
                </div>
                {/* Play Button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-0 h-0 border-l-3 md:border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                </div>
              </div>

              {/* Pool Party Video */}
              <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[3/4] hover-elevate transition-all duration-500 animate-fade-in-up animate-delay-300">
                <video
                  src={poolPartyVideo}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  muted
                  loop
                  playsInline
                  onMouseEnter={(e) => e.currentTarget.play()}
                  onMouseLeave={(e) => {
                    e.currentTarget.pause();
                    e.currentTarget.currentTime = 0;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent">
                  <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4 right-3 md:right-4 text-white">
                    <h3 className="font-heading font-bold text-sm md:text-lg mb-1 md:mb-2">
                      Pool Parties
                    </h3>
                    <p className="font-body text-xs md:text-sm text-white/90">
                      Epic night vibes
                    </p>
                  </div>
                </div>
                {/* Play Button */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="w-0 h-0 border-l-3 md:border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                </div>
              </div>
            </div>
            
            {/* Skiing Downhill Video - Full Width */}
            <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[16/9] hover-elevate transition-all duration-500 animate-fade-in-up animate-delay-400">
              <video
                src={skiingDownhillVideo}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                muted
                loop
                playsInline
                onMouseEnter={(e) => e.currentTarget.play()}
                onMouseLeave={(e) => {
                  e.currentTarget.pause();
                  e.currentTarget.currentTime = 0;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/20 to-transparent">
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white">
                  <h3 className="font-heading font-bold text-base md:text-xl mb-2 md:mb-3">
                    Epic Downhill Adventures
                  </h3>
                  <p className="font-body text-sm md:text-base text-white/90">
                    Feel the rush of perfect powder and mountain freedom
                  </p>
                </div>
              </div>
              {/* Play Button */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="w-0 h-0 border-l-5 md:border-l-6 border-l-white border-t-3 md:border-t-4 border-t-transparent border-b-3 md:border-b-4 border-b-transparent ml-1"></div>
              </div>
            </div>
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