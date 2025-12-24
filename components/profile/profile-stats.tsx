import type { StudentProfile } from "@/lib/profile-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, IndianRupee, Star, Target } from "lucide-react"

interface ProfileStatsProps {
  stats: StudentProfile["stats"]
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const statItems = [
    {
      label: "Tasks Completed",
      value: stats.tasksCompleted,
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Earnings",
      value: `₹${stats.totalEarnings.toLocaleString("en-IN")}`,
      icon: IndianRupee,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Rating",
      value: stats.rating,
      icon: Star,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      label: "Day Streak",
      value: stats.streak,
      icon: Target,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Stats</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {statItems.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
