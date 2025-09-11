import { useState, useEffect } from "react";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Features from "./Features";
import Gallery from "./Gallery";
import AuthPanel from "./AuthPanel";

export default function HomePage() {
  const [showAuthPanel, setShowAuthPanel] = useState(false);
  const [hasShownPanel, setHasShownPanel] = useState(false);

  useEffect(() => {
    // Check if user has already seen the auth panel or has email stored
    const hasSeenPanel = localStorage.getItem("hasSeenAuthPanel");
    const userEmail = localStorage.getItem("userEmail");

    // Show panel after 5 seconds if user hasn't seen it and doesn't have email stored
    if (!hasSeenPanel && !userEmail && !hasShownPanel) {
      const timer = setTimeout(() => {
        setShowAuthPanel(true);
        setHasShownPanel(true);
      }, 5000); // 5 seconds as requested

      return () => clearTimeout(timer);
    }
  }, [hasShownPanel]);

  const handleCloseAuthPanel = () => {
    setShowAuthPanel(false);
    localStorage.setItem("hasSeenAuthPanel", "true");
  };

  const handleEmailCollected = (email: string) => {
    console.log("Email collected:", email);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("hasSeenAuthPanel", "true");
  };

  const handleBookingClick = () => {
    // In a real app, this would navigate to the booking flow
    // For now, we'll scroll to the features section or show the auth panel
    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      setShowAuthPanel(true);
    } else {
      console.log("Navigate to booking flow");
      // This would use router navigation in a real app
      window.location.href = "/booking";
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main>
        <Hero onBookingClick={handleBookingClick} />
        <Features />
        <Gallery />
      </main>

      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="font-body text-muted-foreground">
            © 2025 Trakia Trips. All rights reserved.
          </p>
        </div>
      </footer>

      <AuthPanel 
        isOpen={showAuthPanel}
        onClose={handleCloseAuthPanel}
        onEmailCollected={handleEmailCollected}
      />
    </div>
  );
}