import { FoodCardSkeleton, Skeleton } from '@/components/Skeleton'

export default function Loading() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-b from-night-soft to-night border-b border-white/5 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-3">
          <Skeleton className="h-4 w-32 mx-auto" />
          <Skeleton className="h-12 w-64 mx-auto" />
          <Skeleton className="h-4 w-80 mx-auto" />
        </div>
      </div>

      {/* Search */}
      <div className="bg-night/95 border-b border-white/5 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <Skeleton className="h-12 w-full max-w-md mx-auto rounded-full" />
        </div>
      </div>

      {/* Categories */}
      <div className="py-6 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 flex gap-3">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-24 rounded-full flex-shrink-0" />
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-4 w-32 mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}