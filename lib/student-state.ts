export type VerificationStatus = "not-submitted" | "under-review" | "approved" | "rejected"
export type SubscriptionPlan = "free" | "starter" | "pro"

export interface StudentState {
  id: string
  email: string
  name: string
  avatar?: string
  verificationStatus: VerificationStatus
  isFirstTask: boolean
  freeTasksUsed: number
  totalFreeTasks: number
  subscription: SubscriptionPlan
  subscriptionExpiry?: string
}

export const currentStudent: StudentState = {
  id: "1",
  email: "rahul.sharma@college.edu",
  name: "Rahul Sharma",
  avatar: "/diverse-student-portraits.png",
  verificationStatus: "not-submitted", // Change this to test different states
  isFirstTask: true,
  freeTasksUsed: 7,
  totalFreeTasks: 10,
  subscription: "free",
}

// Admin emails - only these emails can access the admin panel
// To access admin: Login with email "admin@unipay.com" or "support@unipay.com"
export const ADMIN_EMAILS = ["admin@unipay.com", "support@unipay.com"]

// Simulates the currently logged-in user email (would come from auth in real app)
export let currentUserEmail = "rahul.sharma@college.edu"

export function setCurrentUserEmail(email: string) {
  currentUserEmail = email
  // Also update currentStudent email if needed
  currentStudent.email = email
}

export function isAdmin(email: string): boolean {
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export function canApplyForTasks(student: StudentState): boolean {
  if (student.verificationStatus !== "approved") return false
  if (student.subscription === "free" && student.freeTasksUsed >= student.totalFreeTasks) return false
  return true
}

export function getTaskLockReason(student: StudentState): string | null {
  if (student.verificationStatus === "not-submitted") {
    return "Complete verification to apply for tasks"
  }
  if (student.verificationStatus === "under-review") {
    return "Your profile is under admin review"
  }
  if (student.verificationStatus === "rejected") {
    return "Verification rejected. Please resubmit."
  }
  if (student.subscription === "free" && student.freeTasksUsed >= student.totalFreeTasks) {
    return "Free tasks exhausted. Subscribe to continue."
  }
  return null
}

// Skills and interests options
export const skillOptions = [
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

export const interestOptions = [
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

export const streams = [
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

export const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Post Graduate"]
