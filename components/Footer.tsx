'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { useRestaurant } from '@/lib/restaurantContext'
import { getOpeningHours, getCurrentOpenStatus, DAYS_OF_WEEK, type OpeningHour } from '@/lib/hoursSupabase'

function InstagramIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}
function FacebookIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function YoutubeIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </svg>
  )
}
function TwitterIcon({ size = 18, className = '' }: { size?: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export default function Footer() {
  const { restaurant } = useRestaurant()
  const [hours, setHours] = useState<OpeningHour[]>([])
  const [openStatus, setOpenStatus] = useState<{ isOpen: boolean; todayHours: OpeningHour | null }>({ isOpen: false, todayHours: null })

  useEffect(() => {
    const load = async () => {
      if (!restaurant) return
      const data = await getOpeningHours(restaurant.id)
      setHours(data)
      setOpenStatus(getCurrentOpenStatus(data))
    }
    load()
  }, [restaurant])

  const name = restaurant?.name || 'Food Junction'
  const tagline = restaurant?.tagline || 'The Family Restaurant'
  const description = restaurant?.footer_description || restaurant?.short_description || 'Serving delicious, hygienic food to families in Amarpur.'
  const logoUrl = restaurant?.logo_url || '/food-junction-logo.png'
  const phone = restaurant?.phone || '+91 99733 18421'
  const email = restaurant?.email || 'shubhamydv9272@gmail.com'
  const address = restaurant?.address || 'Amarpur, Bihar'

  const instagramUrl = restaurant?.instagram_url || ''
  const facebookUrl = restaurant?.facebook_url || ''
  const youtubeUrl = restaurant?.youtube_url || ''
  const twitterUrl = restaurant?.twitter_url || ''

  const copyrightText = restaurant?.copyright_text || `© ${new Date().getFullYear()} ${name} — ${tagline}. All rights reserved.`
  const hasSocial = instagramUrl || facebookUrl || youtubeUrl || twitterUrl

  return (
    <footer className="relative bg-night-soft border-t border-gold/10 mt-16 overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px] bg-gold/5 rounded-full blur-[100px]" />

      <div className="divider-gold" />

      <div className="relative max-w-7xl mx-auto px-4 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-5 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-gold/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={logoUrl} alt={name} className="relative w-14 h-14 rounded-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div>
                <p className="text-xl text-gold font-bold">{name}</p>
                <p className="text-xs text-white/50 tracking-[0.2em] uppercase">{tagline}</p>
              </div>
            </div>
            <p className="text-sm text-white/60 mb-5 leading-relaxed">{description}</p>
            {hasSocial && (
              <div className="flex flex-wrap gap-3">
                {instagramUrl && (<a href={instagramUrl} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="group w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-gold hover:to-gold-dark hover:border-gold hover:scale-110 transition-all duration-300"><InstagramIcon size={18} className="text-white/70 group-hover:text-night group-hover:scale-110 transition-all" /></a>)}
                {facebookUrl && (<a href={facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="group w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-gold hover:to-gold-dark hover:border-gold hover:scale-110 transition-all duration-300"><FacebookIcon size={18} className="text-white/70 group-hover:text-night group-hover:scale-110 transition-all" /></a>)}
                {youtubeUrl && (<a href={youtubeUrl} target="_blank" rel="noopener noreferrer" aria-label="YouTube" className="group w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-gold hover:to-gold-dark hover:border-gold hover:scale-110 transition-all duration-300"><YoutubeIcon size={18} className="text-white/70 group-hover:text-night group-hover:scale-110 transition-all" /></a>)}
                {twitterUrl && (<a href={twitterUrl} target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="group w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-gradient-to-br hover:from-gold hover:to-gold-dark hover:border-gold hover:scale-110 transition-all duration-300"><TwitterIcon size={16} className="text-white/70 group-hover:text-night group-hover:scale-110 transition-all" /></a>)}
              </div>
            )}
          </div>

          <div>
            <h4 className="font-bold text-gold mb-5 relative inline-block">Quick Links<span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold/50" /></h4>
            <ul className="space-y-2.5 text-sm">
              {[{ href: '/', label: 'Home' }, { href: '/menu', label: 'Menu' }, { href: '/offers', label: 'Offers' }, { href: '/about', label: 'About' }, { href: '/track-order', label: 'Track Order' }].map((l, i) => (
                <li key={i}>
                  <Link href={l.href} className="group inline-flex items-center gap-2 text-white/60 hover:text-gold transition-all duration-300 hover:translate-x-1">
                    <span className="w-1 h-1 rounded-full bg-gold/50 group-hover:w-3 group-hover:bg-gold transition-all duration-300" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gold mb-5 relative inline-block">Contact Us<span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold/50" /></h4>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-start gap-3 text-white/60 group"><MapPin size={16} className="text-gold mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" /><span>{address}</span></li>
              <li className="flex items-start gap-3 text-white/60 group"><Phone size={16} className="text-gold mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" /><a href={`tel:${phone.replace(/\s/g, '')}`} className="hover:text-gold transition-colors">{phone}</a></li>
              <li className="flex items-start gap-3 text-white/60 group"><Mail size={16} className="text-gold mt-0.5 flex-shrink-0 group-hover:scale-110 transition-transform" /><a href={`mailto:${email}`} className="hover:text-gold transition-colors break-all">{email}</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-gold mb-5 relative inline-block">Opening Hours<span className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gold/50" /></h4>
            <ul className="space-y-2 text-sm">
              {hours.length > 0 ? (
                hours.map((h) => {
                  const dayInfo = DAYS_OF_WEEK.find((d) => d.key === h.day_of_week)
                  return (
                    <li key={h.id} className="flex justify-between gap-4">
                      <span className="text-white/60">{dayInfo?.short || h.day_of_week}</span>
                      <span className={h.is_open ? 'font-semibold' : 'text-red-400'}>
                        {h.is_open ? `${h.opening_time} - ${h.closing_time}` : 'Closed'}
                      </span>
                    </li>
                  )
                })
              ) : (
                <>
                  <li className="flex items-center gap-2 text-white/60"><Clock size={16} className="text-gold" /><span>Mon – Sun</span></li>
                  <li className="pl-6 font-semibold text-white text-base">10:00 AM – 10:00 PM</li>
                </>
              )}
              <li className="pt-3">
                <span className={`inline-flex items-center gap-2 font-semibold text-sm px-3 py-1.5 rounded-full ${openStatus.isOpen ? 'text-fresh glass-gold border border-fresh/30' : 'text-red-400 bg-red-500/10 border border-red-500/30'}`}>
                  <span className="relative flex h-2 w-2">
                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${openStatus.isOpen ? 'bg-fresh' : 'bg-red-400'}`}></span>
                    <span className={`relative inline-flex rounded-full h-2 w-2 ${openStatus.isOpen ? 'bg-fresh' : 'bg-red-400'}`}></span>
                  </span>
                  {openStatus.isOpen ? 'Currently Open' : 'Currently Closed'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="divider-gold mt-12 mb-6" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white/40">
          <p>{copyrightText}</p>
          <p className="flex items-center gap-2"><span className="text-white/30">Developed by</span><span className="text-gold font-semibold">Shubham Yadav</span></p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-gold transition-colors relative group">Privacy<span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" /></Link>
            <Link href="/terms" className="hover:text-gold transition-colors relative group">Terms<span className="absolute -bottom-0.5 left-0 w-0 h-px bg-gold group-hover:w-full transition-all duration-300" /></Link>
          </div>
        </div>
      </div>
      <div className="divider-gold" />
    </footer>
  )
}