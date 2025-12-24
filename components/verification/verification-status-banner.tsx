"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Clock, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react"
import type { VerificationStatus } from "@/lib/firebase"
import { cn } from "@/lib/utils"

interface VerificationStatusBannerProps {
  status: VerificationStatus
  onVerifyClick?: () => void
}

const statusConfig = {
  "not-submitted": {
    icon: FileText,
    title: "Verification Required",
    description: "Complete verification to start applying for tasks and earning",
    badge: "Not Verified",
    badgeClass: "bg-muted text-muted-foreground",
    cardClass: "border-border bg-muted/30",
    iconClass: "text-muted-foreground",
    showButton: true,
    buttonText: "Start Verification",
  },
  "under-review": {
    icon: Clock,
    title: "Verification Under Review",
    description: "Your profile is under admin review. Tasks will unlock once approved.",
    badge: "Under Review",
    badgeClass: "bg-info/10 text-info",
    cardClass: "border-info/20 bg-info/5",
    iconClass: "text-info",
    showButton: false,
    buttonText: "",
  },
  rejected: {
    icon: RefreshCw,
    title: "Resubmission Required",
    description: "Please resubmit with correct documents to continue.",
    badge: "Resubmit",
    badgeClass: "bg-warning/10 text-warning",
    cardClass: "border-warning/20 bg-warning/5",
    iconClass: "text-warning",
    showButton: true,
    buttonText: "Resubmit Verification",
  },
  approved: {
    icon: ShieldCheck,
    title: "Verified Student",
    description: "Your profile is verified. You can apply for tasks.",
    badge: "Verified",
    badgeClass: "bg-success/10 text-success",
    cardClass: "border-success/20 bg-success/5",
    iconClass: "text-success",
    showButton: false,
    buttonText: "",
  },
}

export function VerificationStatusBanner({ status, onVerifyClick }: VerificationStatusBannerProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  if (status === "approved") return null

  return (
    <Card className={cn("transition-all duration-200", config.cardClass)}>
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start md:items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-background", config.iconClass)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-medium">{config.title}</p>
                <Badge variant="secondary" className={config.badgeClass}>
                  {config.badge}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-0.5">{config.description}</p>
            </div>
          </div>
          {config.showButton && (
            <Button onClick={onVerifyClick} size="sm" className="shrink-0">
              {config.buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
