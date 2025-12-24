"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BadgeCheck, Mail, GraduationCap, Calendar, Star, ShieldCheck, Camera } from "lucide-react"
import { getCurrentLevel } from "@/lib/levels-data"
import { VerificationModal } from "@/components/verification/verification-modal"
import { useAuth } from "@/contexts/auth-context"
import { uploadFile } from "@/lib/firebase"
import type { UserProfile } from "@/lib/firebase"

interface ProfileHeaderProps {
  profile: UserProfile
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { user, updateProfile } = useAuth()
  const [showVerification, setShowVerification] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  return (
    <>
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
                    <ShieldCheck className="h-3 w-3" />
                    Verify Now
                  </Button>
                )}
                <Badge variant="outline" className="gap-1">
                  {currentLevel.badge} {currentLevel.name}
                </Badge>
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
            </div>
          </div>
        </CardContent>
      </Card>

      <VerificationModal open={showVerification} onOpenChange={setShowVerification} />
    </>
  )
}
