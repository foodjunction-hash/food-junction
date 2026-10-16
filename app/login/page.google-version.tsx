'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleLoginButton from '@/components/GoogleLoginButton'
import AdminLoading from '@/components/AdminLoading'
import { supabase } from '@/lib/supabase'
import { useRestaurant } from '@/lib/restaurantContext'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { restaurant, slug } = useRestaurant()
  const redirectTo = searchParams.get('redirect') || `${slug ? `/${slug}` : ''}/profile`

  const basePath = !slug || slug === 'food-junction' ? '' : `/${slug}`
  const restaurantName = restaurant?.name || 'Food Junction'
  const restaurantLogo = restaurant?.logo_url || '/food-junction-logo.png'

  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        router.push(redirectTo)
        return
      }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [router, redirectTo])

  if (checkingAuth) {
    return <AdminLoading message="Loading Login" />
  }

  return (
    <main className="relative min-h-screen py-10 md:py-16 overflow-hidden bg-gradient-to-br from-night via-night to-night-soft">

      {/* ===== Animated Background ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Gold orbs */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fresh/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />

        {/* Floating food emojis */}
        <div className="absolute top-[15%] left-[10%] text-5xl opacity-10 animate-float" style={{ animationDelay: '0s' }}>🍕</div>
        <div className="absolute top-[25%] right-[15%] text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>🍔</div>
        <div className="absolute bottom-[20%] left-[15%] text-4xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>🍛</div>
        <div className="absolute bottom-[15%] right-[10%] text-5xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>🍜</div>
        <div className="absolute top-[50%] left-[5%] text-3xl opacity-10 animate-float" style={{ animationDelay: '0.7s' }}>☕</div>
        <div className="absolute top-[60%] right-[8%] text-3xl opacity-10 animate-float" style={{ animationDelay: '2.3s' }}>🍰</div>

        {/* Dot grid pattern */}
        <div className="absolute inset-0 bg-dots opacity-20" />
      </div>

      <div className="relative max-w-md mx-auto px-4">

        {/* ===== Logo & Title ===== */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="relative inline-block mb-4">
            {/* Pulsing rings */}
            <div className="absolute inset-0 rounded-full border-2 border-gold/40 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-gold/20 animate-pulse" />
            {/* Glow */}
            <div className="absolute inset-0 rounded-full bg-gold/40 blur-2xl" />
            {/* Logo */}
            <img
              src={restaurantLogo}
              alt={restaurantName}
              className="relative w-24 h-24 md:w-28 md:h-28 mx-auto rounded-full object-cover shadow-gold ring-4 ring-gold/50 animate-scaleIn"
            />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold mb-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            Welcome to{' '}
            <span className="text-gradient-gold inline-block">{restaurantName}</span>
          </h1>
          <p className="text-white/50 text-sm flex items-center justify-center gap-2 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            Login to continue
          </p>
        </div>

        {/* ===== Login Card ===== */}
        <div className="relative animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          {/* Card glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 rounded-3xl blur-xl opacity-50 animate-pulse" />

          <div className="relative bg-night-card/80 backdrop-blur-xl border border-gold/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            {/* Top accent line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />

            <div className="space-y-4">
              <GoogleLoginButton />

              <p className="text-center text-xs text-white/40 pt-2 flex items-center justify-center gap-2">
                <span className="w-8 h-px bg-white/20" />
                More options coming soon
                <span className="w-8 h-px bg-white/20" />
              </p>
            </div>
          </div>
        </div>

        {/* ===== Back Link ===== */}
        <div className="text-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <Link
            href={basePath || '/'}
            className="group inline-flex items-center gap-2 text-sm text-white/40 hover:text-gold transition-all duration-300"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">←</span>
            Back to {restaurantName}
          </Link>
        </div>

        {/* ===== Feature Badges ===== */}
        <div className="mt-10 grid grid-cols-3 gap-3 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <div className="text-center p-3 bg-night-card/50 backdrop-blur border border-white/5 rounded-2xl hover:border-gold/30 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-[10px] text-white/50 font-medium">100% Secure</p>
          </div>
          <div className="text-center p-3 bg-night-card/50 backdrop-blur border border-white/5 rounded-2xl hover:border-gold/30 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-[10px] text-white/50 font-medium">Fast Login</p>
          </div>
          <div className="text-center p-3 bg-night-card/50 backdrop-blur border border-white/5 rounded-2xl hover:border-gold/30 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-1">🎁</div>
            <p className="text-[10px] text-white/50 font-medium">Exclusive Offers</p>
          </div>
        </div>

      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<AdminLoading message="Loading Login" />}>
        <LoginContent />
      </Suspense>
      <Footer />
    </>
  )
}
