import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

interface AuthPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onEmailCollected?: (email: string) => void;
}

export default function AuthPanel({ isOpen, onClose, onEmailCollected }: AuthPanelProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "email-only">("email-only");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateEmail = (email: string) => {
    const regex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return regex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (mode === "signup") {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.password) newErrors.password = "Password is required";
      else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    } else if (mode === "signin" && !formData.password) {
      newErrors.password = "Password is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setLoading(false);
      return;
    }

    try {
      // Save email via backend API
      const response = await fetch('/api/collect-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          status: 'email_only'
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Error saving email via API:', result);
        setErrors({ general: result.error || "Failed to save email. Please try again." });
        return;
      }

      // Store in localStorage for immediate UI updates
      localStorage.setItem("userEmail", formData.email);
      onEmailCollected?.(formData.email);
      
      console.log(`${mode} successful for:`, formData.email, 'Saved via API:', result);
      onClose();
    } catch (error) {
      console.error('Error:', error);
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur-lg border-border shadow-2xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground text-center text-xl font-heading font-semibold">
            {mode === "email-only" ? "Stay Connected" : mode === "signup" ? "Create Account" : "Welcome Back"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && (
            <div className="text-destructive text-sm text-center p-2 bg-destructive/10 rounded">
              {errors.general}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => updateFormData("name", e.target.value)}
                placeholder="Your full name"
                className={errors.name ? "border-destructive" : ""}
                data-testid="input-auth-name"
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="your@email.com"
              className={errors.email ? "border-destructive" : ""}
              data-testid="input-auth-email"
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>

          {mode !== "email-only" && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => updateFormData("password", e.target.value)}
                placeholder="••••••••"
                className={errors.password ? "border-destructive" : ""}
                data-testid="input-auth-password"
              />
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>
          )}

          {mode === "signup" && (
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                placeholder="••••••••"
                className={errors.confirmPassword ? "border-destructive" : ""}
                data-testid="input-auth-confirm-password"
              />
              {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
            </div>
          )}

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full hover-elevate"
            data-testid="button-auth-submit"
          >
            {loading
              ? "Please wait..."
              : mode === "email-only"
                ? "Continue"
                : mode === "signup"
                  ? "Create Account"
                  : "Sign In"}
          </Button>

          <div className="text-center space-y-2">
            {mode === "email-only" && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-primary hover:text-primary/80 text-sm underline"
                  data-testid="button-switch-signin"
                >
                  Already have an account? Sign in
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-primary hover:text-primary/80 text-sm underline"
                  data-testid="button-switch-signup"
                >
                  Create a new account
                </button>
              </div>
            )}

            {mode === "signin" && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="text-primary hover:text-primary/80 text-sm underline"
                  data-testid="button-switch-signup"
                >
                  Don't have an account? Sign up
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setMode("email-only")}
                  className="text-primary hover:text-primary/80 text-sm underline"
                  data-testid="button-switch-email"
                >
                  Just continue with email
                </button>
              </div>
            )}

            {mode === "signup" && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => setMode("signin")}
                  className="text-primary hover:text-primary/80 text-sm underline"
                  data-testid="button-switch-signin"
                >
                  Already have an account? Sign in
                </button>
                <br />
                <button
                  type="button"
                  onClick={() => setMode("email-only")}
                  className="text-primary hover:text-primary/80 text-sm underline"
                  data-testid="button-switch-email"
                >
                  Just continue with email
                </button>
              </div>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}