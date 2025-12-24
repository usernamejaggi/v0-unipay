import type { StudentProfile } from "@/lib/profile-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProfileSkillsProps {
  skills: StudentProfile["skills"]
}

export function ProfileSkills({ skills }: ProfileSkillsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Tasks are matched based on your skills</CardDescription>
        </div>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="px-3 py-1">
              {skill}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
