"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { weeklyLeaderboard, allTimeLeaderboard } from "@/lib/leaderboard-data"
import { cn } from "@/lib/utils"
import { Trophy, Medal, Award, TrendingUp } from "lucide-react"

const rankIcons = {
  1: <Trophy className="h-5 w-5 text-amber-500" />,
  2: <Medal className="h-5 w-5 text-slate-400" />,
  3: <Award className="h-5 w-5 text-amber-700" />,
}

export function LeaderboardCard() {
  const renderLeaderboard = (entries: typeof weeklyLeaderboard) => (
    <div className="space-y-2">
      {entries.slice(0, 5).map((entry, index) => (
        <div
          key={`${entry.rank}-${entry.name}`}
          className={cn(
            "flex items-center gap-3 p-3 rounded-lg transition-all duration-300 hover:bg-muted/50",
            entry.isCurrentUser && "bg-primary/5 border border-primary/20",
            "animate-slide-up",
          )}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="w-8 flex justify-center">
            {entry.rank <= 3 ? (
              rankIcons[entry.rank as 1 | 2 | 3]
            ) : (
              <span className="text-sm font-medium text-muted-foreground">#{entry.rank}</span>
            )}
          </div>

          <Avatar className="h-10 w-10">
            <AvatarImage src={entry.avatar || "/placeholder.svg"} />
            <AvatarFallback className="text-xs">
              {entry.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={cn("font-medium truncate", entry.isCurrentUser && "text-primary")}>
                {entry.name}
                {entry.isCurrentUser && <span className="text-xs ml-1">(You)</span>}
              </p>
              <span className="text-sm">{entry.badge}</span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{entry.college}</p>
          </div>

          <div className="text-right">
            <p className="font-bold text-primary">₹{entry.earnings.toLocaleString("en-IN")}</p>
            <p className="text-xs text-muted-foreground">{entry.tasksCompleted} tasks</p>
          </div>
        </div>
      ))}

      {/* Find current user if not in top 5 */}
      {entries.slice(5).find((e) => e.isCurrentUser) && (
        <>
          <div className="flex items-center gap-2 py-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">Your Position</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          {(() => {
            const user = entries.find((e) => e.isCurrentUser)!
            return (
              <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/20 animate-slide-up">
                <div className="w-8 flex justify-center">
                  <span className="text-sm font-medium">#{user.rank}</span>
                </div>
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-primary">{user.name} (You)</p>
                    <span className="text-sm">{user.badge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{user.college}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{user.earnings.toLocaleString("en-IN")}</p>
                  <p className="text-xs text-muted-foreground">{user.tasksCompleted} tasks</p>
                </div>
              </div>
            )
          })()}
        </>
      )}
    </div>
  )

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly" className="mt-0">
            {renderLeaderboard(weeklyLeaderboard)}
          </TabsContent>
          <TabsContent value="alltime" className="mt-0">
            {renderLeaderboard(allTimeLeaderboard)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
