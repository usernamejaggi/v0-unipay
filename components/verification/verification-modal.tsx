"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, CheckCircle2, AlertCircle, User, CreditCard, Sparkles, Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { submitVerification, uploadFile } from "@/lib/firebase"

// Skills and interests options
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

const interestOptions = [
  "Technology",
  "Education",
  "Healthcare",
  "Finance",
  "E-commerce",
  "Entertainment",
  "Sports",
  "Travel",
  "Food & Beverage",
  "Fashion",
  "Environment",
  "Social Impact",
  "Startups",
  "Gaming",
  "Arts & Culture",
]

const streams = [
  "Computer Science & Engineering",
  "Electronics & Communication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
  "Information Technology",
  "Chemical Engineering",
  "Biotechnology",
  "Commerce",
  "Arts & Humanities",
  "Science",
  "Management / MBA",
  "Law",
  "Medical / MBBS",
  "Pharmacy",
  "Architecture",
  "Other",
]

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Post Graduate"]

interface VerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit?: () => void
}

type Step = "selfie" | "id-card" | "college-info" | "skills" | "review"

export function VerificationModal({ open, onOpenChange, onSubmit }: VerificationModalProps) {
  const { user, profile, updateProfile } = useAuth()
  const [step, setStep] = useState<Step>("selfie")
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null)
  const [selfieFile, setSelfieFile] = useState<File | null>(null)
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null)
  const [idCardFile, setIdCardFile] = useState<File | null>(null)
  const [fullName, setFullName] = useState(profile?.name || "")
  const [collegeName, setCollegeName] = useState(profile?.college || "")
  const [selectedYear, setSelectedYear] = useState(profile?.year || "")
  const [selectedStream, setSelectedStream] = useState(profile?.stream || "")
  const [enrollmentNumber, setEnrollmentNumber] = useState(profile?.enrollmentNumber || "")
  const [selectedSkills, setSelectedSkills] = useState<string[]>(profile?.skills || [])
  const [selectedInterests, setSelectedInterests] = useState<string[]>(profile?.interests || [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const selfieInputRef = useRef<HTMLInputElement>(null)
  const idCardInputRef = useRef<HTMLInputElement>(null)

  const handleSelfieUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelfieFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelfiePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setIdCardFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill))
    } else if (selectedSkills.length < 5) {
      setSelectedSkills([...selectedSkills, skill])
    }
  }

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest))
    } else if (selectedInterests.length < 5) {
      setSelectedInterests([...selectedInterests, interest])
    }
  }

  const handleSubmit = async () => {
    if (!user) return
    setIsSubmitting(true)

    try {
      // Upload files to Firebase Storage
      let selfieUrl = selfiePreview || ""
      let idCardUrl = idCardPreview || ""

      if (selfieFile) {
        const url = await uploadFile(selfieFile, `verifications/${user.uid}/selfie`)
        if (url) selfieUrl = url
      }

      if (idCardFile) {
        const url = await uploadFile(idCardFile, `verifications/${user.uid}/idcard`)
        if (url) idCardUrl = url
      }

      // Submit verification to Firebase
      await submitVerification({
        userId: user.uid,
        studentName: fullName || profile?.name || "",
        email: profile?.email || "",
        collegeName: collegeName,
        enrollmentNumber: enrollmentNumber,
        year: selectedYear,
        stream: selectedStream,
        skills: selectedSkills,
        interests: selectedInterests,
        selfieUrl,
        idCardUrl,
      })

      // Update user profile
      await updateProfile({
        name: fullName,
        college: collegeName,
        year: selectedYear,
        stream: selectedStream,
        enrollmentNumber: enrollmentNumber,
        skills: selectedSkills,
        interests: selectedInterests,
        selfieUrl,
        idCardUrl,
      })

      setIsSubmitting(false)
      setIsComplete(true)
      onSubmit?.()
    } catch (error) {
      console.error("Verification submission error:", error)
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep("selfie")
    setSelfiePreview(null)
    setSelfieFile(null)
    setIdCardPreview(null)
    setIdCardFile(null)
    setFullName(profile?.name || "")
    setCollegeName(profile?.college || "")
    setSelectedYear(profile?.year || "")
    setSelectedStream(profile?.stream || "")
    setEnrollmentNumber(profile?.enrollmentNumber || "")
    setSelectedSkills(profile?.skills || [])
    setSelectedInterests(profile?.interests || [])
    setIsComplete(false)
    onOpenChange(false)
  }

  const steps = [
    { id: "selfie", label: "Selfie", icon: Camera },
    { id: "id-card", label: "ID Card", icon: CreditCard },
    { id: "college-info", label: "College", icon: User },
    { id: "skills", label: "Skills", icon: Sparkles },
    { id: "review", label: "Review", icon: CheckCircle2 },
  ]

  const currentStepIndex = steps.findIndex((s) => s.id === step)

  const canProceed = () => {
    switch (step) {
      case "selfie":
        return !!selfiePreview
      case "id-card":
        return !!idCardPreview
      case "college-info":
        return fullName && collegeName && selectedYear && selectedStream && enrollmentNumber
      case "skills":
        return selectedSkills.length > 0
      default:
        return true
    }
  }

  if (isComplete) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md">
          <div className="flex flex-col items-center justify-center py-8 text-center animate-scale-up">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4">
              <AlertCircle className="h-8 w-8 text-warning animate-pulse-slow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Verification Submitted!</h3>
            <p className="text-muted-foreground mb-2">Your documents have been submitted for admin review.</p>
            <Badge variant="secondary" className="bg-warning/10 text-warning-foreground mb-6">
              Under Review
            </Badge>
            <p className="text-sm text-muted-foreground mb-6">
              {"We'll verify your identity within 24-48 hours. You'll receive a notification once approved."}
            </p>
            <Button onClick={resetForm}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Student Verification</DialogTitle>
          <DialogDescription>Complete verification to unlock task access and start earning</DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((s, index) => (
            <div key={s.id} className="flex items-center">
              <div
                className={cn(
                  "w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
                  index <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                )}
              >
                <s.icon className="h-4 w-4" />
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-6 md:w-10 h-1 mx-1 rounded transition-all duration-300",
                    index < currentStepIndex ? "bg-primary" : "bg-muted",
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[280px]">
          {step === "selfie" && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center">
                <h4 className="font-medium mb-2">Take a Selfie</h4>
                <p className="text-sm text-muted-foreground">
                  Take a clear photo of your face for identity verification
                </p>
              </div>

              <div
                onClick={() => selfieInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5",
                  selfiePreview ? "border-primary bg-primary/5" : "border-muted",
                )}
              >
                <input
                  ref={selfieInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={handleSelfieUpload}
                />
                {selfiePreview ? (
                  <div className="space-y-3">
                    <img
                      src={selfiePreview || "/placeholder.svg"}
                      alt="Selfie preview"
                      className="w-32 h-32 rounded-full object-cover mx-auto ring-4 ring-primary/20"
                    />
                    <p className="text-sm text-primary font-medium">Photo uploaded!</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelfiePreview(null)
                        setSelfieFile(null)
                      }}
                    >
                      Retake Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                      <Camera className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Click to take a selfie or upload a photo</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "id-card" && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center">
                <h4 className="font-medium mb-2">Upload College ID Card</h4>
                <p className="text-sm text-muted-foreground">
                  Upload a clear photo of your college ID card (front side)
                </p>
              </div>

              <div
                onClick={() => idCardInputRef.current?.click()}
                className={cn(
                  "border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 hover:border-primary hover:bg-primary/5",
                  idCardPreview ? "border-primary bg-primary/5" : "border-muted",
                )}
              >
                <input
                  ref={idCardInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleIdCardUpload}
                />
                {idCardPreview ? (
                  <div className="space-y-3">
                    <img
                      src={idCardPreview || "/placeholder.svg"}
                      alt="ID Card preview"
                      className="max-w-full max-h-40 rounded-lg object-contain mx-auto ring-2 ring-primary/20"
                    />
                    <p className="text-sm text-primary font-medium">ID Card uploaded!</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIdCardPreview(null)
                        setIdCardFile(null)
                      }}
                    >
                      Change Photo
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center mx-auto">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">Click to upload your college ID card</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {step === "college-info" && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-2">
                <h4 className="font-medium mb-2">College Information</h4>
                <p className="text-sm text-muted-foreground">Provide your academic details</p>
              </div>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="e.g., Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="collegeName">College / University Name</Label>
                  <Input
                    id="collegeName"
                    placeholder="e.g., IIT Delhi"
                    value={collegeName}
                    onChange={(e) => setCollegeName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="enrollmentNumber">Enrollment / Roll Number</Label>
                  <Input
                    id="enrollmentNumber"
                    placeholder="e.g., 2021CS10234"
                    value={enrollmentNumber}
                    onChange={(e) => setEnrollmentNumber(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Year of Study</Label>
                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Stream / Branch</Label>
                    <Select value={selectedStream} onValueChange={setSelectedStream}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stream" />
                      </SelectTrigger>
                      <SelectContent>
                        {streams.map((stream) => (
                          <SelectItem key={stream} value={stream}>
                            {stream}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "skills" && (
            <div className="space-y-4 animate-slide-up">
              <div className="text-center mb-2">
                <h4 className="font-medium mb-2">Skills & Interests</h4>
                <p className="text-sm text-muted-foreground">Help us match you with the right tasks</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-primary" />
                      Your Skills
                    </Label>
                    <span className="text-xs text-muted-foreground">{selectedSkills.length}/5 selected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {skillOptions.map((skill) => (
                      <Badge
                        key={skill}
                        variant={selectedSkills.includes(skill) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all duration-200",
                          selectedSkills.includes(skill)
                            ? "bg-primary hover:bg-primary/90"
                            : "hover:bg-primary/10 hover:border-primary",
                        )}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-chart-1" />
                      Areas of Interest
                    </Label>
                    <span className="text-xs text-muted-foreground">{selectedInterests.length}/5 selected</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <Badge
                        key={interest}
                        variant={selectedInterests.includes(interest) ? "default" : "outline"}
                        className={cn(
                          "cursor-pointer transition-all duration-200",
                          selectedInterests.includes(interest)
                            ? "bg-chart-1 hover:bg-chart-1/90"
                            : "hover:bg-chart-1/10 hover:border-chart-1",
                        )}
                        onClick={() => toggleInterest(interest)}
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === "review" && (
            <div className="space-y-3 animate-slide-up">
              <div className="text-center mb-2">
                <h4 className="font-medium mb-2">Review Your Information</h4>
                <p className="text-sm text-muted-foreground">Verify all details before submitting</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {selfiePreview ? (
                    <img
                      src={selfiePreview || "/placeholder.svg"}
                      alt="Selfie"
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                      <Camera className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">Selfie</p>
                    <p className="text-xs text-primary">{selfiePreview ? "Uploaded" : "Not uploaded"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  {idCardPreview ? (
                    <img
                      src={idCardPreview || "/placeholder.svg"}
                      alt="ID Card"
                      className="w-12 h-10 rounded object-cover"
                    />
                  ) : (
                    <div className="w-12 h-10 rounded bg-muted flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-sm">College ID Card</p>
                    <p className="text-xs text-primary">{idCardPreview ? "Uploaded" : "Not uploaded"}</p>
                  </div>
                </div>

                <div className="p-3 bg-muted/50 rounded-lg space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name</span>
                    <span className="font-medium">{fullName || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">College</span>
                    <span className="font-medium">{collegeName || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Enrollment</span>
                    <span className="font-medium">{enrollmentNumber || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Year</span>
                    <span className="font-medium">{selectedYear || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Stream</span>
                    <span className="font-medium">{selectedStream || "Not provided"}</span>
                  </div>
                </div>

                {selectedSkills.length > 0 && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-2">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedSkills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => {
              const prevIndex = currentStepIndex - 1
              if (prevIndex >= 0) {
                setStep(steps[prevIndex].id as Step)
              }
            }}
            disabled={currentStepIndex === 0}
          >
            Back
          </Button>

          {step === "review" ? (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Submitting...
                </span>
              ) : (
                "Submit Verification"
              )}
            </Button>
          ) : (
            <Button
              onClick={() => {
                const nextIndex = currentStepIndex + 1
                if (nextIndex < steps.length) {
                  setStep(steps[nextIndex].id as Step)
                }
              }}
              disabled={!canProceed()}
            >
              Next
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
