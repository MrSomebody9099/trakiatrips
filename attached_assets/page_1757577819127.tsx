"use client"

import Navigation from "@/components/navigation"
import Link from "next/link"
import { ArrowRight, Mountain, Star, Music, MapPin } from "lucide-react"
import { useRef } from "react"

export default function HomePage() {
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])

  const handleVideoHover = (index: number, isHovering: boolean) => {
    const video = videoRefs.current[index]
    if (video) {
      if (isHovering) {
        video.play()
      } else {
        video.pause()
      }
    }
  }

  const handleVideoClick = (index: number) => {
    const video = videoRefs.current[index]
    if (video) {
      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />

      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ paddingTop: "6rem" }}
      >
        <div className="absolute inset-0">
          <img
            src="/hero-mountain.jpg"
            alt="Skier on pristine mountain slopes with dramatic peaks"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in-up">
          <div className="glass-hero rounded-3xl p-4 md:p-12">
            <h1 className="font-heading font-bold text-mobile-3xl md:text-6xl lg:text-7xl text-white mb-6 md:mb-8 text-balance leading-tight glass-text">
              Ski. Adventure. Celebrate.
            </h1>
            <p className="font-body text-mobile-base md:text-xl text-white mb-6 md:mb-8 text-pretty glass-text">
              Experience the ultimate mountain adventure with skiing, ATVs, and epic pool parties
            </p>

            <Link
              href="/booking"
              className="inline-flex items-center glass-button-colorful px-4 md:px-8 py-2 md:py-4 rounded-2xl font-heading font-semibold text-mobile-sm md:text-lg group transition-all duration-300 hover:scale-105"
            >
              Book Your Adventure
              <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"></div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-gradient-festival">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="font-heading font-bold text-mobile-2xl md:text-5xl text-gradient mb-4 md:mb-6">
              What's Included
            </h2>
            <p className="font-body text-mobile-base md:text-xl text-slate-600 max-w-3xl mx-auto text-pretty">
              Everything you need for the perfect mountain adventure and festival experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-colorful rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animate-delay-100">
              <Mountain className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mx-auto mb-3 md:mb-4" />
              <h3 className="font-heading font-semibold text-mobile-base md:text-lg text-gradient-warm mb-2 md:mb-3">
                4★ Hotel
              </h3>
              <p className="font-body text-mobile-sm md:text-base text-slate-600">Breakfast & Dinner included</p>
            </div>

            <div className="glass-colorful rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animate-delay-200">
              <MapPin className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mx-auto mb-3 md:mb-4" />
              <h3 className="font-heading font-semibold text-mobile-base md:text-lg text-gradient-warm mb-2 md:mb-3">
                Transport
              </h3>
              <p className="font-body text-mobile-sm md:text-base text-slate-600">Bus from Stara Zagora</p>
            </div>

            <div className="glass-colorful rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animate-delay-300">
              <Music className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mx-auto mb-3 md:mb-4" />
              <h3 className="font-heading font-semibold text-mobile-base md:text-lg text-gradient-warm mb-2 md:mb-3">
                Club Events
              </h3>
              <p className="font-body text-mobile-sm md:text-base text-slate-600">Afrobeats & House DJs</p>
            </div>

            <div className="glass-colorful rounded-2xl p-4 md:p-6 text-center hover:scale-105 transition-all duration-300 animate-fade-in-up animate-delay-300">
              <Star className="h-10 w-10 md:h-12 md:w-12 text-blue-600 mx-auto mb-3 md:mb-4" />
              <h3 className="font-heading font-semibold text-mobile-base md:text-lg text-gradient-warm mb-2 md:mb-3">
                Pool Party
              </h3>
              <p className="font-body text-mobile-sm md:text-base text-slate-600">FREE for first 60 bookings!</p>
            </div>
          </div>

          <div className="mt-8 md:mt-12 glass-colorful rounded-2xl p-6 md:p-8">
            <h3 className="font-heading font-bold text-mobile-xl md:text-2xl text-gradient mb-4 md:mb-6 text-center">
              Additional Info
            </h3>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h4 className="font-heading font-semibold text-mobile-base md:text-lg text-gradient-warm mb-2 md:mb-3">
                  Not Included:
                </h4>
                <ul className="font-body text-mobile-sm md:text-base text-slate-600 space-y-1 md:space-y-2">
                  <li>• Flights</li>
                  <li>• Ski pass</li>
                </ul>
              </div>
              <div>
                <h4 className="font-heading font-semibold text-mobile-base md:text-lg text-gradient-warm mb-2 md:mb-3">
                  Available Extras:
                </h4>
                <ul className="font-body text-mobile-sm md:text-base text-slate-600 space-y-1 md:space-y-2">
                  <li>• Discounted ski rental equipment (prices TBA)</li>
                  <li>• Ski gear, quad bikes & activities (prices TBA)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-16 animate-fade-in-up">
            <h2 className="font-heading font-bold text-mobile-2xl md:text-5xl text-gradient mb-4 md:mb-6">
              Live the Adventure
            </h2>
            <p className="font-body text-mobile-base md:text-xl text-slate-600">Real moments from our epic trips</p>
          </div>

          <div className="horizontal-gallery animate-fade-in-up animate-delay-200">
            <div className="gallery-item">
              <img
                src="/gallery/atv-group.jpg"
                alt="Group adventure with ATVs in mountain terrain"
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">ATV Adventures</h3>
                <p className="font-body text-sm">Explore rugged mountain terrain with your crew</p>
              </div>
            </div>

            <div className="gallery-item">
              <video
                ref={(el) => (videoRefs.current[0] = el)}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                onMouseEnter={() => handleVideoHover(0, true)}
                onMouseLeave={() => handleVideoHover(0, false)}
                onClick={() => handleVideoClick(0)}
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-09-09%20at%2018.02.52_47228827-PAwOx3efv7jUVdkkwNTnsKDDxsjYtS.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">Mountain Adventures</h3>
                <p className="font-body text-sm">Experience the thrill of our mountain trips</p>
              </div>
            </div>

            <div className="gallery-item">
              <video
                ref={(el) => (videoRefs.current[2] = el)}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                onMouseEnter={() => handleVideoHover(2, true)}
                onMouseLeave={() => handleVideoHover(2, false)}
                onClick={() => handleVideoClick(2)}
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-09-09%20at%2018.02.52_c081b062-fpaDrYvQW0bAHY3OZQtbHGv5XS5Ef2.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">Party Vibes</h3>
                <p className="font-body text-sm">Epic nights with your squad and unforgettable memories</p>
              </div>
            </div>

            <div className="gallery-item">
              <img
                src="/gallery/ski-slopes.jpg"
                alt="Skiing on pristine mountain slopes"
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">Epic Skiing</h3>
                <p className="font-body text-sm">Perfect powder and breathtaking mountain views</p>
              </div>
            </div>

            <div className="gallery-item">
              <img
                src="/gallery/pool-party-1.jpg"
                alt="Night pool party with colorful lighting"
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">Pool Parties</h3>
                <p className="font-body text-sm">Vibrant nights with music and amazing vibes</p>
              </div>
            </div>

            <div className="gallery-item">
              <img
                src="/gallery/mountain-atv.jpg"
                alt="Solo ATV rider in scenic mountain landscape"
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">Mountain Views</h3>
                <p className="font-body text-sm">Stunning landscapes and thrilling rides</p>
              </div>
            </div>

            <div className="gallery-item">
              <video
                ref={(el) => (videoRefs.current[1] = el)}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                onMouseEnter={() => handleVideoHover(1, true)}
                onMouseLeave={() => handleVideoHover(1, false)}
                onClick={() => handleVideoClick(1)}
              >
                <source
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Video%202025-09-09%20at%2018.02.52_c2c56724-czBTdNBGsy5MUr7pmTGuOBThgbE70T.mp4"
                  type="video/mp4"
                />
              </video>
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">Epic Memories</h3>
                <p className="font-body text-sm">Unforgettable moments with your squad</p>
              </div>
            </div>

            <div className="gallery-item">
              <img
                src="/gallery/ski-group.jpg"
                alt="Friends skiing together on mountain slopes"
                className="w-full h-full object-cover"
              />
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">Squad Goals</h3>
                <p className="font-body text-sm">Make memories with your best friends</p>
              </div>
            </div>

            <div className="gallery-item">
              <video
                ref={(el) => (videoRefs.current[3] = el)}
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
                onMouseEnter={() => handleVideoHover(3, true)}
                onMouseLeave={() => handleVideoHover(3, false)}
                onClick={() => handleVideoClick(3)}
              >
                <source src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Untitled%20design-yHDN76T2O9yTaChTBDJBNXKSoxSt7V.mp4" type="video/mp4" />
              </video>
              <div className="gallery-overlay">
                <h3 className="font-heading font-semibold text-lg mb-2 text-party-cyan">Snowmobile Thrills</h3>
                <p className="font-body text-sm">Experience the rush of snowmobile adventures</p>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="font-body text-sm text-slate-500">← Scroll to explore more →</p>
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 md:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center space-x-4">
            <img src="/trakia-logo-large.png" alt="Trakia Trips Logo" className="h-12 w-12 md:h-16 md:w-16" />
            <p className="font-body text-mobile-sm md:text-base text-slate-400">
              © 2025 Trakia Trips. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
