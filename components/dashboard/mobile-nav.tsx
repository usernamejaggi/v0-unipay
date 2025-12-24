"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Logo } from "@/components/logo"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, ListTodo, Wallet, User, Lightbulb, FileText, ShieldCheck } from "lucide-react"
import { isAdmin, currentUserEmail } from "@/lib/student-state"
import { ThemeToggle } from "@/components/theme-toggle"

interface MobileNavProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/tasks", label: "Tasks", icon: ListTodo },
  { href: "/submit-idea", label: "Submit Idea", icon: Lightbulb },
  { href: "/my-submissions", label: "My Submissions", icon: FileText },
  { href: "/wallet", label: "Wallet", icon: Wallet },
  { href: "/profile", label: "Profile", icon: User },
]

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const pathname = usePathname()

  const showAdminLink = isAdmin(currentUserEmail)

  return (
    <>
      {/* Sheet for hamburger menu */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-72">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center justify-between">
              <Logo />
              <ThemeToggle />
            </SheetTitle>
          </SheetHeader>

          <nav className="mt-6 flex flex-col gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => onOpenChange?.(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}

            {showAdminLink && (
              <Link
                href="/admin"
                onClick={() => onOpenChange?.(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 border-t mt-2 pt-4",
                  pathname === "/admin"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <ShieldCheck className="h-5 w-5" />
                Admin Panel
              </Link>
            )}
          </nav>
        </SheetContent>
      </Sheet>

      {/* Bottom navigation bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
        <nav className="flex items-center justify-around h-16">
          {[
            { href: "/dashboard", label: "Home", icon: Home },
            { href: "/tasks", label: "Tasks", icon: ListTodo },
            { href: "/submit-idea", label: "Idea", icon: Lightbulb },
            { href: "/wallet", label: "Wallet", icon: Wallet },
            { href: "/profile", label: "Profile", icon: User },
          ].map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-300",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className={cn("h-5 w-5 transition-transform duration-300", isActive && "scale-110")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </>
  )
}
