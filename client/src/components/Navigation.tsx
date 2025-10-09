import { useState } from "react";
import { Menu, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/one_1758569530864.jpg";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Premium ticker banner */}
      <div className="fixed top-0 left-0 right-0 z-50 h-8 overflow-hidden" style={{background: '#004AAD'}}>
        <div className="flex items-center h-full animate-marquee whitespace-nowrap">
          <div className="text-white font-body font-medium text-xs sm:text-sm px-4 sm:px-8">
            Early bird Sale 80% sold out • Early bird Sale 80% sold out • Early bird Sale 80% sold out • Early bird Sale 80% sold out • Early bird Sale 80% sold out • Early bird Sale 80% sold out
          </div>
        </div>
      </div>

      {/* Premium navigation */}
      <nav className="fixed top-8 left-0 right-0 z-40 backdrop-blur-lg border-b border-blue-700/50 shadow-2xl" style={{background: '#004AAD'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center md:hidden"></div>

            <div className="flex-1 flex justify-center items-center">
              <div className="flex items-center space-x-3">
                <img 
                  src={logoImage} 
                  alt="Trakia Trips" 
                  className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 object-contain"
                  data-testid="logo-header"
                />
                <h1 className="font-heading font-black text-xl sm:text-2xl md:text-3xl text-white tracking-wider uppercase relative">
                  <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    TRAKIA
                  </span>
                  <span className="text-blue-200 ml-2">TRIPS</span>
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent"></div>
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Profile Icon */}
              <Button
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = '/profile';
                  link.click();
                }}
                variant="ghost"
                size="icon"
                className="hover-elevate text-white hover:bg-blue-700/50 rounded-full"
                data-testid="button-profile"
              >
                <User className="h-5 w-5" />
              </Button>
              
              {/* Menu Toggle */}
              <Button
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                size="icon"
                className="hover-elevate border-blue-400/50 text-white hover:bg-blue-700/50"
                data-testid="button-menu-toggle"
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {isOpen && (
            <div className="bg-gradient-to-br from-blue-900/95 to-blue-800/95 backdrop-blur-lg rounded-2xl mt-4 p-8 mb-4 border border-blue-600/50 shadow-2xl animate-fade-in-up">
              <div className="flex flex-col space-y-6">
                <a
                  href="/"
                  className="text-white hover:text-blue-200 transition-colors font-heading font-bold text-xl uppercase tracking-wider hover-elevate p-3 rounded-xl bg-blue-800/30 hover:bg-blue-700/50"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-home"
                >
                  HOME
                </a>
                <a
                  href="/about"
                  className="text-white hover:text-blue-200 transition-colors font-heading font-bold text-xl uppercase tracking-wider hover-elevate p-3 rounded-xl bg-blue-800/30 hover:bg-blue-700/50"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-about"
                >
                  ABOUT US
                </a>
                <a
                  href="/booking"
                  className="text-white hover:text-blue-200 transition-colors font-heading font-bold text-xl uppercase tracking-wider hover-elevate p-3 rounded-xl bg-blue-800/30 hover:bg-blue-700/50"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-booking"
                >
                  BOOK TRIP
                </a>
                <a
                  href="/terms"
                  className="text-white hover:text-blue-200 transition-colors font-heading font-bold text-xl uppercase tracking-wider hover-elevate p-3 rounded-xl bg-blue-800/30 hover:bg-blue-700/50"
                  onClick={() => setIsOpen(false)}
                  data-testid="link-terms"
                >
                  TERMS
                </a>
                <a
                  href="#"
                  className="mt-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-heading font-bold text-lg py-4 rounded-xl shadow-lg hover-elevate flex items-center justify-center"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    window.location.href = "/booking";
                  }}
                  data-testid="button-book-now"
                >
                  BOOK NOW
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}