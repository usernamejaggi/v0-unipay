import type React from "react"
import { Header } from "@/components/dashboard/header"
import { MobileNav } from "@/components/dashboard/mobile-nav"

export const metadata = {
  title: "Leaderboard | TaskEarn",
  description: "See how you rank against other students",
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">{children}</main>
      <MobileNav />
    </div>
  )
}
