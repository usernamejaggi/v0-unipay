"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Megaphone, Calendar, Sparkles, Newspaper, ArrowLeft, GraduationCap } from "lucide-react"
import Link from "next/link"
import { getUniversityUpdates, type UniversityUpdate } from "@/lib/firebase"
import { cn } from "@/lib/utils"

export default function UniversityUpdatesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [updates, setUpdates] = useState<UniversityUpdate[]>([])
  const [filter, setFilter] = useState<"all" | "announcement" | "event" | "opportunity" | "news">("all")
  const [loadingUpdates, setLoadingUpdates] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchUpdates = async () => {
      const data = await getUniversityUpdates()
      setUpdates(data)
      setLoadingUpdates(false)
    }
    fetchUpdates()
  }, [])

  if (loading || loadingUpdates) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const filteredUpdates = updates.filter((u) => {
    if (filter === "all") return true
    return u.category === filter
  })

  const getIcon = (category: UniversityUpdate["category"]) => {
    switch (category) {
      case "announcement":
        return <Megaphone className="h-5 w-5 text-primary" />
      case "event":
        return <Calendar className="h-5 w-5 text-warning" />
      case "opportunity":
        return <Sparkles className="h-5 w-5 text-success" />
      case "news":
        return <Newspaper className="h-5 w-5 text-info" />
      default:
        return <GraduationCap className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getCategoryColor = (category: UniversityUpdate["category"]) => {
    switch (category) {
      case "announcement":
        return "bg-primary/10 text-primary"
      case "event":
        return "bg-warning/10 text-warning"
      case "opportunity":
        return "bg-success/10 text-success"
      case "news":
        return "bg-info/10 text-info"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  // Sample updates if no Firebase data
  const sampleUpdates: UniversityUpdate[] = [
    {
      id: "1",
      title: "Winter Vacation Schedule 2025",
      content:
        "The university will remain closed from December 25, 2025 to January 2, 2026 for winter break. All pending assignments must be submitted before December 24.",
      category: "announcement",
      createdAt: { seconds: Date.now() / 1000 - 86400 } as any,
      createdBy: "admin",
      isActive: true,
    },
    {
      id: "2",
      title: "Tech Fest 2025 Registration Open",
      content:
        "Annual tech fest registrations are now open. Participate in coding competitions, hackathons, and workshops. Register by January 15, 2025.",
      category: "event",
      createdAt: { seconds: Date.now() / 1000 - 172800 } as any,
      createdBy: "admin",
      isActive: true,
    },
    {
      id: "3",
      title: "Internship Fair - Top Companies",
      content:
        "Over 50 companies including Google, Microsoft, and Amazon will be visiting campus for internship recruitment. Prepare your resumes!",
      category: "opportunity",
      createdAt: { seconds: Date.now() / 1000 - 259200 } as any,
      createdBy: "admin",
      isActive: true,
    },
    {
      id: "4",
      title: "New Library Hours",
      content: "The central library will now remain open 24/7 during exam season. Access requires valid student ID.",
      category: "news",
      createdAt: { seconds: Date.now() / 1000 - 345600 } as any,
      createdBy: "admin",
      isActive: true,
    },
  ]

  const displayUpdates =
    filteredUpdates.length > 0
      ? filteredUpdates
      : sampleUpdates.filter((u) => {
          if (filter === "all") return true
          return u.category === filter
        })

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
              <h1 className="text-lg font-bold">University Updates</h1>
              <p className="text-xs text-muted-foreground">Stay informed about campus news</p>
            </div>
          </div>
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
      </header>

      <div className="container px-4 py-6 max-w-3xl mx-auto">
        <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="announcement">Announce</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="opportunity">Opportunity</TabsTrigger>
            <TabsTrigger value="news">News</TabsTrigger>
          </TabsList>

          <div className="space-y-4">
            {displayUpdates.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <GraduationCap className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="font-semibold text-lg">No updates</h3>
                  <p className="text-sm text-muted-foreground">Check back later for new updates</p>
                </CardContent>
              </Card>
            ) : (
              displayUpdates.map((update) => (
                <Card key={update.id} className="overflow-hidden">
                  <div
                    className={cn("h-1", getCategoryColor(update.category).replace("text-", "bg-").replace("/10", ""))}
                  />
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-full", getCategoryColor(update.category))}>
                          {getIcon(update.category)}
                        </div>
                        <div>
                          <CardTitle className="text-lg">{update.title}</CardTitle>
                          <CardDescription>
                            {update.createdAt &&
                              new Date(update.createdAt.seconds * 1000).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              })}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge variant="secondary" className={getCategoryColor(update.category)}>
                        {update.category.charAt(0).toUpperCase() + update.category.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{update.content}</p>
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
