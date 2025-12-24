import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SkeletonStatCard, SkeletonAvatar, SkeletonText, SkeletonButton } from "@/components/ui/skeleton-card"

export default function DashboardLoading() {
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
        <div className="flex items-center gap-4">
          <SkeletonAvatar className="h-14 w-14" />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <SkeletonText width="w-48" className="h-6" />
              <div className="h-5 w-20 rounded-full skeleton-shimmer" />
            </div>
            <SkeletonText width="w-64" className="h-4" />
          </div>
        </div>
        <SkeletonButton className="w-24" />
      </div>

      {/* New Tasks Alert Skeleton */}
      <Card>
        <CardContent className="flex items-center gap-4 p-4">
          <div className="h-12 w-12 rounded-full skeleton-shimmer" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-40" />
            <SkeletonText width="w-32" className="h-3" />
          </div>
          <SkeletonButton />
        </CardContent>
      </Card>

      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>

      {/* Main Content Grid Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Level & Wallet Cards */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full skeleton-shimmer" />
                <SkeletonText width="w-24" />
              </div>
              <div className="h-3 w-full rounded-full skeleton-shimmer" />
              <div className="flex justify-between">
                <SkeletonText width="w-16" className="h-3" />
                <SkeletonText width="w-16" className="h-3" />
              </div>
            </Card>
            <Card className="p-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full skeleton-shimmer" />
                <SkeletonText width="w-20" />
              </div>
              <SkeletonText width="w-32" className="h-8" />
              <SkeletonText width="w-40" className="h-3" />
            </Card>
          </div>

          {/* Recent Tasks Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <SkeletonText width="w-32" className="h-5" />
                <SkeletonButton className="w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded skeleton-shimmer" />
                    <div className="space-y-2">
                      <SkeletonText width="w-40" />
                      <SkeletonText width="w-24" className="h-3" />
                    </div>
                  </div>
                  <SkeletonText width="w-16" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <SkeletonText width="w-28" className="h-5" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 rounded-lg border">
                <div className="h-10 w-10 mx-auto rounded skeleton-shimmer mb-2" />
                <SkeletonText width="w-24" className="mx-auto h-3" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      <SkeletonText width="w-6" />
                      <SkeletonText width="w-20" />
                    </div>
                    <SkeletonText width="w-16" />
                  </div>
                ))}
              </div>
              <SkeletonButton className="w-full" />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Tips Skeleton */}
      <Card>
        <CardHeader>
          <SkeletonText width="w-24" className="h-5" />
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/50 space-y-2">
                <SkeletonText width="w-32" />
                <SkeletonText width="w-full" className="h-3" />
                <SkeletonText width="w-3/4" className="h-3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
