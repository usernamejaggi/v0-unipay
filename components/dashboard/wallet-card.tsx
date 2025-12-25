"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Wallet, TrendingUp } from "lucide-react"
import Link from "next/link"

interface WalletCardProps {
  balance: number
  todayEarnings: number
  dailyLimit: { min: number; max: number }
}

export function WalletCard({ balance, todayEarnings, dailyLimit }: WalletCardProps) {
  const limitProgress = (todayEarnings / dailyLimit.max) * 100

  return (
    <Card className="bg-primary text-primary-foreground overflow-hidden relative group hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-primary-foreground/10 -translate-y-1/2 translate-x-1/4 animate-float" />
      <div
        className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-primary-foreground/5 translate-y-1/2 -translate-x-1/4 animate-float"
        style={{ animationDelay: "1s" }}
      />
      <CardHeader className="relative pb-2">
        <CardTitle className="flex items-center gap-2 text-primary-foreground/80 text-sm font-medium">
          <Wallet className="h-4 w-4" />
          Wallet Balance
        </CardTitle>
      </CardHeader>
      <CardContent className="relative space-y-4">
        <div>
        <p className="text-4xl font-bold animate-count-up">
  ₹{Number(balance ?? 0).toLocaleString("en-IN")}
</p>

          <div className="flex items-center gap-1 mt-1 text-primary-foreground/70 text-sm">
            <TrendingUp className="h-3 w-3" />
            <span>+₹{todayEarnings} today</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-primary-foreground/70">Daily limit</span>
            <span className="font-medium">
              ₹{todayEarnings} / ₹{dailyLimit.max}
            </span>
          </div>
          <div className="h-2 bg-primary-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary-foreground rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${Math.min(limitProgress, 100)}%` }}
            >
              <div className="absolute inset-0 animate-shimmer" />
            </div>
          </div>
          <p className="text-xs text-primary-foreground/60">
            Withdraw ₹{dailyLimit.min} - ₹{dailyLimit.max} daily
          </p>
        </div>

        <Button
          variant="secondary"
          className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-transform duration-300 hover:scale-[1.02]"
          asChild
        >
          <Link href="/wallet">
            Withdraw Funds <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardContent>
    </Card>
  )
}
