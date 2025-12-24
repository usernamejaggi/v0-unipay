"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setMobileNavOpen(true)} />
      <MobileNav open={mobileNavOpen} onOpenChange={setMobileNavOpen} />
      <main className="container mx-auto px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  )
}
