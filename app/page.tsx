"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Wallet,
  Shield,
  Clock,
  Star,
  TrendingUp,
  Briefcase,
  PenTool,
  MessageSquare,
  Search,
  Sparkles,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false, isClicked: false })
  const particlesRef = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
      mass: number
      color: string
      alpha: number
      pulsePhase: number
      orbitAngle: number
      orbitSpeed: number
      magneticCharge: number
    }>
  >([])
  const sparksRef = useRef<
    Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      color: string
      size: number
    }>
  >([])
  const lightningsRef = useRef<
    Array<{
      points: Array<{ x: number; y: number }>
      alpha: number
      width: number
      color: string
    }>
  >([])
  const ripplesRef = useRef<
    Array<{
      x: number
      y: number
      radius: number
      maxRadius: number
      alpha: number
    }>
  >([])
  const trailsRef = useRef<Array<{ x: number; y: number; alpha: number; radius: number }>>([])
  const timeRef = useRef(0)
  const lastClickRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight

    const resizeCanvas = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      initParticles()
    }

    const initParticles = () => {
      const particleCount = Math.min(Math.floor((width * height) / 18000), 80)
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2.5 + 1
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          radius,
          mass: radius * radius,
          color: Math.random() > 0.6 ? "14, 165, 233" : "37, 99, 235",
          alpha: Math.random() * 0.5 + 0.2,
          pulsePhase: Math.random() * Math.PI * 2,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() - 0.5) * 0.015,
          magneticCharge: Math.random() > 0.5 ? 1 : -1,
        })
      }
    }

    // Generate lightning bolt between two points
    const generateLightning = (startX: number, startY: number, endX: number, endY: number, segments = 8) => {
      const points: Array<{ x: number; y: number }> = [{ x: startX, y: startY }]
      const dx = endX - startX
      const dy = endY - startY

      for (let i = 1; i < segments; i++) {
        const t = i / segments
        const midX = startX + dx * t + (Math.random() - 0.5) * 60
        const midY = startY + dy * t + (Math.random() - 0.5) * 60
        points.push({ x: midX, y: midY })
      }
      points.push({ x: endX, y: endY })

      return points
    }

    // Create spark burst at position
    const createSparkBurst = (x: number, y: number, count = 12) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.5
        const speed = Math.random() * 8 + 4
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          color: Math.random() > 0.5 ? "37, 99, 235" : "250, 204, 21",
          size: Math.random() * 3 + 1,
        })
      }
    }

    // Create ripple effect
    const createRipple = (x: number, y: number) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 150,
        alpha: 0.6,
      })
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { ...mouseRef.current, x: e.clientX, y: e.clientY, isActive: true }
    }

    const handleMouseLeave = () => {
      mouseRef.current.isActive = false
    }

    const handleClick = (e: MouseEvent) => {
      const now = Date.now()
      if (now - lastClickRef.current > 100) {
        lastClickRef.current = now
        createSparkBurst(e.clientX, e.clientY, 20)
        createRipple(e.clientX, e.clientY)

        // Create lightning bolts from click to nearby particles
        const nearbyParticles = particlesRef.current
          .filter((p) => {
            const dx = p.x - e.clientX
            const dy = p.y - e.clientY
            return Math.sqrt(dx * dx + dy * dy) < 200
          })
          .slice(0, 3)

        nearbyParticles.forEach((p) => {
          lightningsRef.current.push({
            points: generateLightning(e.clientX, e.clientY, p.x, p.y),
            alpha: 1,
            width: 2,
            color: "37, 99, 235",
          })
        })
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { ...mouseRef.current, x: e.touches[0].clientX, y: e.touches[0].clientY, isActive: true }
      }
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        createSparkBurst(touch.clientX, touch.clientY, 15)
        createRipple(touch.clientX, touch.clientY)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)
    window.addEventListener("click", handleClick)
    window.addEventListener("touchmove", handleTouchMove)
    window.addEventListener("touchstart", handleTouchStart)

    let animationId: number
    const friction = 0.98
    const cursorForce = 6000
    const cursorRadius = 180

    const animate = () => {
      timeRef.current += 0.016
      ctx.clearRect(0, 0, width, height)

      // Draw and update ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 4
        ripple.alpha -= 0.02

        if (ripple.alpha > 0) {
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(37, 99, 235, ${ripple.alpha})`
          ctx.lineWidth = 2
          ctx.stroke()

          // Inner ripple
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius * 0.6, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(14, 165, 233, ${ripple.alpha * 0.5})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        return ripple.alpha > 0
      })

      // Draw and update lightning bolts
      lightningsRef.current = lightningsRef.current.filter((lightning) => {
        lightning.alpha -= 0.08

        if (lightning.alpha > 0) {
          ctx.beginPath()
          ctx.moveTo(lightning.points[0].x, lightning.points[0].y)

          for (let i = 1; i < lightning.points.length; i++) {
            ctx.lineTo(lightning.points[i].x, lightning.points[i].y)
          }

          // Glow effect
          ctx.shadowBlur = 15
          ctx.shadowColor = `rgba(${lightning.color}, ${lightning.alpha})`
          ctx.strokeStyle = `rgba(${lightning.color}, ${lightning.alpha})`
          ctx.lineWidth = lightning.width
          ctx.stroke()

          // Bright core
          ctx.shadowBlur = 0
          ctx.strokeStyle = `rgba(255, 255, 255, ${lightning.alpha * 0.8})`
          ctx.lineWidth = lightning.width * 0.3
          ctx.stroke()
        }

        return lightning.alpha > 0
      })
      ctx.shadowBlur = 0

      // Draw and update sparks
      sparksRef.current = sparksRef.current.filter((spark) => {
        spark.x += spark.vx
        spark.y += spark.vy
        spark.vy += 0.2 // Gravity
        spark.vx *= 0.98
        spark.life -= 0.03

        if (spark.life > 0) {
          const alpha = spark.life

          // Spark trail
          ctx.beginPath()
          ctx.moveTo(spark.x, spark.y)
          ctx.lineTo(spark.x - spark.vx * 3, spark.y - spark.vy * 3)
          ctx.strokeStyle = `rgba(${spark.color}, ${alpha * 0.5})`
          ctx.lineWidth = spark.size * 0.5
          ctx.stroke()

          // Spark head
          ctx.beginPath()
          ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${spark.color}, ${alpha})`
          ctx.fill()

          // Bright center
          ctx.beginPath()
          ctx.arc(spark.x, spark.y, spark.size * 0.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`
          ctx.fill()
        }

        return spark.life > 0
      })

      // Cursor trail
      if (mouseRef.current.isActive) {
        trailsRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          alpha: 0.5,
          radius: 6,
        })
      }

      // Update and draw trails
      trailsRef.current = trailsRef.current.filter((trail) => {
        trail.alpha -= 0.025
        trail.radius *= 0.94
        if (trail.alpha > 0) {
          ctx.beginPath()
          ctx.arc(trail.x, trail.y, trail.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(37, 99, 235, ${trail.alpha * 0.4})`
          ctx.fill()
        }
        return trail.alpha > 0
      })

      if (trailsRef.current.length > 40) {
        trailsRef.current = trailsRef.current.slice(-40)
      }

      // Cursor glow and energy field
      if (mouseRef.current.isActive) {
        // Pulsing energy rings
        const pulseTime = timeRef.current * 3
        for (let i = 0; i < 3; i++) {
          const ringRadius = 20 + i * 15 + Math.sin(pulseTime + i) * 5
          const ringAlpha = 0.15 - i * 0.04
          ctx.beginPath()
          ctx.arc(mouseRef.current.x, mouseRef.current.y, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(37, 99, 235, ${ringAlpha})`
          ctx.lineWidth = 1.5
          ctx.stroke()
        }

        // Central glow
        const glowGradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          50,
        )
        glowGradient.addColorStop(0, "rgba(37, 99, 235, 0.2)")
        glowGradient.addColorStop(0.5, "rgba(37, 99, 235, 0.08)")
        glowGradient.addColorStop(1, "rgba(37, 99, 235, 0)")
        ctx.fillStyle = glowGradient
        ctx.beginPath()
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 50, 0, Math.PI * 2)
        ctx.fill()

        // Occasional mini lightning from cursor
        if (Math.random() < 0.02) {
          const angle = Math.random() * Math.PI * 2
          const endX = mouseRef.current.x + Math.cos(angle) * (60 + Math.random() * 40)
          const endY = mouseRef.current.y + Math.sin(angle) * (60 + Math.random() * 40)
          lightningsRef.current.push({
            points: generateLightning(mouseRef.current.x, mouseRef.current.y, endX, endY, 4),
            alpha: 0.6,
            width: 1,
            color: "14, 165, 233",
          })
        }
      }

      // Update particles with physics
      particlesRef.current.forEach((particle, i) => {
        particle.orbitAngle += particle.orbitSpeed
        particle.pulsePhase += 0.025
        const pulse = 1 + Math.sin(particle.pulsePhase) * 0.12

        // Cursor anti-gravity interaction
        if (mouseRef.current.isActive) {
          const dx = particle.x - mouseRef.current.x
          const dy = particle.y - mouseRef.current.y
          const distSq = dx * dx + dy * dy
          const dist = Math.sqrt(distSq)

          if (dist < cursorRadius && dist > 0) {
            const force = (cursorForce / distSq) * particle.magneticCharge
            const forceX = (dx / dist) * force
            const forceY = (dy / dist) * force

            const tangentX = -dy / dist
            const tangentY = dx / dist
            const swirl = force * 0.25

            particle.vx += (forceX + tangentX * swirl) / particle.mass
            particle.vy += (forceY + tangentY * swirl) / particle.mass
          }
        }

        // Particle connections
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j]
          const dx = other.x - particle.x
          const dy = other.y - particle.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 100 && dist > 0) {
            const lineAlpha = (1 - dist / 100) * 0.12
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        // Apply friction and update position
        particle.vx *= friction
        particle.vy *= friction
        particle.vx += Math.sin(particle.orbitAngle) * 0.03
        particle.vy += Math.cos(particle.orbitAngle) * 0.02
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around screen
        if (particle.x < -30) particle.x = width + 30
        if (particle.x > width + 30) particle.x = -30
        if (particle.y < -30) particle.y = height + 30
        if (particle.y > height + 30) particle.y = -30

        // Draw particle
        const drawRadius = particle.radius * pulse

        // Glow
        const particleGlow = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          drawRadius * 3.5,
        )
        particleGlow.addColorStop(0, `rgba(${particle.color}, ${particle.alpha * 0.25})`)
        particleGlow.addColorStop(1, `rgba(${particle.color}, 0)`)
        ctx.fillStyle = particleGlow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, drawRadius * 3.5, 0, Math.PI * 2)
        ctx.fill()

        // Core
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, drawRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`
        ctx.fill()

        // Center highlight
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, drawRadius * 0.35, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.alpha * 0.5})`
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
      window.removeEventListener("click", handleClick)
      window.removeEventListener("touchmove", handleTouchMove)
      window.removeEventListener("touchstart", handleTouchStart)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }} />
}

export default function LandingPage() {
  const [email, setEmail] = useState("")
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({})
  const observerRefs = useRef<Record<string, HTMLElement | null>>({})

  useEffect(() => {
    // Set hero as visible immediately
    setIsVisible((prev) => ({ ...prev, hero: true }))

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    )

    Object.values(observerRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const setRef = (id: string) => (el: HTMLElement | null) => {
    observerRefs.current[id] = el
  }

  const stats = [
    { value: "25,000+", label: "LPU Students" },
    { value: "₹50L+", label: "Paid Out" },
    { value: "4.9/5", label: "Rating" },
    { value: "24hrs", label: "Avg. Payout" },
  ]

  const features = [
    {
      icon: Shield,
      title: "Verified Students Only",
      description: "Exclusively for LPU students with college ID verification",
    },
    {
      icon: Wallet,
      title: "Daily Withdrawals",
      description: "Withdraw earnings to your bank account every day",
    },
    {
      icon: Clock,
      title: "Flexible Hours",
      description: "Work anytime between classes or during breaks",
    },
    {
      icon: TrendingUp,
      title: "Skill Growth",
      description: "Build real-world experience while you study",
    },
  ]

  const taskTypes = [
    { icon: PenTool, title: "Content Writing", earning: "₹50-200/task" },
    { icon: Search, title: "Research Tasks", earning: "₹30-150/task" },
    { icon: MessageSquare, title: "Survey & Reviews", earning: "₹20-100/task" },
    { icon: Briefcase, title: "Data Entry", earning: "₹40-120/task" },
  ]

  const testimonials = [
    {
      name: "Priya Singh",
      course: "B.Tech CSE, 3rd Year",
      text: "UniPay helped me earn while studying. The tasks are genuine and payments are always on time.",
      rating: 5,
    },
    {
      name: "Amit Kumar",
      course: "MBA, 2nd Year",
      text: "Great platform for students. I've earned over ₹15,000 in just two months!",
      rating: 5,
    },
    {
      name: "Sneha Patel",
      course: "BBA, Final Year",
      text: "Love the flexibility. I complete tasks between classes and the money adds up quickly.",
      rating: 5,
    },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      window.location.href = `/login?email=${encodeURIComponent(email)}`
    }
  }

  return (
    <div className="min-h-screen bg-background relative">
      <InteractiveBackground />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Logo />
            <nav className="hidden md:flex items-center gap-8">
              {["Features", "How it Works", "Testimonials"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <Button variant="ghost" asChild className="hidden sm:flex">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild className="btn-hover">
                <a href="#signup">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Added relative z-10 to keep content above background */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div
              className={`transition-all duration-500 ${
                isVisible["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              id="hero"
              ref={setRef("hero")}
            >
              <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-primary/10 text-primary border-0">
                <GraduationCap className="h-4 w-4 mr-2" />
                Exclusively for LPU Students
              </Badge>
            </div>

            <h1
              className={`text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 transition-all duration-500 delay-100 ${
                isVisible["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Earn While You <span className="text-primary">Learn</span>
            </h1>

            <p
              className={`text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto transition-all duration-500 delay-200 ${
                isVisible["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Complete simple tasks, build skills, and earn real money. Made by LPU students, for LPU students.
            </p>

            {/* Signup Form */}
            <form
              onSubmit={handleSubmit}
              id="signup"
              className={`flex flex-col sm:flex-row gap-3 max-w-md mx-auto transition-all duration-500 delay-300 ${
                isVisible["hero"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Input
                type="email"
                placeholder="Enter your LPU email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 px-4 bg-card border-border"
                required
              />
              <Button type="submit" size="lg" className="h-12 px-8 btn-hover">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </form>

            <p
              className={`text-sm text-muted-foreground mt-4 transition-all duration-500 delay-400 ${
                isVisible["hero"] ? "opacity-100" : "opacity-0"
              }`}
            >
              Free to join. No credit card required.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section - Added relative z-10 */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-y border-border bg-secondary/50 relative z-10">
        <div className="max-w-7xl mx-auto" id="stats" ref={setRef("stats")}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={`text-center transition-all duration-500 ${
                  isVisible["stats"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-3xl sm:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Added relative z-10 */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" id="features-header" ref={setRef("features-header")}>
            <h2
              className={`text-3xl sm:text-4xl font-bold text-foreground mb-4 transition-all duration-500 ${
                isVisible["features-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Why Students Love UniPay
            </h2>
            <p
              className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-100 ${
                isVisible["features-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Built specifically for the needs of college students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6" id="features-grid" ref={setRef("features-grid")}>
            {features.map((feature, index) => (
              <Card
                key={feature.title}
                className={`border border-border bg-card/80 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 hover:scale-[1.02] transition-all duration-300 ${
                  isVisible["features-grid"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Task Types Section - Added relative z-10 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" id="tasks-header" ref={setRef("tasks-header")}>
            <h2
              className={`text-3xl sm:text-4xl font-bold text-foreground mb-4 transition-all duration-500 ${
                isVisible["tasks-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Tasks You Can Complete
            </h2>
            <p
              className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-100 ${
                isVisible["tasks-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Choose from a variety of tasks that match your skills
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" id="tasks-grid" ref={setRef("tasks-grid")}>
            {taskTypes.map((task, index) => (
              <Card
                key={task.title}
                className={`border border-border bg-card/80 backdrop-blur-sm hover:shadow-lg hover:border-primary/20 hover:scale-[1.02] transition-all duration-300 ${
                  isVisible["tasks-grid"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <task.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{task.title}</h3>
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">
                    {task.earning}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works Section - Added relative z-10 */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" id="how-header" ref={setRef("how-header")}>
            <h2
              className={`text-3xl sm:text-4xl font-bold text-foreground mb-4 transition-all duration-500 ${
                isVisible["how-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              How It Works
            </h2>
            <p
              className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-100 ${
                isVisible["how-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8" id="how-grid" ref={setRef("how-grid")}>
            {[
              {
                step: "01",
                title: "Sign Up & Verify",
                description: "Create your account using your LPU email and verify your student ID",
              },
              {
                step: "02",
                title: "Browse & Complete",
                description: "Choose tasks that match your skills and complete them at your own pace",
              },
              {
                step: "03",
                title: "Earn & Withdraw",
                description: "Get paid for completed tasks and withdraw to your bank daily",
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className={`relative text-center transition-all duration-500 ${
                  isVisible["how-grid"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-6xl font-bold text-primary/10 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section - Added relative z-10 */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-secondary/50 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16" id="testimonials-header" ref={setRef("testimonials-header")}>
            <h2
              className={`text-3xl sm:text-4xl font-bold text-foreground mb-4 transition-all duration-500 ${
                isVisible["testimonials-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              What Students Say
            </h2>
            <p
              className={`text-lg text-muted-foreground max-w-2xl mx-auto transition-all duration-500 delay-100 ${
                isVisible["testimonials-header"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              Join thousands of satisfied LPU students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6" id="testimonials-grid" ref={setRef("testimonials-grid")}>
            {testimonials.map((testimonial, index) => (
              <Card
                key={testimonial.name}
                className={`border border-border bg-card/80 backdrop-blur-sm hover:scale-[1.02] transition-all duration-500 ${
                  isVisible["testimonials-grid"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.course}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Added relative z-10 */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center" id="cta" ref={setRef("cta")}>
          <div
            className={`transition-all duration-500 ${
              isVisible["cta"] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Ready to Start Earning?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of LPU students already earning with UniPay. Sign up today and start your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="btn-hover">
                <Link href="/login">
                  Get Started Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="#features">Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer - Added relative z-10 */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-border relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Logo />
              <span className="text-sm text-muted-foreground">By LPU Students, For LPU Students</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors duration-200">
                Privacy
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors duration-200">
                Terms
              </Link>
              <Link href="#" className="hover:text-foreground transition-colors duration-200">
                Support
              </Link>
            </div>
            <div className="text-sm text-muted-foreground">© 2025 UniPay. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
