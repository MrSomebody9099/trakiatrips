"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { AuthPanel } from "./auth-panel"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [showAuthPanel, setShowAuthPanel] = useState(false)
  const [hasShownPanel, setHasShownPanel] = useState(false)

  useEffect(() => {
    // Check if user has already seen the auth panel or has email stored
    const hasSeenPanel = localStorage.getItem("hasSeenAuthPanel")
    const userEmail = localStorage.getItem("userEmail")

    // Show panel after 2 seconds if user hasn't seen it and doesn't have email stored
    if (!hasSeenPanel && !userEmail) {
      const timer = setTimeout(() => {
        setShowAuthPanel(true)
        setHasShownPanel(true)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [])

  const handleCloseAuthPanel = () => {
    setShowAuthPanel(false)
    localStorage.setItem("hasSeenAuthPanel", "true")
  }

  const handleEmailCollected = (email: string) => {
    console.log("[v0] Email collected:", email)
    localStorage.setItem("userEmail", email)
    localStorage.setItem("hasSeenAuthPanel", "true")
  }

  return (
    <>
      {children}
      <AuthPanel isOpen={showAuthPanel} onClose={handleCloseAuthPanel} onEmailCollected={handleEmailCollected} />
    </>
  )
}
