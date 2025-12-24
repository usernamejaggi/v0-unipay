"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Clock, IndianRupee, Target } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  completed: number
  pending: number
  todayEarnings: number
  streak: number
}

export function StatsCards({ completed, pending, todayEarnings, streak }: StatsCardsProps) {
  const stats = [
    {
      label: "Tasks Completed",
      value: completed,
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Pending Tasks",
      value: pending,
      icon: Clock,
      color: "text-warning",
      bgColor: "bg-warning/10",
    },
    {
      label: "Earned Today",
      value: `₹${todayEarnings}`,
      icon: IndianRupee,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Day Streak",
      value: streak,
      icon: Target,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card
          key={stat.label}
          className={cn(
            "group hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-slide-up",
            `stagger-${index + 1}`,
          )}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor} transition-transform duration-300 group-hover:scale-110`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold animate-count-up">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
