import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Premium_skiing_mountain_hero_3ef17e6e.png";

interface HeroProps {
  onBookingClick?: () => void;
}

export default function Hero({ onBookingClick }: HeroProps) {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Pristine mountain slopes with dramatic peaks"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border border-white/20 shadow-2xl">
          <h1 className="font-heading font-bold text-4xl md:text-6xl lg:text-7xl text-white mb-6 md:mb-8 leading-tight">
            Ski. Adventure. Celebrate.
          </h1>
          <p className="font-body text-lg md:text-xl text-white/90 mb-6 md:mb-8 max-w-2xl mx-auto">
            Experience the ultimate mountain adventure with skiing, ATVs, and epic pool parties
          </p>

          <Button
            onClick={onBookingClick}
            size="lg"
            className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl font-heading font-semibold text-lg group transition-all duration-300 hover:scale-105 hover-elevate"
            data-testid="button-book-adventure"
          >
            Book Your Adventure
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </section>
  );
}