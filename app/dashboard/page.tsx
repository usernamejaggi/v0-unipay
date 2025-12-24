"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { WalletCard } from "@/components/dashboard/wallet-card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RecentTasks } from "@/components/dashboard/recent-tasks"
import { LevelCard } from "@/components/dashboard/level-card"
import { FreeTasksBanner } from "@/components/subscription/free-tasks-banner"
import { SubscriptionModal } from "@/components/subscription/subscription-modal"
import { VerificationStatusBanner } from "@/components/verification/verification-status-banner"
import { VerificationModal } from "@/components/verification/verification-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LightningButton } from "@/components/ui/lightning-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCheck, Sparkles, Crown, Clock, ShieldAlert, Trophy, Lightbulb, FileText, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getUserIdeas, type IdeaSubmission } from "@/lib/firebase"

export default function DashboardPage() {
  const [showSubscription, setShowSubscription] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [mySubmissions, setMySubmissions] = useState<IdeaSubmission[]>([])
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (user) {
        const ideas = await getUserIdeas(user.uid)
        setMySubmissions(ideas)
      }
    }
    fetchSubmissions()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!profile) {
    return null
  }

  const handleVerificationSubmit = () => {
    // Profile will auto-update via Firebase subscription
  }

  const getStatusBadge = () => {
    switch (profile.verificationStatus) {
      case "approved":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
            <BadgeCheck className="h-3 w-3" />
            Verified
          </Badge>
        )
      case "under-review":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning-foreground gap-1">
            <Clock className="h-3 w-3" />
            Under Review
          </Badge>
        )
      case "rejected":
      case "not-submitted":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground gap-1">
            <ShieldAlert className="h-3 w-3" />
            Not Verified
          </Badge>
        )
    }
  }

  const getInitials = () => {
    if (profile.name) {
      return profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    return profile.email?.slice(0, 2).toUpperCase() || "U"
  }

  const displayName = profile.name || profile.email?.split("@")[0] || "User"
  const firstName = displayName.split(" ")[0]

  return (
    <div className="space-y-6">
      <VerificationStatusBanner status={profile.verificationStatus} onVerifyClick={() => setShowVerification(true)} />

      {profile.verificationStatus === "approved" && <FreeTasksBanner />}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarImage src={profile.avatar || ""} alt={displayName} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg">{getInitials()}</AvatarFallback>
          </Avatar>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
              {getStatusBadge()}
              {profile.subscription !== "free" && (
                <Badge variant="secondary" className="bg-amber-500/10 text-amber-600 gap-1">
                  <Crown className="h-3 w-3" />
                  {profile.subscription === "starter" ? "Starter" : "Pro"}
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1">
              {profile.verificationStatus === "approved"
                ? "Here's what's happening with your tasks today."
                : "Complete verification to start earning."}
            </p>
          </div>
        </div>

        <Button variant="outline" className="gap-2 bg-transparent" onClick={() => setShowSubscription(true)}>
          <Crown className="h-4 w-4" />
          Plans
        </Button>
      </div>

      {/* New Tasks Alert */}
      {profile.verificationStatus === "approved" && (
        <Card className="bg-gradient-to-r from-primary/5 to-chart-2/5 border-primary/20">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="p-3 rounded-full bg-primary/10">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium">5 new tasks available!</p>
              <p className="text-sm text-muted-foreground">Earn up to ₹500 today</p>
            </div>
            <LightningButton size="sm" href="/tasks">
              View Tasks
            </LightningButton>
          </CardContent>
        </Card>
      )}

      {/* Stats - using real profile data */}
      <StatsCards
        completed={profile.verificationStatus === "approved" ? profile.tasksCompleted : 0}
        pending={profile.verificationStatus === "approved" ? 3 : 0}
        todayEarnings={profile.verificationStatus === "approved" ? Math.floor(profile.totalEarnings * 0.04) : 0}
        streak={profile.verificationStatus === "approved" ? profile.streak : 0}
      />

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <LevelCard tasksCompleted={profile.verificationStatus === "approved" ? profile.tasksCompleted : 0} />
            <WalletCard
              balance={profile.verificationStatus === "approved" ? profile.totalEarnings : 0}
              todayEarnings={profile.verificationStatus === "approved" ? Math.floor(profile.totalEarnings * 0.04) : 0}
              dailyLimit={{ min: 500, max: 1000 }}
            />
          </div>
          <RecentTasks />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <FileText className="h-5 w-5 text-primary" />
                My Submissions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <p className="text-2xl font-bold text-warning">
                    {mySubmissions.filter((s) => s.status === "pending").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Pending</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-chart-2/10 border border-chart-2/20">
                  <p className="text-2xl font-bold text-chart-2">
                    {mySubmissions.filter((s) => s.status === "approved" || s.status === "converted").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-transparent" asChild>
                  <Link href="/my-submissions">View All</Link>
                </Button>
                <LightningButton className="flex-1" href="/submit-idea">
                  <Lightbulb className="h-4 w-4" />
                  New Idea
                </LightningButton>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-primary" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-3xl font-bold text-primary">#4</p>
                <p className="text-sm text-muted-foreground">Your Weekly Rank</p>
              </div>
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Priya S.", earnings: "₹12,500" },
                  { rank: 2, name: "Amit K.", earnings: "₹11,200" },
                  { rank: 3, name: "Sneha R.", earnings: "₹10,800" },
                ].map((entry) => (
                  <div key={entry.rank} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-muted-foreground">#{entry.rank}</span>
                      <span className="text-sm font-medium">{entry.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{entry.earnings}</span>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full bg-transparent" asChild>
                <Link href="/leaderboard">View Full Leaderboard</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/submit-idea"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="p-2 rounded-full bg-primary/10">
                <Lightbulb className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Submit an Idea</h4>
                <p className="text-xs text-muted-foreground">Propose a new task</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/tasks"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="p-2 rounded-full bg-chart-2/10">
                <Sparkles className="h-5 w-5 text-chart-2" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Browse Tasks</h4>
                <p className="text-xs text-muted-foreground">Find tasks to complete</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/my-submissions"
              className="flex items-center gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
            >
              <div className="p-2 rounded-full bg-warning/10">
                <FileText className="h-5 w-5 text-warning" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-sm">Track Submissions</h4>
                <p className="text-xs text-muted-foreground">View idea status</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <SubscriptionModal open={showSubscription} onOpenChange={setShowSubscription} />
      <VerificationModal
        open={showVerification}
        onOpenChange={setShowVerification}
        onSubmit={handleVerificationSubmit}
      />
    </div>
  )
}
