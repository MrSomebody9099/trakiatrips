import Navigation from "@/components/navigation"
import Link from "next/link"
import { ArrowRight, Heart, Award, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass rounded-3xl p-12">
            <h1 className="font-display font-bold text-4xl md:text-6xl text-slate-800 mb-6 text-balance">
              About Trakia Trips
            </h1>
            <p className="text-xl text-slate-600 text-pretty">
              Bringing you unforgettable ski adventures with friends, amazing après-ski nights, and thrilling mountain
              activities since our founding.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <div className="glass rounded-2xl p-12">
              <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-800 mb-8 text-center">Our Story</h2>
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-lg text-slate-600 leading-relaxed">
                  Trakia Trips was born from a passion for the mountains and a love for bringing people together. We
                  believe that the best adventures happen when you're surrounded by great company, breathtaking scenery,
                  and the thrill of the slopes.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Our team of experienced guides and adventure enthusiasts work tirelessly to create experiences that go
                  beyond just skiing. We curate every detail, from the perfect mountain lodges to the most exciting
                  après-ski activities.
                </p>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Whether you're a seasoned skier or just starting your mountain journey, we're here to make your
                  adventure unforgettable. Every trip is designed to create lasting memories and forge new friendships
                  in the stunning backdrop of snow-capped peaks.
                </p>
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="glass rounded-2xl p-8 text-center">
              <Heart className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-xl text-slate-800 mb-3">Passion</h3>
              <p className="text-slate-600">
                We're passionate about creating magical moments on the mountain that you'll treasure forever.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 text-center">
              <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-xl text-slate-800 mb-3">Excellence</h3>
              <p className="text-slate-600">
                Every detail is carefully planned to ensure you have the best possible experience with us.
              </p>
            </div>

            <div className="glass rounded-2xl p-8 text-center">
              <Globe className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-display font-semibold text-xl text-slate-800 mb-3">Adventure</h3>
              <p className="text-slate-600">
                We explore the world's most beautiful ski destinations to bring you incredible adventures.
              </p>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="glass rounded-3xl p-12">
              <h2 className="font-display font-bold text-3xl md:text-4xl text-slate-800 mb-6">
                Ready to Join Our Adventure?
              </h2>
              <p className="text-xl text-slate-600 mb-8 text-pretty">
                Let us create an unforgettable ski experience tailored just for you and your friends.
              </p>
              <Link
                href="/booking"
                className="inline-flex items-center glass-button-colorful px-8 py-4 rounded-2xl text-white font-semibold text-lg group"
              >
                Book Your Ski Trip Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass border-t border-white/20 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-slate-600">© 2025 Trakia Trips. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
