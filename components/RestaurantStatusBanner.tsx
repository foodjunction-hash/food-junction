'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, AlertTriangle, Power, Clock, Phone } from 'lucide-react'

export default function RestaurantStatusBanner() {
  const [isOpen, setIsOpen] = useState<boolean | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('is_open, opening_time, closing_time, phone')
          .eq('id', 'main')
          .maybeSingle()

        if (error) throw error
        setIsOpen(data?.is_open ?? true)
      } catch (err) {
        console.error('Failed to fetch restaurant status:', err)
      }
    }

    checkStatus()

    // Poll every 30 seconds
    const interval = setInterval(checkStatus, 30000)

    // Listen for realtime changes
    const channel = supabase
      .channel('settings-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload: any) => {
          if (payload.new?.is_open !== undefined) {
            setIsOpen(payload.new.is_open)
          }
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  if (isOpen !== false || dismissed) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[100] animate-slideDown">
      {/* Backdrop blur overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 via-red-500/10 to-red-500/20 backdrop-blur-sm" />

      <div className="relative max-w-7xl mx-auto px-4 py-3">
        <div className="relative overflow-hidden bg-gradient-to-r from-red-500/95 via-red-600/95 to-red-500/95 backdrop-blur-xl rounded-2xl border border-red-400/50 shadow-2xl shadow-red-500/30">
          {/* Animated stripes */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 20px)',
              }}
            />
          </div>

          {/* Glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-red-300/30 rounded-full blur-3xl animate-pulse" />

          <div className="relative z-10 flex items-center gap-3 p-4 md:px-6 md:py-4 flex-wrap">
            {/* Icon */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 bg-white/40 rounded-full blur-lg animate-pulse" />
              <div className="relative w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center border-2 border-white/40">
                <Power size={22} className="text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Text */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <AlertTriangle
                  size={16}
                  className="text-yellow-200 flex-shrink-0"
                />
                <p className="font-bold text-white text-base md:text-lg">
                  Restaurant is Currently Closed
                </p>
                <span className="text-[10px] bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-white border border-white/30 animate-pulse">
                  ● CLOSED
                </span>
              </div>
              <p className="text-white/90 text-xs md:text-sm flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  We&apos;re not accepting orders right now
                </span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1.5">
                  <Phone size={12} />
                  Call us to know when we open
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0 ml-auto">
              <a
                href="tel:+919973318421"
                className="hidden md:inline-flex items-center gap-1.5 bg-white text-red-600 font-bold px-4 py-2 rounded-full hover:scale-105 transition-all shadow-lg text-sm"
              >
                <Phone size={14} /> Call Now
              </a>

              {/* Dismiss */}
              <button
                onClick={() => setDismissed(true)}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur flex items-center justify-center transition-all hover:scale-110 border border-white/30"
                aria-label="Dismiss"
                title="Dismiss for now"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}