import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#DDF9F1'}}>
      <Navigation />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-16">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block bg-blue-500/10 border border-blue-500/20 rounded-full px-6 py-2 text-blue-600 font-medium mb-8">
              Legal Document
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-foreground mb-6 leading-tight">
              TERMS &
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                CONDITIONS
              </span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before booking your adventure
            </p>
          </div>

          {/* Legal Content */}
          <div className="relative bg-white backdrop-blur-xl border border-blue-200/50 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="prose prose-slate max-w-none">
              
              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">1. INTRODUCTION</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms govern all Bookings and Tickets. Where You have purchased Travel Arrangements and/or Extras, the terms and conditions of the Supplier of those Travel Arrangements and/or Extras (as may be provided to You by Us or the Supplier from time to time) apply in addition to these Terms. These Terms are legally binding on You and any person who purchases, possesses, uses or attempts to use any Booking and You and any such person shall be deemed to have accepted and agreed to comply with these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to vary these Terms from time to time without notice and at Our sole discretion. Updates will be published on Our Website and the date at the top of these Terms will be updated to reflect the date of the latest amendments.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">2. TICKET PURCHASE AND DELIVERY</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tickets are sold on Our Website on the platform operated by Stripe. Where You make a purchase on Our Website, a contract is entered into between You and Us and there is no contractual relationship between You and Stripe. Your payment to Us may be processed on Our behalf by Stripe.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>Payment Options:</strong> Bookings can be paid for in full at the time of purchase or by paying a deposit to secure Your Booking and thereafter paying the balance by the due date specified by Us.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>Refund Policy:</strong> If You choose to cancel Your Booking, You are entitled to a refund of Your second payment in the case that You cancel Your Booking at least 45 days prior to the date of the Festival. If You cancel Your Booking within 45 days of the trip You will not receive any refunds or compensation.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  <strong>Age Requirement:</strong> Ticket Purchasers and all Ticket Holders must be aged 18 or over at the time of the Event start date.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Bookings are not exchangeable, refundable or transferable. Re-sale or attempted re-sale is not allowed, unless expressly authorised by Us via an authorised Ticket reseller.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">3. USE OF YOUR BOOKING AND TICKETS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bookings (including Tickets) are strictly non-transferable and must not be sold or offered for sale, or transferred or otherwise disposed of, save as in accordance with these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tickets will be exchanged for Wristbands at the Festival at the Wristband exchange. Wristbands are only issued directly to the Ticket Holder on production of photographic ID (driver's licence or passport).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You must retain Your Wristband at all times whilst at the Festival and Wristbands must be produced for inspection upon Our request. Failure to do so may result in You being ejected from the Festival without refund or compensation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">4. ACCESS, ENTRY AND CONDUCT</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Admission to the Festival will only be authorised upon presentation of a valid Wristband and photographic proof of identity and proof of age (driver's licence or passport).
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may be refused admission to or ejected from the Festival without refund or compensation if You:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>Behave in a way that is anti-social, offensive, violent, dangerous, disruptive, racist, sexist, homophobic, sexually provocative or a nuisance to other guests</li>
                  <li>Are excessively under the influence of alcohol</li>
                  <li>Are under the influence of drugs, narcotics, psychoactive substances, or 'legal' highs</li>
                  <li>Bring any prohibited items to the Festival</li>
                  <li>Attempt to gain access to restricted areas</li>
                  <li>Damage, tamper with or interfere with Our property</li>
                  <li>Smoke or vape in non-permitted areas</li>
                  <li>Commit or are suspected of committing a criminal offence</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  You are responsible for Your own personal property at all times. We cannot accept any liability for any loss, theft or damage to Your personal property.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">5. PHOTOGRAPHY, FILMING AND RECORDINGS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may take photographs and recordings at the Festival for personal, private, non-commercial purposes only. You must not use professional audio or imaging equipment or drones to capture footage.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You consent to being photographed, filmed and sound recorded as an audience at the Festival without payment, and to Your image being exploited in any media for any purpose by Us.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">6. TRAVEL AND TRAVEL ARRANGEMENTS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Where You book Travel Arrangements through Us, We act as a booking agent for the Supplier/Principals. Your purchase of Travel Arrangements is subject to these Terms and the specific terms and conditions of the relevant Supplier/Principal.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The price of Travel Arrangements includes all government taxes applicable at the time of booking. Any taxes that have to be paid locally by You are extra and are Your responsibility (including 'Resort tax' in Bulgaria).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  It is Your responsibility to ensure You have adequate travel insurance. You must be satisfied that Your insurance fully covers all Your personal requirements including pre-existing medical conditions, cancellation charges, and medical expenses.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">7. EXTRAS</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Where You book Extras through Us (equipment hire, lessons, excursions, dining experiences), We act as a booking agent for the Supplier/Principals. Your purchase is subject to these Terms and the specific terms and conditions of the relevant Supplier/Principal.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">8. LIABILITY AND INSURANCE</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Unless otherwise prohibited by law, Our liability to You is limited to the Face Value of Your Ticket(s) plus the value of any Extras that are booked through Us for which We are not an agent.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We do not accept any liability for costs or expense You might incur as a result of events beyond Our control which affect Your arrangements, including but not limited to war, strikes, natural disasters, adverse weather conditions, epidemics, flight restrictions, or government restrictions on travel.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">9. FORCE MAJEURE</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We shall not be liable for any failure to perform Our obligations under these Terms if such failure is due to circumstances beyond Our reasonable control, including but not limited to acts of God, war, terrorism, epidemic, government action, or industrial action.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">10. DATA PROTECTION</h2>
                <p className="text-muted-foreground leading-relaxed">
                  We will store and process Your details in accordance with the terms of Our Privacy Policy, which can be found on Our Website. All personal data will be processed in accordance with applicable data protection laws.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">11. GENERAL PROVISIONS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  These Terms constitute the entire agreement between You and Us regarding Your Booking. If any provision of these Terms is found to be unenforceable, the remainder shall continue in full force and effect.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms shall be governed by and construed in accordance with the laws of England and Wales, and You submit to the exclusive jurisdiction of the English courts.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">12. CONTACT INFORMATION</h2>
                <p className="text-muted-foreground leading-relaxed">
                  For questions about these terms or your booking, please contact us at:
                  <br />
                  <strong>Email:</strong> trakia.trips@gmail.com
                  <br />
                  <strong>Instagram:</strong> @trakiatrips
                </p>
              </section>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
                <p className="text-sm text-blue-800 leading-relaxed">
                  <strong>Last Updated:</strong> September 2025
                  <br />
                  By booking with Trakia Trips, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}