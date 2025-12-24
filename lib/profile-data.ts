export interface StudentProfile {
  id: string
  name: string
  email: string
  avatar?: string
  college: string
  degree: string
  year: string
  stream: string
  enrollmentNumber: string
  verified: boolean
  verifiedAt: string
  joinedAt: string
  skills: string[]
  stats: {
    tasksCompleted: number
    totalEarnings: number
    rating: number
    streak: number
  }
}

export const studentProfile: StudentProfile = {
  id: "user_1",
  name: "Rahul Sharma",
  email: "rahul.sharma@iitd.ac.in",
  college: "Indian Institute of Technology Delhi",
  degree: "B.Tech Computer Science",
  year: "3rd Year",
  stream: "Computer Science & Engineering",
  enrollmentNumber: "2022CS10234",
  verified: true,
  verifiedAt: "2025-10-15",
  joinedAt: "2025-10-10",
  skills: ["Content Writing", "UI Testing", "Data Entry", "Survey Participation", "Social Media"],
  stats: {
    tasksCompleted: 47,
    totalEarnings: 8500,
    rating: 4.8,
    streak: 7,
  },
}
