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
                  These Terms govern all Bookings and Tickets. Where You have purchased Travel Arrangements and/or Extras, the terms and conditions of the Supplier of those Travel Arrangements and/or Extras (as may be provided to You by Us or the Supplier from time to time) apply in addition to these Terms. These Terms are legally binding on You and any person who purchases, possesses, uses or attempts to use any Booking and You and any such person shall be deemed to have accepted and agreed to comply with these Terms. All capitalised words used in these Terms shall have the meaning as set out in clause 16. We reserve the right to vary these Terms from time to time without notice and at Our sole discretion. Updates will be published on Our Website and the date at the top of these Terms will be updated to reflect the date of the latest amendments. Any directives or statements featured on the Tickets (including electronic Tickets) or posted or announced at or in relation to the Festival, shall also form part of these Terms.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">2. TICKET PURCHASE AND DELIVERY</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tickets are sold on Our Website on the platform operated by Stripe. Stripe has no control over the Tickets, Travel Arrangements or Extras We sell on Our Website. Where You make a purchase on Our Website, a contract is entered into between You and Us (subject to Our agency status as set out below for Travel Arrangements and Extras) and there is no contractual relationship between You and Stripe. Your payment to Us may be processed on Our behalf by the Stripe (or its appointed third party payment processing provider). Stripe receives the monies You pay to it as Our payment agent only. Stripe is not a ticketing agent and has no responsibility to You. Any payment You make to Stripe shall be in satisfaction of payments You are liable to make to Us in accordance with these Terms. If You have any questions, concerns, complaints, or requests, You should direct them to Us and not Stripe.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Nothing in these Terms shall affect Your applicable statutory rights as a consumer.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tickets may only be purchased from Us or through any other sale or transfer mechanism authorised by Us in writing. Tickets purchased or obtained from any other source shall be void and may be seized or cancelled without refund or compensation.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bookings are not exchangeable, refundable or transferable. Re-sale or attempted re-sale is not allowed, unless expressly authorised by Us (at Our sole discretion) via an authorised Ticket reseller and may only be sold and purchased in accordance with the Ticket resellers terms and conditions. If You are buying or selling Tickets, Travel Arrangements and/or Extras from an official Ticket reseller, please read their terms and conditions carefully, additional fees may apply. Only Bookings that have been fully paid for shall be available for re-sale. Not all Bookings shall be available for re-sale and We reserve the right to disable the re-sale function at any time. Do not attempt to buy or sell Tickets from touts or unauthorised re-sellers. We reserve the right to cancel any Ticket that We reasonably believe to have been bought or sold in this way. We will not be able to respond to any questions or queries You might have unless You are a valid Ticket Holder.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Any attempt to exchange or transfer Your Booking in breach of these Terms shall result in the Booking being void and it may be seized or cancelled without refund or compensation.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bookings can be paid for in the following ways (in case of options I and ii, subject to availability (which shall be entirely at Our discretion) and eligibility:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>in full at the time of purchase using the acceptable payment methods as shown on Our Website (please note that these may vary from time to time);</li>
                  <li>by paying a deposit to secure Your Booking and thereafter paying the balance by the due date specified by Us at the time of purchase (the deposit terms and conditions set out at clause 2.7 shall apply if You choose this payment method);</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The Terms set out in this clause 2.7 shall apply when You choose to pay for Your Booking using a Deposit. You acknowledge and agree that:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>You shall pay to Us the balance of Your Booking on the due date provided to You by Us at the time of Your Booking;</li>
                  <li>it is Your responsibility to make the balance paying through Your Account by the due date;</li>
                  <li>if You fail to make the balance payment by the due date agreed between You and Us and do not contact Us to remedy such failure to Our satisfaction, Your Booking shall be cancelled and Your Tickets, Travel Arrangements and/or any Extras shall be null and void and Your Deposit shall not be refunded; and</li>
                  <li>You may cancel Your Booking at any time by contacting Us without making any further payments to Us. If You choose to cancel Your Booking, You are entitled to a refund of Your second payment in the case that You cancel Your Booking at least 45 days prior to the date of the Festival. If You cancel Your Booking within 45 days of the trip You will not receive any refunds or compensation) and Your Booking shall be null and void.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We will store Your details in accordance with the terms of Our Privacy Policy, which can be found on Our Website.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The debit or credit card used to purchase Tickets must be registered in the name and address of the Ticket Purchaser. To prevent fraud We may carry out checks and/or You may be asked to provide additional information (such as proof of address or proof that the nominated card is registered to You) after Your booking. If We suspect fraud, We may cancel Your Booking at any time.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Your Booking is not complete until You have paid for Your Booking in full. Until such time, Your Tickets, Travel Arrangements and/or Extras shall not be issued and to the extent they have already been issued, they shall not be valid.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Where the Ticket Purchaser is purchasing Tickets, Travel Arrangements and/or Extras on behalf of other people as part of a group Booking, it is the Ticket Purchasers responsibility to circulate these Terms to the entire Booking party and Ticket Holders, all of whom are bound by these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tickets, Wristbands and/or other forms of rights to attend the Festival and/or any Venue are personal, revocable licences granted by Us to each Ticket Holder and shall remain Our property at all times. For safety and security purposes, We reserve the right, at Our sole discretion, to recall any accreditation or other rights to attend the Festival and/or any Venue at any time.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ticket price and availability may be subject to change without notice prior to purchase.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We reserve the right to limit the number of Tickets that any person may purchase for the Festival. Tickets may be limited to a maximum number per person, per payment card and/or per household. We reserve the right to cancel Tickets purchased in excess of this number.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tickets are not issued on a sale or return basis and refunds will not be made on returned Tickets unless provided for under these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Ticket Purchasers and all Ticket Holders must be aged 18 or over at the time of the Event start date.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It is Your responsibility to check Your Booking information carefully and inform Us immediately of any inaccuracies or any changes You wish to make. Mistakes cannot always be rectified, and changes or rectification may incur a charge. Typically, an administration charge of €5 is applied when a change or rectification is made, however, this is subject to change and increase at Our discretion. We cannot accept any liability for errors made by You. In some instances, You will be able to make changes directly in Your Account. Should You make any changes that relate to any Travel Arrangements or Extras within the 60 days leading up to the Festival, You must also notify Us directly so that We can make a change request to the relevant Supplier. We cannot accept any liability for errors in orders placed with Suppliers on Your behalf where this error arises as a result of inaccuracies in information provided by You. Should any change result in any overpayment being made by You, these are strictly non-refundable.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Unless otherwise prohibited by law, Our liability to You is limited to the Face Value of Your Ticket(s) plus the value of any Extras that are booked through Us for which We are not an agent.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">3. USE OF YOUR BOOKING AND TICKETS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Bookings (including Tickets) are strictly non-transferable and must not be sold or offered, exposed or made available for sale, or transferred or otherwise disposed of, save as in accordance with these Terms. We reserve the right to cancel without refund or compensation any Bookings issued to a Ticket Holder whom We believe plans to offer such Booking for resale otherwise than in accordance with these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  If a Ticket Purchaser makes a Booking for more than one person, the Ticket Purchaser must retain one Ticket for his/her personal use. Any remaining Tickets may only be used by a natural person who is known to the Ticket Purchaser personally (and who did not become known to the Ticket Purchaser through the sale, transfer or disposal of the Ticket) and who is intended to accompany the Ticket Purchaser to the Festival and subject to the following conditions: i) the sale, transfer or disposal of any such Booking must not be for a value greater than the original sale price of the Booking; ii) the Booking must not be offered publicly (including on any website) whether for sale, as a gift or donation or any other means of transfer; and iii) the sale, transfer or disposal must be made strictly subject to these Terms (and the transferee's acceptance thereof) which shall be binding upon the transferee in full as if the transferee was the Ticket Purchaser, save only that such transferee shall have no right to a refund under these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Notwithstanding clause 3.2 above, the Booking must not be: i) transferred, used or otherwise disposed of in the course of any business or for the purpose of facilitating a third party's business; ii) transferred, used or otherwise disposed of in relation to any promotional or commercial purpose (including any competition, advertising, promotion, auction or as a prize in any competition or sweepstake, whether for a business or a charity or otherwise; iii) transferred or otherwise disposed of to any person who agrees to buy any good(s) or service(s) in return for the Booking; and/or d) combined with any other good(s) or service(s) (including as part of any hospitality, accommodation or travel package or service), in each case without Our prior written approval.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Any Booking offered for sale, sold, transferred, used or disposed of in breach of clause 3 of these Conditions may be cancelled and any person seeking to use the Booking may be refused admission to or be evicted from the Festival and/or Venue(s) without refund or compensation.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tickets will be exchanged for Wristbands at the Festival at the Wristband exchange. If You are using an electronic Ticket, it is Your responsibility to ensure You have a sufficiently powered mobile device enabling You to show Your Ticket. Wristbands are only issued directly to the Ticket Holder on production of photographic ID (driver's licence or passport). In the event that We suspect (acting reasonably) that the ID presented is not valid or authentic, We reserve the right to request a secondary form of ID. If We are not satisfied that the ID presented is valid or valid or authentic (acting reasonably), We reserve the right to refuse to issue a Wristband without refund or compensation. It is not possible to collect Wristbands on behalf of other people and all Wristbands must be placed and secured on the Ticket Holder's wrist directly by Us. Your Wristband will be invalidated if any part of it is removed, detached, altered or defaced. Wristbands will not be reissued or replaced regardless of whether You still have Your Ticket.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You must retain Your Wristband at all times whilst at the Festival and/or any Venue and Wristbands must be produced for inspection upon Our request and/or the request of any Authorised Person. Failure to do so may result in the You being ejected from the Festival or any Venue without refund or compensation.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are not liable for lost, stolen or defaced Tickets or Wristbands. If You lose or damage Your Ticket or Wristband, You will not be able to re-enter the Festival or Venue(s). All Wristbands will be checked when entering and leaving the Festival and Venue(s).
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Tickets for Travel Arrangements and/or Extras are separate to Festival Tickets. You will be notified by Us as to how You redeem Your tickets for Travel Arrangements and/or Extras in advance. Your Wristband cannot be used as proof of purchase of or to gain access or entry to any Travel Arrangements or Extras.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Festival Tickets and Tickets for Travel Arrangements and/or Extras are not valid for persons under the age of 18. Persons under the age of 18 will not be permitted entry to the Festival or any Venues and we will not be able to exchange their Ticket for a Wristband. Persons under the age of 18 will not be able to use any Tickets for Travel Arrangements and/or Extras. No refunds or compensation will be given in these circumstances.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">4. ACCESS, ENTRY AND CONDUCT</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Admission to the Festival and Venue(s) will only be authorised upon presentation of a valid Wristband and, We and/or any Authorised Representative may require, photographic proof of identity and proof of age (driver's licence or passport). You are not guaranteed an uninterrupted and/or uninhibited view of any performance, nor is any representation or warranty given as to the quality, content or duration of the Festival or any performances. Access to Venue(s) is subject to capacity and We accept no liability and will not offer any refunds if You are unable to attend a specific performance due to the Venue being at maximum capacity.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may be requested to submit to a body check and/or a search of Your possessions for the purposes of locating and removing any Prohibited Item. Should You refuse, You may be refused admission to or ejected from the Festival or Venue(s) without refund or compensation.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may be refused admission to or ejected from the Festival and/or any Venue with Your Wristband removed, or denied access or entry to any Travel Arrangements or Extras, without refund or compensation, if You (in Our opinion or in the opinion of any Authorised Person):
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>behave (or are likely to behave) in a way that is anti-social, offensive, violent, dangerous disruptive, racist, sexist, homophobic, sexually provocative or a nuisance to other Festival guests, neighbouring residents of the Festival, Our staff, Suppliers or Venue staff;</li>
                  <li>behave (or are likely to behave) in a manner contrary to public order and/or safety;</li>
                  <li>are excessively under the influence of alcohol;</li>
                  <li>are under the influence of drugs, narcotics, psychoactive substances, nitrous oxide, 'legal' highs or any similar or associated paraphernalia;</li>
                  <li>bring, attempt to bring, possess or use within the Festival, Resort or any Venue any Prohibited Item (and any Prohibited Items may be confiscated and/or destroyed without compensation at the discretion of Us and any Authorised Person);</li>
                  <li>attempt to gain access to any restricted areas, climb on any infrastructure, mosh, crowd surf or throw items;</li>
                  <li>damage, tamper with or interfere with any of Our property or that of any Venue or Supplier;</li>
                  <li>smoke or vape in a non-permitted area;</li>
                  <li>commit (or are suspected of committing or are likely to commit) a criminal offence; or</li>
                  <li>behave in a way that is contrary to Our (or an Authorised Persons) reasonable instruction.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Suppliers of Travel Arrangements and Extras reserve their rights to refuse service to You as a result of Your non-compliance with these Terms and any terms and conditions provided by them. We accept no responsibility for any action taken by Suppliers.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Unless otherwise agreed by Us in writing, You must not engage in any trading, marketing or commercial activity at the Festival or any Venue or bring into the Festival or Venues or display or distribute at any sponsorship, promotional or marketing materials.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You are responsible for Your own personal property at all times. We cannot accept any liability for any loss, theft or damage to Your personal property.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You acknowledge that Police are present at the Resort who enforce strict laws including but not limited to with regards drug possession and use and drunken or other disorderly behaviour in public. It is Your responsibility to be aware of and abide by local laws. We accept no responsibility for any action taken by the police and no refunds or compensation will be paid should Your Booking be affected by police action taken.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In the interest of Your safety, We may provide welfare assistance and services to You during the Festival. For example, We may provide translation or logistical services should You be detained by the police, or We may provide You with a welfare room if Your accommodation is not appropriate or accessible or we consider your safety is at risk. In certain instances, We will charge You for these services, particularly where the requirement for these services arises as a result of Your breach of these Terms. We reserve the right to refuse welfare assistance and services to You in the event that You breach these Terms.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Whilst We provide welfare assistance at the Festival and Resort, We shall not provide any such assistance in the event that You breach these Terms or those of any Supplier.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Suppliers of medical assistance may charge You for their services in the event that You require medical assistance. In some instances, We shall recover such charges from You on their behalf.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Where necessary, Our staff (including members of Our security team) will report Your behaviour to the police. Should You commit (or be suspected of committing) a crime, Our security team may detain You until the police arrive and may confiscate from You any such evidence that the police may require.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  In some instances, We may require You to provide emergency contact information. By providing us with such information, You agree that We may contact such persons in the event of an emergency. We will handle such information in accordance with the terms of Our Privacy Policy which can be found on Our Website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">5. PHOTOGRAPHY, FILMING AND RECORDINGS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You may take photographs and recordings at the Festival for personal, private, non-commercial and non-promotional purposes only providing that You do not use any professional audio or imaging equipment or drones to capture such footage. You must not, under any circumstances, disseminate or transmit (on social media, the internet, radio, TV or any other form of media) any footage of the Festival for commercial gain. Unauthorised photography and recordings or transmission of the Festival or any performers is strictly forbidden. Any recording or transmitting equipment (including professional cameras), unauthorised photos, recordings, tapes, films or similar items may be confiscated and/or destroyed by Us without compensation.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  You consent to being photographed, filmed and sound recorded as an audience at the Festival without payment, and to Your image being exploited in any and all media for any purpose at any time throughout the world by Us who shall own the copyright in all such recordings. All personal data will be processed in accordance with Our Privacy Policy which can be found on Our Website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">6. TRAVEL AND TRAVEL ARRANGEMENTS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Where You book Travel Arrangements through Us on Our Website, We act in the sole capacity of a booking agent for the Supplier/Principals. We will arrange for You to enter into a contract with the applicable Supplier/Principal of the Travel Arrangements. Your purchase of Travel Arrangements is subject to these Terms and the specific terms and conditions of the relevant Supplier/Principal You contract with (such terms may be issued to you in French language without translation). The Supplier/Principal's terms and conditions may limit and/or exclude the Supplier/Principal's liability to You. As an agent, We accept no liability in relation to the Travel Arrangements You purchase or for the acts or omissions of the Supplier/Principal or other person(s) or party(ies) connected with any Travel Arrangements. Your contract is with the Supplier/Principal and its terms and conditions apply. As agent, We accept no responsibility for the actual provision of the Travel Arrangements. Our responsibilities are limited to making the booking in accordance with Your instructions. We accept no responsibility for any information about the Travel Arrangements that We pass on to You in good faith. However, in the event that We are found liable to You on any basis whatsoever, Our maximum liability to You is limited to the cost of the commission We earn on Your Travel Arrangements. Except where otherwise advised or stated in the terms and conditions of the Supplier/Principal concerned, all monies You pay to Us for Your Travel Arrangements will be held by Us on behalf of the Supplier/Principal and forwarded on to the Supplier/Principal in accordance with Our agreement with them.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The price of the Travel Arrangements includes all government taxes as applicable at the time of booking that do not have to be paid locally. Any taxes that have to be paid locally by You are extra and are Your responsibility (including, but not limited to, 'Resort tax', which is a tourist tax collected by people such as accommodation providers in Bulgaria).
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We will do Our utmost to cater for any special requirements You may have. If You (or any member of Your group has) any medical problem or disability which may affect Your Festival, please provide Us with full details before We confirm Your Booking so that We can try to advise You as to the suitability of Your chosen Booking. Acting reasonably, if We or the Supplier/Principal is unable to properly accommodate the needs of the person(s) concerned, We will not confirm Your booking or, if You did not give Us full details at the time of booking, We may cancel it and impose applicable cancellation charges, when We become aware of these details.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We will inform You as soon as reasonably possible if the Supplier/Principal needs to make a significant change to Your confirmed Travel Arrangements or to cancel them. We will also liaise between You and the Supplier/Principal in relation to any alternative arrangements offered by the Supplier/Principal but We will have no further liability to You.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  All ratings for the Travel Arrangements are as provided by the relevant Supplier/Principal. These are intended to give a guide to the services and facilities You should expect from Your Travel Arrangements. Standards and ratings may vary between countries, as well as between Supplier/Principals. We cannot guarantee the accuracy of any ratings given.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not accept any liability, including for compensation, for any costs or expense You might incur as a result of events beyond Our or the Supplier/Principals control which affect Your Travel Arrangements. This includes, but is not limited to, whether actual or threatened, war, riot, civil strife, strikes, terrorist activity, industrial dispute, natural or nuclear disaster, adverse weather conditions, flood, epidemics and pandemics, fire, airport, port or airspace closures, restrictions or congestion, flight or entry restrictions imposed by any regulatory authority or other third party, an FCO advisory against travel to a particular destination and any other government restrictions on travel from any destination.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We cannot guarantee the accuracy of any information We provide relating to visas, passports and health requirements. Requirements may change and it is Your responsibility to check the up to date position with regards visas, passports and health requirements before You travel. For up-to-date travel advice from the UK government, visit www.gov.uk/foreign-travel-advice.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not accept any liability in the event that You are unable to cross any international border including by coach, air and car. No refunds or compensation will be given in such instances.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  It is Your responsibility to ensure You have adequate travel insurance. You must be satisfied that Your insurance fully covers all Your personal requirements including pre-existing medical conditions, cancellation charges, medical expenses and repatriation in the event of accident or illness as well any adventure activities insurance appropriate to the activities You will be undertaking. We will not be liable for any such losses howsoever arising.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Any purchases You make for travel arrangements that are not purchased through Us on Our Website, including, but not limited to, any flights, accommodation, travel or transfers or coach travel to the Festival (e.g. a coach to the Festival booked through National Express) are not governed by these Terms. Under no circumstances do We accept responsibility or liability for any such bookings made directly with third parties.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The price of Travel Arrangements and availability may be subject to change without prior notice prior to purchase.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">7. EXTRAS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Where You book the following Extras through Us on Our Website, We act in the sole capacity of a booking agent for the Supplier/Principals, including in relation to: (i) equipment hire; (ii) lessons; (iii) excursions; and/or (iv) dining experiences. In such circumstances:
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We will arrange for You to enter into a contract with the applicable Supplier/Principal of these Extras. Your purchase of these Extras is subject to these Terms and the specific terms and conditions of the relevant Supplier/Principal You contract with (such terms may be issued to you in Bulgarian language without translation). The Supplier/Principal's terms and conditions may limit and/or exclude the Supplier/Principal's liability to You. As an agent, We accept no liability in relation to these Extras You purchase or for the acts or omissions of the Supplier/Principal or other person(s) or party(ies) connected with any such Extras. Your contract is with the Supplier/Principal and its terms and conditions apply. As agent, We accept no responsibility for the actual provision of these Extras. Our responsibilities are limited to making the booking in accordance with Your instructions. We accept no responsibility for any information about these Extras that We pass on to You in good faith. However, in the event that We are found liable to You on any basis whatsoever, Our maximum liability to You is limited to the cost of the commission We earn on Your Extras. Except where otherwise advised or stated in the terms and conditions of the Supplier/Principal concerned, all monies You pay to Us for such Extras will be held by Us on behalf of the Supplier/Principal and forwarded on to the Supplier/Principal in accordance with Our agreement with them;
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We will do Our utmost to cater for any special requirements You may have. If You (or any member of Your group has) any medical problem or disability which may affect Your Extras, please provide Us with full details before We confirm Your Booking so that We can try to advise You as to the suitability of Your chosen Booking. Acting reasonably, if We or the Supplier/Principal is unable to properly accommodate the needs of the person(s) concerned, We will not confirm Your booking or, if You did not give Us full details at the time of booking, We may cancel it and impose applicable cancellation charges, when We become aware of these details; and
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We will inform You as soon as reasonably possible if the Supplier/Principal needs to make a significant change to Your confirmed Travel Arrangements or to cancel them. We will also liaise between You and the Supplier/Principal in relation to any alternative arrangements offered by the Supplier/Principal but We will have no further liability to You.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Where You book tickets to Additional Parties directly from Us on Our Website, the contract is between You and Us.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Additional Parties are subject to the terms and conditions provided to You at the time of booking. Tickets to Additional Parties are non-refundable and non-transferrable. If You miss the last entry time, You will be denied entry to the event. Tickets for Additional Parties will be electronic tickets and it is Your responsibility to ensure that You have sufficient power on Your mobile device to present the electronic ticket to gain entry to the event. The Terms set out in clauses 4.1 to 4.3 apply to Additional Parties.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  The price of Extras and availability may be subject to change without prior notice prior to purchase.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">8. ACCOMMODATION</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Supplier/Principals terms and conditions relating to any accommodation booked by You as part of a Travel Arrangement shall apply. We do not have any control over or liability for any such terms set by the Supplier/Principal. These may include (but are not limited to) the following (exact terms will be set by the Supplier/Principal in relation to this Travel Arrangement):
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>Check-in requires the lead booker present;</li>
                  <li>A damage deposit may be charged by the Supplier (the amount, method and conditions of the damage deposit such as how the Supplier shall return Your damage deposit are determined by the Supplier and it is Your responsibility to obtain these terms from the Supplier and familiarise yourself with them (We would point out that some Suppliers include within their terms a liability for communal damage where specific offenders cannot be identified));</li>
                  <li>Check in times and procedures; and/or</li>
                  <li>The way in which (and if) You can check in after hours</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  all of which, for the avoidance of doubt, We are not responsible for, have no control over and accept no liability for.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  For safety and security reasons, We employ security to patrol some accommodation. Security shall report to Us any anti-social behaviour that takes place in or around the accommodation. Examples of antisocial behaviour include but are not limited to:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>Excessive noise after 22:00;</li>
                  <li>Non-residents found inside accommodation buildings;</li>
                  <li>Waste left in communal areas;</li>
                  <li>Damage caused in communal areas and in areas surrounding the accommodation; and/or</li>
                  <li>Excessive noise (which causes a concern of nuisance or welfare).</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  In the event Our security team reports to Us that You have engaged in the behaviours set out in clause 8.2, We reserve the right to take the following actions against You (in no particular order, for example, where a behaviour is sufficiently serious to warrant such action, in Our sole opinion, We may skip any step):
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>Deliver to You a first warning by text message, notification, email or in person;</li>
                  <li>Deliver to You a second warning by text message, notification, email or in person where there is evidence that You have continued to engage in the behaviours set out in clause 8.2, despite having already received a warning;</li>
                  <li>Deliver to You a final warning in person (either directly or via an Authorised Person, a member of the Supplier/Principals team and/or Our security team; then</li>
                  <li>Eject You from the accommodation with no refund or compensation or support for alternative accommodation.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  You must direct any queries or questions You have regarding Your accommodation or any deposit to the Supplier/Principal. We may, at Our discretion and with no liability, assist You with such queries if appropriate.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">9. TRANSFERS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Supplier/Principal terms and conditions relating to any transfers booked by You as part of Travel Arrangement shall apply. We do not have any control over or liability for any such terms set by the Supplier/Principal. These may include (but are not limited to) the following (exact terms will be set by the Supplier/Principal in relation to this Travel Arrangement):
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>pick up location and times and the consequence of You not being at Your pick up location at Your pick up time;</li>
                  <li>expected wait times for Your transfer following Your arrival at the pick-up location;</li>
                  <li>conditions of You travelling (such as travel may be denied due to intoxication or anti-social behaviour);</li>
                  <li>importance of accurate booking information being provided and the consequence of any inaccuracies; and</li>
                  <li>exclusion of any liability for You not reaching Your destination at the estimated time (whether this results in missed onward travel or not).</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">10. EQUIPMENT HIRE</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Supplier/Principal terms and conditions relating to any equipment hire booked by You as an Extra shall apply. We do not have any control over or liability for any such terms set by the Supplier/Principal. These may include (but are not limited to) exclusion of any liability arising as a result of:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>You not providing details of Your accommodation at the time of booking;</li>
                  <li>You not providing any preferences or specification of the equipment You wish to hire;</li>
                  <li>You providing inaccurate information resulting in any delays or unavailability of equipment;</li>
                  <li>Your arrival being outside of the usual dates for the Festival; or</li>
                  <li>any time lost due to collection not being available in certain hours.</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  We accept no responsibility or liability for any loss, theft or damage to any equipment hired by You.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">11. LESSONS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Supplier/Principal terms and conditions relating to any lessons booked by You as an Extra shall apply. We do not have any control over or liability for any such terms set by the Supplier/Principal. These may include (but are not limited to) exclusion of any liability arising from:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>You not collecting Your hired equipment in time for the start of Your lesson or not having the appropriate clothing or equipment for Your lesson;</li>
                  <li>Your non attendance of the activity; or</li>
                  <li>You booking the wrong level of lesson appropriate to Your abilities; or</li>
                  <li>You missing Your lesson as a result of You arriving at the wrong time or location.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">12. ACCESSIBILITY</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are committed to providing equal access to the Festival where possible. Due to the nature of the Resort being a ski resort, this is not always possible. Any access requirements must be provided to Us in writing at trakia.trips@gmail.com prior to Your Booking, upon receipt of which We can inform You how We can accommodate Your requirements. Not all parts of the Resort are under Our control during the Festival (for example bars, restaurants, accommodation, ski lifts and slopes) and We can only advise on the areas of the Resort We have under Our control during the Festival.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We provide a complimentary Ticket to a personal assistant accompanying a paid for accessibility Ticket. In order for Us to provide a complimentary Ticket, We require the evidence of Your accessibility requirements (such as a copy of the front page of Your DLA, proof of PIP or AccessCard, or the equivalent of such in your country of residence). The complimentary Ticket does not include a lift pass.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If You are purchasing Travel Arrangements through Us, You must inform of Us of any accessibility requirements so that We can discuss Your requirements with Suppliers/Principals. Access to accommodation widely varies between Suppliers.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">13. RISK AND LIABILITY</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We do not accept any responsibility or liability for any loss, damage or injury arising as a result of activities You participate in at the Resort (save for where this is caused by Our negligence). It is Your responsibility to assess whether You are fit and able to participate in any skiing, snowboarding or similar or associated activities at the Resort. You should consult a medical professional and (where Your activity is booked as an Extra through Us, the Supplier) if You are unsure. You assume all risks associated with such activities. Should You book an Extra through Us and later decide You are not able to participate in the activity booked, no refunds or compensation will be given by Us.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You acknowledge that You may be asked to sign a waiver by a Supplier for any Extras that You have booked through Us. You should read this waiver carefully and ensure You understand it before signing.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You acknowledge and accept that it is solely Your responsibility to communicate any allergies or dietary requirements You may have to Your Supplier with regards any dining experiences You book as an Extra through Us. We accept no responsibility or liability for any loss, damage or injury arising as a result of You not communicating, or the Supplier not meeting or not being able to meet, any dietary requirements You may have. No refunds or compensation will be given by Us in such circumstances.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We make no representations or warranties that any guidance provided by Us to You on Our Website relating to appropriate clothing and equipment is accurate and You acknowledge and accept that it is solely Your responsibility to ensure that You have the appropriate clothing and equipment to participate in any activity at the Resort (whether booked through Us or otherwise). We do not accept any responsibility or liability for any damage, loss or injury arising as a result of You not having or wearing the appropriate clothing or equipment during any activity You participate in at the Resort and no refunds or compensation will be given by Us in such circumstances.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You acknowledge and agree that it is solely Your responsibility to ensure that any equipment You use at the Resort does not cause harm to other people and/or third party property. You may be liable to a third party for damages if Your equipment causes harm or damage. We accept no responsibility or liability for any loss, damage or injury caused by You.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Subject to clause 14, We accept no responsibility or liability for any part of the Resort being closed or hindered (for example, where lifts are closed due to adverse weather conditions).
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Strobe lighting, lasers, pyrotechnics, smoke / haze effects and other special effects may be used in some performances at the Festival.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You acknowledge that exposure to loud music over periods of time can cause damage hearing. It is the Your responsibility to protect Yourself from such exposure if so required.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We accept no responsibility or liability to You for any loss, theft or damage to any equipment or property howsoever caused in any circumstances unless due to Our negligence.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We accept no responsibility or liability to You for any purchases or bookings You make directly with third parties.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  These Terms do not seek to exclude liability for death or personal injury: (i) which cannot legally be excluded or limited; and (ii) is caused by Our gross negligence, or that of anyone for whom We are legally liable.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">14. REFUNDS</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We may alter or vary a published Festival programme which may result in changes to some elements of the line-up, playing times, start and finish times, facilities, Venue(s) or locations of facilities and/or Venue(s) at the Festival. We will not be liable to You for any refunds or other costs, expenses or other losses resulting from such alteration, unless it is a Material Alteration which gives a right to a refund under clause 14.2 in which case Our only liability to You will be a refund of the Face Value of the Ticket and the cost of any Additional Parties bookings. In no circumstances will We be liable to You for any part of Your Booking for which We act as agent (including Travel Arrangements and those Extras for which We act in the capacity of agent).
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  You will only be entitled to a refund of any Tickets You have purchased directly from Us through Our Website in the following circumstances: i) if the entire Festival is cancelled; ii) if the entire Festival is postponed and/or rescheduled to another date (unless You elect to transfer Your Ticket to the rescheduled date, in which case You will not be entitled to a refund); iii) in the event of a Material Alteration which gives You the right to a refund under applicable law; or iv) as otherwise required under applicable law.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Any refunds will be for the Face Value of the Tickets (or Additional Party tickets) purchased (or for a proportionate amount where We agree to refund You in part if the Festival is cancelled less than half-way through) only and You will not be entitled to a refund of any Booking Fees or administration fees.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Save as set out in clause 14.2, a Ticket will not be exchanged or refunded after it has been exchanged for a Wristband.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If We agree to refund the Face Value of a Ticket (or portion thereof), We will provide details of the refund process and deadlines for making a claim either through Our Website, social media, the media or directly. You are responsible for following any such process and complying with any deadlines We set out. Any refund request made after such deadline(s) will not be considered. You must submit any complaint to Us within 28 days of receipt. We request that you read these Terms fully prior to submitting any complaint.
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