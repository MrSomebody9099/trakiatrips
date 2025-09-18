import MarqueeTape from "../components/MarqueeTape";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen" style={{backgroundColor: '#DDF9F1'}}>
      <MarqueeTape />
      <Navigation />
      
      <main className="pt-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto py-16 md:py-24">
          <div className="text-center mb-16 md:mb-24 animate-fade-in-up">
            <div className="inline-block bg-purple-500/10 border border-purple-500/20 rounded-full px-6 py-2 text-purple-600 font-medium mb-8">
              Legal Information
            </div>
            <h1 className="font-heading font-black text-4xl md:text-6xl lg:text-8xl xl:text-9xl text-foreground mb-8 md:mb-12 leading-tight">
              PRIVACY
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">
                POLICY
              </span>
            </h1>
            <p className="font-body text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              How we protect and use your information
            </p>
          </div>
          
          <div className="space-y-12 md:space-y-16 animate-fade-in-up animate-delay-200">
            <div className="relative bg-gradient-to-br from-white via-purple-50/30 to-purple-100/20 backdrop-blur-xl border border-purple-200/50 rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-purple-500/10">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent rounded-3xl md:rounded-[3rem]"></div>
              
              <div className="relative">
                <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-8 text-center">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">DATA</span> Collection
                </h2>
                
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/50">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">Information We Collect</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      We collect personal information that you voluntarily provide to us when you register on our website, express interest in obtaining information about us or our products and services, participate in activities on the website, or otherwise contact us. The personal information we collect may include names, email addresses, phone numbers, and payment information.
                    </p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-2xl p-6 border border-purple-200/50">
                    <h3 className="font-heading font-bold text-xl text-foreground mb-3">How We Use Your Information</h3>
                    <p className="font-body text-muted-foreground leading-relaxed">
                      We use the information we collect to provide, maintain, and improve our services, to process your bookings and transactions, to send you marketing and promotional communications if you have opted in to receive them, and to comply with legal obligations.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative bg-gradient-to-br from-purple-500/5 to-purple-600/15 backdrop-blur-xl border border-purple-300/30 rounded-3xl md:rounded-[3rem] p-8 md:p-16 lg:p-20 shadow-2xl shadow-purple-500/20">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400/5 to-transparent rounded-3xl md:rounded-[3rem]"></div>
              
              <div className="relative">
                <h2 className="font-heading font-black text-3xl md:text-4xl lg:text-5xl text-foreground mb-8 text-center">
                  <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">YOUR</span> Rights
                </h2>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mt-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Access and Update</h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          You have the right to access and update the personal information we hold about you. You can do this by logging into your account or contacting us directly.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mt-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Data Deletion</h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          You have the right to request that we delete your personal information. We will comply with such requests unless we have a legal obligation to retain certain information.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mt-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Marketing Preferences</h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          You can opt out of receiving marketing communications from us at any time by clicking the "unsubscribe" link in our emails or contacting us directly.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mt-1">
                        <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-xl text-foreground mb-2">Cookies</h3>
                        <p className="font-body text-muted-foreground leading-relaxed">
                          We use cookies to enhance your experience on our website. You can manage your cookie preferences through your browser settings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}