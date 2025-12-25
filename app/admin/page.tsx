"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  ShieldCheck,
  Clock,
  GraduationCap,
  CheckCircle2,
  XCircle,
  Users,
  ClipboardCheck,
  ShieldAlert,
  ArrowLeft,
  LayoutDashboard,
  Lightbulb,
  Plus,
  Activity,
  Eye,
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import {
  getAllUsers,
  updateVerificationStatus,
  updateIdeaStatus,
  createUniversityUpdate,
  createTask,
  subscribeToVerifications,
  subscribeToIdeas,
  type VerificationSubmission,
  type IdeaSubmission,
  type UserProfile,
} from "@/lib/firebase"

type AdminTab = "overview" | "verifications" | "ideas" | "tasks" | "users" | "updates"

const categoryLabels: Record<string, string> = {
  tech: "Technology",
  content: "Content Creation",
  data: "Data Entry",
  research: "Research",
  outreach: "Outreach",
  other: "Other",
}

export default function AdminPage() {
  const { user, profile, loading, isAdmin } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<AdminTab>("overview")
  const [verifications, setVerifications] = useState<VerificationSubmission[]>([])
  const [ideas, setIdeas] = useState<IdeaSubmission[]>([])
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loadingData, setLoadingData] = useState(true)

  // Modals
  const [selectedVerification, setSelectedVerification] = useState<VerificationSubmission | null>(null)
  const [verificationDetailsOpen, setVerificationDetailsOpen] = useState(false)
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmission | null>(null)
  const [ideaDetailsOpen, setIdeaDetailsOpen] = useState(false)
  const [rejectIdeaOpen, setRejectIdeaOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState("")
  const [editPriceOpen, setEditPriceOpen] = useState(false)
  const [editPrice, setEditPrice] = useState("")
  const [editCapacity, setEditCapacity] = useState("")
  const [createUpdateOpen, setCreateUpdateOpen] = useState(false)
  const [updateTitle, setUpdateTitle] = useState("")
  const [updateContent, setUpdateContent] = useState("")
  const [updateCategory, setUpdateCategory] = useState<"announcement" | "event" | "opportunity" | "news">(
    "announcement",
  )

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
      return
    }
    if (!loading && user && !isAdmin) {
      router.push("/dashboard")
    }
  }, [user, loading, isAdmin, router])

  // Subscribe to real-time updates
  useEffect(() => {
    if (!isAdmin) return

    const unsubVerif = subscribeToVerifications((data) => {
      setVerifications(data)
      setLoadingData(false)
    })

    const unsubIdeas = subscribeToIdeas((data) => {
      setIdeas(data)
    })

    // Fetch users and refresh periodically
    const fetchUsers = () => getAllUsers().then(setUsers)
    fetchUsers()
    const userInterval = setInterval(fetchUsers, 10000) // Refresh every 10 seconds

    return () => {
      unsubVerif()
      unsubIdeas()
      clearInterval(userInterval)
    }
  }, [isAdmin])

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
              <ShieldAlert className="h-8 w-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Access Denied</h2>
              <p className="text-muted-foreground mt-1">You don&apos;t have permission to access the admin panel.</p>
            </div>
            <Button asChild className="w-full">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Stats
  const pendingVerifications = verifications.filter((v) => v.status === "under-review").length
  const approvedVerifications = verifications.filter((v) => v.status === "approved").length
  const pendingIdeas = ideas.filter((i) => i.status === "pending").length
  const approvedIdeas = ideas.filter((i) => i.status === "approved").length
  const totalUsers = users.length
  const verifiedUsers = users.filter((u) => u.verificationStatus === "approved").length

  // Handlers
  const handleApproveVerification = async (verification: VerificationSubmission) => {
    if (!profile) return
    await updateVerificationStatus(verification.id, verification.userId, "approved", profile.email || "admin")
    setVerificationDetailsOpen(false)
  }

  const handleRejectVerification = async (verification: VerificationSubmission) => {
    if (!profile) return
    await updateVerificationStatus(verification.id, verification.userId, "rejected", profile.email || "admin")
    setVerificationDetailsOpen(false)
  }

  const handleApproveIdea = async () => {
    if (!selectedIdea || !profile) return
    const price = editPrice ? Number.parseInt(editPrice) : selectedIdea.proposedPrice
    const capacity = editCapacity ? Number.parseInt(editCapacity) : selectedIdea.capacity

    // Update idea status
    await updateIdeaStatus(selectedIdea.id, selectedIdea.userId, "approved", profile.email || "admin", price, capacity)

    // Create a new task from the approved idea
    await createTask({
      title: selectedIdea.title,
      description: selectedIdea.proposedSolution,
      category: selectedIdea.category === "tech" ? "remote" : selectedIdea.category === "data" ? "testing" : "survey",
      reward: price,
      estimatedTime: selectedIdea.estimatedTime,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
      instructions: selectedIdea.deliverables,
      requirements: selectedIdea.skillRequirements,
      capacity: capacity,
      isActive: true,
      createdBy: profile.email || "admin",
    })

    setEditPriceOpen(false)
    setIdeaDetailsOpen(false)
    setEditPrice("")
    setEditCapacity("")
  }

  const handleRejectIdea = async () => {
    if (!selectedIdea || !rejectReason.trim() || !profile) return
    await updateIdeaStatus(
      selectedIdea.id,
      selectedIdea.userId,
      "rejected",
      profile.email || "admin",
      undefined,
      undefined,
      rejectReason.trim(),
    )
    setRejectIdeaOpen(false)
    setIdeaDetailsOpen(false)
    setRejectReason("")
  }

  const openIdeaDetails = (idea: IdeaSubmission) => {
    setSelectedIdea(idea)
    setEditPrice(idea.adminPrice?.toString() || idea.proposedPrice.toString())
    setEditCapacity(idea.adminCapacity?.toString() || idea.capacity.toString())
    setIdeaDetailsOpen(true)
  }

  const handleCreateUpdate = async () => {
    if (!updateTitle || !updateContent || !profile) return
    await createUniversityUpdate({
      title: updateTitle,
      content: updateContent,
      category: updateCategory,
      createdBy: profile.email || "admin",
      isActive: true,
    })
    setCreateUpdateOpen(false)
    setUpdateTitle("")
    setUpdateContent("")
    setUpdateCategory("announcement")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="mr-2">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {profile?.email}
            </Badge>
          </div>
        </div>
      </header>

      <div className="container px-4 py-6">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as AdminTab)}>
          <TabsList className="grid w-full grid-cols-6 mb-6">
            <TabsTrigger value="overview" className="gap-2">
              <LayoutDashboard className="h-4 w-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="verifications" className="gap-2 relative">
              <GraduationCap className="h-4 w-4" />
              <span className="hidden sm:inline">Verify</span>
              {pendingVerifications > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-warning text-[10px] flex items-center justify-center text-warning-foreground">
                  {pendingVerifications}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="ideas" className="gap-2 relative">
              <Lightbulb className="h-4 w-4" />
              <span className="hidden sm:inline">Ideas</span>
              {pendingIdeas > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-warning text-[10px] flex items-center justify-center text-warning-foreground">
                  {pendingIdeas}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="tasks" className="gap-2">
              <ClipboardCheck className="h-4 w-4" />
              <span className="hidden sm:inline">Tasks</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="updates" className="gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">Updates</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-warning/10">
                      <Clock className="h-6 w-6 text-warning" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingVerifications}</p>
                      <p className="text-sm text-muted-foreground">Pending Verifications</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-primary/10">
                      <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingIdeas}</p>
                      <p className="text-sm text-muted-foreground">Pending Ideas</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-chart-2/10">
                      <Users className="h-6 w-6 text-chart-2" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{totalUsers}</p>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-full bg-chart-4/10">
                      <CheckCircle2 className="h-6 w-6 text-chart-4" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{verifiedUsers}</p>
                      <p className="text-sm text-muted-foreground">Verified Users</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Recent Verification Requests
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {verifications
                    .filter((v) => v.status === "under-review")
                    .slice(0, 3)
                    .map((v) => (
                      <div key={v.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={v.selfieUrl || ""} />
                            <AvatarFallback>{v.studentName.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{v.studentName}</p>
                            <p className="text-xs text-muted-foreground">{v.collegeName}</p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVerification(v)
                            setVerificationDetailsOpen(true)
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    ))}
                  {pendingVerifications === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No pending verifications</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Recent Idea Submissions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ideas
                    .filter((i) => i.status === "pending")
                    .slice(0, 3)
                    .map((idea) => (
                      <div key={idea.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium text-sm">{idea.title}</p>
                          <p className="text-xs text-muted-foreground">
                            by {idea.userName} • ₹{idea.proposedPrice}
                          </p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => openIdeaDetails(idea)}>
                          Review
                        </Button>
                      </div>
                    ))}
                  {pendingIdeas === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">No pending ideas</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Verifications Tab */}
          <TabsContent value="verifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Student Verifications</CardTitle>
                <CardDescription>Review and approve student verification requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Student</th>
                        <th className="text-left p-3 text-sm font-medium hidden md:table-cell">College</th>
                        <th className="text-left p-3 text-sm font-medium hidden sm:table-cell">Submitted</th>
                        <th className="text-left p-3 text-sm font-medium">Status</th>
                        <th className="text-right p-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {verifications.map((v) => (
                        <tr key={v.id} className="border-t hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={v.selfieUrl || ""} />
                                <AvatarFallback>{v.studentName.slice(0, 2).toUpperCase()}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{v.studentName}</p>
                                <p className="text-xs text-muted-foreground">{v.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <p className="text-sm">{v.collegeName}</p>
                            <p className="text-xs text-muted-foreground">{v.stream}</p>
                          </td>
                          <td className="p-3 hidden sm:table-cell text-sm text-muted-foreground">
                            {v.submittedAt && new Date(v.submittedAt.seconds * 1000).toLocaleDateString("en-IN")}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="secondary"
                              className={cn(
                                v.status === "under-review" && "bg-warning/10 text-warning",
                                v.status === "approved" && "bg-chart-2/10 text-chart-2",
                                v.status === "rejected" && "bg-destructive/10 text-destructive",
                              )}
                            >
                              {v.status === "under-review" ? "Pending" : v.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedVerification(v)
                                setVerificationDetailsOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {verifications.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No verifications yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Ideas Tab */}
          <TabsContent value="ideas" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Idea Submissions</CardTitle>
                <CardDescription>Review and approve task ideas from students</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">Idea</th>
                        <th className="text-left p-3 text-sm font-medium hidden md:table-cell">Submitted By</th>
                        <th className="text-left p-3 text-sm font-medium hidden sm:table-cell">Price</th>
                        <th className="text-left p-3 text-sm font-medium">Status</th>
                        <th className="text-right p-3 text-sm font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ideas.map((idea) => (
                        <tr key={idea.id} className="border-t hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <p className="font-medium text-sm">{idea.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {categoryLabels[idea.category] || idea.category}
                            </p>
                          </td>
                          <td className="p-3 hidden md:table-cell">
                            <p className="text-sm">{idea.userName}</p>
                            <p className="text-xs text-muted-foreground">{idea.userEmail}</p>
                          </td>
                          <td className="p-3 hidden sm:table-cell text-sm font-medium text-primary">
                            ₹{idea.proposedPrice}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant="secondary"
                              className={cn(
                                idea.status === "pending" && "bg-warning/10 text-warning",
                                idea.status === "approved" && "bg-chart-2/10 text-chart-2",
                                idea.status === "rejected" && "bg-destructive/10 text-destructive",
                                idea.status === "converted" && "bg-primary/10 text-primary",
                              )}
                            >
                              {idea.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right">
                            <Button variant="ghost" size="sm" onClick={() => openIdeaDetails(idea)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                      {ideas.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No ideas submitted yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>All Users</CardTitle>
                <CardDescription>
                  Manage registered users ({totalUsers} total, {verifiedUsers} verified)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left p-3 text-sm font-medium">User</th>
                        <th className="text-left p-3 text-sm font-medium hidden md:table-cell">College</th>
                        <th className="text-left p-3 text-sm font-medium">Verification</th>
                        <th className="text-left p-3 text-sm font-medium hidden sm:table-cell">Tasks</th>
                        <th className="text-left p-3 text-sm font-medium hidden sm:table-cell">Earnings</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id} className="border-t hover:bg-muted/30 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={u.avatar || ""} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                  {u.name?.slice(0, 2).toUpperCase() || u.email?.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{u.name || "No name"}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 hidden md:table-cell text-sm">{u.college || "-"}</td>
                          <td className="p-3">
                            <Badge
                              variant="secondary"
                              className={cn(
                                u.verificationStatus === "approved" && "bg-chart-2/10 text-chart-2",
                                u.verificationStatus === "under-review" && "bg-warning/10 text-warning",
                                (u.verificationStatus === "not-submitted" || u.verificationStatus === "rejected") &&
                                  "bg-muted text-muted-foreground",
                              )}
                            >
                              {u.verificationStatus}
                            </Badge>
                          </td>
                          <td className="p-3 hidden sm:table-cell text-sm">{u.tasksCompleted}</td>
                          <td className="p-3 hidden sm:table-cell text-sm font-medium text-primary">
                          <td className="p-3 hidden sm:table-cell text-sm font-medium text-primary">
  ₹{Number(u.totalEarnings ?? 0).toLocaleString("en-IN")}
</td>

                          </td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-muted-foreground">
                            No users registered yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Updates Tab */}
          <TabsContent value="updates" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>University Updates</CardTitle>
                  <CardDescription>Create and manage university announcements</CardDescription>
                </div>
                <Button onClick={() => setCreateUpdateOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  New Update
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Create updates to notify all students about important announcements, events, and opportunities.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Task Management</CardTitle>
                <CardDescription>Tasks are automatically created when you approve ideas</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground text-center py-8">
                  Approve ideas from the Ideas tab to automatically create new tasks for students.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Verification Details Modal */}
      <Dialog open={verificationDetailsOpen} onOpenChange={setVerificationDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Verification Details</DialogTitle>
            <DialogDescription>Review student verification submission</DialogDescription>
          </DialogHeader>
          {selectedVerification && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedVerification.selfieUrl || ""} />
                  <AvatarFallback>{selectedVerification.studentName.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{selectedVerification.studentName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedVerification.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">College</p>
                  <p className="font-medium">{selectedVerification.collegeName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Enrollment</p>
                  <p className="font-medium">{selectedVerification.enrollmentNumber}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Year</p>
                  <p className="font-medium">{selectedVerification.year}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Stream</p>
                  <p className="font-medium">{selectedVerification.stream}</p>
                </div>
              </div>

              {selectedVerification.idCardUrl && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">ID Card</p>
                  <img
                    src={selectedVerification.idCardUrl || "/placeholder.svg"}
                    alt="ID Card"
                    className="max-w-full rounded-lg border"
                  />
                </div>
              )}

              {selectedVerification.status === "under-review" && (
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => handleRejectVerification(selectedVerification)}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button onClick={() => handleApproveVerification(selectedVerification)}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Idea Details Modal */}
      <Dialog open={ideaDetailsOpen} onOpenChange={setIdeaDetailsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Idea Details</DialogTitle>
            <DialogDescription>Review submitted task idea</DialogDescription>
          </DialogHeader>
          {selectedIdea && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold">{selectedIdea.title}</h3>
                <p className="text-sm text-muted-foreground">
                  by {selectedIdea.userName} • {categoryLabels[selectedIdea.category] || selectedIdea.category}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Problem Statement</p>
                <p className="text-sm">{selectedIdea.problemStatement}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Proposed Solution</p>
                <p className="text-sm">{selectedIdea.proposedSolution}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Proposed Price</p>
                  <p className="font-medium">₹{selectedIdea.proposedPrice}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Capacity</p>
                  <p className="font-medium">{selectedIdea.capacity} students</p>
                </div>
              </div>

              {selectedIdea.status === "pending" && (
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setRejectIdeaOpen(true)}>
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                  <Button onClick={() => setEditPriceOpen(true)}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                </DialogFooter>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Idea with Price Modal */}
      <Dialog open={editPriceOpen} onOpenChange={setEditPriceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Task Price & Capacity</DialogTitle>
            <DialogDescription>
              Adjust the price and capacity before approving. This will create a new task.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input type="number" value={editPrice} onChange={(e) => setEditPrice(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Capacity (students)</Label>
              <Input type="number" value={editCapacity} onChange={(e) => setEditCapacity(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPriceOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleApproveIdea}>Approve & Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Idea Modal */}
      <Dialog open={rejectIdeaOpen} onOpenChange={setRejectIdeaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Idea</DialogTitle>
            <DialogDescription>Provide a reason for rejection</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Rejection Reason</Label>
              <Textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Explain why this idea is being rejected..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectIdeaOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectIdea} disabled={!rejectReason.trim()}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create University Update Modal */}
      <Dialog open={createUpdateOpen} onOpenChange={setCreateUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create University Update</DialogTitle>
            <DialogDescription>Create a new announcement for all students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={updateCategory} onValueChange={(v) => setUpdateCategory(v as typeof updateCategory)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="announcement">Announcement</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="opportunity">Opportunity</SelectItem>
                  <SelectItem value="news">News</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={updateTitle} onChange={(e) => setUpdateTitle(e.target.value)} placeholder="Update title" />
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea
                value={updateContent}
                onChange={(e) => setUpdateContent(e.target.value)}
                placeholder="Write your update content..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateUpdateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateUpdate} disabled={!updateTitle || !updateContent}>
              Publish Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
