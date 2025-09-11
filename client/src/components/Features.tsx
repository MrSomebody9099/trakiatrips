import { Mountain, MapPin, Music, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Mountain,
    title: "LUXURY ALPINE LODGE",
    description: "4★ mountain hotel with breakfast & dinner",
    gradient: "from-blue-500 to-blue-600",
  },
  {
    icon: MapPin,
    title: "VIP TRANSPORT",
    description: "Premium bus from Stara Zagora",
    gradient: "from-blue-600 to-blue-700",
  },
  {
    icon: Music,
    title: "EXCLUSIVE EVENTS",
    description: "Afrobeats & House DJs nightly",
    gradient: "from-blue-700 to-blue-800",
  },
  {
    icon: Star,
    title: "EPIC POOL PARTIES",
    description: "FREE for first 60 adventurers!",
    gradient: "from-blue-800 to-blue-900",
  },
];

export default function Features() {
  return (
    <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-blue-50/30 via-background to-blue-50/50">
      <div className="max-w-7xl mx-auto">
        {/* LIVE THE ADVENTURE Section */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-blue-600 font-medium mb-6">
            🎬 Live The Adventure
          </div>
          <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 md:mb-8">
            LIVE THE
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              ADVENTURE
            </span>
          </h2>
          <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-16">
            Watch real moments from our epic adventures
          </p>
        </div>

        {/* Adventure Videos Grid */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-20 md:mb-32">
          {/* Skiing Video */}
          <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/5] hover-elevate transition-all duration-500">
            <video
              src="/videos/enjoying-skiing.mp4"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              muted
              loop
              playsInline
              onMouseEnter={(e) => {
                e.currentTarget.play().catch(err => console.log('Video play failed:', err));
              }}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
              data-testid="video-skiing"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent">
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white">
                <h3 className="font-heading font-bold text-xl md:text-2xl mb-2 md:mb-3">
                  Epic Skiing
                </h3>
                <p className="font-body text-sm md:text-base text-white/90 leading-relaxed">
                  Hit the pristine slopes of Bansko with world-class equipment and breathtaking mountain views.
                </p>
              </div>
            </div>
            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
            </div>
          </div>

          {/* Pool Party Video */}
          <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/5] hover-elevate transition-all duration-500">
            <video
              src="/videos/pool-party.mp4"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              muted
              loop
              playsInline
              onMouseEnter={(e) => {
                e.currentTarget.play().catch(err => console.log('Video play failed:', err));
              }}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
              data-testid="video-pool-party"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent">
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white">
                <h3 className="font-heading font-bold text-xl md:text-2xl mb-2 md:mb-3">
                  Pool Parties
                </h3>
                <p className="font-body text-sm md:text-base text-white/90 leading-relaxed">
                  When the sun sets, the real adventure begins. Dance the night away with world-class DJs.
                </p>
              </div>
            </div>
            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
            </div>
          </div>

          {/* Skiing Downhill Video */}
          <div className="relative group rounded-2xl md:rounded-3xl overflow-hidden aspect-[4/5] hover-elevate transition-all duration-500">
            <video
              src="/videos/skiing-downhill.mp4"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              muted
              loop
              playsInline
              onMouseEnter={(e) => {
                e.currentTarget.play().catch(err => console.log('Video play failed:', err));
              }}
              onMouseLeave={(e) => {
                e.currentTarget.pause();
                e.currentTarget.currentTime = 0;
              }}
              data-testid="video-skiing-downhill"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent">
              <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6 right-4 md:right-6 text-white">
                <h3 className="font-heading font-bold text-xl md:text-2xl mb-2 md:mb-3">
                  Downhill Rush
                </h3>
                <p className="font-body text-sm md:text-base text-white/90 leading-relaxed">
                  Feel the adrenaline as you carve through perfect powder on legendary Bulgarian slopes.
                </p>
              </div>
            </div>
            {/* Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm border-2 border-white/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
              <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
            </div>
          </div>
        </div>

        {/* Premium Package Inclusions Section */}
        <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-blue-600 font-medium mb-6">
            ⭐ Premium Package Inclusions
          </div>
          <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 md:mb-8">
            EPIC
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              INCLUSIONS
            </span>
          </h2>
          <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for the ultimate mountain adventure and festival experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative group hover-elevate transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
              data-testid={`card-feature-${index}`}
            >
              <div className="relative bg-gradient-to-br from-white to-blue-50/50 backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 shadow-xl shadow-blue-500/10 group-hover:shadow-2xl group-hover:shadow-blue-500/20 transition-all duration-500">
                {/* Premium gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-3xl`}></div>
                
                {/* Icon with premium background */}
                <div className={`relative w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                
                <div className="relative text-center">
                  <h3 className="font-heading font-black text-lg text-foreground mb-3 tracking-wide">
                    {feature.title}
                  </h3>
                  <p className="font-body text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>

                {/* Premium border accent */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-300/30 rounded-3xl transition-all duration-500"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Additional Info Section */}
        <div className="mt-20 animate-fade-in-up animate-delay-300">
          <div className="relative bg-gradient-to-br from-blue-500/10 to-blue-600/20 backdrop-blur-xl border border-blue-300/30 rounded-3xl p-8 md:p-12 shadow-2xl shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent rounded-3xl"></div>
            
            <div className="relative text-center mb-12">
              <h3 className="font-heading font-black text-3xl md:text-4xl text-foreground mb-4">
                ADDITIONAL
                <span className="block bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                  ADVENTURE INFO
                </span>
              </h3>
            </div>
            
            <div className="relative grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></div>
                  <h4 className="font-heading font-bold text-xl text-foreground">
                    NOT INCLUDED
                  </h4>
                </div>
                <div className="space-y-4 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="font-body text-lg text-muted-foreground">Flights to Bulgaria</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="font-body text-lg text-muted-foreground">Daily ski passes</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full"></div>
                  <h4 className="font-heading font-bold text-xl text-foreground">
                    EPIC EXTRAS
                  </h4>
                </div>
                <div className="space-y-4 pl-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="font-body text-lg text-muted-foreground">Premium ski equipment rental</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="font-body text-lg text-muted-foreground">ATV mountain adventures & activities</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating accent elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-300/15 to-blue-400/15 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}