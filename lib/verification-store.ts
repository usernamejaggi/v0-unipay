import type { VerificationStatus } from "./student-state"

export interface VerificationSubmission {
  id: string
  studentName: string
  email: string
  collegeName: string
  enrollmentNumber: string
  year: string
  stream: string
  skills: string[]
  interests: string[]
  selfieUrl: string
  idCardUrl: string
  submittedAt: string
  status: VerificationStatus
}

// Initial mock data for demo
const initialVerifications: VerificationSubmission[] = [
  {
    id: "v1",
    studentName: "Priya Patel",
    email: "priya.patel@iitd.ac.in",
    collegeName: "IIT Delhi",
    enrollmentNumber: "2022CS10456",
    year: "3rd Year",
    stream: "Computer Science & Engineering",
    skills: ["Content Writing", "Web Research", "Data Entry"],
    interests: ["Technology", "Startups", "Education"],
    selfieUrl: "/indian-college-girl-selfie-portrait.jpg",
    idCardUrl: "/college-id-card-front.jpg",
    submittedAt: "2025-01-20T10:30:00",
    status: "under-review",
  },
  {
    id: "v2",
    studentName: "Amit Kumar",
    email: "amit.kumar@bits.ac.in",
    collegeName: "BITS Pilani",
    enrollmentNumber: "2021EE10234",
    year: "4th Year",
    stream: "Electrical Engineering",
    skills: ["Testing & QA", "Excel/Sheets", "Coding"],
    interests: ["Technology", "Finance", "Gaming"],
    selfieUrl: "/indian-college-boy-selfie-portrait.jpg",
    idCardUrl: "/college-student-id-card.jpg",
    submittedAt: "2025-01-20T09:15:00",
    status: "under-review",
  },
]

// In-memory store (in real app, this would be a database)
let verifications: VerificationSubmission[] = [...initialVerifications]
let listeners: (() => void)[] = []

export const verificationStore = {
  getVerifications: () => verifications,

  addVerification: (submission: Omit<VerificationSubmission, "id" | "submittedAt" | "status">) => {
    const newVerification: VerificationSubmission = {
      ...submission,
      id: `v${Date.now()}`,
      submittedAt: new Date().toISOString(),
      status: "under-review",
    }
    verifications = [newVerification, ...verifications]
    listeners.forEach((listener) => listener())
    return newVerification
  },

  updateStatus: (id: string, status: VerificationStatus) => {
    verifications = verifications.map((v) => (v.id === id ? { ...v, status } : v))
    listeners.forEach((listener) => listener())
  },

  subscribe: (listener: () => void) => {
    listeners.push(listener)
    return () => {
      listeners = listeners.filter((l) => l !== listener)
    }
  },

  getByEmail: (email: string) => {
    return verifications.find((v) => v.email === email)
  },
}
