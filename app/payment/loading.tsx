import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { SkeletonText, SkeletonButton } from "@/components/ui/skeleton-card"

export default function PaymentLoading() {
  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header Skeleton */}
        <div className="text-center mb-8 space-y-2">
          <SkeletonText width="w-48" className="h-8 mx-auto" />
          <SkeletonText width="w-64" className="h-4 mx-auto" />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Payment Methods Skeleton */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <SkeletonText width="w-40" className="h-5" />
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment method options */}
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg border">
                    <div className="h-5 w-5 rounded-full skeleton-shimmer" />
                    <div className="h-10 w-10 rounded skeleton-shimmer" />
                    <div className="flex-1 space-y-2">
                      <SkeletonText width="w-24" />
                      <SkeletonText width="w-40" className="h-3" />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Payment Form Skeleton */}
            <Card>
              <CardHeader>
                <SkeletonText width="w-32" className="h-5" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <SkeletonText width="w-20" className="h-4" />
                  <div className="h-10 w-full rounded-md skeleton-shimmer" />
                </div>
                <div className="space-y-2">
                  <SkeletonText width="w-24" className="h-4" />
                  <div className="h-10 w-full rounded-md skeleton-shimmer" />
                </div>
                <SkeletonButton className="w-full h-11" />
              </CardContent>
            </Card>
          </div>

          {/* Order Summary Skeleton */}
          <div>
            <Card>
              <CardHeader>
                <SkeletonText width="w-32" className="h-5" />
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 space-y-2">
                  <SkeletonText width="w-24" className="h-5" />
                  <SkeletonText width="w-32" className="h-3" />
                </div>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between">
                    <SkeletonText width="w-20" className="h-4" />
                    <SkeletonText width="w-16" className="h-4" />
                  </div>
                  <div className="flex justify-between">
                    <SkeletonText width="w-24" className="h-4" />
                    <SkeletonText width="w-12" className="h-4" />
                  </div>
                  <div className="border-t pt-3 flex justify-between">
                    <SkeletonText width="w-16" className="h-5" />
                    <SkeletonText width="w-20" className="h-5" />
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50">
                  <div className="h-4 w-4 rounded skeleton-shimmer" />
                  <SkeletonText width="w-40" className="h-3" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
