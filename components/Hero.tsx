'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Phone,
  UtensilsCrossed,
  ShoppingBag,
  Star,
  Sparkles,
} from 'lucide-react'
import InstallAppButton from '@/components/InstallAppButton'

export default function Hero() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center">
      {/* ===== Video Background ===== */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-95"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
        </video>

        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-night/85 via-night/75 to-night/90" />
      </div>

      {/* ===== Multi-Layer Background ===== */}
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="absolute inset-0 bg-dots opacity-20" />

      {/* Radial glow */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px] animate-pulse-glow pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-fresh/10 blur-[100px] pointer-events-none" />

      {/* Floating emojis (decorative) */}
      <div className="absolute top-20 left-10 text-6xl opacity-[0.07] animate-float select-none pointer-events-none">
        🍕
      </div>
      <div
        className="absolute bottom-32 right-16 text-7xl opacity-[0.07] animate-float select-none pointer-events-none"
        style={{ animationDelay: '1s' }}
      >
        🍔
      </div>
      <div
        className="absolute top-1/3 right-1/4 text-5xl opacity-[0.07] animate-float select-none pointer-events-none"
        style={{ animationDelay: '2s' }}
      >
        🍜
      </div>
      <div
        className="absolute bottom-20 left-1/4 text-5xl opacity-[0.07] animate-float select-none pointer-events-none"
        style={{ animationDelay: '1.5s' }}
      >
        🍰
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-20 w-full z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* ==================== LEFT CONTENT ==================== */}
          <div className="text-center lg:text-left">
            {/* Top Badge */}
            <div
              className={`inline-flex items-center gap-2 glass-gold border border-gold/30 text-gold px-4 py-2 rounded-full text-sm mb-6 transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
              }`}
            >
              <Star size={14} fill="currentColor" className="animate-pulse" />
              <span className="font-semibold">
                Amarpur&apos;s Favorite Family Restaurant
              </span>
              <Sparkles size={12} className="opacity-70" />
            </div>

            {/* Heading */}
            <h1
              className={`font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.1] transition-all duration-700 delay-100 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              Taste That Brings
              <br />
              <span className="text-shimmer relative">
                Family
                {/* Underline glow */}
                <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-60 blur-sm" />
              </span>{' '}
              Together
            </h1>

            {/* Subtext */}
            <p
              className={`text-xl md:text-2xl text-white/85 mb-3 tracking-wide transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
              }`}
            >
              Fresh <span className="text-gold mx-1">•</span> Delicious{' '}
              <span className="text-gold mx-1">•</span> Hygienic
            </p>
            <p
              className={`text-white/50 mb-10 text-sm md:text-base transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Order online <span className="text-gold/50 mx-1">•</span> Home
              delivery <span className="text-gold/50 mx-1">•</span> Takeaway{' '}
              <span className="text-gold/50 mx-1">•</span> Dine-in
            </p>

            {/* CTA Buttons */}
            <div
              className={`flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start mb-12 transition-all duration-700 delay-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {/* Order Now */}
              <Link
                href="/menu"
                className="group relative bg-gradient-to-br from-gold to-gold-dark text-night font-bold px-7 md:px-9 py-4 rounded-full btn-premium shadow-gold hover:shadow-[0_15px_40px_rgba(245,179,1,0.5)] transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingBag
                    size={18}
                    className="group-hover:rotate-12 transition-transform duration-300"
                  />
                  <span>ORDER NOW</span>
                </span>
              </Link>

              {/* View Menu */}
              <Link
                href="/menu"
                className="group relative border-2 border-gold/60 text-gold font-bold px-7 md:px-9 py-4 rounded-full hover:bg-gold hover:text-night transition-all duration-300 hover:border-gold hover:shadow-[0_10px_30px_rgba(245,179,1,0.3)] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <UtensilsCrossed
                    size={18}
                    className="group-hover:rotate-90 transition-transform duration-500"
                  />
                  <span>VIEW MENU</span>
                </span>
              </Link>

              {/* Call Now */}
              <a
                href="tel:+919973318421"
                className="group relative border-2 border-fresh/60 text-fresh font-bold px-7 md:px-9 py-4 rounded-full hover:bg-fresh hover:text-night transition-all duration-300 hover:border-fresh hover:shadow-[0_10px_30px_rgba(34,197,94,0.3)]"
              >
                <span className="flex items-center gap-2">
                  <Phone
                    size={18}
                    className="group-hover:animate-bounce-soft"
                  />
                  <span>CALL NOW</span>
                </span>
              </a>

              {/* Install App Button */}
              <InstallAppButton />
            </div>

            {/* Stats Row */}
            <div
              className={`grid grid-cols-3 gap-6 max-w-md mx-auto lg:mx-0 transition-all duration-700 delay-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              {[
                { value: '50+', label: 'Dishes', delay: 0 },
                { value: '10K+', label: 'Happy Customers', delay: 100 },
                { value: '30min', label: 'Fast Delivery', delay: 200 },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="group text-center lg:text-left cursor-default transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="font-display text-3xl md:text-4xl font-bold text-gold mb-1 group-hover:text-shimmer transition-all">
                    {stat.value}
                  </p>
                  <p className="text-xs md:text-sm text-white/50 group-hover:text-white/70 transition-colors">
                    {stat.label}
                  </p>
                  {/* Gold underline */}
                  <div className="w-8 h-0.5 bg-gradient-to-r from-gold to-transparent mx-auto lg:mx-0 mt-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </div>
          </div>

          {/* ==================== RIGHT VISUAL ==================== */}
          <div
            className={`relative hidden lg:block transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
            }`}
          >
            <div className="relative w-full aspect-square max-w-md mx-auto">
              {/* Outer glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/30 via-gold/10 to-fresh/20 blur-3xl animate-pulse-glow" />

              {/* Rotating rings */}
              <div className="absolute inset-0 rounded-full border-2 border-dashed border-gold/20 animate-spin-slow" />
              <div
                className="absolute inset-6 rounded-full border border-gold/10 animate-spin-slow"
                style={{
                  animationDirection: 'reverse',
                  animationDuration: '15s',
                }}
              />

              {/* Center plate */}
              <div className="absolute inset-12 rounded-full border-4 border-gold/20 bg-night-card/50 backdrop-blur flex items-center justify-center group">
                <span className="text-[160px] animate-float select-none">
                  🍽️
                </span>
              </div>

              {/* Orbiting Bestseller card */}
              <div
                className="absolute top-8 -left-6 animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="glass border border-gold/30 rounded-2xl px-4 py-3 shadow-gold hover:scale-105 transition-transform duration-300">
                  <p className="text-[10px] text-white/50 tracking-wider mb-0.5">
                    BESTSELLER
                  </p>
                  <p className="text-sm font-bold text-gold flex items-center gap-1.5">
                    <span className="text-base">🍚</span> Hyderabadi Biryani
                  </p>
                </div>
              </div>

              {/* Orbiting Delivery card */}
              <div
                className="absolute bottom-8 -right-6 animate-float"
                style={{ animationDelay: '1.5s' }}
              >
                <div className="glass border border-fresh/30 rounded-2xl px-4 py-3 shadow-[0_10px_40px_-10px_rgba(34,197,94,0.5)] hover:scale-105 transition-transform duration-300">
                  <p className="text-[10px] text-white/50 tracking-wider mb-0.5">
                    DELIVERY IN
                  </p>
                  <p className="text-sm font-bold text-fresh flex items-center gap-1.5">
                    30 minutes <span className="animate-bounce-soft">⚡</span>
                  </p>
                </div>
              </div>

              {/* Small floating accent dots */}
              <div className="absolute top-1/4 right-4 w-2 h-2 rounded-full bg-gold shadow-gold animate-pulse" />
              <div
                className="absolute bottom-1/4 left-6 w-2 h-2 rounded-full bg-fresh animate-pulse"
                style={{ animationDelay: '0.8s' }}
              />
              <div
                className="absolute top-1/2 -right-2 w-1.5 h-1.5 rounded-full bg-gold-light animate-pulse"
                style={{ animationDelay: '1.2s' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ===== Bottom Fade ===== */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-night to-transparent pointer-events-none" />

      {/* ===== Scroll Indicator ===== */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 animate-fade-in">
        <span className="text-[10px] text-white/40 tracking-[0.3em]">
          SCROLL
        </span>
        <div className="w-5 h-8 rounded-full border border-gold/40 flex items-start justify-center p-1">
          <div className="w-1 h-2 rounded-full bg-gold animate-bounce-soft" />
        </div>
      </div>
    </section>
  )
}