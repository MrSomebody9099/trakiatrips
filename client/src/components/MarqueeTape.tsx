export default function MarqueeTape() {
  const marqueeText = "🎿 early bird spaces, book now, save money • March 6-9 Ski Festival • 🏔️ Epic Adventures Await • 🎵 Afrobeats & House DJs • ";

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