import { OrderCardSkeleton, Skeleton } from '@/components/Skeleton'

export default function Loading() {
  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="bg-night-card/80 rounded-2xl p-4">
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-16" />
          </div>
        ))}
      </div>

      {/* Search */}
      <Skeleton className="h-12 w-full max-w-md rounded-full mb-6" />

      {/* Orders */}
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <OrderCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}