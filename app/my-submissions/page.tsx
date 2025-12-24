"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Lightbulb,
  IndianRupee,
  Users,
  Calendar,
  AlertCircle,
  Plus,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { getUserIdeas, type IdeaSubmission } from "@/lib/firebase"

const categoryLabels: Record<string, string> = {
  tech: "Technology",
  content: "Content Creation",
  data: "Data Entry",
  research: "Research",
  outreach: "Outreach",
  other: "Other",
}

export default function MySubmissionsPage() {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [submissions, setSubmissions] = useState<IdeaSubmission[]>([])
  const [selectedIdea, setSelectedIdea] = useState<IdeaSubmission | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [loadingSubmissions, setLoadingSubmissions] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (user) {
        const ideas = await getUserIdeas(user.uid)
        setSubmissions(ideas)
        setLoadingSubmissions(false)
      }
    }
    fetchSubmissions()
  }, [user])

  if (loading || loadingSubmissions) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  const pendingCount = submissions.filter((s) => s.status === "pending").length
  const approvedCount = submissions.filter((s) => s.status === "approved" || s.status === "converted").length
  const rejectedCount = submissions.filter((s) => s.status === "rejected").length

  const getStatusBadge = (status: IdeaSubmission["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className="bg-warning/10 text-warning gap-1">
            <Clock className="h-3 w-3" />
            Pending Review
          </Badge>
        )
      case "approved":
        return (
          <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
            <CheckCircle2 className="h-3 w-3" />
            Approved
          </Badge>
        )
      case "converted":
        return (
          <Badge variant="secondary" className="bg-chart-2/10 text-chart-2 gap-1">
            <ArrowRight className="h-3 w-3" />
            Live Task
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="secondary" className="bg-destructive/10 text-destructive gap-1">
            <XCircle className="h-3 w-3" />
            Rejected
          </Badge>
        )
    }
  }

  const viewDetails = (idea: IdeaSubmission) => {
    setSelectedIdea(idea)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            My Submissions
          </h1>
          <p className="text-muted-foreground mt-1">Track the status of your submitted ideas</p>
        </div>
        <Button asChild>
          <Link href="/submit-idea">
            <Plus className="h-4 w-4 mr-2" />
            Submit New Idea
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-full bg-warning/10">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingCount}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-full bg-primary/10">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedCount}</p>
              <p className="text-xs text-muted-foreground">Approved</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-full bg-destructive/10">
              <XCircle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedCount}</p>
              <p className="text-xs text-muted-foreground">Rejected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions List */}
      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          <CardDescription>All ideas you have submitted to UniPay</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Lightbulb className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold">No submissions yet</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Submit your first idea to see it here</p>
              <Button asChild>
                <Link href="/submit-idea">Submit an Idea</Link>
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="all">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All ({submissions.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedCount})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
              </TabsList>

              {["all", "pending", "approved", "rejected"].map((tab) => (
                <TabsContent key={tab} value={tab} className="space-y-3">
                  {submissions
                    .filter((s) => {
                      if (tab === "all") return true
                      if (tab === "approved") return s.status === "approved" || s.status === "converted"
                      return s.status === tab
                    })
                    .map((submission) => (
                      <div
                        key={submission.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{submission.title}</h3>
                            {getStatusBadge(submission.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Badge variant="outline" className="text-xs">
                                {categoryLabels[submission.category] || submission.category}
                              </Badge>
                            </span>
                            <span className="flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />
                              {submission.adminPrice ?? submission.proposedPrice}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {submission.adminCapacity ?? submission.capacity}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {submission.submittedAt &&
                                new Date(submission.submittedAt.seconds * 1000).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => viewDetails(submission)}>
                          View Details
                        </Button>
                      </div>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedIdea && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-primary" />
                  {selectedIdea.title}
                </DialogTitle>
                <DialogDescription className="flex items-center gap-2">
                  {getStatusBadge(selectedIdea.status)}
                  <span>
                    Submitted on{" "}
                    {selectedIdea.submittedAt &&
                      new Date(selectedIdea.submittedAt.seconds * 1000).toLocaleDateString("en-IN")}
                  </span>
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Rejection Reason */}
                {selectedIdea.status === "rejected" && selectedIdea.rejectionReason && (
                  <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-medium text-destructive">Rejection Reason</p>
                        <p className="text-sm text-muted-foreground mt-1">{selectedIdea.rejectionReason}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price/Capacity Changes */}
                {selectedIdea.status === "approved" &&
                  (selectedIdea.adminPrice !== selectedIdea.proposedPrice ||
                    selectedIdea.adminCapacity !== selectedIdea.capacity) && (
                    <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                      <p className="font-medium text-primary mb-2">Admin Modifications</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        {selectedIdea.adminPrice !== selectedIdea.proposedPrice && (
                          <div>
                            <span className="text-muted-foreground">Price changed:</span>
                            <span className="ml-2">
                              <span className="line-through text-muted-foreground">₹{selectedIdea.proposedPrice}</span>
                              <span className="ml-1 font-medium">→ ₹{selectedIdea.adminPrice}</span>
                            </span>
                          </div>
                        )}
                        {selectedIdea.adminCapacity !== selectedIdea.capacity && (
                          <div>
                            <span className="text-muted-foreground">Capacity changed:</span>
                            <span className="ml-2">
                              <span className="line-through text-muted-foreground">{selectedIdea.capacity}</span>
                              <span className="ml-1 font-medium">→ {selectedIdea.adminCapacity}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                {/* Details Grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Category</p>
                    <p className="font-medium">{categoryLabels[selectedIdea.category] || selectedIdea.category}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Estimated Time</p>
                    <p className="font-medium">{selectedIdea.estimatedTime}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Price per Task</p>
                    <p className="font-medium">₹{selectedIdea.adminPrice ?? selectedIdea.proposedPrice}</p>
                  </div>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground">Participants</p>
                    <p className="font-medium">{selectedIdea.adminCapacity ?? selectedIdea.capacity}</p>
                  </div>
                </div>

                {/* Problem & Solution */}
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium mb-1">Problem Statement</p>
                    <p className="text-sm text-muted-foreground">{selectedIdea.problemStatement}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-1">Proposed Solution</p>
                    <p className="text-sm text-muted-foreground">{selectedIdea.proposedSolution}</p>
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <p className="text-sm font-medium mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedIdea.skillRequirements.map((skill) => (
                      <Badge key={skill} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Deliverables */}
                <div>
                  <p className="text-sm font-medium mb-2">Expected Deliverables</p>
                  <ul className="space-y-1">
                    {selectedIdea.deliverables.map((d, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {selectedIdea.status === "rejected" && (
                <div className="flex justify-end pt-4 border-t">
                  <Button asChild>
                    <Link href="/submit-idea">Resubmit with Revisions</Link>
                  </Button>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
