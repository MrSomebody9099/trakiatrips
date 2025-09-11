import atvImage from "@assets/generated_images/Premium_ATV_mountain_adventure_e62e935b.png";
import poolImage from "@assets/generated_images/Luxury_pool_party_scene_427ac283.png";
import mountainImage from "@assets/generated_images/Majestic_mountain_top_view_fe2cde7f.png";

const galleryItems = [
  {
    type: "image" as const,
    src: atvImage,
    title: "ATV Adventures",
    description: "Explore rugged mountain terrain with your crew",
    category: "adventure",
  },
  {
    type: "image" as const,
    src: mountainImage,
    title: "Mountain Adventures",
    description: "Experience the thrill of our mountain trips",
    category: "mountains",
  },
  {
    type: "image" as const,
    src: poolImage,
    title: "Pool Parties",
    description: "Vibrant nights with music and amazing vibes",
    category: "party",
  },
  {
    type: "image" as const,
    src: atvImage,
    title: "Epic Skiing",
    description: "Perfect powder and breathtaking mountain views",
    category: "skiing",
  },
];

export default function Gallery() {
  return (
    <section className="py-16 md:py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4 md:mb-6">
            Live the Adventure
          </h2>
          <p className="font-body text-lg md:text-xl text-muted-foreground">
            Real moments from our epic trips
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in-up">
          {galleryItems.map((item, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl aspect-[3/4] hover-elevate transition-all duration-300 hover:scale-105"
              data-testid={`gallery-item-${index}`}
            >
              <img
                src={item.src}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="font-heading font-semibold text-lg mb-2 text-primary-foreground">
                    {item.title}
                  </h3>
                  <p className="font-body text-sm text-white/90">{item.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground font-body">← Scroll to explore more →</p>
        </div>
      </div>
    </section>
  );
}