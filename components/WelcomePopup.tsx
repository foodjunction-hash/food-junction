'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import {
  X,
  Sparkles,
  ShoppingBag,
  Clock,
  MapPin,
  Star,
  ArrowRight,
  UtensilsCrossed,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Settings = {
  name: string
  address: string
  opening_time: string
  closing_time: string
  is_open: boolean
}

export default function WelcomePopup() {
  const pathname = usePathname()
  const [show, setShow] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const [settings, setSettings] = useState<Settings | null>(null)
  const [mounted, setMounted] = useState(false)

  const showOnPages = ['/']
  const shouldShow = showOnPages.includes(pathname)

  // Load settings
  useEffect(() => {
    if (!shouldShow) return

    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('name, address, opening_time, closing_time, is_open')
          .eq('id', 'main')
          .maybeSingle()

        if (error) throw error
        if (data) setSettings(data)
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
      setMounted(true)
    }

    loadSettings()
  }, [shouldShow])

  // Show immediately
  useEffect(() => {
    if (!shouldShow || !mounted) return
    setShow(true)
  }, [shouldShow, mounted])

  // Auto-close after 8 seconds
  useEffect(() => {
    if (!show) return

    const timer = setTimeout(() => {
      handleClose()
    }, 8000)

    return () => clearTimeout(timer)
  }, [show])

  // Reset on page change
  useEffect(() => {
    setShow(false)
    setLeaving(false)
  }, [pathname])

  const handleClose = () => {
    setLeaving(true)
    setTimeout(() => {
      setShow(false)
      // ✅ Fire event: welcome popup closed
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('welcomeClosed'))
      }
    }, 300)
  }

  if (!shouldShow || !show) return null

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const displayH = h % 12 || 12
    return `${displayH}:${minutes} ${ampm}`
  }

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-all duration-300 ${
        leaving ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-night/80 backdrop-blur-md" />

      <div
        className={`relative max-w-lg w-full bg-night-card rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl shadow-gold/30 transition-all duration-300 ${
          leaving ? 'scale-95 opacity-0' : 'scale-100 opacity-100 animate-popIn'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/30 rounded-full blur-3xl animate-pulse pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

        <div className="h-1.5 bg-gradient-to-r from-gold via-yellow-400 to-gold" />

        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-night/80 backdrop-blur hover:bg-night flex items-center justify-center transition-all border border-white/20 hover:scale-110"
          aria-label="Close"
        >
          <X size={18} className="text-white" />
        </button>

        <div className="relative z-10 p-6 md:p-8">
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="absolute inset-0 bg-gold/40 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-2xl shadow-gold/40 border-4 border-gold/30">
                <UtensilsCrossed
                  size={36}
                  className="text-night"
                  strokeWidth={2.5}
                />
              </div>
              <Sparkles
                size={20}
                className="absolute -top-1 -right-1 text-gold animate-pulse"
                fill="currentColor"
              />
            </div>
          </div>

          <div className="flex justify-center mb-3">
            <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-gold/20 to-gold-dark/20 border border-gold/40 text-gold text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
              <Star size={10} fill="currentColor" />
              Welcome to
            </span>
          </div>

          <h1 className="text-center text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
            {settings?.name || 'Food Junction'}
          </h1>
          <p className="text-center text-white/60 text-sm mb-6">
            The Family Restaurant • Amarpur
          </p>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div
              className={`rounded-xl p-3 text-center border ${
                settings?.is_open
                  ? 'bg-fresh/10 border-fresh/30'
                  : 'bg-red-500/10 border-red-500/30'
              }`}
            >
              <div className="flex justify-center mb-1">
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings?.is_open ? 'bg-fresh' : 'bg-red-400'
                  } animate-pulse`}
                />
              </div>
              <p
                className={`text-xs font-bold uppercase tracking-wide ${
                  settings?.is_open ? 'text-fresh' : 'text-red-400'
                }`}
              >
                {settings?.is_open ? 'Open Now' : 'Closed'}
              </p>
            </div>

            <div className="rounded-xl p-3 text-center border border-gold/30 bg-gold/10">
              <div className="flex justify-center mb-1">
                <Clock size={12} className="text-gold" />
              </div>
              <p className="text-[10px] text-white/60 uppercase tracking-wide">
                Opening Hours
              </p>
              <p className="text-xs font-bold text-gold mt-0.5">
                {formatTime(settings?.opening_time || '10:00')} -{' '}
                {formatTime(settings?.closing_time || '22:00')}
              </p>
            </div>
          </div>

          {settings?.address && (
            <div className="flex items-center justify-center gap-2 text-xs text-white/50 mb-6">
              <MapPin size={12} className="text-gold" />
              <span>{settings.address}</span>
            </div>
          )}

          <div className="space-y-2">
            <Link
              href="/menu"
              onClick={handleClose}
              className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3.5 rounded-full hover:scale-[1.02] transition-all shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40"
            >
              <ShoppingBag size={18} />
              Order Now
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <Link
              href="/menu"
              onClick={handleClose}
              className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-gold border border-white/10 hover:border-gold/40 font-semibold py-3.5 rounded-full transition-all hover:scale-[1.02]"
            >
              <UtensilsCrossed size={18} />
              View Menu
            </Link>
          </div>

          <p className="text-center text-[10px] text-white/30 mt-4 uppercase tracking-widest">
            Fresh • Delicious • Hygienic
          </p>
        </div>

        <div className="h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold" />
      </div>

      <style jsx global>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-popIn {
          animation: popIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}