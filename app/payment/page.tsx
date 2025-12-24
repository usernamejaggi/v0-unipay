"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { subscriptionPlans } from "@/lib/subscription-data"
import { InteractiveBackground } from "@/components/ui/interactive-background"
import { LightningButton } from "@/components/ui/lightning-button"
import {
  CreditCard,
  Smartphone,
  Building2,
  Shield,
  Check,
  ArrowLeft,
  Lock,
  IndianRupee,
  Zap,
  Crown,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { Logo } from "@/components/logo"

export default function PaymentPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const planId = searchParams.get("plan") || "starter"
  const [paymentMethod, setPaymentMethod] = useState("upi")
  const [upiId, setUpiId] = useState("")
  const [cardNumber, setCardNumber] = useState("")
  const [cardExpiry, setCardExpiry] = useState("")
  const [cardCvv, setCardCvv] = useState("")
  const [cardName, setCardName] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const selectedPlan = subscriptionPlans.find((p) => p.id === planId) || subscriptionPlans[1]

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500))

    setIsProcessing(false)
    setIsSuccess(true)

    // Redirect after success
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    return parts.length ? parts.join(" ") : value
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
        <InteractiveBackground />
        <Card className="w-full max-w-md text-center relative z-10">
          <CardContent className="pt-10 pb-10">
            <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-6">
              You are now subscribed to the {selectedPlan.name} plan. Enjoy unlimited tasks and premium features!
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Redirecting to dashboard...
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative">
      <InteractiveBackground />

      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              Secure Checkout
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6 gap-2" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-2xl font-bold">Complete Your Payment</h1>
              <p className="text-muted-foreground mt-1">Subscribe to {selectedPlan.name} plan</p>
            </div>

            {/* Payment Method Selection */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Select Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                  <div
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "upi" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    onClick={() => setPaymentMethod("upi")}
                  >
                    <RadioGroupItem value="upi" id="upi" />
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label htmlFor="upi" className="font-medium cursor-pointer">
                        UPI
                      </Label>
                      <p className="text-sm text-muted-foreground">Pay using any UPI app</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                        G
                      </div>
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                        P
                      </div>
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold">
                        PP
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "card" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label htmlFor="card" className="font-medium cursor-pointer">
                        Credit / Debit Card
                      </Label>
                      <p className="text-sm text-muted-foreground">Visa, Mastercard, Rupay</p>
                    </div>
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                        V
                      </div>
                      <div className="w-8 h-8 rounded bg-red-500 flex items-center justify-center text-xs font-bold text-white">
                        M
                      </div>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${paymentMethod === "netbanking" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}
                    onClick={() => setPaymentMethod("netbanking")}
                  >
                    <RadioGroupItem value="netbanking" id="netbanking" />
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <Label htmlFor="netbanking" className="font-medium cursor-pointer">
                        Net Banking
                      </Label>
                      <p className="text-sm text-muted-foreground">All major banks supported</p>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Payment Details Form */}
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-4">
                  {paymentMethod === "upi" && (
                    <div className="space-y-2">
                      <Label htmlFor="upi-id">UPI ID</Label>
                      <Input
                        id="upi-id"
                        placeholder="yourname@upi"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground">Enter your UPI ID (e.g., name@paytm, name@gpay)</p>
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Name on Card</Label>
                        <Input
                          id="card-name"
                          placeholder="John Doe"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Card Number</Label>
                        <div className="relative">
                          <Input
                            id="card-number"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                            maxLength={19}
                            required
                          />
                          <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-expiry">Expiry Date</Label>
                          <Input
                            id="card-expiry"
                            placeholder="MM/YY"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                            maxLength={5}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="card-cvv">CVV</Label>
                          <Input
                            id="card-cvv"
                            placeholder="123"
                            type="password"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            maxLength={3}
                            required
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentMethod === "netbanking" && (
                    <div className="space-y-3">
                      <Label>Select Your Bank</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak", "Others"].map((bank) => (
                          <Button
                            key={bank}
                            type="button"
                            variant="outline"
                            className="h-12 justify-start bg-transparent"
                          >
                            <Building2 className="h-4 w-4 mr-2" />
                            {bank}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator className="my-6" />

                  <LightningButton type="submit" className="w-full h-12 text-base gap-2" disabled={isProcessing}>
                    {isProcessing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Pay ₹{selectedPlan.price}
                      </>
                    )}
                  </LightningButton>

                  <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      256-bit SSL
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      PCI DSS Compliant
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-24 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Plan Details */}
                <div className="p-4 rounded-lg bg-muted/50 border">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {selectedPlan.id === "starter" ? (
                        <Zap className="h-5 w-5 text-primary" />
                      ) : (
                        <Crown className="h-5 w-5 text-amber-500" />
                      )}
                      <span className="font-semibold">{selectedPlan.name} Plan</span>
                    </div>
                    {selectedPlan.badge && <Badge variant="secondary">{selectedPlan.badge}</Badge>}
                  </div>
                  <ul className="space-y-2">
                    {selectedPlan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                {/* Price Breakdown */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{selectedPlan.name} Plan (Monthly)</span>
                    <span>₹{selectedPlan.price}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{Math.round(selectedPlan.price * 0.18)}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      {selectedPlan.price + Math.round(selectedPlan.price * 0.18)}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="p-4 rounded-lg bg-success/5 border border-success/20">
                  <div className="flex items-center gap-2 text-sm text-success mb-2">
                    <Shield className="h-4 w-4" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your payment is secured with industry-standard encryption. Cancel anytime.
                  </p>
                </div>

                {/* Switch Plan */}
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-2">Want a different plan?</p>
                  <div className="flex gap-2 justify-center">
                    {subscriptionPlans
                      .filter((p) => p.id !== "free" && p.id !== planId)
                      .map((plan) => (
                        <Button key={plan.id} variant="outline" size="sm" asChild>
                          <Link href={`/payment?plan=${plan.id}`}>
                            {plan.name} - ₹{plan.price}
                          </Link>
                        </Button>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
