import type { VerificationStatus } from "./student-state"

export interface PendingVerification {
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

export const pendingVerifications: PendingVerification[] = [
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
    idCardUrl: "/college-id-card.jpg",
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
  {
    id: "v3",
    studentName: "Sneha Reddy",
    email: "sneha.r@vit.ac.in",
    collegeName: "VIT Vellore",
    enrollmentNumber: "20BCE1234",
    year: "2nd Year",
    stream: "Information Technology",
    skills: ["Social Media", "Graphic Design", "Video Editing"],
    interests: ["Entertainment", "Fashion", "Arts & Culture"],
    selfieUrl: "/young-indian-woman-student-portrait.jpg",
    idCardUrl: "/university-student-card.jpg",
    submittedAt: "2025-01-19T16:45:00",
    status: "under-review",
  },
]
