import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SkeletonText, SkeletonButton } from "@/components/ui/skeleton-card"

export default function WalletLoading() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <SkeletonText width="w-32" className="h-7" />
        <SkeletonText width="w-64" className="h-4" />
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Earnings Summary Skeleton */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center space-y-2">
                <SkeletonText width="w-24" className="h-4 mx-auto" />
                <SkeletonText width="w-40" className="h-10 mx-auto" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="text-center p-4 rounded-lg bg-muted/50 space-y-2">
                    <SkeletonText width="w-20" className="h-3 mx-auto" />
                    <SkeletonText width="w-16" className="h-6 mx-auto" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Transaction History Skeleton */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <SkeletonText width="w-40" className="h-5" />
                <SkeletonButton className="w-24" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full skeleton-shimmer" />
                    <div className="space-y-2">
                      <SkeletonText width="w-32" />
                      <SkeletonText width="w-24" className="h-3" />
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

        {/* Withdraw Card Skeleton */}
        <div>
          <Card>
            <CardHeader>
              <SkeletonText width="w-32" className="h-5" />
              <SkeletonText width="w-48" className="h-3" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                <SkeletonText width="w-28" className="h-3" />
                <SkeletonText width="w-24" className="h-7" />
              </div>
              <div className="space-y-2">
                <SkeletonText width="w-24" className="h-4" />
                <div className="h-10 w-full rounded-md skeleton-shimmer" />
              </div>
              <div className="space-y-2">
                <SkeletonText width="w-32" className="h-4" />
                <div className="h-10 w-full rounded-md skeleton-shimmer" />
              </div>
              <SkeletonButton className="w-full h-10" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
