export default function MarqueeTape() {
  const marqueeText = "🎿 Early bird Sale 80% sold out • March 6-9 Ski Festival • 🏔️ Epic Adventures Await • 🎵 Afrobeats & House DJs • ";

  return (
    <div className="bg-primary text-primary-foreground py-3 overflow-hidden relative">
      <div className="whitespace-nowrap">
        <div className="animate-marquee inline-block">
          <span className="text-sm font-semibold px-4">{marqueeText}</span>
          <span className="text-sm font-semibold px-4">{marqueeText}</span>
          <span className="text-sm font-semibold px-4">{marqueeText}</span>
          <span className="text-sm font-semibold px-4">{marqueeText}</span>
          <span className="text-sm font-semibold px-4">{marqueeText}</span>
          <span className="text-sm font-semibold px-4">{marqueeText}</span>
          <span className="text-sm font-semibold px-4">{marqueeText}</span>
          <span className="text-sm font-semibold px-4">{marqueeText}</span>
        </div>
      </div>
    </div>
  );
}