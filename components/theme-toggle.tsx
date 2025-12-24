"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem("theme")
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && systemDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)

    if (newIsDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9 border-border bg-transparent">
        <div className="h-5 w-5" />
      </Button>
    )
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="h-9 w-9 border-border bg-card hover:bg-secondary"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="relative h-5 w-5">
        <Sun
          className={`h-5 w-5 absolute inset-0 text-amber-500 transition-all duration-300 ${
            isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`h-5 w-5 absolute inset-0 text-blue-400 transition-all duration-300 ${
            isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
    </Button>
  )
}
