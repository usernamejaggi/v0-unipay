"use client"

import { useState } from "react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  BadgeCheck,
  Bell,
  Menu,
  LogOut,
  User,
  Wallet,
  Trophy,
  Crown,
  Clock,
  ShieldAlert,
  ShieldCheck,
  Lightbulb,
  FileText,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SubscriptionModal } from "@/components/subscription/subscription-modal"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"

interface HeaderProps {
  onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
  const [showSubscription, setShowSubscription] = useState(false)
  const { profile, notifications, unreadCount, logOut, isAdmin } = useAuth()
  const router = useRouter()

  const getVerificationBadge = () => {
    switch (profile?.verificationStatus) {
      case "approved":
        return <BadgeCheck className="h-4 w-4 text-primary" />
      case "under-review":
        return <Clock className="h-4 w-4 text-warning" />
      default:
        return <ShieldAlert className="h-4 w-4 text-muted-foreground" />
    }
  }

  const getVerificationText = () => {
    switch (profile?.verificationStatus) {
      case "approved":
        return "Verified Student"
      case "under-review":
        return "Under Review"
      default:
        return "Not Verified"
    }
  }

  const handleLogout = async () => {
    await logOut()
    router.push("/login")
  }

  const getInitials = () => {
    if (profile?.name) {
      return profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    }
    if (profile?.email) {
      return profile.email.slice(0, 2).toUpperCase()
    }
    return "U"
  }

  const displayName = profile?.name || profile?.email?.split("@")[0] || "User"

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
            <Link href="/dashboard">
              <Logo />
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "/dashboard", label: "Dashboard" },
              { href: "/tasks", label: "Tasks" },
              { href: "/submit-idea", label: "Submit Idea" },
              { href: "/my-submissions", label: "My Submissions" },
              { href: "/wallet", label: "Wallet" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors duration-200 hover:text-primary text-muted-foreground"
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors duration-200 hover:text-primary text-muted-foreground flex items-center gap-1"
              >
                <ShieldCheck className="h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-2">
            {profile?.subscription !== "free" && (
              <Badge variant="secondary" className="hidden md:flex bg-warning/10 text-warning gap-1">
                <Crown className="h-3 w-3" />
                {profile?.subscription === "starter" ? "Starter" : "Pro"}
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              className="hidden md:flex gap-1.5 text-primary border-primary/30 hover:bg-primary/5 bg-transparent"
              onClick={() => setShowSubscription(true)}
            >
              <Crown className="h-4 w-4" />
              Upgrade
            </Button>

            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative h-9 w-9" asChild>
              <Link href="/university-updates">
                <GraduationCap className="h-5 w-5" />
                <span className="sr-only">University Updates</span>
              </Link>
            </Button>

            <Button variant="ghost" size="icon" className="relative h-9 w-9" asChild>
              <Link href="/notifications">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Link>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 px-2">
                  <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                    <AvatarImage src={profile?.avatar || ""} alt={displayName} />
                    <AvatarFallback className="bg-primary/10 text-primary">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-medium">{displayName}</span>
                      {getVerificationBadge()}
                    </div>
                    <span className="text-xs text-muted-foreground">{getVerificationText()}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wallet" className="flex items-center cursor-pointer">
                    <Wallet className="mr-2 h-4 w-4" />
                    Wallet
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/notifications" className="flex items-center cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                    {unreadCount > 0 && (
                      <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/university-updates" className="flex items-center cursor-pointer">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    University Updates
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/submit-idea" className="flex items-center cursor-pointer">
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Submit Idea
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/my-submissions" className="flex items-center cursor-pointer">
                    <FileText className="mr-2 h-4 w-4" />
                    My Submissions
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/leaderboard" className="flex items-center cursor-pointer">
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center cursor-pointer">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center cursor-pointer text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <SubscriptionModal open={showSubscription} onOpenChange={setShowSubscription} />
    </>
  )
}
