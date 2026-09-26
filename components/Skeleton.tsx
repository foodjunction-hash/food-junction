'use client'

// ============================================
// BASE SKELETON
// ============================================
export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gradient-to-r from-white/5 via-white/10 to-white/5 bg-[length:200%_100%] animate-shimmer rounded-lg ${className}`}
    />
  )
}

// ============================================
// MENU ITEM SKELETON
// ============================================
export function MenuItemSkeleton() {
  return (
    <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
      <div className="flex items-start gap-3 mb-3">
        <Skeleton className="w-16 h-16 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <Skeleton className="h-5 w-20 mt-2" />
        </div>
      </div>
      <div className="flex gap-1.5 mb-3">
        <Skeleton className="h-6 w-24 rounded-full" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-8 flex-1 rounded-full" />
        <Skeleton className="h-8 flex-1 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  )
}

// ============================================
// ORDER CARD SKELETON
// ============================================
export function OrderCardSkeleton() {
  return (
    <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 md:p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="space-y-2 flex-1">
          <div className="flex gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="space-y-1 text-right">
          <Skeleton className="h-6 w-16 ml-auto" />
          <Skeleton className="h-3 w-12 ml-auto" />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-3 mb-3">
        <div className="bg-night/60 rounded-xl p-3 space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="bg-night/60 rounded-xl p-3 space-y-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    </div>
  )
}

// ============================================
// STATS CARD SKELETON
// ============================================
export function StatsCardSkeleton() {
  return (
    <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4">
      <Skeleton className="w-10 h-10 rounded-xl mb-3" />
      <Skeleton className="h-8 w-20 mb-2" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-2 w-16 mt-2" />
    </div>
  )
}

// ============================================
// FOOD CARD SKELETON (Customer)
// ============================================
export function FoodCardSkeleton() {
  return (
    <div className="bg-night-card rounded-2xl overflow-hidden border border-white/5">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// ============================================
// PROFILE SKELETON
// ============================================
export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Skeleton className="w-16 h-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
        <Skeleton className="h-10 w-24 rounded-full" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>

      {/* Orders */}
      <div className="bg-night-card/80 rounded-2xl p-5 space-y-3">
        <Skeleton className="h-6 w-32" />
        <OrderCardSkeleton />
        <OrderCardSkeleton />
      </div>
    </div>
  )
}

// ============================================
// GLOBAL PAGE LOADING
// ============================================
export function PageLoading({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 mx-auto mb-4 border-4 border-gold/30 border-t-gold rounded-full animate-spin" />
        <p className="text-white/60 text-sm">{text}</p>
      </div>
    </div>
  )
}