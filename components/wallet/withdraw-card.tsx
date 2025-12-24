"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Banknote, Smartphone } from "lucide-react"

interface WithdrawCardProps {
  balance: number
  dailyLimit: { min: number; max: number }
  todayWithdrawn: number
}

export function WithdrawCard({ balance, dailyLimit, todayWithdrawn }: WithdrawCardProps) {
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState("bank")
  const [isProcessing, setIsProcessing] = useState(false)

  const remainingLimit = dailyLimit.max - todayWithdrawn
  const numAmount = Number(amount) || 0
  const canWithdraw = numAmount >= dailyLimit.min && numAmount <= remainingLimit && numAmount <= balance

  const handleWithdraw = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setAmount("")
    }, 2000)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdraw Funds</CardTitle>
        <CardDescription>Transfer your earnings to your bank account or UPI</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert className="bg-secondary border-secondary">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Daily withdrawal limit: ₹{dailyLimit.min} - ₹{dailyLimit.max}. You can withdraw ₹{remainingLimit} more
            today.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            placeholder={`Min ₹${dailyLimit.min}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={dailyLimit.min}
            max={Math.min(remainingLimit, balance)}
          />
          <div className="flex gap-2">
            {[500, 750, 1000].map((preset) => (
              <Button
                key={preset}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setAmount(String(Math.min(preset, remainingLimit, balance)))}
                disabled={preset > remainingLimit || preset > balance}
              >
                ₹{preset}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <Label>Withdrawal Method</Label>
          <RadioGroup value={method} onValueChange={setMethod} className="grid grid-cols-2 gap-4">
            <Label
              htmlFor="bank"
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value="bank" id="bank" className="sr-only" />
              <Banknote className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">Bank Transfer</p>
                <p className="text-xs text-muted-foreground">1-2 business days</p>
              </div>
            </Label>
            <Label
              htmlFor="upi"
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors [&:has(:checked)]:border-primary [&:has(:checked)]:bg-primary/5"
            >
              <RadioGroupItem value="upi" id="upi" className="sr-only" />
              <Smartphone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-sm">UPI</p>
                <p className="text-xs text-muted-foreground">Instant transfer</p>
              </div>
            </Label>
          </RadioGroup>
        </div>

        {method === "bank" && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-1">
            <p className="text-sm font-medium">HDFC Bank</p>
            <p className="text-sm text-muted-foreground">Account ending in ****4521</p>
            <p className="text-xs text-primary hover:underline cursor-pointer">Change account</p>
          </div>
        )}

        {method === "upi" && (
          <div className="p-4 rounded-lg bg-muted/50 space-y-1">
            <p className="text-sm font-medium">UPI ID</p>
            <p className="text-sm text-muted-foreground">rahul@hdfc</p>
            <p className="text-xs text-primary hover:underline cursor-pointer">Change UPI ID</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled={!canWithdraw || isProcessing} onClick={handleWithdraw}>
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Withdraw ₹${numAmount || "0"}`
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
