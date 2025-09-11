"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from "react-hook-form"

interface AuthPanelProps {
  isOpen: boolean
  onClose: () => void
  onEmailCollected?: (email: string) => void
}

interface FormData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

export function AuthPanel({ isOpen, onClose, onEmailCollected }: AuthPanelProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "email-only">("email-only")
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  const form = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    },
  })

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()
  }, [supabase])

  const handleEmailOnly = async (data: FormData) => {
    setLoading(true)
    try {
      // Store email in localStorage for later use
      localStorage.setItem("userEmail", data.email)
      onEmailCollected?.(data.email)
      onClose()
    } catch (error) {
      console.error("Error storing email:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      form.setError("confirmPassword", { message: "Passwords do not match" })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { name: data.name },
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || window.location.origin,
        },
      })

      if (error) throw error

      localStorage.setItem("userEmail", data.email)
      onEmailCollected?.(data.email)
      onClose()
    } catch (error: any) {
      form.setError("email", { message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (data: FormData) => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      localStorage.setItem("userEmail", data.email)
      onEmailCollected?.(data.email)
      onClose()
    } catch (error: any) {
      form.setError("email", { message: error.message })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (data: FormData) => {
    if (mode === "email-only") {
      handleEmailOnly(data)
    } else if (mode === "signup") {
      handleSignUp(data)
    } else {
      handleSignIn(data)
    }
  }

  if (user) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="glass-hero border-0 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-xl font-semibold">
              Welcome back, {user.user_metadata?.name || user.email}!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center py-4">
            <p className="text-white/80 mb-4">You're already signed in and ready to book your adventure.</p>
            <Button onClick={onClose} className="glass-button-colorful w-full">
              Continue Exploring
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-hero border-0 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-center text-xl font-semibold">
            {mode === "email-only" ? "Stay Connected" : mode === "signup" ? "Create Account" : "Welcome Back"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {mode === "signup" && (
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Your full name"
                        className="glass border-white/20 text-white placeholder:text-white/60"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Email</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your@email.com"
                      className="glass border-white/20 text-white placeholder:text-white/60"
                    />
                  </FormControl>
                  <FormMessage className="text-red-300" />
                </FormItem>
              )}
            />

            {mode !== "email-only" && (
              <FormField
                control={form.control}
                name="password"
                rules={{
                  required: "Password is required",
                  minLength: { value: 6, message: "Password must be at least 6 characters" },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="glass border-white/20 text-white placeholder:text-white/60"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
            )}

            {mode === "signup" && (
              <FormField
                control={form.control}
                name="confirmPassword"
                rules={{ required: "Please confirm your password" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="••••••••"
                        className="glass border-white/20 text-white placeholder:text-white/60"
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />
            )}

            <Button type="submit" disabled={loading} className="glass-button-colorful w-full">
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
                    className="text-white/80 hover:text-white text-sm underline"
                  >
                    Already have an account? Sign in
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => setMode("signup")}
                    className="text-white/80 hover:text-white text-sm underline"
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
                    className="text-white/80 hover:text-white text-sm underline"
                  >
                    Don't have an account? Sign up
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => setMode("email-only")}
                    className="text-white/80 hover:text-white text-sm underline"
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
                    className="text-white/80 hover:text-white text-sm underline"
                  >
                    Already have an account? Sign in
                  </button>
                  <br />
                  <button
                    type="button"
                    onClick={() => setMode("email-only")}
                    className="text-white/80 hover:text-white text-sm underline"
                  >
                    Just continue with email
                  </button>
                </div>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
