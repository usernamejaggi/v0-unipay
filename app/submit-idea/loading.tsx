import { Card, CardContent, CardHeader } from "@/components/ui/card"

function Skeleton({ className }: { className?: string }) {
  return <div className={`animate-shimmer bg-muted rounded ${className}`} />
}

export default function SubmitIdeaLoading() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-1" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
