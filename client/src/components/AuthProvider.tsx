import { useState, useEffect } from "react";
import AuthPanel from "./AuthPanel";
import { supabase } from "@/lib/supabase";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showAuthPanel, setShowAuthPanel] = useState(false);

  useEffect(() => {
    // Check if user has already seen the auth panel or has email stored
    const hasSeenPanel = localStorage.getItem("hasSeenAuthPanel");
    const userEmail = localStorage.getItem("userEmail");

    // Show panel after 2 seconds if user hasn't seen it and doesn't have email stored
    if (!hasSeenPanel && !userEmail) {
      const timer = setTimeout(() => {
        setShowAuthPanel(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleCloseAuthPanel = () => {
    setShowAuthPanel(false);
    localStorage.setItem("hasSeenAuthPanel", "true");
  };

  const handleEmailCollected = async (email: string) => {
    console.log("Email collected:", email);
    
    // Update localStorage for immediate UI response
    localStorage.setItem("userEmail", email);
    localStorage.setItem("hasSeenAuthPanel", "true");
    
    // Also verify the email was saved to Supabase
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('email, status')
        .eq('email', email)
        .single();
        
      if (error) {
        console.error('Error verifying email in Supabase:', error);
      } else {
        console.log('Email confirmed in Supabase:', data);
      }
    } catch (error) {
      console.error('Error checking email in Supabase:', error);
    }
    
    setShowAuthPanel(false);
  };

  return (
    <>
      {children}
      <AuthPanel 
        isOpen={showAuthPanel} 
        onClose={handleCloseAuthPanel} 
        onEmailCollected={handleEmailCollected} 
      />
    </>
  );
}