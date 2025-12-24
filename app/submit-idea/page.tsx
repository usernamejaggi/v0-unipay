"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Lightbulb,
  AlertCircle,
  Plus,
  X,
  Upload,
  CheckCircle2,
  Clock,
  IndianRupee,
  Users,
  FileText,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { submitIdea } from "@/lib/firebase"

const categoryLabels: Record<string, string> = {
  tech: "Technology",
  content: "Content Creation",
  data: "Data Entry",
  research: "Research",
  outreach: "Outreach",
  other: "Other",
}

const timeEstimates = [
  { value: "15 mins", label: "15 minutes" },
  { value: "30 mins", label: "30 minutes" },
  { value: "1 hour", label: "1 hour" },
  { value: "2 hours", label: "2 hours" },
  { value: "3+ hours", label: "3+ hours" },
]

const skillOptions = [
  "Content Writing",
  "Data Entry",
  "Social Media",
  "Video Editing",
  "Graphic Design",
  "Translation",
  "Transcription",
  "Web Research",
  "Testing & QA",
  "Survey Taking",
  "Customer Support",
  "Coding",
  "SEO",
  "Excel/Sheets",
  "Presentation Design",
]

type IdeaCategory = "tech" | "content" | "data" | "research" | "outreach" | "other"

export default function SubmitIdeaPage() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form state
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<IdeaCategory | "">("")
  const [problemStatement, setProblemStatement] = useState("")
  const [proposedSolution, setProposedSolution] = useState("")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [estimatedTime, setEstimatedTime] = useState("")
  const [proposedPrice, setProposedPrice] = useState("")
  const [capacity, setCapacity] = useState("")
  const [deliverables, setDeliverables] = useState<string[]>([""])
  const [guidelinesAccepted, setGuidelinesAccepted] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const addDeliverable = () => {
    setDeliverables((prev) => [...prev, ""])
  }

  const removeDeliverable = (index: number) => {
    setDeliverables((prev) => prev.filter((_, i) => i !== index))
  }

  const updateDeliverable = (index: number, value: string) => {
    setDeliverables((prev) => prev.map((d, i) => (i === index ? value : d)))
  }

  const isFormValid = () => {
    return (
      title.trim() &&
      category &&
      problemStatement.trim() &&
      proposedSolution.trim() &&
      selectedSkills.length > 0 &&
      estimatedTime &&
      proposedPrice &&
      Number.parseInt(proposedPrice) > 0 &&
      capacity &&
      Number.parseInt(capacity) > 0 &&
      deliverables.filter((d) => d.trim()).length > 0 &&
      guidelinesAccepted
    )
  }

  const handleSubmit = async () => {
    if (!isFormValid() || !user || !profile) return

    setIsSubmitting(true)

    const result = await submitIdea({
      userId: user.uid,
      userName: profile.name || profile.email?.split("@")[0] || "User",
      userEmail: profile.email || "",
      title: title.trim(),
      category: category as IdeaCategory,
      problemStatement: problemStatement.trim(),
      proposedSolution: proposedSolution.trim(),
      skillRequirements: selectedSkills,
      estimatedTime,
      proposedPrice: Number.parseInt(proposedPrice),
      capacity: Number.parseInt(capacity),
      deliverables: deliverables.filter((d) => d.trim()),
    })

    setIsSubmitting(false)

    if (!result.error) {
      setSubmitted(true)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-primary/20">
          <CardContent className="pt-12 pb-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Idea Submitted Successfully</h2>
              <p className="text-muted-foreground mt-2">
                Your idea has been submitted for review. Our team will evaluate it within 2-3 business days.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              Status:{" "}
              <Badge variant="secondary" className="bg-warning/10 text-warning">
                Pending Review
              </Badge>
            </div>
            <div className="flex gap-3 justify-center pt-4">
              <Button variant="outline" onClick={() => router.push("/my-submissions")}>
                View My Submissions
              </Button>
              <Button
                onClick={() => {
                  setSubmitted(false)
                  setTitle("")
                  setCategory("")
                  setProblemStatement("")
                  setProposedSolution("")
                  setSelectedSkills([])
                  setEstimatedTime("")
                  setProposedPrice("")
                  setCapacity("")
                  setDeliverables([""])
                  setGuidelinesAccepted(false)
                }}
              >
                Submit Another Idea
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          Submit Your Idea
        </h1>
        <p className="text-muted-foreground mt-1">
          Propose a task idea for the UniPay community. Approved ideas become live tasks.
        </p>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Idea Details</CardTitle>
          <CardDescription>Fill in the details of your proposed task. Be specific and actionable.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">
              Idea Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g., Campus Event Photography"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground">{title.length}/100 characters</p>
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label>
              Category <span className="text-destructive">*</span>
            </Label>
            <Select value={category} onValueChange={(v) => setCategory(v as IdeaCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Problem Statement */}
          <div className="space-y-2">
            <Label htmlFor="problem">
              Problem Statement <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="problem"
              placeholder="What problem does this task solve? Who benefits from it?"
              value={problemStatement}
              onChange={(e) => setProblemStatement(e.target.value)}
              rows={3}
            />
          </div>

          {/* Proposed Solution */}
          <div className="space-y-2">
            <Label htmlFor="solution">
              Proposed Solution / Task Description <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="solution"
              placeholder="Describe how the task should be executed. What are the steps involved?"
              value={proposedSolution}
              onChange={(e) => setProposedSolution(e.target.value)}
              rows={4}
            />
          </div>

          {/* Skill Requirements */}
          <div className="space-y-2">
            <Label>
              Required Skills <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mb-2">Select skills needed to complete this task</p>
            <div className="flex flex-wrap gap-2">
              {skillOptions.map((skill) => (
                <Badge
                  key={skill}
                  variant={selectedSkills.includes(skill) ? "default" : "outline"}
                  className={cn(
                    "cursor-pointer transition-all duration-200",
                    selectedSkills.includes(skill) ? "bg-primary hover:bg-primary/90" : "hover:bg-muted",
                  )}
                  onClick={() => toggleSkill(skill)}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Time and Price Row */}
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>
                Estimated Time <span className="text-destructive">*</span>
              </Label>
              <Select value={estimatedTime} onValueChange={setEstimatedTime}>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  {timeEstimates.map((time) => (
                    <SelectItem key={time.value} value={time.value}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">
                Proposed Price (₹) <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="price"
                  type="number"
                  placeholder="100"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(e.target.value)}
                  className="pl-9"
                  min={1}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">
                Participants Needed <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="capacity"
                  type="number"
                  placeholder="10"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  className="pl-9"
                  min={1}
                />
              </div>
            </div>
          </div>

          {/* Deliverables */}
          <div className="space-y-2">
            <Label>
              Expected Deliverables <span className="text-destructive">*</span>
            </Label>
            <p className="text-xs text-muted-foreground mb-2">What should participants submit upon completion?</p>
            <div className="space-y-2">
              {deliverables.map((deliverable, index) => (
                <div key={index} className="flex gap-2">
                  <div className="relative flex-1">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder={`Deliverable ${index + 1}`}
                      value={deliverable}
                      onChange={(e) => updateDeliverable(index, e.target.value)}
                      className="pl-9"
                    />
                  </div>
                  {deliverables.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeDeliverable(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addDeliverable}
                className="mt-2 bg-transparent"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Deliverable
              </Button>
            </div>
          </div>

          {/* File Upload (Optional) */}
          <div className="space-y-2">
            <Label>Supporting Document (Optional)</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
              <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Drag and drop or click to upload</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or images up to 5MB</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertCircle className="h-5 w-5 text-primary" />
            Submission Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Idea must be original and actionable</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Payment is released only after admin approval and task conversion</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>UniPay reserves the right to modify pricing or capacity</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <span>Rejected ideas can be resubmitted after revision</span>
            </li>
          </ul>

          <div className="flex items-start gap-2 pt-2 border-t">
            <Checkbox
              id="guidelines"
              checked={guidelinesAccepted}
              onCheckedChange={(checked) => setGuidelinesAccepted(checked as boolean)}
            />
            <Label htmlFor="guidelines" className="text-sm font-normal cursor-pointer">
              I confirm that this idea follows UniPay guidelines and is my original work.
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!isFormValid() || isSubmitting} className="min-w-[120px]">
          {isSubmitting ? "Submitting..." : "Submit Idea"}
        </Button>
      </div>
    </div>
  )
}
