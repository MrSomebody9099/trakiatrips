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
    type: "video" as const,
    src: "/videos/enjoying-skiing.mp4",
    title: "Skiing Action",
    description: "Experience the thrill of carving through fresh powder on pristine mountain slopes.",
    category: "skiing",
    featured: false,
    orientation: "portrait",
    testId: "video-skiing",
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
    type: "video" as const,
    src: "/videos/pool-party.mp4",
    title: "Night Pool Parties",
    description: "Epic nighttime pool parties with amazing vibes, music and unforgettable moments.",
    category: "party",
    featured: false,
    orientation: "portrait",
    testId: "video-pool-party",
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
    type: "video" as const,
    src: "/videos/skiing-downhill.mp4",
    title: "Downhill Rush",
    description: "Feel the adrenaline as you carve through perfect powder on legendary Bulgarian slopes.",
    category: "skiing",
    featured: false,
    orientation: "portrait",
    testId: "video-skiing-downhill",
  },
  {
    type: "video" as const,
    src: "/videos/snow-mobile.mp4",
    title: "Snow Mobile Adventure",
    description: "Explore the mountain wilderness with high-speed snowmobile adventures.",
    category: "adventure",
    featured: false,
    orientation: "portrait",
    testId: "video-snow-mobile",
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
];

const instagramVideos = [
  {
    src: "https://www.instagram.com/reel/DObghFHCF2R/embed",
    title: "Skiing Action",
  },
  {
    src: "https://www.instagram.com/reel/DB9bNrjMVSZ/embed", 
    title: "Party Highlights",
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

        {/* Live Adventure Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8 animate-fade-in-up animate-delay-200">
          {galleryItems.map((item, index) => {
            const isLarge = item.featured;
            const isLandscape = item.orientation === "landscape";
            
            let gridClass;
            if (isLarge && isLandscape) {
              gridClass = "col-span-1 md:col-span-2 lg:col-span-4 xl:col-span-4 aspect-[16/9]"; // Large landscape
            } else if (isLarge) {
              gridClass = "col-span-1 lg:col-span-2 xl:col-span-3 aspect-[3/4]"; // Large portrait
            } else if (isLandscape) {
              gridClass = "col-span-1 md:col-span-2 lg:col-span-2 xl:col-span-2 aspect-[4/3]"; // Small landscape
            } else {
              gridClass = "col-span-1 aspect-[3/4]"; // Small portrait
            }
            
            return (
              <div
                key={index}
                className={`relative group rounded-2xl ${gridClass} hover-elevate transition-all duration-500 overflow-hidden`}
                data-testid={item.type === 'video' ? item.testId : `gallery-item-${index}`}
              >
                {item.type === 'video' ? (
                  <video
                    key={item.src}
                    src={item.src}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    muted
                    loop
                    playsInline
                    preload="auto"
                    onMouseEnter={(e) => {
                      const video = e.currentTarget as HTMLVideoElement;
                      video.muted = true;
                      video.play().then(() => {
                        console.log('✅ Video playing:', item.title);
                      }).catch((err) => {
                        console.error('❌ Video play failed:', item.title, err);
                      });
                    }}
                    onMouseLeave={(e) => {
                      const video = e.currentTarget as HTMLVideoElement;
                      video.pause();
                      video.currentTime = 0;
                      console.log('⏹️ Video stopped:', item.title);
                    }}
                    onClick={(e) => {
                      const video = e.currentTarget as HTMLVideoElement;
                      if (video.paused) {
                        video.muted = true;
                        video.play().then(() => {
                          console.log('📱 Video playing via click:', item.title);
                        }).catch((err) => {
                          console.error('📱 Video click failed:', item.title, err);
                        });
                      } else {
                        video.pause();
                        video.currentTime = 0;
                        console.log('📱 Video clicked to stop:', item.title);
                      }
                    }}
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                )}
                
                {/* Premium Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/30 to-transparent opacity-60 group-hover:opacity-80 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-6 text-white">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-xs text-blue-200">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span className="uppercase tracking-wide font-medium">{item.category}</span>
                      </div>
                      
                      <h3 className="font-heading font-bold text-sm md:text-xl leading-tight group-hover:text-blue-200 transition-colors">
                        {item.title}
                      </h3>
                      
                      <p className="font-body text-xs md:text-sm text-white/90 leading-relaxed line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Premium Border Accent */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-400/30 rounded-2xl transition-all duration-300"></div>
                
              </div>
            );
          })}
        </div>
        
        {/* Instagram Moments Section */}
        <div className="mt-20 md:mt-32 animate-fade-in-up animate-delay-300">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block bg-gradient-to-r from-pink-500/10 to-orange-500/10 border border-pink-500/20 rounded-full px-6 py-2 text-pink-600 font-medium mb-6">
              Live Moments
            </div>
            <h2 className="font-heading font-black text-4xl md:text-6xl lg:text-7xl text-foreground mb-6 md:mb-8">
              EPIC
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                MOMENTS
              </span>
            </h2>
            <p className="font-body text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Real adventures, real excitement - captured live from our trips
            </p>
          </div>
          
          {/* Clean Instagram Videos Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {instagramVideos.map((video, index) => (
              <div
                key={index}
                className="relative group rounded-2xl aspect-[9/16] hover-elevate transition-all duration-500 overflow-hidden"
                data-testid={`instagram-video-${index}`}
              >
                <iframe
                  src={`${video.src}?utm_source=ig_embed&amp;utm_campaign=loading`}
                  className="w-full h-full rounded-2xl"
                  frameBorder="0"
                  scrolling="no"
                  title={video.title}
                  style={{ border: 'none', background: 'transparent' }}
                />
                
                {/* Clean Video Overlay - Hide unwanted elements */}
                <div className="absolute inset-0 pointer-events-none rounded-2xl">
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/80 to-transparent"></div>
                </div>
                
                {/* Premium Border Accent */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-pink-400/30 rounded-2xl transition-all duration-300"></div>
              </div>
            ))}
          </div>
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