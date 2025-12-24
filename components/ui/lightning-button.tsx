"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface LightningButtonProps extends Omit<ButtonProps, "asChild"> {
  enableLightning?: boolean
  href?: string
}

export function LightningButton({
  children,
  className,
  enableLightning = true,
  href,
  onClick,
  ...props
}: LightningButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [lightnings, setLightnings] = useState<Array<{ id: number; path: string }>>([])
  const buttonRef = useRef<HTMLButtonElement | HTMLAnchorElement>(null)
  const idCounter = useRef(0)

  useEffect(() => {
    if (!isHovered || !enableLightning) return

    const interval = setInterval(() => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
      const startX = Math.random() * rect.width
      const startY = Math.random() < 0.5 ? 0 : rect.height
      const endX = Math.random() * rect.width
      const endY = startY === 0 ? rect.height : 0

      const points: string[] = [`M ${startX} ${startY}`]
      const segments = 4
      for (let i = 1; i < segments; i++) {
        const t = i / segments
        const midX = startX + (endX - startX) * t + (Math.random() - 0.5) * 20
        const midY = startY + (endY - startY) * t + (Math.random() - 0.5) * 10
        points.push(`L ${midX} ${midY}`)
      }
      points.push(`L ${endX} ${endY}`)

      const newLightning = {
        id: idCounter.current++,
        path: points.join(" "),
      }

      setLightnings((prev) => [...prev.slice(-3), newLightning])

      setTimeout(() => {
        setLightnings((prev) => prev.filter((l) => l.id !== newLightning.id))
      }, 300)
    }, 150)

    return () => clearInterval(interval)
  }, [isHovered, enableLightning])

  const content = (
    <>
      {/* Lightning SVG overlay - in FRONT of button content */}
      {enableLightning && lightnings.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 10 }}>
          {lightnings.map((lightning) => (
            <g key={lightning.id}>
              <path
                d={lightning.path}
                fill="none"
                stroke="rgba(255, 255, 255, 0.6)"
                strokeWidth="4"
                strokeLinecap="round"
                className="animate-lightning-fade"
                style={{ filter: "blur(3px)" }}
              />
              <path
                d={lightning.path}
                fill="none"
                stroke="rgba(255, 255, 255, 0.9)"
                strokeWidth="1.5"
                strokeLinecap="round"
                className="animate-lightning-fade"
              />
            </g>
          ))}
        </svg>
      )}

      {/* Spark particles on hover */}
      {enableLightning && isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 9 }}>
          {[...Array(4)].map((_, i) => (
            <span
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-spark"
              style={{
                left: `${20 + i * 20}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Button content */}
      <span className="relative z-[1] flex items-center gap-1">{children}</span>
    </>
  )

  if (href) {
    return (
      <Link
        href={href}
        ref={buttonRef as React.RefObject<HTMLAnchorElement>}
        className={cn(
          "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors",
          "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90",
          "h-9 px-4 py-2",
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false)
          setLightnings([])
        }}
      >
        {content}
      </Link>
    )
  }

  return (
    <Button
      ref={buttonRef as React.RefObject<HTMLButtonElement>}
      className={cn("relative overflow-hidden", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setLightnings([])
      }}
      onClick={onClick}
      {...props}
    >
      {content}
    </Button>
  )
}
