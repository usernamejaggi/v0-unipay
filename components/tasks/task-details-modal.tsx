"use client"

import type { Task } from "@/lib/task-data"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Clock, IndianRupee, Calendar, CheckCircle2, AlertCircle, Send, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface TaskDetailsModalProps {
  task: Task | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusStyles = {
  available: { bg: "bg-primary/10", text: "text-primary", label: "Available", icon: CheckCircle2 },
  applied: { bg: "bg-warning/10", text: "text-warning-foreground", label: "Applied", icon: Clock },
  approved: { bg: "bg-chart-2/10", text: "text-chart-2", label: "Approved", icon: CheckCircle2 },
  rejected: { bg: "bg-destructive/10", text: "text-destructive", label: "Rejected", icon: AlertCircle },
  completed: { bg: "bg-muted", text: "text-muted-foreground", label: "Completed", icon: CheckCircle2 },
}

export function TaskDetailsModal({ task, open, onOpenChange }: TaskDetailsModalProps) {
  const [isApplying, setIsApplying] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!task) return null

  const statusStyle = statusStyles[task.status]
  const StatusIcon = statusStyle.icon

  const handleApply = () => {
    setIsApplying(true)
    setTimeout(() => {
      setIsApplying(false)
      onOpenChange(false)
    }, 1500)
  }

  const handleSubmit = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onOpenChange(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="secondary" className="capitalize">
              {task.category}
            </Badge>
            <Badge variant="secondary" className={cn("gap-1", statusStyle.bg, statusStyle.text)}>
              <StatusIcon className="h-3 w-3" />
              {statusStyle.label}
            </Badge>
          </div>
          <DialogTitle className="text-xl">{task.title}</DialogTitle>
          <DialogDescription className="text-base">{task.description}</DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-6 py-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <IndianRupee className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Reward</p>
              <p className="font-semibold">₹{task.reward}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted">
              <Clock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Duration</p>
              <p className="font-semibold">{task.estimatedTime}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-muted">
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Deadline</p>
              <p className="font-semibold">
                {new Date(task.deadline).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-4 py-4">
          <div>
            <h4 className="font-semibold mb-2">Instructions</h4>
            <ol className="space-y-2">
              {task.instructions.map((instruction, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium flex items-center justify-center">
                    {index + 1}
                  </span>
                  {instruction}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Requirements</h4>
            <ul className="space-y-1.5">
              {task.requirements.map((req, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          {task.status === "available" && (
            <Button onClick={handleApply} disabled={isApplying}>
              {isApplying ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Applying...
                </>
              ) : (
                "Apply for Task"
              )}
            </Button>
          )}
          {task.status === "approved" && (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Work
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
