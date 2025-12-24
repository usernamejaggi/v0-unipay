import { Card, CardContent } from "@/components/ui/card"
import { SkeletonTaskCard, SkeletonText } from "@/components/ui/skeleton-card"

export default function TasksLoading() {
  return (
    <div className="space-y-6">
      {/* Verification Banner Skeleton */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full skeleton-shimmer" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-48 rounded skeleton-shimmer" />
            <div className="h-3 w-64 rounded skeleton-shimmer" />
          </div>
          <div className="h-9 w-24 rounded-md skeleton-shimmer" />
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <SkeletonText width="w-40" className="h-7" />
            <div className="h-5 w-16 rounded-full skeleton-shimmer" />
          </div>
          <SkeletonText width="w-64" className="h-4" />
        </div>
        <Card className="border-none bg-secondary">
          <CardContent className="flex items-center gap-3 p-4">
            <div className="h-10 w-10 rounded-full skeleton-shimmer" />
            <div className="space-y-2">
              <SkeletonText width="w-36" className="h-4" />
              <SkeletonText width="w-20" className="h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="h-10 w-64 rounded-md skeleton-shimmer" />
          <div className="h-10 w-32 rounded-md skeleton-shimmer" />
          <div className="h-10 w-32 rounded-md skeleton-shimmer" />
        </div>
        <div className="hidden md:flex h-10 w-40 rounded-md skeleton-shimmer" />
      </div>

      {/* Tasks Grid Skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonTaskCard key={i} />
        ))}
      </div>
    </div>
  )
}
