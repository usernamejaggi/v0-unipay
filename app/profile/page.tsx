"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ProfileStats } from "@/components/profile/profile-stats"
import { LevelCard } from "@/components/dashboard/level-card"
import { SubscriptionModal } from "@/components/subscription/subscription-modal"
import { VerificationModal } from "@/components/verification/verification-modal"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Settings,
  Shield,
  Bell,
  HelpCircle,
  Crown,
  Sparkles,
  BadgeCheck,
  Mail,
  GraduationCap,
  Calendar,
  Star,
  Camera,
  Edit,
  Save,
  X,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { uploadFile } from "@/lib/firebase"
import { getCurrentLevel } from "@/lib/levels-data"

export default function ProfilePage() {
  const { user, profile, loading, updateProfile } = useAuth()
  const router = useRouter()
  const [showSubscription, setShowSubscription] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [editName, setEditName] = useState("")
  const [editCollege, setEditCollege] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (profile) {
      setEditName(profile.name || "")
      setEditCollege(profile.college || "")
    }
  }, [profile])

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const currentLevel = getCurrentLevel(profile.tasksCompleted)

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

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user) {
      const url = await uploadFile(file, `avatars/${user.uid}`)
      if (url) {
        await updateProfile({ avatar: url })
      }
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    await updateProfile({
      name: editName,
      college: editCollege,
    })
    setIsSaving(false)
    setIsEditing(false)
  }

  const quickActions = [
    { label: "Account Settings", icon: Settings, href: "#" },
    { label: "Privacy & Security", icon: Shield, href: "#" },
    { label: "Notifications", icon: Bell, href: "/notifications" },
    { label: "Help Center", icon: HelpCircle, href: "#" },
  ]

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary via-primary/80 to-chart-2 relative">
          <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-10" />
        </div>
        <CardContent className="relative pt-0">
          <div className="flex flex-col md:flex-row md:items-end gap-4 -mt-16">
            {/* Avatar with upload */}
            <div className="relative">
              <Avatar className="h-28 w-28 ring-4 ring-background">
                <AvatarImage src={profile.avatar || ""} alt={profile.name || "User"} />
                <AvatarFallback className="text-2xl bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
              </Avatar>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 pb-4 md:pb-0">
              {isEditing ? (
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input value={editName} onChange={(e) => setEditName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label>College</Label>
                    <Input
                      value={editCollege}
                      onChange={(e) => setEditCollege(e.target.value)}
                      placeholder="Your college"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSaveProfile} disabled={isSaving}>
                      {isSaving ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                              fill="none"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                          </svg>
                          Saving...
                        </span>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-1" />
                          Save
                        </>
                      )}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setIsEditing(false)}>
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-2xl font-bold">{profile.name || profile.email?.split("@")[0]}</h1>
                    {profile.verificationStatus === "approved" ? (
                      <Badge className="bg-primary/10 text-primary gap-1">
                        <BadgeCheck className="h-3 w-3" />
                        Verified Student
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 text-warning border-warning/30 hover:bg-warning/10 bg-transparent"
                        onClick={() => setShowVerification(true)}
                      >
                        <Shield className="h-3 w-3" />
                        Verify Now
                      </Button>
                    )}
                    <Badge variant="outline" className="gap-1">
                      {currentLevel.badge} {currentLevel.name}
                    </Badge>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {profile.email}
                    </div>
                    {profile.college && (
                      <div className="flex items-center gap-1">
                        <GraduationCap className="h-4 w-4" />
                        {profile.college}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Joined{" "}
                      {profile.createdAt
                        ? new Date(profile.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
                            month: "long",
                            year: "numeric",
                          })
                        : "Recently"}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-chart-4 text-chart-4" />
                      {profile.rating || 0} rating
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          <ProfileStats
            stats={{
              tasksCompleted: profile.tasksCompleted,
              totalEarnings: profile.totalEarnings,
              rating: profile.rating,
              streak: profile.streak,
            }}
          />

          {/* Level Progress */}
          <LevelCard tasksCompleted={profile.tasksCompleted} />

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Profile Details */}
          <Card>
            <CardHeader>
              <CardTitle>Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.year && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Year</span>
                  <span className="font-medium">{profile.year}</span>
                </div>
              )}
              {profile.stream && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Stream</span>
                  <span className="font-medium">{profile.stream}</span>
                </div>
              )}
              {profile.enrollmentNumber && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Enrollment</span>
                  <span className="font-medium">{profile.enrollmentNumber}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Free Tasks</span>
                <span className="font-medium">
                  {profile.totalFreeTasks - profile.freeTasksUsed}/{profile.totalFreeTasks}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Status */}
          <Card className="overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary via-chart-2 to-chart-4" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-primary" />
                Subscription
              </CardTitle>
              <CardDescription>
                {profile.subscription !== "free" ? "You have an active subscription" : "Upgrade for unlimited access"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Current Plan</span>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {profile.subscription}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Free tasks remaining</span>
                <span className="font-medium">
                  {profile.totalFreeTasks - profile.freeTasksUsed}/{profile.totalFreeTasks}
                </span>
              </div>
              <Button className="w-full gap-2" onClick={() => setShowSubscription(true)}>
                <Crown className="h-4 w-4" />
                {profile.subscription === "free" ? "Upgrade to Pro" : "Manage Subscription"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action) => (
                <Button key={action.label} variant="ghost" className="w-full justify-start gap-3" asChild>
                  <Link href={action.href}>
                    <action.icon className="h-4 w-4 text-muted-foreground" />
                    {action.label}
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <SubscriptionModal open={showSubscription} onOpenChange={setShowSubscription} />
      <VerificationModal open={showVerification} onOpenChange={setShowVerification} />
    </div>
  )
}
