"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, Crown, X } from "lucide-react"
import { SubscriptionModal } from "./subscription-modal"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export function FreeTasksBanner() {
  const { profile } = useAuth()
  const [showModal, setShowModal] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (!profile) return null

  const freeTasksRemaining = profile.totalFreeTasks - profile.freeTasksUsed
  const totalFreeTasks = profile.totalFreeTasks
  const tasksUsed = profile.freeTasksUsed
  const progress = (tasksUsed / totalFreeTasks) * 100
  const isLow = freeTasksRemaining <= 3
  const isExhausted = freeTasksRemaining <= 0
  const isSubscribed = profile.subscription !== "free"

  if (isSubscribed || dismissed) return null

  return (
    <>
      <Card
        className={cn(
          "transition-all duration-300",
          isExhausted
            ? "border-destructive bg-destructive/5"
            : isLow
              ? "border-warning bg-warning/5"
              : "border-primary/20 bg-primary/5",
        )}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {isExhausted ? (
                <div className="p-2 rounded-full bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
              ) : (
                <div className="p-2 rounded-full bg-primary/10">
                  <Crown className="h-5 w-5 text-primary" />
                </div>
              )}
              <div>
                <p className="font-medium">
                  {isExhausted
                    ? "Free tasks exhausted!"
                    : isLow
                      ? `Only ${freeTasksRemaining} free tasks left!`
                      : `${freeTasksRemaining} free tasks remaining`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isExhausted
                    ? "Subscribe to continue earning on the platform"
                    : "Upgrade for unlimited tasks and bonus earnings"}
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="w-32">
                <div className="flex justify-between text-xs mb-1">
                  <span>{tasksUsed} used</span>
                  <span>{totalFreeTasks} total</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
              <Button size="sm" onClick={() => setShowModal(true)}>
                Upgrade Now
              </Button>
              {!isExhausted && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDismissed(true)}>
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            <div className="flex md:hidden">
              <Button size="sm" onClick={() => setShowModal(true)}>
                Upgrade
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <SubscriptionModal open={showModal} onOpenChange={setShowModal} trigger={isExhausted ? "free-limit" : "manual"} />
    </>
  )
}
