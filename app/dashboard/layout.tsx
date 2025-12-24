"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { InteractiveBackground } from "@/components/ui/interactive-background"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <InteractiveBackground />
      <Header onMenuClick={() => setMobileNavOpen(true)} />
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8 relative z-10">{children}</main>
    </div>
  )
}
