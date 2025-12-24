import { cn } from "@/lib/utils"

interface SkeletonCardProps {
  className?: string
}

export function SkeletonCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-3", className)}>
      <div className="h-4 w-3/4 rounded skeleton-shimmer" />
      <div className="h-3 w-1/2 rounded skeleton-shimmer" />
      <div className="h-20 rounded skeleton-shimmer" />
      <div className="flex gap-2">
        <div className="h-8 w-20 rounded skeleton-shimmer" />
        <div className="h-8 w-20 rounded skeleton-shimmer" />
      </div>
    </div>
  )
}

export function SkeletonTaskCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-3", className)}>
      <div className="flex items-start justify-between">
        <div className="h-5 w-16 rounded-full skeleton-shimmer" />
        <div className="h-5 w-12 rounded skeleton-shimmer" />
      </div>
      <div className="h-5 w-4/5 rounded skeleton-shimmer" />
      <div className="h-4 w-full rounded skeleton-shimmer" />
      <div className="h-4 w-2/3 rounded skeleton-shimmer" />
      <div className="flex items-center gap-4 pt-2">
        <div className="h-4 w-16 rounded skeleton-shimmer" />
        <div className="h-4 w-20 rounded skeleton-shimmer" />
      </div>
      <div className="h-9 w-full rounded skeleton-shimmer" />
    </div>
  )
}

export function SkeletonStatCard({ className }: SkeletonCardProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-4 space-y-2", className)}>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full skeleton-shimmer" />
        <div className="h-4 w-24 rounded skeleton-shimmer" />
      </div>
      <div className="h-8 w-20 rounded skeleton-shimmer" />
      <div className="h-3 w-16 rounded skeleton-shimmer" />
    </div>
  )
}

export function SkeletonAvatar({ className }: SkeletonCardProps) {
  return <div className={cn("rounded-full skeleton-shimmer", className)} />
}

export function SkeletonText({ className, width = "w-full" }: SkeletonCardProps & { width?: string }) {
  return <div className={cn("h-4 rounded skeleton-shimmer", width, className)} />
}

export function SkeletonButton({ className }: SkeletonCardProps) {
  return <div className={cn("h-9 w-24 rounded-md skeleton-shimmer", className)} />
}
