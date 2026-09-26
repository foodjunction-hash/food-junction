'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { X, Sparkles, ArrowRight, Clock } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Offer = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  priority: number
}

export default function OfferBannerPopup() {
  const pathname = usePathname()
  const [offer, setOffer] = useState<Offer | null>(null)
  const [show, setShow] = useState(false)

  // Sirf home aur offers page par dikhao
  const showOnPages = ['/', '/offers']
  const shouldShow = showOnPages.includes(pathname)

  // ============================================
  // LOAD OFFER
  // ============================================
  useEffect(() => {
    if (!shouldShow) return

    const loadOffer = async () => {
      try {
        const now = new Date().toISOString()
        const { data, error } = await supabase
          .from('offers')
          .select('id, title, description, image_url, priority')
          .eq('is_active', true)
          .or(`start_date.is.null,start_date.lte.${now}`)
          .or(`end_date.is.null,end_date.gte.${now}`)
          .order('priority', { ascending: false })
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        if (error) throw error
        if (data) setOffer(data)
      } catch (err) {
        console.error('Failed to load offer:', err)
      }
    }

    loadOffer()
  }, [shouldShow])

  // ============================================
  // SHOW AFTER 1 SEC
  // ============================================
  useEffect(() => {
    if (!offer || !shouldShow) return

    const showTimer = setTimeout(() => setShow(true), 1000)
    return () => clearTimeout(showTimer)
  }, [offer, shouldShow])

  // ============================================
  // AUTO-HIDE AFTER 6 SEC
  // ============================================
  useEffect(() => {
    if (!show) return
    const hideTimer = setTimeout(() => setShow(false), 6000)
    return () => clearTimeout(hideTimer)
  }, [show])

  // Reset on page change
  useEffect(() => {
    setShow(false)
  }, [pathname])

  const handleDismiss = () => setShow(false)
  const handleClick = () => {
    handleDismiss()
    window.location.href = '/menu'
  }

  if (!offer || !shouldShow) return null

  return (
    <>
      {/* Backdrop blur */}
      <div
        className={`fixed inset-0 z-[90] bg-black/60 backdrop-blur-md transition-opacity duration-500 ${
          show ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleDismiss}
      />

      {/* ============================================
          BADA BANNER (top-center se slide-down)
          ============================================ */}
      <div
        className={`fixed inset-x-0 top-0 z-[95] flex justify-center px-4 transition-all duration-700 ease-out ${
          show
            ? 'translate-y-0 opacity-100'
            : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div
          className="relative w-full max-w-5xl mt-4 md:mt-6 rounded-3xl overflow-hidden shadow-2xl shadow-gold/30 cursor-pointer group"
          onClick={handleClick}
        >
          {/* Gold border glow */}
          <div className="absolute inset-0 rounded-3xl ring-2 ring-gold/50 shadow-[0_0_60px_rgba(245,179,1,0.4)]" />

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-night-card via-night-soft to-night-card rounded-3xl overflow-hidden">

            {/* Background glow effects */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-gold/20 rounded-full blur-3xl animate-pulse pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-pink-500/15 rounded-full blur-3xl animate-pulse pointer-events-none" />

            {/* Close button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleDismiss()
              }}
              className="absolute top-3 right-3 z-30 w-10 h-10 rounded-full bg-black/50 backdrop-blur-md hover:bg-black/80 flex items-center justify-center transition-all hover:scale-110 border border-white/20"
            >
              <X size={20} className="text-white" />
            </button>

            {/* Layout: Desktop = row, Mobile = col */}
            <div className="relative z-10 flex flex-col md:flex-row">

              {/* ============================================
                  LEFT: IMAGE
                  ============================================ */}
              {offer.image_url && (
                <div className="relative w-full md:w-2/5 h-48 md:h-auto md:min-h-[280px] overflow-hidden flex-shrink-0">
                  <img
                    src={offer.image_url}
                    alt={offer.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Gradient overlay for mobile */}
                  <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-transparent via-transparent to-night-card/60" />

                  {/* Sparkle badge on image */}
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-xl shadow-gold/50 animate-pulse">
                      <Sparkles size={22} className="text-night" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>
              )}

              {/* ============================================
                  RIGHT: CONTENT
                  ============================================ */}
              <div className="flex-1 p-5 md:p-8 flex flex-col justify-center">

                {/* Top badges */}
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="bg-gradient-to-r from-gold to-gold-dark text-night text-[10px] md:text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-widest flex items-center gap-1 shadow-lg">
                    <Sparkles size={11} /> Special Offer
                  </span>
                  <span className="text-[10px] md:text-xs bg-fresh/20 text-fresh px-2.5 py-1 rounded-full font-bold uppercase border border-fresh/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-fresh animate-pulse" />
                    Live Now
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl md:text-4xl font-bold mb-3 leading-tight bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                  {offer.title}
                </h2>

                {/* Description */}
                {offer.description && (
                  <p className="text-sm md:text-base text-white/70 mb-4 md:mb-6 leading-relaxed">
                    {offer.description}
                  </p>
                )}

                {/* CTA Button */}
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-5 md:px-7 py-3 md:py-3.5 rounded-full shadow-lg shadow-gold/40 group-hover:scale-105 transition-all text-sm md:text-base">
                    Order Now
                    <ArrowRight
                      size={18}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>

                  {/* Timer */}
                  <div className="flex items-center gap-1.5 text-xs md:text-sm text-white/50">
                    <Clock size={14} className="text-gold" />
                    <span>Limited time</span>
                  </div>
                </div>

                {/* Progress bar */}
                {show && (
                  <div className="mt-5 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-gold via-yellow-400 to-gold rounded-full"
                      style={{
                        animation: 'progressBar 6s linear forwards',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Bottom gold accent line */}
            <div className="h-1.5 bg-gradient-to-r from-gold via-yellow-400 to-gold" />
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </>
  )
}