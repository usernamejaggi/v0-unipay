"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Briefcase, Shield, CreditCard, ArrowLeft, CheckCheck } from "lucide-react"
import Link from "next/link"
import { markNotificationRead, markAllNotificationsRead, type Notification } from "@/lib/firebase"
import { cn } from "@/lib/utils"

export default function NotificationsPage() {
  const { user, profile, notifications, loading } = useAuth()
  const router = useRouter()
  const [filter, setFilter] = useState<"all" | "unread" | "task" | "verification" | "payment">("all")

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true
    if (filter === "unread") return !n.read
    return n.type === filter
  })

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task":
        return <Briefcase className="h-5 w-5 text-primary" />
      case "verification":
        return <Shield className="h-5 w-5 text-warning" />
      case "payment":
        return <CreditCard className="h-5 w-5 text-success" />
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />
    }
  }

  const handleMarkRead = async (notificationId: string) => {
    await markNotificationRead(notificationId)
  }

  const handleMarkAllRead = async () => {
    if (user) {
      await markAllNotificationsRead(user.uid)
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-bold">Notifications</h1>
              <p className="text-xs text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up!"}
              </p>
            </div>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={handleMarkAllRead} className="gap-2 bg-transparent">
              <CheckCheck className="h-4 w-4" />
              Mark all read
            </Button>
          )}
        </div>
      </header>

      <div className="container px-4 py-6 max-w-3xl mx-auto">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread" className="relative">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="task">Tasks</TabsTrigger>
            <TabsTrigger value="verification">Verify</TabsTrigger>
            <TabsTrigger value="payment">Payments</TabsTrigger>
          </TabsList>

          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Bell className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No notifications</h3>
                  <p className="text-sm text-muted-foreground">
                    {filter === "unread" ? "You're all caught up!" : "No notifications in this category"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              filteredNotifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={cn(
                    "cursor-pointer transition-all hover:border-primary/50",
                    !notification.read && "bg-primary/5 border-primary/20",
                  )}
                  onClick={() => {
                    handleMarkRead(notification.id)
                    if (notification.link) {
                      router.push(notification.link)
                    }
                  }}
                >
                  <CardContent className="flex items-start gap-4 p-4">
                    <div
                      className={cn(
                        "p-2 rounded-full",
                        notification.type === "task" && "bg-primary/10",
                        notification.type === "verification" && "bg-warning/10",
                        notification.type === "payment" && "bg-success/10",
                        notification.type === "system" && "bg-muted",
                      )}
                    >
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={cn("font-medium text-sm", !notification.read && "font-semibold")}>
                          {notification.title}
                        </h4>
                        {!notification.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification.createdAt &&
                          new Date(notification.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
