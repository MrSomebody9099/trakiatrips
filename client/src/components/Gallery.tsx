import skiGroupPhoto from "@assets/WhatsApp Image 2025-09-09 at 18.02.52_8921f211_1757579817544.jpg";
import atvSoloPhoto from "@assets/WhatsApp Image 2025-09-09 at 18.02.53_89b49da5_1757579817546.jpg";
import atvGroupPhoto from "@assets/WhatsApp Image 2025-09-09 at 18.02.53_e5ee5227_1757579817548.jpg";
import skiCelebrationPhoto from "@assets/WhatsApp Image 2025-09-09 at 18.02.53_e23d55a8_1757579817549.jpg";
import poolPartyPhoto from "@assets/WhatsApp Image 2025-09-09 at 18.14.12_3eb30612_1757579827194.jpg";

const galleryItems = [
  {
    type: "image" as const,
    src: skiGroupPhoto,
    title: "Epic Skiing Adventures",
    description: "Perfect powder and breathtaking alpine experiences with friends",
    category: "skiing",
    featured: true,
  },
  {
    type: "image" as const,
    src: poolPartyPhoto,
    title: "Legendary Pool Parties",
    description: "Vibrant nights with Afrobeats, House DJs and amazing vibes",
    category: "party",
    featured: false,
  },
  {
    type: "image" as const,
    src: atvSoloPhoto,
    title: "Mountain ATV Adventures", 
    description: "Explore rugged mountain terrain and scenic landscapes",
    category: "adventure",
    featured: false,
  },
  {
    type: "image" as const,
    src: skiCelebrationPhoto,
    title: "Celebrate the Moment",
    description: "Pure joy and celebration on the mountain slopes",
    category: "celebration",
    featured: true,
  },
  {
    type: "image" as const,
    src: atvGroupPhoto,
    title: "Squad Adventures",
    description: "Epic group experiences with ATVs and adventure gear",
    category: "group",
    featured: false,
  },
];

export default function Gallery() {
  return (
    <section className="py-20 md:py-32 px-4 bg-gradient-to-b from-background to-blue-50/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 md:mb-20 animate-fade-in-up">
          <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-blue-600 font-medium mb-6">
            🏔️ Real Adventures, Real Moments
          </div>
          <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 md:mb-8">
            LIVE THE
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              ADVENTURE
            </span>
          </h2>
          <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
            Authentic moments captured from our epic Trakia Trips experiences
          </p>
        </div>

        {/* Premium Gallery Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-fade-in-up animate-delay-200">
          {galleryItems.map((item, index) => {
            const isLarge = item.featured;
            const gridClass = isLarge 
              ? "lg:col-span-8 lg:row-span-2 aspect-[4/3]" 
              : "lg:col-span-4 aspect-[3/4]";
            
            return (
              <div
                key={index}
                className={`relative group rounded-2xl ${gridClass} hover-elevate transition-all duration-500 overflow-hidden`}
                data-testid={`gallery-item-${index}`}
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 text-white">
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-sm text-blue-200">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="uppercase tracking-wide font-medium">{item.category}</span>
                      </div>
                      
                      <h3 className="font-heading font-bold text-xl md:text-2xl leading-tight group-hover:text-blue-200 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="font-body text-sm md:text-base text-white/90 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Border Accent */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/30 rounded-2xl transition-all duration-300"></div>
                
                {/* Floating Play Button for Featured Items */}
                {isLarge && (
                  <div className="absolute top-6 right-6 w-12 h-12 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30">
                    <div className="w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 md:mt-20 animate-fade-in-up animate-delay-300">
          <p className="text-lg text-muted-foreground font-body mb-6">
            Ready to create your own epic memories?
          </p>
          <div className="inline-flex items-center space-x-2 text-blue-600 font-medium">
            <span>Book your adventure now</span>
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
              <div className="w-0 h-0 border-l-3 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent ml-0.5"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}