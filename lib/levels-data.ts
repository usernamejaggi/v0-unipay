export interface Level {
  id: number
  name: string
  minTasks: number
  maxTasks: number
  badge: string
  color: string
  perks: string[]
  rewardMultiplier: number
}

export const levels: Level[] = [
  {
    id: 1,
    name: "Rookie",
    minTasks: 0,
    maxTasks: 10,
    badge: "🌱",
    color: "bg-slate-500",
    perks: ["Access to basic tasks", "Standard payouts"],
    rewardMultiplier: 1.0,
  },
  {
    id: 2,
    name: "Explorer",
    minTasks: 11,
    maxTasks: 30,
    badge: "🔍",
    color: "bg-blue-500",
    perks: ["5% bonus on tasks", "Priority task access"],
    rewardMultiplier: 1.05,
  },
  {
    id: 3,
    name: "Achiever",
    minTasks: 31,
    maxTasks: 60,
    badge: "⭐",
    color: "bg-purple-500",
    perks: ["10% bonus on tasks", "Early task notifications", "Profile badge"],
    rewardMultiplier: 1.1,
  },
  {
    id: 4,
    name: "Expert",
    minTasks: 61,
    maxTasks: 100,
    badge: "🏆",
    color: "bg-amber-500",
    perks: ["15% bonus on tasks", "Premium task access", "Leaderboard feature"],
    rewardMultiplier: 1.15,
  },
  {
    id: 5,
    name: "Master",
    minTasks: 101,
    maxTasks: 200,
    badge: "💎",
    color: "bg-emerald-500",
    perks: ["20% bonus on tasks", "Exclusive tasks", "Mentor status", "Priority support"],
    rewardMultiplier: 1.2,
  },
  {
    id: 6,
    name: "Legend",
    minTasks: 201,
    maxTasks: Number.POSITIVE_INFINITY,
    badge: "👑",
    color: "bg-gradient-to-r from-amber-400 to-orange-500",
    perks: ["25% bonus on tasks", "VIP access", "Featured profile", "Direct company contacts"],
    rewardMultiplier: 1.25,
  },
]

export function getCurrentLevel(tasksCompleted: number): Level {
  return levels.find((level) => tasksCompleted >= level.minTasks && tasksCompleted <= level.maxTasks) || levels[0]
}

export function getNextLevel(tasksCompleted: number): Level | null {
  const currentLevel = getCurrentLevel(tasksCompleted)
  const nextIndex = levels.findIndex((l) => l.id === currentLevel.id) + 1
  return nextIndex < levels.length ? levels[nextIndex] : null
}

export function getLevelProgress(tasksCompleted: number): number {
  const currentLevel = getCurrentLevel(tasksCompleted)
  const nextLevel = getNextLevel(tasksCompleted)
  if (!nextLevel) return 100
  const progress = ((tasksCompleted - currentLevel.minTasks) / (nextLevel.minTasks - currentLevel.minTasks)) * 100
  return Math.min(progress, 100)
}
