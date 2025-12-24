import { EarningsSummary } from "@/components/wallet/earnings-summary"
import { WithdrawCard } from "@/components/wallet/withdraw-card"
import { TransactionHistory } from "@/components/wallet/transaction-history"
import { transactions, walletStats } from "@/lib/wallet-data"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"

export default function WalletPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">Wallet</h1>
          <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
            <Wallet className="h-3 w-3" />
            Verified
          </Badge>
        </div>
        <p className="text-muted-foreground mt-1">Manage your earnings and withdrawals</p>
      </div>

      {/* Earnings Summary */}
      <EarningsSummary
        balance={walletStats.balance}
        totalEarned={walletStats.totalEarned}
        totalWithdrawn={walletStats.totalWithdrawn}
        pendingWithdrawal={walletStats.pendingWithdrawal}
      />

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <WithdrawCard
            balance={walletStats.balance}
            dailyLimit={walletStats.dailyLimit}
            todayWithdrawn={walletStats.todayWithdrawn}
          />
        </div>
        <div className="lg:col-span-2">
          <TransactionHistory transactions={transactions} />
        </div>
      </div>
    </div>
  )
}
