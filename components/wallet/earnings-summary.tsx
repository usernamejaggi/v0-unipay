import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet, TrendingUp, ArrowDownToLine, Clock } from "lucide-react"

interface EarningsSummaryProps {
  balance: number
  totalEarned: number
  totalWithdrawn: number
  pendingWithdrawal: number
}

export function EarningsSummary({ balance, totalEarned, totalWithdrawn, pendingWithdrawal }: EarningsSummaryProps) {
  const stats = [
    {
      label: "Available Balance",
      value: `₹${balance.toLocaleString("en-IN")}`,
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Total Earned",
      value: `₹${totalEarned.toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Total Withdrawn",
      value: `₹${totalWithdrawn.toLocaleString("en-IN")}`,
      icon: ArrowDownToLine,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      label: "Pending",
      value: `₹${pendingWithdrawal.toLocaleString("en-IN")}`,
      icon: Clock,
      color: "text-warning-foreground",
      bgColor: "bg-warning/10",
    },
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              {stat.label}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stat.value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
