'use client'

import { useEffect, useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Offer = {
  id: string
  title: string
  description: string | null
  image_url: string | null
  priority: number
}

export default function OfferBannerPopup() {
  const [offer, setOffer] = useState<Offer | null>(null)
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user already dismissed in this session
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem('fj-offer-dismissed')
      if (dismissed === 'true') {
        setDismissed(true)
        return
      }
    }

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
        if (data) {
          setOffer(data)
        }
      } catch (err) {
        console.error('Failed to load offer:', err)
      }
    }

    loadOffer()
  }, [])

  // Show popup after 1 second delay, auto-hide after 5 seconds
  useEffect(() => {
    if (!offer || dismissed) return

    const showTimer = setTimeout(() => {
      setShow(true)
    }, 1000)

    return () => clearTimeout(showTimer)
  }, [offer, dismissed])

  const handleDismiss = () => {
    setShow(false)
    setDismissed(true)
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fj-offer-dismissed', 'true')
    }
  }

  // Auto-hide after 5 seconds of showing
  useEffect(() => {
    if (!show) return

    const hideTimer = setTimeout(() => {
      handleDismiss()
    }, 5000)

    return () => clearTimeout(hideTimer)
  }, [show])

  if (!offer || !show) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4 animate-fadeIn"
      onClick={handleDismiss}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-night/80 backdrop-blur-md" />

      {/* Card */}
      <div
        className="relative max-w-lg w-full bg-night-card rounded-3xl overflow-hidden border-2 border-gold/40 shadow-2xl shadow-gold/30 animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-pink-500/20 rounded-full blur-3xl animate-pulse" />

        {/* Close */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full bg-night/80 backdrop-blur hover:bg-night flex items-center justify-center transition-all border border-white/20 hover:scale-110"
        >
          <X size={18} className="text-white" />
        </button>

        {/* Badge */}
        <div className="absolute top-3 left-3 z-20">
          <span className="bg-gradient-to-r from-gold to-gold-dark text-night text-[10px] px-3 py-1.5 rounded-full font-bold uppercase tracking-widest shadow-lg flex items-center gap-1">
            <Sparkles size={10} /> Special Offer
          </span>
        </div>

        {/* Image */}
        {offer.image_url ? (
          <div className="relative w-full h-56 md:h-64 overflow-hidden">
            <img
              src={offer.image_url}
              alt={offer.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night-card via-transparent to-transparent" />
          </div>
        ) : (
          <div className="w-full h-56 md:h-64 bg-gradient-to-br from-gold/30 to-gold-dark/20 flex items-center justify-center">
            <div className="text-8xl animate-bounce">🎁</div>
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 p-5 text-center -mt-6">
          <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
            {offer.title}
          </h3>
          {offer.description && (
            <p className="text-sm text-white/70 mb-4">{offer.description}</p>
          )}

          <div className="flex items-center justify-center gap-2">
            <div className="h-1 w-8 bg-gold/30 rounded-full" />
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">
              Auto-closing in a moment
            </p>
            <div className="h-1 w-8 bg-gold/30 rounded-full" />
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/5">
          <div
            className="h-full bg-gradient-to-r from-gold to-gold-dark"
            style={{
              animation: 'progress 5s linear forwards',
            }}
          />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes progress {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}