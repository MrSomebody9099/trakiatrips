import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "./components/HomePage";
import AboutPage from "./pages/AboutPage";
import TermsPage from "./pages/TermsPage";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BookingFlow from "./components/BookingFlow";
import AdminDashboard from "./components/AdminDashboard";
import UserProfile from "./components/UserProfile";
import UserDashboard from "./components/UserDashboard";
import SuccessPage from "./pages/SuccessPage";
import TransactionSuccess from "./pages/TransactionSuccess";
import PaymentFailed from "./pages/PaymentFailed";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentProcess from "./pages/PaymentProcess";
import NotFound from "@/pages/not-found";
import AuthProvider from "./components/AuthProvider";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy-policy" component={() => <PrivacyPolicy />} />
      <Route path="/booking" component={() => <BookingFlow />} />
      <Route path="/payment-process" component={() => <PaymentProcess />} />
      <Route path="/payment-success" component={() => <PaymentSuccess />} />
      <Route path="/success" component={() => <SuccessPage />} />
      <Route path="/payment-failed" component={() => <PaymentFailed />} />
      <Route path="/transaction-successful" component={() => <TransactionSuccess />} />
      <Route path="/dashboard" component={() => <AdminDashboard />} />
      <Route path="/profile" component={() => <UserProfile />} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="bg-background text-foreground min-h-screen">
            <Router />
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;