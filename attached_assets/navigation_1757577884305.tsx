"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-60 bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 h-8 overflow-hidden">
        <div className="ticker-tape flex items-center h-full whitespace-nowrap">
          <div className="ticker-content text-white font-body font-semibold text-mobile-xs md:text-sm">
            🎿 Early Bird Special: Save €50 • Book by Feb 15th • March 6-9 Ski Festival • Limited Spots Available • 🏔️
            Epic Adventures Await • 🎵 Afrobeats & House DJs • 🎿 Early Bird Special: Save €50 • Book by Feb 15th •
            March 6-9 Ski Festival • Limited Spots Available • 🏔️ Epic Adventures Await • 🎵 Afrobeats & House DJs •
          </div>
        </div>
      </div>

      <nav className="fixed top-8 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center md:hidden"></div>

            <div className="flex-1 flex justify-center items-center">
              <Link href="/" className="flex items-center space-x-3">
                <span className="font-heading font-black text-mobile-xl md:text-2xl text-cyan-400 tracking-wider uppercase">
                  TRAKIA TRIPS
                </span>
              </Link>
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-xl transition-all duration-300 hover:scale-105"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {isOpen && (
            <div className="bg-slate-800/95 backdrop-blur-sm rounded-2xl mt-4 p-6 mb-4 border border-slate-700/50">
              <div className="flex flex-col space-y-4">
                <Link
                  href="/"
                  className="text-white hover:text-cyan-400 transition-all duration-300 font-body font-semibold text-mobile-base md:text-lg uppercase tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  HOME
                </Link>
                <Link
                  href="/about"
                  className="text-white hover:text-cyan-400 transition-all duration-300 font-body font-semibold text-mobile-base md:text-lg uppercase tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  ABOUT US
                </Link>
                <Link
                  href="/booking"
                  className="text-white hover:text-cyan-400 transition-all duration-300 font-body font-semibold text-mobile-base md:text-lg uppercase tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  BOOK TRIP
                </Link>
                <Link
                  href="/terms"
                  className="text-white hover:text-cyan-400 transition-all duration-300 font-body font-semibold text-mobile-base md:text-lg uppercase tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  TERMS
                </Link>
                <Link
                  href="/booking"
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-900 px-6 py-3 rounded-2xl font-heading font-bold text-center transition-all duration-300 hover:scale-105 mt-4 text-mobile-sm md:text-base uppercase tracking-wide"
                  onClick={() => setIsOpen(false)}
                >
                  BOOK NOW
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}
