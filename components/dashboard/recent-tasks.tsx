"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Clock, IndianRupee, ListTodo } from "lucide-react"
import Link from "next/link"
import { subscribeToTasks, type Task } from "@/lib/firebase"

const statusStyles = {
  available: "bg-primary/10 text-primary",
  applied: "bg-warning/10 text-warning-foreground",
  completed: "bg-chart-2/10 text-chart-2",
}

export function RecentTasks() {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    const unsubscribe = subscribeToTasks((data) => {
      setTasks(data.slice(0, 4)) // Only show first 4
    })
    return () => unsubscribe()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Recent Tasks</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/tasks" className="text-primary">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <ListTodo className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No tasks available yet</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-sm truncate">{task.title}</h4>
                  <Badge variant="secondary" className={statusStyles.available}>
                    available
                  </Badge>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="capitalize">{task.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {task.estimatedTime}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 font-semibold text-primary">
                <IndianRupee className="h-4 w-4" />
                {task.reward}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
