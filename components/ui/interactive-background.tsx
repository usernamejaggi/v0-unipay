"use client"

import { useEffect, useRef } from "react"

interface Particle {
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
}

interface Spark {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  color: string
  size: number
}

interface Lightning {
  points: Array<{ x: number; y: number }>
  alpha: number
  width: number
  color: string
}

interface Ripple {
  x: number
  y: number
  radius: number
  maxRadius: number
  alpha: number
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -1000, y: -1000, isActive: false })
  const particlesRef = useRef<Particle[]>([])
  const sparksRef = useRef<Spark[]>([])
  const lightningsRef = useRef<Lightning[]>([])
  const ripplesRef = useRef<Ripple[]>([])
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
      const particleCount = Math.min(Math.floor((width * height) / 25000), 50)
      particlesRef.current = []

      for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1
        particlesRef.current.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius,
          mass: radius * radius,
          color: Math.random() > 0.5 ? "14, 165, 233" : "37, 99, 235",
          alpha: Math.random() * 0.4 + 0.1,
          pulsePhase: Math.random() * Math.PI * 2,
          orbitAngle: Math.random() * Math.PI * 2,
          orbitSpeed: (Math.random() - 0.5) * 0.01,
          magneticCharge: Math.random() > 0.5 ? 1 : -1,
        })
      }
    }

    const generateLightning = (startX: number, startY: number, endX: number, endY: number, segments = 6) => {
      const points: Array<{ x: number; y: number }> = [{ x: startX, y: startY }]
      const dx = endX - startX
      const dy = endY - startY

      for (let i = 1; i < segments; i++) {
        const t = i / segments
        const midX = startX + dx * t + (Math.random() - 0.5) * 40
        const midY = startY + dy * t + (Math.random() - 0.5) * 40
        points.push({ x: midX, y: midY })
      }
      points.push({ x: endX, y: endY })

      return points
    }

    const createSparkBurst = (x: number, y: number, count = 10) => {
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2 + Math.random() * 0.3
        const speed = Math.random() * 6 + 3
        sparksRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          maxLife: 1,
          color: Math.random() > 0.5 ? "37, 99, 235" : "250, 204, 21",
          size: Math.random() * 2 + 1,
        })
      }
    }

    const createRipple = (x: number, y: number) => {
      ripplesRef.current.push({
        x,
        y,
        radius: 0,
        maxRadius: 120,
        alpha: 0.5,
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
        createSparkBurst(e.clientX, e.clientY, 15)
        createRipple(e.clientX, e.clientY)

        const nearbyParticles = particlesRef.current
          .filter((p) => {
            const dx = p.x - e.clientX
            const dy = p.y - e.clientY
            return Math.sqrt(dx * dx + dy * dy) < 150
          })
          .slice(0, 2)

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
        createSparkBurst(touch.clientX, touch.clientY, 12)
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
    const cursorForce = 4000
    const cursorRadius = 150

    const animate = () => {
      timeRef.current += 0.016
      ctx.clearRect(0, 0, width, height)

      // Draw ripples
      ripplesRef.current = ripplesRef.current.filter((ripple) => {
        ripple.radius += 3
        ripple.alpha -= 0.015

        if (ripple.alpha > 0) {
          ctx.beginPath()
          ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(37, 99, 235, ${ripple.alpha})`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        return ripple.alpha > 0
      })

      // Draw lightning
      lightningsRef.current = lightningsRef.current.filter((lightning) => {
        lightning.alpha -= 0.06

        if (lightning.alpha > 0) {
          ctx.beginPath()
          ctx.moveTo(lightning.points[0].x, lightning.points[0].y)

          for (let i = 1; i < lightning.points.length; i++) {
            ctx.lineTo(lightning.points[i].x, lightning.points[i].y)
          }

          ctx.shadowBlur = 12
          ctx.shadowColor = `rgba(${lightning.color}, ${lightning.alpha})`
          ctx.strokeStyle = `rgba(${lightning.color}, ${lightning.alpha})`
          ctx.lineWidth = lightning.width
          ctx.stroke()

          ctx.shadowBlur = 0
          ctx.strokeStyle = `rgba(255, 255, 255, ${lightning.alpha * 0.7})`
          ctx.lineWidth = lightning.width * 0.3
          ctx.stroke()
        }

        return lightning.alpha > 0
      })
      ctx.shadowBlur = 0

      // Draw sparks
      sparksRef.current = sparksRef.current.filter((spark) => {
        spark.x += spark.vx
        spark.y += spark.vy
        spark.vy += 0.15
        spark.vx *= 0.98
        spark.life -= 0.025

        if (spark.life > 0) {
          const alpha = spark.life

          ctx.beginPath()
          ctx.moveTo(spark.x, spark.y)
          ctx.lineTo(spark.x - spark.vx * 2, spark.y - spark.vy * 2)
          ctx.strokeStyle = `rgba(${spark.color}, ${alpha * 0.4})`
          ctx.lineWidth = spark.size * 0.4
          ctx.stroke()

          ctx.beginPath()
          ctx.arc(spark.x, spark.y, spark.size, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(${spark.color}, ${alpha})`
          ctx.fill()
        }

        return spark.life > 0
      })

      // Cursor trail
      if (mouseRef.current.isActive) {
        trailsRef.current.push({
          x: mouseRef.current.x,
          y: mouseRef.current.y,
          alpha: 0.4,
          radius: 5,
        })
      }

      trailsRef.current = trailsRef.current.filter((trail) => {
        trail.alpha -= 0.02
        trail.radius *= 0.95
        if (trail.alpha > 0) {
          ctx.beginPath()
          ctx.arc(trail.x, trail.y, trail.radius, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(37, 99, 235, ${trail.alpha * 0.3})`
          ctx.fill()
        }
        return trail.alpha > 0
      })

      if (trailsRef.current.length > 30) {
        trailsRef.current = trailsRef.current.slice(-30)
      }

      // Cursor glow
      if (mouseRef.current.isActive) {
        const pulseTime = timeRef.current * 2
        for (let i = 0; i < 2; i++) {
          const ringRadius = 15 + i * 12 + Math.sin(pulseTime + i) * 3
          const ringAlpha = 0.12 - i * 0.04
          ctx.beginPath()
          ctx.arc(mouseRef.current.x, mouseRef.current.y, ringRadius, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(37, 99, 235, ${ringAlpha})`
          ctx.lineWidth = 1
          ctx.stroke()
        }

        // Mini lightning
        if (Math.random() < 0.015) {
          const angle = Math.random() * Math.PI * 2
          const endX = mouseRef.current.x + Math.cos(angle) * (40 + Math.random() * 30)
          const endY = mouseRef.current.y + Math.sin(angle) * (40 + Math.random() * 30)
          lightningsRef.current.push({
            points: generateLightning(mouseRef.current.x, mouseRef.current.y, endX, endY, 3),
            alpha: 0.5,
            width: 1,
            color: "14, 165, 233",
          })
        }
      }

      // Update particles
      particlesRef.current.forEach((particle, i) => {
        particle.orbitAngle += particle.orbitSpeed
        particle.pulsePhase += 0.02
        const pulse = 1 + Math.sin(particle.pulsePhase) * 0.1

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
            const swirl = force * 0.2

            particle.vx += (forceX + tangentX * swirl) / particle.mass
            particle.vy += (forceY + tangentY * swirl) / particle.mass
          }
        }

        // Connections
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const other = particlesRef.current[j]
          const dx = other.x - particle.x
          const dy = other.y - particle.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 80 && dist > 0) {
            const lineAlpha = (1 - dist / 80) * 0.08
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.strokeStyle = `rgba(37, 99, 235, ${lineAlpha})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }

        particle.vx *= friction
        particle.vy *= friction
        particle.vx += Math.sin(particle.orbitAngle) * 0.02
        particle.vy += Math.cos(particle.orbitAngle) * 0.015
        particle.x += particle.vx
        particle.y += particle.vy

        if (particle.x < -20) particle.x = width + 20
        if (particle.x > width + 20) particle.x = -20
        if (particle.y < -20) particle.y = height + 20
        if (particle.y > height + 20) particle.y = -20

        const drawRadius = particle.radius * pulse

        const particleGlow = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, drawRadius * 3)
        particleGlow.addColorStop(0, `rgba(${particle.color}, ${particle.alpha * 0.2})`)
        particleGlow.addColorStop(1, `rgba(${particle.color}, 0)`)
        ctx.fillStyle = particleGlow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, drawRadius * 3, 0, Math.PI * 2)
        ctx.fill()

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, drawRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particle.color}, ${particle.alpha})`
        ctx.fill()
      })

      // Draw elegant flowing gradient waves
      const waveCount = 3
      for (let w = 0; w < waveCount; w++) {
        ctx.beginPath()
        ctx.moveTo(0, height)

        const baseY = height * (0.6 + w * 0.15)
        const amplitude = 30 + w * 20
        const frequency = 0.002 - w * 0.0005
        const phase = timeRef.current + w * 0.5

        for (let x = 0; x <= width; x += 5) {
          let y = baseY + Math.sin(x * frequency + phase) * amplitude

          // Add mouse interaction - gentle ripple effect
          if (mouseRef.current.isActive) {
            const dx = x - mouseRef.current.x
            const dy = y - mouseRef.current.y
            const dist = Math.sqrt(dx * dx + dy * dy)
            if (dist < 200) {
              const influence = (1 - dist / 200) * 30
              y += Math.sin(dist * 0.05 - timeRef.current * 3) * influence
            }
          }

          ctx.lineTo(x, y)
        }

        ctx.lineTo(width, height)
        ctx.closePath()

        const gradient = ctx.createLinearGradient(0, baseY - amplitude, 0, height)
        const alpha = 0.03 - w * 0.008
        gradient.addColorStop(0, `rgba(37, 99, 235, ${alpha})`)
        gradient.addColorStop(1, `rgba(37, 99, 235, 0)`)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      // Subtle cursor glow
      if (mouseRef.current.isActive) {
        const gradient = ctx.createRadialGradient(
          mouseRef.current.x,
          mouseRef.current.y,
          0,
          mouseRef.current.x,
          mouseRef.current.y,
          150,
        )
        gradient.addColorStop(0, "rgba(37, 99, 235, 0.08)")
        gradient.addColorStop(0.5, "rgba(37, 99, 235, 0.03)")
        gradient.addColorStop(1, "rgba(37, 99, 235, 0)")
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 150, 0, Math.PI * 2)
        ctx.fill()
      }

      // Floating light orbs - subtle and minimal
      const orbCount = 5
      for (let i = 0; i < orbCount; i++) {
        const orbX = (width / orbCount) * i + width / orbCount / 2
        const orbY = height * 0.3 + Math.sin(timeRef.current + i * 1.5) * 50
        const orbRadius = 80 + Math.sin(timeRef.current * 0.5 + i) * 20

        const orbGradient = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, orbRadius)
        orbGradient.addColorStop(0, "rgba(37, 99, 235, 0.04)")
        orbGradient.addColorStop(1, "rgba(37, 99, 235, 0)")
        ctx.fillStyle = orbGradient
        ctx.beginPath()
        ctx.arc(orbX, orbY, orbRadius, 0, Math.PI * 2)
        ctx.fill()
      }

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

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }} />
}
