"use client"

import type { Task } from "@/lib/task-data"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, IndianRupee, Calendar, FlaskConical, ClipboardList, Laptop, Lock } from "lucide-react"
import { cn } from "@/lib/utils"
import { currentStudent, getTaskLockReason } from "@/lib/student-state"

interface TaskCardProps {
  task: Task
  onViewDetails: (task: Task) => void
  index?: number
}

const categoryIcons = {
  testing: FlaskConical,
  survey: ClipboardList,
  remote: Laptop,
}

const categoryColors = {
  testing: "bg-chart-1/10 text-chart-1",
  survey: "bg-chart-2/10 text-chart-2",
  remote: "bg-chart-4/10 text-chart-4",
}

const statusStyles = {
  available: { bg: "bg-primary/10", text: "text-primary", label: "Available" },
  applied: { bg: "bg-warning/10", text: "text-warning-foreground", label: "Applied" },
  approved: { bg: "bg-chart-2/10", text: "text-chart-2", label: "Approved" },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", label: "Rejected" },
  completed: { bg: "bg-muted", text: "text-muted-foreground", label: "Completed" },
}

export function TaskCard({ task, onViewDetails, index = 0 }: TaskCardProps) {
  const CategoryIcon = categoryIcons[task.category]
  const statusStyle = statusStyles[task.status]

  const lockReason = getTaskLockReason(currentStudent)
  const isLocked = !!lockReason && task.status === "available"
  const isDisabled = !task.isAvailableForStudent || isLocked

  return (
    <Card
      className={cn(
        "group transition-all duration-300 hover:shadow-lg hover:scale-[1.02] animate-slide-up",
        isDisabled && "opacity-60",
      )}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "p-2 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
                categoryColors[task.category],
              )}
            >
              <CategoryIcon className="h-4 w-4" />
            </div>
            <Badge variant="secondary" className="capitalize text-xs">
              {task.category}
            </Badge>
          </div>
          <Badge variant="secondary" className={cn("text-xs", statusStyle.bg, statusStyle.text)}>
            {statusStyle.label}
          </Badge>
        </div>
        <h3 className="font-semibold text-base mt-3 line-clamp-2 group-hover:text-primary transition-colors">
          {task.title}
        </h3>
      </CardHeader>

      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{task.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{new Date(task.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-1 text-lg font-bold text-primary group-hover:animate-pulse-slow">
          <IndianRupee className="h-5 w-5" />
          {task.reward}
        </div>

        {isLocked ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="sm" variant="secondary" disabled className="gap-1">
                  <Lock className="h-3 w-3" />
                  Locked
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{lockReason}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            size="sm"
            variant={isDisabled ? "secondary" : "default"}
            disabled={isDisabled}
            onClick={() => onViewDetails(task)}
            className="transition-transform duration-300 hover:scale-105"
          >
            {isDisabled ? "Not Available" : "View Details"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
