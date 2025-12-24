export interface Transaction {
  id: string
  type: "earning" | "withdrawal" | "bonus"
  description: string
  amount: number
  date: string
  status: "completed" | "pending" | "failed"
  taskId?: string
}

export const transactions: Transaction[] = [
  {
    id: "1",
    type: "earning",
    description: "Mobile App Usability Testing",
    amount: 200,
    date: "2025-12-21",
    status: "completed",
    taskId: "1",
  },
  {
    id: "2",
    type: "withdrawal",
    description: "Bank Transfer to HDFC ****4521",
    amount: -500,
    date: "2025-12-20",
    status: "completed",
  },
  {
    id: "3",
    type: "earning",
    description: "Student Lifestyle Survey",
    amount: 50,
    date: "2025-12-20",
    status: "completed",
    taskId: "2",
  },
  {
    id: "4",
    type: "bonus",
    description: "7-Day Streak Bonus",
    amount: 100,
    date: "2025-12-19",
    status: "completed",
  },
  {
    id: "5",
    type: "earning",
    description: "Data Entry Task",
    amount: 150,
    date: "2025-12-18",
    status: "completed",
    taskId: "4",
  },
  {
    id: "6",
    type: "withdrawal",
    description: "UPI Transfer to @rahul",
    amount: -800,
    date: "2025-12-17",
    status: "completed",
  },
  {
    id: "7",
    type: "earning",
    description: "Website Bug Hunting",
    amount: 300,
    date: "2025-12-16",
    status: "completed",
    taskId: "6",
  },
  {
    id: "8",
    type: "withdrawal",
    description: "Bank Transfer to HDFC ****4521",
    amount: -600,
    date: "2025-12-15",
    status: "pending",
  },
  {
    id: "9",
    type: "earning",
    description: "Social Media Content Creation",
    amount: 500,
    date: "2025-12-14",
    status: "completed",
    taskId: "3",
  },
  {
    id: "10",
    type: "bonus",
    description: "Welcome Bonus",
    amount: 50,
    date: "2025-12-10",
    status: "completed",
  },
]

export const walletStats = {
  balance: 4250,
  totalEarned: 8500,
  totalWithdrawn: 4250,
  pendingWithdrawal: 600,
  dailyLimit: { min: 500, max: 1000 },
  todayEarnings: 350,
  todayWithdrawn: 0,
}
