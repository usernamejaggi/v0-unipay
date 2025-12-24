import type { StudentProfile } from "@/lib/profile-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { GraduationCap, BookOpen, Calendar, BadgeCheck } from "lucide-react"

interface ProfileDetailsProps {
  profile: StudentProfile
}

export function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Student Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <GraduationCap className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">College</p>
            <p className="font-medium">{profile.college}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Degree</p>
            <p className="font-medium">{profile.degree}</p>
            <p className="text-sm text-muted-foreground">{profile.year}</p>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <BadgeCheck className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Verification Status</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge className="bg-primary/10 text-primary">Verified</Badge>
              <span className="text-sm text-muted-foreground">
                since{" "}
                {new Date(profile.verifiedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-muted">
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Member Since</p>
            <p className="font-medium">
              {new Date(profile.joinedAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
