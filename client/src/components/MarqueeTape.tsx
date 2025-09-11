export default function MarqueeTape() {
  const marqueeText = "🎿 Early Bird Special: Save €50 • Book by Feb 15th • March 6-9 Ski Festival • Limited Spots Available • 🏔️ Epic Adventures Await • 🎵 Afrobeats & House DJs • ";

  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden relative">
      <div className="flex animate-marquee whitespace-nowrap">
        <span className="text-sm font-semibold px-4">{marqueeText}</span>
        <span className="text-sm font-semibold px-4">{marqueeText}</span>
        <span className="text-sm font-semibold px-4">{marqueeText}</span>
        <span className="text-sm font-semibold px-4">{marqueeText}</span>
      </div>
    </div>
  );
}