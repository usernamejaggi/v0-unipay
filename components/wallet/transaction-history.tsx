import type { Transaction } from "@/lib/wallet-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpRight, ArrowDownLeft, Gift } from "lucide-react"
import { cn } from "@/lib/utils"

interface TransactionHistoryProps {
  transactions: Transaction[]
}

const typeConfig = {
  earning: { icon: ArrowUpRight, color: "text-chart-2", label: "Earning" },
  withdrawal: { icon: ArrowDownLeft, color: "text-chart-4", label: "Withdrawal" },
  bonus: { icon: Gift, color: "text-primary", label: "Bonus" },
}

const statusStyles = {
  completed: "bg-chart-2/10 text-chart-2",
  pending: "bg-warning/10 text-warning-foreground",
  failed: "bg-destructive/10 text-destructive",
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => {
                const config = typeConfig[transaction.type]
                const Icon = config.icon
                return (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("p-1.5 rounded-md bg-muted", config.color)}>
                          <Icon className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{config.label}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn("capitalize", statusStyles[transaction.status])}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold",
                        transaction.amount > 0 ? "text-chart-2" : "text-chart-4",
                      )}
                    >
                      {transaction.amount > 0 ? "+" : ""}₹{Math.abs(transaction.amount).toLocaleString("en-IN")}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
