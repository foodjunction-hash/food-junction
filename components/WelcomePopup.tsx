'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, Sparkles, Clock, ShoppingBag, UtensilsCrossed, Star } from 'lucide-react'
import { useRestaurant } from '@/lib/restaurantContext'
import { getWelcomePopup, type WelcomePopup as WelcomePopupType } from '@/lib/welcomePopupSupabase'
import { getOpeningHours, getCurrentOpenStatus } from '@/lib/hoursSupabase'

export default function WelcomePopup() {
  const { restaurant } = useRestaurant()
  const [popup, setPopup] = useState<WelcomePopupType | null>(null)
  const [open, setOpen] = useState(false)
  const [openStatus, setOpenStatus] = useState<{ isOpen: boolean; todayHours: any }>({
    isOpen: false,
    todayHours: null,
  })
  const [hours, setHours] = useState('')

  useEffect(() => {
    // Check if already shown in this session
    if (typeof window !== 'undefined' && sessionStorage.getItem('welcome-shown')) {
      return
    }

    const load = async () => {
      if (!restaurant) return
      
      // Load popup config
      const data = await getWelcomePopup(restaurant.id)
      if (!data || !data.is_active || !data.show_on_load) return
      setPopup(data)

      // Load opening hours status
      if (data.show_open_now || data.show_opening_hours) {
        const hoursData = await getOpeningHours(restaurant.id)
        const status = getCurrentOpenStatus(hoursData)
        setOpenStatus(status)

        // Format today's hours
        if (status.todayHours && status.todayHours.is_open) {
          const fmt = (t: string) => {
            const [h, m] = t.split(':').map(Number)
            const ampm = h >= 12 ? 'PM' : 'AM'
            const h12 = h % 12 || 12
            return `${h12}:${String(m).padStart(2, '0')} ${ampm}`
          }
          setHours(`${fmt(status.todayHours.opening_time)} - ${fmt(status.todayHours.closing_time)}`)
        } else if (status.todayHours && !status.todayHours.is_open) {
          setHours('Closed Today')
        }
      }

      // Show popup after delay
      setTimeout(() => {
        setOpen(true)
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('welcome-shown', '1')
        }
      }, data.delay_ms || 1500)
    }
    load()
  }, [restaurant])

  if (!popup || !open) return null

  const logoUrl = restaurant?.logo_url || '/food-junction-logo.png'

  return (
    <div
      className="fixed inset-0 z-[100] bg-night/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
      onClick={() => setOpen(false)}
    >
      <div
        className="relative w-full max-w-md bg-night-card border-2 border-gold/40 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(245,179,1,0.3)] animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gold/20 rounded-full blur-[80px] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur flex items-center justify-center transition z-10 group"
          aria-label="Close"
        >
          <X size={18} className="group-hover:rotate-90 transition-transform" />
        </button>

        <div className="relative p-7 text-center">
          {/* Logo */}
          <div className="relative mx-auto mb-5 w-24 h-24">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-gold-dark blur-xl opacity-60 animate-pulse" />
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-gold shadow-gold flex items-center justify-center bg-gradient-to-br from-gold to-gold-dark">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={restaurant?.name || 'Logo'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UtensilsCrossed size={40} className="text-night" />
              )}
            </div>
            <Sparkles
              size={20}
              className="absolute -top-1 -right-1 text-gold animate-pulse"
            />
          </div>

          {/* Badge */}
          {popup.badge_visible && popup.badge_text && (
            <div className="inline-flex items-center gap-1.5 bg-gold/15 border border-gold/40 text-gold px-4 py-1.5 rounded-full text-xs font-bold tracking-widest mb-4">
              <Star size={10} fill="currentColor" />
              <span>{popup.badge_text}</span>
            </div>
          )}

          {/* Title */}
          {popup.title && (
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-2 leading-tight">
              <span className="bg-gradient-to-r from-gold via-amber-400 to-gold bg-clip-text text-transparent">
                {popup.title}
              </span>
            </h2>
          )}

          {/* Subtitle */}
          {popup.subtitle && (
            <p className="text-white/60 text-sm mb-6">{popup.subtitle}</p>
          )}

          {/* Feature Cards (Open Now + Hours) */}
          {(popup.show_open_now || popup.show_opening_hours) && (
            <div className="grid grid-cols-2 gap-3 mb-5">
              {popup.show_open_now && (
                <div
                  className={`rounded-2xl p-3 border ${
                    openStatus.isOpen
                      ? 'bg-fresh/10 border-fresh/40'
                      : 'bg-red-500/10 border-red-500/40'
                  }`}
                >
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                    <span className="relative flex h-2 w-2">
                      <span
                        className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                          openStatus.isOpen ? 'bg-fresh' : 'bg-red-400'
                        }`}
                      />
                      <span
                        className={`relative inline-flex rounded-full h-2 w-2 ${
                          openStatus.isOpen ? 'bg-fresh' : 'bg-red-400'
                        }`}
                      />
                    </span>
                  </div>
                  <p
                    className={`text-xs font-bold tracking-wider ${
                      openStatus.isOpen ? 'text-fresh' : 'text-red-400'
                    }`}
                  >
                    {openStatus.isOpen ? 'OPEN NOW' : 'CLOSED'}
                  </p>
                </div>
              )}

              {popup.show_opening_hours && (
                <div className="rounded-2xl p-3 bg-gold/10 border border-gold/40">
                  <div className="flex items-center justify-center mb-1">
                    <Clock size={14} className="text-gold" />
                  </div>
                  <p className="text-[10px] text-gold/80 font-semibold tracking-wider">
                    OPENING HOURS
                  </p>
                  <p className="text-xs font-bold text-white mt-0.5">
                    {hours || '10:00 AM - 10:00 PM'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="space-y-2.5">
            {popup.primary_button_visible && popup.primary_button_text && (
              <Link
                href={popup.primary_button_link || '/menu'}
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3.5 rounded-full btn-premium shadow-gold hover:shadow-[0_10px_30px_rgba(245,179,1,0.5)] transition-all"
              >
                <ShoppingBag size={18} />
                <span>{popup.primary_button_text}</span>
                <span className="text-lg">→</span>
              </Link>
            )}

            {popup.secondary_button_visible && popup.secondary_button_text && (
              <Link
                href={popup.secondary_button_link || '/menu'}
                onClick={() => setOpen(false)}
                className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/40 text-white font-bold py-3.5 rounded-full transition-all"
              >
                <UtensilsCrossed size={18} />
                <span>{popup.secondary_button_text}</span>
              </Link>
            )}
          </div>

          {/* Footer */}
          {popup.footer_text && (
            <p className="text-[10px] text-white/40 tracking-[0.3em] mt-5">
              {popup.footer_text}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}