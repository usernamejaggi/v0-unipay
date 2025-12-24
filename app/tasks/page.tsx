"use client"

import { useState, useMemo, useEffect } from "react"
import { TaskCard } from "@/components/tasks/task-card"
import { TaskFilters } from "@/components/tasks/task-filters"
import { TaskDetailsModal } from "@/components/tasks/task-details-modal"
import { FreeTasksBanner } from "@/components/subscription/free-tasks-banner"
import { VerificationStatusBanner } from "@/components/verification/verification-status-banner"
import { VerificationModal } from "@/components/verification/verification-modal"
import { SubscriptionModal } from "@/components/subscription/subscription-modal"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListTodo, Grid3X3, List } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { subscribeToTasks, type Task } from "@/lib/firebase"

export default function TasksPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [verificationOpen, setVerificationOpen] = useState(false)
  const [subscriptionOpen, setSubscriptionOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const unsubscribe = subscribeToTasks((data) => {
      setTasks(data)
    })
    return () => unsubscribe()
  }, [])

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === "all" || task.category === category
      return matchesSearch && matchesCategory
    })
  }, [search, category, tasks])

  const handleViewDetails = (task: Task) => {
    if (profile?.verificationStatus !== "approved") {
      setVerificationOpen(true)
      return
    }

    // Check if subscription needed
    if (profile?.subscription === "free" && profile?.freeTasksUsed >= profile?.totalFreeTasks) {
      setSubscriptionOpen(true)
      return
    }

    setSelectedTask(task)
    setModalOpen(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!profile) return null

  const availableCount = tasks.length

  return (
    <div className="space-y-6">
      <VerificationStatusBanner status={profile.verificationStatus} onVerifyClick={() => setVerificationOpen(true)} />

      {profile.verificationStatus === "approved" && <FreeTasksBanner />}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slide-up">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">Available Tasks</h1>
            <Badge variant="secondary" className="bg-primary/10 text-primary animate-pulse-slow">
              {availableCount} available
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">Browse and apply for tasks that match your skills</p>
        </div>
        <Card className="bg-secondary border-none transition-all duration-300 hover:shadow-md hover:scale-[1.02]">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-full bg-primary/10 animate-pulse-slow">
              <ListTodo className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">Total earnings potential</p>
              <p className="text-lg font-bold text-primary">
                ₹{tasks.reduce((sum, t) => sum + t.reward, 0).toLocaleString("en-IN")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 animate-slide-up stagger-1">
        <TaskFilters
          search={search}
          onSearchChange={setSearch}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
        />
        <Tabs value={view} onValueChange={(v) => setView(v as "grid" | "list")} className="hidden md:block">
          <TabsList>
            <TabsTrigger value="grid" className="gap-2">
              <Grid3X3 className="h-4 w-4" />
              Grid
            </TabsTrigger>
            <TabsTrigger value="list" className="gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tasks Grid/List */}
      {filteredTasks.length === 0 ? (
        <Card className="animate-scale-up">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ListTodo className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg">No tasks found</h3>
            <p className="text-sm text-muted-foreground">
              {tasks.length === 0 ? "Tasks will appear here when available" : "Try adjusting your filters"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className={view === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-4" : "flex flex-col gap-4"}>
          {filteredTasks.map((task, index) => (
            <TaskCard
              key={task.id}
              task={{
                ...task,
                id: task.id,
                status: "available",
                isAvailableForStudent: profile.verificationStatus === "approved",
              }}
              onViewDetails={() => handleViewDetails(task)}
              index={index}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <TaskDetailsModal
        task={
          selectedTask
            ? {
                ...selectedTask,
                id: selectedTask.id,
                status: "available",
                isAvailableForStudent: profile.verificationStatus === "approved",
              }
            : null
        }
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
      <VerificationModal open={verificationOpen} onOpenChange={setVerificationOpen} />
      <SubscriptionModal open={subscriptionOpen} onOpenChange={setSubscriptionOpen} trigger="free-limit" />
    </div>
  )
}
