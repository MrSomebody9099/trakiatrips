import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Premium ticker banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-primary via-blue-600 to-primary h-8 overflow-hidden">
        <div className="flex items-center h-full whitespace-nowrap animate-pulse">
          <div className="text-white font-body font-medium text-sm px-4 animate-bounce">
            🎿 Early Bird Special: Save €50 • Book by Feb 15th • March 6-9 Ski Festival • Limited Spots Available 🏔️
          </div>
        </div>
      </div>

      {/* Premium navigation */}
      <nav className="fixed top-8 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center md:hidden"></div>

            <div className="flex-1 flex justify-center items-center">
              <h1 className="font-heading font-bold text-2xl text-primary tracking-wider uppercase">
                TRAKIA TRIPS
              </h1>
            </div>

            <Button
              onClick={() => setIsOpen(!isOpen)}
              variant="outline"
              size="icon"
              className="hover-elevate"
              data-testid="button-menu-toggle"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {isOpen && (
            <div className="bg-card/95 backdrop-blur-lg rounded-lg mt-4 p-6 mb-4 border border-border shadow-xl animate-fade-in-up">
              <div className="flex flex-col space-y-4">
                <a
                  href="#home"
                  className="text-foreground hover:text-primary transition-colors font-body font-medium text-lg uppercase tracking-wide hover-elevate p-2 rounded"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-home"
                >
                  HOME
                </a>
                <a
                  href="#about"
                  className="text-foreground hover:text-primary transition-colors font-body font-medium text-lg uppercase tracking-wide hover-elevate p-2 rounded"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-about"
                >
                  ABOUT US
                </a>
                <a
                  href="#booking"
                  className="text-foreground hover:text-primary transition-colors font-body font-medium text-lg uppercase tracking-wide hover-elevate p-2 rounded"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-booking"
                >
                  BOOK TRIP
                </a>
                <a
                  href="#terms"
                  className="text-foreground hover:text-primary transition-colors font-body font-medium text-lg uppercase tracking-wide hover-elevate p-2 rounded"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-terms"
                >
                  TERMS
                </a>
                <Button
                  className="mt-4 hover-elevate"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-book-now"
                >
                  BOOK NOW
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}