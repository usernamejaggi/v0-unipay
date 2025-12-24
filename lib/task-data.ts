export interface Task {
  id: string
  title: string
  description: string
  category: "testing" | "survey" | "remote"
  reward: number
  estimatedTime: string
  deadline: string
  instructions: string[]
  requirements: string[]
  status: "available" | "applied" | "approved" | "rejected" | "completed"
  isAvailableForStudent: boolean
}

export const tasks: Task[] = [
  {
    id: "1",
    title: "Mobile App Usability Testing",
    description:
      "Test our new e-commerce mobile app and provide detailed feedback on user experience, navigation flow, and any bugs encountered.",
    category: "testing",
    reward: 200,
    estimatedTime: "45 mins",
    deadline: "2025-12-25",
    instructions: [
      "Download the app using the provided TestFlight link",
      "Complete all onboarding steps",
      "Browse products and add items to cart",
      "Complete a mock checkout process",
      "Record any issues or suggestions",
    ],
    requirements: ["iOS 15+ or Android 11+", "Stable internet connection", "Screen recording capability"],
    status: "available",
    isAvailableForStudent: true,
  },
  {
    id: "2",
    title: "Student Lifestyle Survey 2025",
    description:
      "Participate in a comprehensive survey about student spending habits, lifestyle choices, and brand preferences.",
    category: "survey",
    reward: 50,
    estimatedTime: "15 mins",
    deadline: "2025-12-28",
    instructions: [
      "Answer all questions honestly",
      "Complete the survey in one sitting",
      "Provide detailed responses for open-ended questions",
    ],
    requirements: ["Must be a current college student", "Age 18-25"],
    status: "available",
    isAvailableForStudent: true,
  },
  {
    id: "3",
    title: "Social Media Content Creation",
    description: "Create engaging Instagram reels or TikTok videos reviewing our study productivity app.",
    category: "remote",
    reward: 500,
    estimatedTime: "2 hours",
    deadline: "2025-12-30",
    instructions: [
      "Download and use the app for at least 1 week",
      "Create 2-3 short-form videos (30-60 seconds each)",
      "Include specific features in your review",
      "Post on your personal account with provided hashtags",
    ],
    requirements: ["Minimum 1000 followers on Instagram or TikTok", "Public account", "Good video quality"],
    status: "applied",
    isAvailableForStudent: true,
  },
  {
    id: "4",
    title: "Data Entry Task - Research Papers",
    description: "Help digitize and categorize research paper metadata into our academic database.",
    category: "remote",
    reward: 150,
    estimatedTime: "1 hour",
    deadline: "2025-12-24",
    instructions: [
      "Access the provided spreadsheet template",
      "Enter paper titles, authors, and abstracts",
      "Categorize papers by research field",
      "Verify all entries for accuracy",
    ],
    requirements: ["Good typing speed", "Attention to detail", "Basic knowledge of academic fields"],
    status: "approved",
    isAvailableForStudent: true,
  },
  {
    id: "5",
    title: "Premium Focus Group - Finance App",
    description:
      "Join an exclusive online focus group to discuss features for a new personal finance app for students.",
    category: "survey",
    reward: 400,
    estimatedTime: "1.5 hours",
    deadline: "2025-12-26",
    instructions: [
      "Join the video call at scheduled time",
      "Share your screen when requested",
      "Provide constructive feedback on UI mockups",
      "Participate in group discussion",
    ],
    requirements: ["Working webcam and microphone", "Quiet environment", "Finance or Business student preferred"],
    status: "available",
    isAvailableForStudent: false,
  },
  {
    id: "6",
    title: "Website Bug Hunting",
    description: "Find and report bugs on our new educational platform. Bonus rewards for critical bugs!",
    category: "testing",
    reward: 300,
    estimatedTime: "2 hours",
    deadline: "2025-12-29",
    instructions: [
      "Create a test account on the platform",
      "Test all major features systematically",
      "Document bugs with screenshots and steps to reproduce",
      "Submit report using provided template",
    ],
    requirements: ["Basic technical knowledge", "Experience with web applications", "Chrome browser"],
    status: "completed",
    isAvailableForStudent: true,
  },
  {
    id: "7",
    title: "Translation Task - Hindi to English",
    description: "Translate marketing content from Hindi to English for an education startup.",
    category: "remote",
    reward: 250,
    estimatedTime: "1.5 hours",
    deadline: "2025-12-27",
    instructions: [
      "Review the source content carefully",
      "Translate while maintaining marketing tone",
      "Proofread for grammatical errors",
      "Submit in the provided document format",
    ],
    requirements: ["Native Hindi speaker", "Excellent English writing skills", "Marketing knowledge is a plus"],
    status: "rejected",
    isAvailableForStudent: true,
  },
  {
    id: "8",
    title: "Campus Ambassador Program",
    description: "Represent our brand on your campus and organize promotional events.",
    category: "remote",
    reward: 1000,
    estimatedTime: "Ongoing",
    deadline: "2026-01-15",
    instructions: [
      "Attend online training session",
      "Set up promotional booth on campus",
      "Distribute marketing materials",
      "Collect student sign-ups",
    ],
    requirements: ["Strong communication skills", "Access to campus facilities", "Available for on-ground activities"],
    status: "available",
    isAvailableForStudent: true,
  },
]

export const categories = [
  { value: "all", label: "All Categories" },
  { value: "testing", label: "Testing" },
  { value: "survey", label: "Surveys" },
  { value: "remote", label: "Remote Tasks" },
]

export const statuses = [
  { value: "all", label: "All Status" },
  { value: "available", label: "Available" },
  { value: "applied", label: "Applied" },
  { value: "approved", label: "Approved" },
  { value: "completed", label: "Completed" },
  { value: "rejected", label: "Rejected" },
]
