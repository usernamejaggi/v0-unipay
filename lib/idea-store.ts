// Idea submission store for UniPay
export type IdeaStatus = "pending" | "approved" | "rejected" | "converted"
export type IdeaCategory = "tech" | "content" | "data" | "research" | "outreach" | "other"

export interface IdeaSubmission {
  id: string
  userId: string
  userName: string
  userEmail: string

  // Form fields
  title: string
  category: IdeaCategory
  problemStatement: string
  proposedSolution: string
  skillRequirements: string[]
  estimatedTime: string
  proposedPrice: number
  capacity: number
  deliverables: string[]
  supportingFileUrl?: string

  // Admin modifications
  adminPrice?: number
  adminCapacity?: number
  rejectionReason?: string

  // Metadata
  status: IdeaStatus
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  convertedToTaskId?: string
}

// Category labels
export const categoryLabels: Record<IdeaCategory, string> = {
  tech: "Technology",
  content: "Content Creation",
  data: "Data Entry",
  research: "Research",
  outreach: "Outreach",
  other: "Other",
}

// Time estimates
export const timeEstimates = [
  { value: "30min", label: "30 minutes" },
  { value: "1hr", label: "1 hour" },
  { value: "2hr", label: "2 hours" },
  { value: "3hr", label: "3 hours" },
  { value: "4hr", label: "4+ hours" },
]

// Sample data
const sampleIdeas: IdeaSubmission[] = [
  {
    id: "idea-1",
    userId: "user-2",
    userName: "Priya Singh",
    userEmail: "priya.singh@lpu.edu",
    title: "Campus Event Photography Database",
    category: "content",
    problemStatement: "LPU hosts many events but there's no organized photo database for students to access memories.",
    proposedSolution:
      "Create a task where students photograph campus events and upload them to a categorized database.",
    skillRequirements: ["Photography", "Photo Editing", "Organization"],
    estimatedTime: "2hr",
    proposedPrice: 150,
    capacity: 20,
    deliverables: ["Minimum 50 photos per event", "Edited and categorized uploads", "Event summary report"],
    status: "pending",
    submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "idea-2",
    userId: "user-3",
    userName: "Amit Kumar",
    userEmail: "amit.kumar@lpu.edu",
    title: "Survey Data Collection for Research",
    category: "research",
    problemStatement: "Research students need help collecting survey responses from diverse demographics.",
    proposedSolution: "Students can participate in collecting verified survey responses from their networks.",
    skillRequirements: ["Communication", "Data Entry", "Survey Administration"],
    estimatedTime: "1hr",
    proposedPrice: 75,
    capacity: 50,
    deliverables: ["50 completed surveys", "Data entry in provided format", "Participant consent forms"],
    status: "approved",
    adminPrice: 80,
    adminCapacity: 40,
    submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: "admin@unipay.com",
  },
  {
    id: "idea-3",
    userId: "user-1",
    userName: "Rahul Sharma",
    userEmail: "rahul.sharma@college.edu",
    title: "Social Media Content Creation",
    category: "content",
    problemStatement: "Many startups need social media content but can't afford full-time creators.",
    proposedSolution: "Students create Instagram reels and posts for local businesses.",
    skillRequirements: ["Video Editing", "Social Media", "Graphic Design"],
    estimatedTime: "2hr",
    proposedPrice: 200,
    capacity: 15,
    deliverables: ["3 edited reels", "5 static posts", "Caption suggestions"],
    status: "rejected",
    rejectionReason: "Similar task already exists. Consider focusing on a more niche area like LinkedIn content.",
    submittedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    reviewedBy: "admin@unipay.com",
  },
]

// Store with subscription pattern
let ideas: IdeaSubmission[] = [...sampleIdeas]
const listeners: Set<() => void> = new Set()

export const ideaStore = {
  getIdeas: () => ideas,

  getIdeasByUser: (userId: string) => ideas.filter((i) => i.userId === userId),

  getIdeasByStatus: (status: IdeaStatus) => ideas.filter((i) => i.status === status),

  getIdeaById: (id: string) => ideas.find((i) => i.id === id),

  submitIdea: (idea: Omit<IdeaSubmission, "id" | "status" | "submittedAt">) => {
    const newIdea: IdeaSubmission = {
      ...idea,
      id: `idea-${Date.now()}`,
      status: "pending",
      submittedAt: new Date().toISOString(),
    }
    ideas = [newIdea, ...ideas]
    listeners.forEach((l) => l())
    return newIdea
  },

  approveIdea: (id: string, adminPrice?: number, adminCapacity?: number, reviewedBy?: string) => {
    ideas = ideas.map((i) =>
      i.id === id
        ? {
            ...i,
            status: "approved" as IdeaStatus,
            adminPrice: adminPrice ?? i.proposedPrice,
            adminCapacity: adminCapacity ?? i.capacity,
            reviewedAt: new Date().toISOString(),
            reviewedBy,
          }
        : i,
    )
    listeners.forEach((l) => l())
  },

  rejectIdea: (id: string, reason: string, reviewedBy?: string) => {
    ideas = ideas.map((i) =>
      i.id === id
        ? {
            ...i,
            status: "rejected" as IdeaStatus,
            rejectionReason: reason,
            reviewedAt: new Date().toISOString(),
            reviewedBy,
          }
        : i,
    )
    listeners.forEach((l) => l())
  },

  convertToTask: (id: string, taskId: string) => {
    ideas = ideas.map((i) => (i.id === id ? { ...i, status: "converted" as IdeaStatus, convertedToTaskId: taskId } : i))
    listeners.forEach((l) => l())
  },

  subscribe: (listener: () => void) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  },
}
