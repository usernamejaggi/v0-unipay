import { LoginForm } from "@/components/login-form"
import { InteractiveBackground } from "@/components/ui/interactive-background"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex relative">
      <InteractiveBackground />

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary p-12 flex-col justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-foreground/20">
            <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <span className="text-xl font-semibold text-primary-foreground">UniPay</span>
        </div>

        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-primary-foreground leading-tight text-balance">
            Earn While You Learn
          </h1>
          <p className="text-primary-foreground/80 text-lg leading-relaxed max-w-md">
            Complete remote tasks, participate in surveys, and test products. Withdraw your earnings daily. Built
            exclusively for verified college students.
          </p>
          <div className="flex items-center gap-8 pt-4">
            <div>
              <p className="text-3xl font-bold text-primary-foreground">70K+</p>
              <p className="text-sm text-primary-foreground/70">Active Students</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">500+</p>
              <p className="text-sm text-primary-foreground/70">Colleges</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-primary-foreground">₹2.5Cr+</p>
              <p className="text-sm text-primary-foreground/70">Paid Out</p>
            </div>
          </div>
        </div>

        <p className="text-sm text-primary-foreground/60">Trusted by students from top universities across India</p>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative z-10">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 justify-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <svg className="h-5 w-5 text-primary-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
            <span className="text-xl font-semibold">UniPay</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight">Welcome back</h2>
            <p className="text-muted-foreground">Sign in with your college email to continue</p>
          </div>

          <LoginForm />

          <p className="text-center text-sm text-muted-foreground">
            {"Don't have an account?"}{" "}
            <a href="/" className="font-medium text-primary hover:underline">
              Sign up with college email
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
