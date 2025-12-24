"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getCurrentLevel, getNextLevel, getLevelProgress, levels } from "@/lib/levels-data"
import { cn } from "@/lib/utils"
import { ChevronRight, Sparkles } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface LevelCardProps {
  tasksCompleted: number
}

export function LevelCard({ tasksCompleted }: LevelCardProps) {
  const currentLevel = getCurrentLevel(tasksCompleted)
  const nextLevel = getNextLevel(tasksCompleted)
  const progress = getLevelProgress(tasksCompleted)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Card className="cursor-pointer group hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Current Level
              </span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <div className={cn("text-3xl animate-float", currentLevel.color.includes("gradient") && "bg-clip-text")}>
                {currentLevel.badge}
              </div>
              <div>
                <p className="font-bold text-lg">{currentLevel.name}</p>
                <p className="text-sm text-muted-foreground">
                  {currentLevel.rewardMultiplier > 1 &&
                    `+${((currentLevel.rewardMultiplier - 1) * 100).toFixed(0)}% bonus`}
                </p>
              </div>
            </div>

            {nextLevel && (
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Progress to {nextLevel.name}</span>
                  <span className="font-medium">
                    {tasksCompleted} / {nextLevel.minTasks} tasks
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Level System</DialogTitle>
          <DialogDescription>Complete more tasks to level up and unlock perks</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {levels.map((level, index) => {
            const isCurrentLevel = level.id === currentLevel.id
            const isUnlocked = tasksCompleted >= level.minTasks

            return (
              <div
                key={level.id}
                className={cn(
                  "p-4 rounded-lg border transition-all duration-300",
                  isCurrentLevel && "border-primary bg-primary/5 ring-2 ring-primary/20",
                  !isUnlocked && "opacity-50",
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{level.badge}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{level.name}</h4>
                      {isCurrentLevel && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                          Current
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {level.minTasks === 0 ? "Starting level" : `${level.minTasks}+ tasks completed`}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {level.perks.map((perk) => (
                        <Badge key={perk} variant="outline" className="text-xs font-normal">
                          {perk}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={cn("font-bold", level.rewardMultiplier > 1 ? "text-primary" : "text-muted-foreground")}
                    >
                      {level.rewardMultiplier > 1 ? `+${((level.rewardMultiplier - 1) * 100).toFixed(0)}%` : "-"}
                    </p>
                    <p className="text-xs text-muted-foreground">bonus</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
