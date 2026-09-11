'use client'

import { Check } from 'lucide-react'
import { ORDER_STATUSES, type OrderStatus } from '@/lib/orders'

export default function OrderTimeline({ currentStatus }: { currentStatus: OrderStatus }) {
  const currentIndex = ORDER_STATUSES.findIndex((s) => s.key === currentStatus)
  const progressPercent = ((currentIndex + 1) / ORDER_STATUSES.length) * 100

  return (
    <div className="bg-night-card rounded-2xl border border-white/5 p-5 md:p-6">
      <h2 className="font-bold mb-6 text-lg">Order Progress</h2>

      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-light transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {ORDER_STATUSES.map((status, index) => {
          const isCompleted = index <= currentIndex
          const isActive = index === currentIndex

          return (
            <div key={status.key} className="flex items-start gap-4">
              {/* Circle */}
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isCompleted
                    ? 'bg-gold text-night'
                    : 'bg-white/5 text-white/30 border border-white/10'
                } ${isActive ? 'ring-4 ring-gold/30 scale-110' : ''}`}
              >
                {isCompleted ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <span className="text-lg">{status.emoji}</span>
                )}
              </div>

              {/* Text */}
              <div className="flex-1 pt-1">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-bold text-sm md:text-base ${
                      isCompleted ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {status.label}
                  </p>
                  {isActive && (
                    <span className="text-[10px] bg-gold text-night px-2 py-0.5 rounded-full font-bold animate-pulse">
                      NOW
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs md:text-sm ${
                    isCompleted ? 'text-white/60' : 'text-white/30'
                  }`}
                >
                  {status.desc}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}