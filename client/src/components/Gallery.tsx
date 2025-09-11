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
    orientation: "landscape",
  },
  {
    type: "image" as const,
    src: poolPartyPhoto,
    title: "Legendary Pool Parties",
    description: "Vibrant nights with Afrobeats, House DJs and amazing vibes",
    category: "party",
    featured: false,
    orientation: "portrait",
  },
  {
    type: "image" as const,
    src: atvSoloPhoto,
    title: "Mountain ATV Adventures", 
    description: "Explore rugged mountain terrain and scenic landscapes",
    category: "adventure",
    featured: false,
    orientation: "landscape",
  },
  {
    type: "image" as const,
    src: skiCelebrationPhoto,
    title: "Celebrate the Moment",
    description: "Pure joy and celebration on the mountain slopes",
    category: "celebration",
    featured: false,
    orientation: "portrait",
  },
  {
    type: "image" as const,
    src: atvGroupPhoto,
    title: "Squad Adventures",
    description: "Epic group experiences with ATVs and adventure gear",
    category: "group",
    featured: true,
    orientation: "landscape",
  },
  // Instagram Video Embeds
  {
    type: "video" as const,
    src: "https://www.instagram.com/reel/DObghFHCF2R/embed",
    title: "Skiing Action Reel",
    description: "Live skiing moments from our adventures",
    category: "video",
    featured: false,
    orientation: "portrait",
  },
  {
    type: "video" as const,
    src: "https://www.instagram.com/reel/DB9bNrjMVSZ/embed",
    title: "Party Highlights",
    description: "Epic party moments and celebrations",
    category: "video", 
    featured: false,
    orientation: "portrait",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8 animate-fade-in-up animate-delay-200">
          {galleryItems.map((item, index) => {
            const isLarge = item.featured;
            const isLandscape = item.orientation === "landscape";
            
            let gridClass;
            if (isLarge && isLandscape) {
              gridClass = "md:col-span-2 lg:col-span-4 xl:col-span-4 aspect-[16/9]"; // Large landscape
            } else if (isLarge) {
              gridClass = "lg:col-span-2 xl:col-span-3 aspect-[3/4]"; // Large portrait
            } else if (isLandscape) {
              gridClass = "md:col-span-2 lg:col-span-2 xl:col-span-2 aspect-[4/3]"; // Small landscape
            } else {
              gridClass = "aspect-[3/4]"; // Small portrait
            }
            
            return (
              <div
                key={index}
                className={`relative group rounded-2xl ${gridClass} hover-elevate transition-all duration-500 overflow-hidden`}
                data-testid={`gallery-item-${index}`}
              >
                {item.type === "image" ? (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <iframe
                    src={item.src}
                    className="w-full h-full rounded-2xl"
                    frameBorder="0"
                    scrolling="no"
                    title={item.title}
                  />
                )}
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 text-white">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-blue-200">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="uppercase tracking-wide font-medium">{item.category}</span>
                      </div>
                      
                      <h3 className="font-heading font-bold text-lg md:text-xl leading-tight group-hover:text-blue-200 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="font-body text-sm text-white/90 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Border Accent */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/30 rounded-2xl transition-all duration-300"></div>
                
                {/* Instagram Icon for Videos */}
                {item.type === "video" && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-lg flex items-center justify-center opacity-90 group-hover:opacity-100 transition-all duration-300">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </div>
                )}
                
                {/* Play Button for Featured Images */}
                {isLarge && item.type === "image" && (
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white/30">
                    <div className="w-0 h-0 border-l-6 border-l-white border-t-4 border-t-transparent border-b-4 border-b-transparent ml-1"></div>
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