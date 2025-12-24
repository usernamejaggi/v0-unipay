export interface SubscriptionPlan {
  id: string
  name: string
  price: number
  period: "monthly" | "yearly"
  features: string[]
  highlighted?: boolean
  badge?: string
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    period: "monthly",
    features: ["10 free tasks only", "Basic task access", "Standard payouts", "Email support"],
  },
  {
    id: "starter",
    name: "Starter",
    price: 500,
    period: "monthly",
    features: [
      "Unlimited tasks",
      "10% bonus on all earnings",
      "Priority task access",
      "Early notifications",
      "Starter badge",
      "Chat support",
    ],
    highlighted: true,
    badge: "Most Popular",
  },
  {
    id: "pro",
    name: "Pro",
    price: 1000,
    period: "monthly",
    features: [
      "Everything in Starter",
      "20% bonus on all earnings",
      "Exclusive premium tasks",
      "Featured profile",
      "Direct company access",
      "Priority support",
      "Instant withdrawals",
    ],
    badge: "Best Value",
  },
]

export interface UserSubscription {
  planId: string
  freeTasksRemaining: number
  totalFreeTasks: number
  isSubscribed: boolean
  expiresAt?: string
}

export const userSubscription: UserSubscription = {
  planId: "free",
  freeTasksRemaining: 3,
  totalFreeTasks: 10,
  isSubscribed: false,
}
