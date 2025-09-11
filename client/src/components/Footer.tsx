export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white">
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center space-y-8">
          {/* Logo */}
          <div className="space-y-4">
            <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                TRAKIA
              </span>
              <span className="text-blue-200 ml-2">TRIPS</span>
            </h2>
            <p className="font-body text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
              Where epic adventures meet unforgettable celebrations
            </p>
          </div>
          
          {/* Instagram Link */}
          <div className="flex justify-center">
            <a
              href="https://www.instagram.com/trakiatrips/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 rounded-2xl p-4 transition-all duration-300 hover-elevate"
              data-testid="link-instagram"
            >
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                <span className="font-heading font-bold text-lg text-white group-hover:text-blue-100 transition-colors">
                  Follow @trakiatrips
                </span>
              </div>
            </a>
          </div>
          
          {/* Bottom Info */}
          <div className="pt-8 border-t border-blue-700/50 space-y-4 text-blue-200">
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm md:text-base">
              <span>March 6-9, 2025 • Bansko, Bulgaria</span>
              <span className="hidden sm:block">|</span>
              <span>Limited to 100 Adventurers</span>
            </div>
            <p className="text-sm text-blue-300">
              © 2025 Trakia Trips. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}