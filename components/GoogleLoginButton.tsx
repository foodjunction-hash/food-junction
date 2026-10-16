'use client'

import { supabase } from '@/lib/supabase'
import { useState } from 'react'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'

export default function GoogleLoginButton() {
  const toast = useToast()
  const { restaurant } = useRestaurant()
  const [loading, setLoading] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isEnabled = restaurant?.google_login_enabled ?? false

  const handleGoogleLogin = async () => {
    if (!isEnabled) {
      toast.info(
        `Google login ${restaurant?.name || 'is restaurant'} ke liye abhi available nahi hai.`
      )
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) {
        toast.error('Google login failed: ' + error.message)
        setLoading(false)
      }
    } catch (err: any) {
      toast.error('Google login failed')
      setLoading(false)
    }
  }

  return (
    <div className="relative group">
      {/* Animated glow border */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gold via-gold-light to-gold rounded-full opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 animate-pulse" />

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`relative w-full flex items-center justify-center gap-3 bg-white text-gray-800 font-bold py-4 rounded-full transition-all duration-300 disabled:opacity-60 overflow-hidden ${
          hovered && !loading ? 'scale-[1.02] shadow-2xl shadow-gold/30' : 'shadow-lg'
        }`}
      >
        {/* Shimmer effect */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-gold/20 to-transparent" />

        {/* Google Logo */}
        {loading ? (
          <svg className="w-5 h-5 animate-spin text-gold" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        )}

        <span className="relative z-10">
          {loading ? 'Signing you in...' : 'Continue with Google'}
        </span>

        {/* Arrow on hover */}
        {!loading && (
          <svg
            className={`w-4 h-4 transition-all duration-300 ${hovered ? 'translate-x-1 opacity-100' : 'opacity-0 -translate-x-2'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        )}

        {/* COMING SOON badge */}
        {!isEnabled && (
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-gold to-gold-dark text-night text-[9px] font-bold px-2.5 py-1 rounded-full border-2 border-night shadow-lg animate-bounce-soft">
            COMING SOON
          </span>
        )}
      </button>

      {/* Sub-text */}
      <p className="text-center text-[11px] text-white/40 mt-3 flex items-center justify-center gap-1.5">
        <span className="w-1 h-1 rounded-full bg-fresh animate-pulse" />
        Secure login powered by Google
      </p>
    </div>
  )
}
