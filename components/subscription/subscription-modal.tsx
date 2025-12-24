"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { subscriptionPlans, userSubscription } from "@/lib/subscription-data"
import { cn } from "@/lib/utils"
import { Check, Sparkles, Crown, Zap, AlertTriangle, Info } from "lucide-react"
import Link from "next/link"

interface SubscriptionModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trigger?: "free-limit" | "manual"
}

export function SubscriptionModal({ open, onOpenChange, trigger = "manual" }: SubscriptionModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          {trigger === "free-limit" && (
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <Badge variant="secondary" className="bg-warning/10 text-warning-foreground">
                Free Limit Reached
              </Badge>
            </div>
          )}
          <DialogTitle className="text-2xl">
            {trigger === "free-limit" ? "Upgrade to Continue Earning" : "Choose Your Plan"}
          </DialogTitle>
          <DialogDescription>
            {trigger === "free-limit"
              ? `You've completed ${userSubscription.totalFreeTasks} free tasks. Subscribe to unlock unlimited tasks!`
              : "Unlock more features and earn higher rewards with our premium plans"}
          </DialogDescription>
        </DialogHeader>

        {/* Free tasks counter */}
        {trigger === "free-limit" && (
          <div className="flex items-center justify-center gap-4 py-4">
            <div className="text-center">
              <p className="text-4xl font-bold text-destructive">{userSubscription.freeTasksRemaining}</p>
              <p className="text-sm text-muted-foreground">tasks remaining</p>
            </div>
            <div className="h-12 w-px bg-border" />
            <div className="text-center">
              <p className="text-4xl font-bold text-muted-foreground">{userSubscription.totalFreeTasks}</p>
              <p className="text-sm text-muted-foreground">free tasks total</p>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {subscriptionPlans.map((plan, index) => (
            <div
              key={plan.id}
              className={cn(
                "relative rounded-xl border p-5 transition-all duration-300",
                plan.highlighted
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20 scale-105"
                  : "hover:border-primary/50 hover:shadow-md",
              )}
            >
              {plan.badge && (
                <Badge
                  className={cn(
                    "absolute -top-2.5 left-1/2 -translate-x-1/2",
                    plan.highlighted ? "bg-primary" : "bg-muted-foreground",
                  )}
                >
                  {plan.badge}
                </Badge>
              )}

              <div className="text-center mb-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                  {plan.id === "free" && <Sparkles className="h-6 w-6 text-muted-foreground" />}
                  {plan.id === "starter" && <Zap className="h-6 w-6 text-primary" />}
                  {plan.id === "pro" && <Crown className="h-6 w-6 text-amber-500" />}
                </div>
                <h3 className="text-lg font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price === 0 ? "Free" : `₹${plan.price}`}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.id === "free" ? (
                <Button className="w-full bg-transparent" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link href={`/payment?plan=${plan.id}`}>Subscribe</Link>
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="flex items-start gap-2 p-3 bg-muted/50 rounded-lg text-sm mt-2">
          <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <p className="text-muted-foreground">
            Subscription unlocks continued task access and bonus features. Earnings depend on task availability and
            completion quality. No earning guarantees.
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-2">
          All plans include secure payments via Razorpay. Cancel anytime.
        </p>
      </DialogContent>
    </Dialog>
  )
}
