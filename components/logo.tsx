export function Logo({ className = "", size = "default" }: { className?: string; size?: "default" | "large" }) {
  const isLarge = size === "large"

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${isLarge ? "h-10 w-10" : "h-8 w-8"}`}>
        <svg viewBox="0 0 40 40" className="w-full h-full" fill="none">
          {/* Circular base */}
          <circle cx="20" cy="20" r="18" fill="#2563EB" />

          {/* Abstract "U" formed by two vertical bars connected at bottom */}
          <path
            d="M12 12V24C12 28.4183 15.5817 32 20 32C24.4183 32 28 28.4183 28 24V12"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
          />

          {/* Payment flow indicator - small arrow pointing up inside U */}
          <path
            d="M20 26V18M20 18L16 22M20 18L24 22"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
        </svg>
      </div>

      <div className="flex flex-col">
        <span className={`font-semibold tracking-tight text-foreground ${isLarge ? "text-xl" : "text-lg"}`}>
          UniPay
        </span>
        {isLarge && <span className="text-xs text-muted-foreground">LPU Student Platform</span>}
      </div>
    </div>
  )
}
