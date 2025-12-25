"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, ArrowRight, User } from "lucide-react"
import { VerificationModal } from "./verification/verification-modal"
import { useAuth } from "@/contexts/auth-context"
import { ADMIN_EMAILS } from "@/lib/firebase"

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()
  const { signIn, signUp, signInWithGoogle, profile } = useAuth()

  // ✅ ADMIN REDIRECT — CORRECT PLACE
  useEffect(() => {
    if (profile?.isAdmin) {
      router.push("/admin")
    }
  }, [profile, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (isSignUp) {
        const result = await signUp(email, password, name)
        if (result.error) {
          setError(result.error)
          return
        }
        setShowVerification(true)
        return
      }

      const result = await signIn(email, password)
      if (result.error) {
        setError(result.error)
        return
      }

      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true)
    setError(null)

    try {
      const result = await signInWithGoogle()
      if (result.error) {
        setError(result.error)
        return
      }
      router.push("/dashboard")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const isAdminEmail = ADMIN_EMAILS.includes(email.toLowerCase())

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-3 bg-transparent"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading || isLoading}
        >
          {isGoogleLoading ? "Signing in..." : <> <GoogleIcon className="h-5 w-5" /> Continue with Google </>}
        </Button>

        <div className="space-y-4">
          {isSignUp && (
            <div>
              <Label>Full Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
          )}

          <div>
            <Label>Email</Label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} required />
            {isAdminEmail && <p className="text-xs text-primary">Admin login detected</p>}
          </div>

          <div>
            <Label>Password</Label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Please wait..." : isSignUp ? "Create Account" : "Sign In"}
        </Button>

        <button
          type="button"
          onClick={() => {
            setIsSignUp(!isSignUp)
            setError(null)
          }}
          className="text-sm underline"
        >
          {isSignUp ? "Already have an account?" : "Create an account"}
        </button>
      </form>

      <VerificationModal
        open={showVerification}
        onOpenChange={setShowVerification}
        onSubmit={() => router.push("/dashboard")}
      />
    </>
  )
}
