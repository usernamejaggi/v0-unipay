"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy, TrendingUp, Users, Zap, Flame, Medal, Crown } from "lucide-react"
import { leaderboardData } from "@/lib/leaderboard-data"

export default function LeaderboardPage() {
  const [timeframe, setTimeframe] = useState<"weekly" | "allTime">("weekly")

  const data = timeframe === "weekly" ? leaderboardData.weekly : leaderboardData.allTime
  const topThree = data.slice(0, 3)
  const rest = data.slice(3)

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-br from-amber-400 to-yellow-500 text-white"
      case 2:
        return "bg-gradient-to-br from-gray-300 to-gray-400 text-gray-800"
      case 3:
        return "bg-gradient-to-br from-amber-600 to-amber-700 text-white"
      default:
        return "bg-muted"
    }
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-5 w-5" />
      case 2:
        return <Medal className="h-5 w-5" />
      case 3:
        return <Medal className="h-5 w-5" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="h-6 w-6 text-primary" />
            Leaderboard
          </h1>
          <p className="text-muted-foreground mt-1">See how you rank against other students</p>
        </div>
      </div>

      {/* Your Stats */}
      <Card className="bg-gradient-to-r from-primary/5 via-transparent to-chart-2/5 border-primary/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold text-primary">#4</p>
              <p className="text-xs text-muted-foreground">Weekly Rank</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold">#18</p>
              <p className="text-xs text-muted-foreground">All Time</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <div className="flex items-center justify-center gap-1">
                <Flame className="h-5 w-5 text-orange-500" />
                <p className="text-2xl font-bold text-orange-500">7</p>
              </div>
              <p className="text-xs text-muted-foreground">Day Streak</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-background/50">
              <p className="text-2xl font-bold">₹3,200</p>
              <p className="text-xs text-muted-foreground">This Week</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Your Weekly Earnings", value: "₹3,200", icon: TrendingUp, color: "text-primary" },
          { label: "Total Competitors", value: "70,000+", icon: Users, color: "text-chart-2" },
          { label: "Tasks to Next Rank", value: "4", icon: Zap, color: "text-amber-500" },
        ].map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Top Earners</CardTitle>
              <CardDescription>Students with highest earnings</CardDescription>
            </div>
            <Tabs value={timeframe} onValueChange={(v) => setTimeframe(v as "weekly" | "allTime")}>
              <TabsList>
                <TabsTrigger value="weekly">This Week</TabsTrigger>
                <TabsTrigger value="allTime">All Time</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          {/* Top 3 Podium */}
          <div className="flex justify-center items-end gap-4 mb-8 pt-8">
            {/* 2nd Place */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-16 w-16 ring-4 ring-gray-300">
                  <AvatarImage src={topThree[1]?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{topThree[1]?.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white font-bold text-sm">
                  2
                </div>
              </div>
              <p className="font-medium mt-3 text-sm">{topThree[1]?.name}</p>
              <p className="text-xs text-muted-foreground">{topThree[1]?.college}</p>
              <Badge variant="secondary" className="mt-2">
                ₹{topThree[1]?.earnings.toLocaleString()}
              </Badge>
              <div className="w-20 h-20 bg-gradient-to-t from-gray-200 to-gray-100 rounded-t-lg mt-3" />
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center -mt-8">
              <Crown className="h-8 w-8 text-amber-500 mb-2 animate-bounce" />
              <div className="relative">
                <Avatar className="h-20 w-20 ring-4 ring-amber-400">
                  <AvatarImage src={topThree[0]?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{topThree[0]?.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-white font-bold text-sm">
                  1
                </div>
              </div>
              <p className="font-semibold mt-3">{topThree[0]?.name}</p>
              <p className="text-xs text-muted-foreground">{topThree[0]?.college}</p>
              <Badge className="mt-2 bg-amber-500">₹{topThree[0]?.earnings.toLocaleString()}</Badge>
              <div className="w-24 h-28 bg-gradient-to-t from-amber-200 to-amber-100 rounded-t-lg mt-3" />
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Avatar className="h-14 w-14 ring-4 ring-amber-600">
                  <AvatarImage src={topThree[2]?.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{topThree[2]?.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-gradient-to-br from-amber-600 to-amber-700 flex items-center justify-center text-white font-bold text-xs">
                  3
                </div>
              </div>
              <p className="font-medium mt-3 text-sm">{topThree[2]?.name}</p>
              <p className="text-xs text-muted-foreground">{topThree[2]?.college}</p>
              <Badge variant="secondary" className="mt-2">
                ₹{topThree[2]?.earnings.toLocaleString()}
              </Badge>
              <div className="w-16 h-14 bg-gradient-to-t from-amber-100 to-amber-50 rounded-t-lg mt-3" />
            </div>
          </div>

          {/* Rest of the leaderboard */}
          <div className="space-y-2">
            {rest.map((entry, index) => (
              <div
                key={entry.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center font-medium text-sm">
                  {index + 4}
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarImage src={entry.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{entry.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{entry.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{entry.college}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-sm">{entry.streak}</span>
                  </div>
                  <Badge variant="outline">₹{entry.earnings.toLocaleString()}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
