import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SkeletonText, SkeletonAvatar, SkeletonButton } from "@/components/ui/skeleton-card"

export default function ProfileLoading() {
  return (
    <div className="space-y-6">
      {/* Profile Header Skeleton */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <SkeletonAvatar className="h-24 w-24" />
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-3">
                <SkeletonText width="w-40" className="h-7" />
                <div className="h-6 w-20 rounded-full skeleton-shimmer" />
              </div>
              <SkeletonText width="w-48" className="h-4" />
              <div className="flex gap-2">
                <div className="h-6 w-24 rounded-full skeleton-shimmer" />
                <div className="h-6 w-20 rounded-full skeleton-shimmer" />
              </div>
            </div>
            <SkeletonButton className="w-28" />
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full skeleton-shimmer" />
              <SkeletonText width="w-20" className="h-3" />
            </div>
            <SkeletonText width="w-16" className="h-7" />
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Profile Details Skeleton */}
        <Card>
          <CardHeader>
            <SkeletonText width="w-32" className="h-5" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex justify-between py-2 border-b last:border-0">
                <SkeletonText width="w-24" className="h-4" />
                <SkeletonText width="w-40" className="h-4" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills Skeleton */}
        <Card>
          <CardHeader>
            <SkeletonText width="w-24" className="h-5" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-7 w-20 rounded-full skeleton-shimmer" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
