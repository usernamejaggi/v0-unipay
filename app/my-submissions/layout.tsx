import type React from "react"
import { Header } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export default function MySubmissionsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <Header />
      <main className="container px-4 py-6">{children}</main>
      <MobileNav />
    </div>
  )
}
