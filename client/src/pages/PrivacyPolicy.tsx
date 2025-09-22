import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#DDF9F1'}}>
      <Navigation />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto py-16">
          {/* Header */}
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-block bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-2 text-purple-600 font-medium mb-8">
              Legal Document
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl text-foreground mb-6 leading-tight">
              PRIVACY
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                POLICY
              </span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
              How we protect and use your personal information
            </p>
          </div>

          {/* Legal Content */}
          <div className="relative bg-white backdrop-blur-xl border border-purple-200/50 rounded-3xl p-8 md:p-12 shadow-xl">
            <div className="prose prose-slate max-w-none">
              
              <section className="mb-8">
                <p className="text-muted-foreground leading-relaxed mb-6">
                  This privacy policy ("policy") will help you understand how Trakia Trips Limited ("us", "we", "our") uses and protects the data you provide to us when you visit and use our website ("website", "service").
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We reserve the right to change this policy at any given time, of which you will be promptly updated. If you want to make sure that you are up to date with the latest changes, we advise you to frequently visit this page.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">What User Data We Collect</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  When you visit the website, we may collect the following data:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed space-y-2">
                  <li>Your IP address</li>
                  <li>Your contact information and email address</li>
                  <li>Other information such as interests and preferences</li>
                  <li>Data profile regarding your online behaviour on our website</li>
                  <li>Operational data pertaining to your purchase</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Why We Collect Your Data</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  We are collecting your data for several reasons:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed space-y-2">
                  <li>To better understand your needs</li>
                  <li>To improve our services and products</li>
                  <li>To operate safely and effectively at the event</li>
                  <li>To send you promotional emails containing the information we think you will find interesting</li>
                  <li>To contact you to fill out surveys and participate in other types of market research</li>
                  <li>To customize our website according to your online behavior and personal preferences</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Safeguarding and Securing the Data</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Trakia Trips Limited is committed to securing your data and keeping it confidential. Trakia Trips Limited has done all in its power to prevent data theft, unauthorized access, and disclosure by implementing the latest technologies and software, which help us safeguard all the information we collect online.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Our Cookie Policy</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Once you agree to allow our website to use cookies, you also agree to use the data it collects regarding your online behavior (analyze web traffic, web pages you spend the most time on, and websites you visit).
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The data we collect by using cookies is used to customize our website to your needs. After we use the data for statistical analysis, the data is completely removed from our systems.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Please note that cookies don't allow us to gain control of your computer in any way. They are strictly used to monitor which pages you find useful and which you do not so that we can provide a better experience for you.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  If you want to disable cookies, you can do it by accessing the settings of your internet browser. You can visit www.internetcookies.com, which contains comprehensive information on how to do this on a wide variety of browsers and devices.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Links to Other Websites</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Our website contains links that lead to other websites. If you click on these links Trakia Trips is not held responsible for your data and privacy protection. Visiting those websites is not governed by this privacy policy agreement. Make sure to read the privacy policy documentation of the website you go to from our website.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Restricting the Collection of Your Personal Data</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At some point, you might wish to restrict the use and collection of your personal data. You can achieve this by doing the following:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed mb-4 space-y-2">
                  <li>When you are filling the forms on the website, make sure to check if there is a box which you can leave unchecked, if you don't want to disclose your personal information</li>
                  <li>If you have already agreed to share your information with us, feel free to contact us via email and we will be more than happy to change this for you</li>
                </ul>
                <p className="text-muted-foreground leading-relaxed">
                  Trakia Trips Limited will not lease, sell or distribute your personal information to any third parties, unless we have your permission. We might do so if the law forces us. Your personal information will be used when we need to send you promotional materials if you agree to this privacy policy.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Your Data Protection Rights</h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Under data protection law, you have the following rights:
                </p>
                <ul className="list-disc pl-6 text-muted-foreground leading-relaxed space-y-2">
                  <li><strong>The right to access:</strong> You have the right to request copies of your personal data</li>
                  <li><strong>The right to rectification:</strong> You have the right to request that we correct any information you believe is inaccurate or complete information you believe is incomplete</li>
                  <li><strong>The right to erasure:</strong> You have the right to request that we erase your personal data, under certain conditions</li>
                  <li><strong>The right to restrict processing:</strong> You have the right to request that we restrict the processing of your personal data, under certain conditions</li>
                  <li><strong>The right to object to processing:</strong> You have the right to object to our processing of your personal data, under certain conditions</li>
                  <li><strong>The right to data portability:</strong> You have the right to request that we transfer the data that we have collected to another organization, or directly to you, under certain conditions</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="font-heading font-bold text-2xl text-foreground mb-4">Contact Trakia Trips</h2>
                <p className="text-muted-foreground leading-relaxed">
                  Should you wish to contact us to speak about your data, please contact:
                  <br />
                  <strong>Email:</strong> trakia.trips@gmail.com
                  <br />
                  <strong>Instagram:</strong> @trakiatrips
                </p>
              </section>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 mt-8">
                <p className="text-sm text-purple-800 leading-relaxed">
                  <strong>Last Updated:</strong> September 2025
                  <br />
                  By using our website and services, you acknowledge that you have read and understood this Privacy Policy and agree to the collection and use of your information as described herein.
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