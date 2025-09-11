import { Mountain, MapPin, Music, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Mountain,
    title: "4★ Hotel",
    description: "Breakfast & Dinner included",
  },
  {
    icon: MapPin,
    title: "Transport",
    description: "Bus from Stara Zagora",
  },
  {
    icon: Music,
    title: "Club Events",
    description: "Afrobeats & House DJs",
  },
  {
    icon: Star,
    title: "Pool Party",
    description: "FREE for first 60 bookings!",
  },
];

export default function Features() {
  return (
    <section className="py-16 md:py-20 px-4 bg-gradient-to-b from-background to-accent/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
          <h2 className="font-heading font-bold text-3xl md:text-5xl text-foreground mb-4 md:mb-6">
            What's Included
          </h2>
          <p className="font-body text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need for the perfect mountain adventure and festival experience
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={feature.title}
              className="hover-elevate transition-all duration-300 hover:scale-105 border-border/50 bg-card/80 backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`card-feature-${index}`}
            >
              <CardContent className="p-6 text-center">
                <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-heading font-semibold text-lg text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="font-body text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-12 border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-8">
            <h3 className="font-heading font-bold text-2xl text-foreground mb-6 text-center">
              Additional Info
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-heading font-semibold text-lg text-foreground mb-3">
                  Not Included:
                </h4>
                <ul className="font-body text-muted-foreground space-y-2">
                  <li>• Flights</li>
                  <li>• Ski pass</li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-lg text-foreground mb-3">
                  Available Extras:
                </h4>
                <ul className="font-body text-muted-foreground space-y-2">
                  <li>• Discounted ski rental equipment (prices TBA)</li>
                  <li>• Ski gear, quad bikes & activities (prices TBA)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}