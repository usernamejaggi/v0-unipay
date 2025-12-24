import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SkeletonText, SkeletonAvatar } from "@/components/ui/skeleton-card"

export default function LeaderboardLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <SkeletonText width="w-36" className="h-7" />
        <SkeletonText width="w-64" className="h-4" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-2">
        <div className="h-10 w-32 rounded-md skeleton-shimmer" />
        <div className="h-10 w-32 rounded-md skeleton-shimmer" />
      </div>

      {/* Top 3 Podium Skeleton */}
      <div className="grid md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className={i === 1 ? "md:-mt-4" : ""}>
            <CardContent className="p-6 text-center space-y-4">
              <div className="h-8 w-8 rounded-full skeleton-shimmer mx-auto" />
              <SkeletonAvatar className="h-20 w-20 mx-auto" />
              <SkeletonText width="w-24" className="h-5 mx-auto" />
              <SkeletonText width="w-20" className="h-4 mx-auto" />
              <SkeletonText width="w-16" className="h-6 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Leaderboard List Skeleton */}
      <Card>
        <CardHeader>
          <SkeletonText width="w-24" className="h-5" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <SkeletonText width="w-8" className="h-5" />
                <SkeletonAvatar className="h-10 w-10" />
                <div className="space-y-2">
                  <SkeletonText width="w-32" />
                  <SkeletonText width="w-20" className="h-3" />
                </div>
              </div>
              <div className="text-right space-y-2">
                <SkeletonText width="w-20" />
                <SkeletonText width="w-16" className="h-3" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
