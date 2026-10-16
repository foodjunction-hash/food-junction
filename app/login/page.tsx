'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AdminLoading from '@/components/AdminLoading'
import { supabase } from '@/lib/supabase'
import { useRestaurant } from '@/lib/restaurantContext'
import { useToast } from '@/components/Toast'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const { restaurant, slug } = useRestaurant()
  const basePath = !slug || slug === 'food-junction' ? '' : `/${slug}`
  const redirectTo = searchParams.get('redirect') || `${basePath}/profile`
  const restaurantName = restaurant?.name || 'Food Junction'
  const restaurantLogo = restaurant?.logo_url || '/food-junction-logo.png'

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [isSignup, setIsSignup] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
  })

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push(redirectTo)
        return
      }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [router, redirectTo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (isSignup && !form.name.trim()) {
      toast.error('Naam daalo')
      return
    }
    if (!/^[6-9]\d{9}$/.test(form.mobile)) {
      toast.error('Sahi 10-digit mobile number daalo')
      return
    }
    if (form.password.length < 6) {
      toast.error('Password kam se kam 6 character ka hona chahiye')
      return
    }

    setLoading(true)
    // Mobile ko email format mein convert karo (Supabase email-based auth ke liye)
    const email = `${form.mobile}@foodjunction.local`

    try {
      if (isSignup) {
        // Signup
        const { data, error } = await supabase.auth.signUp({
          email,
          password: form.password,
          options: {
            data: {
              full_name: form.name,
              phone: form.mobile,
            },
          },
        })
        if (error) throw error
        toast.success('Account ban gaya! Ab login karo.')
        setIsSignup(false)
      } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: form.password,
        })
        if (error) throw error
        toast.success('Login successful!')
        router.push(redirectTo)
      }
    } catch (err: any) {
      toast.error(err.message || 'Kuch galat ho gaya')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return <AdminLoading message="Loading Login" />
  }

  return (
    <main className="relative min-h-screen py-10 md:py-16 overflow-hidden bg-gradient-to-br from-night via-night to-night-soft">

      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gold/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-fresh/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[15%] left-[10%] text-5xl opacity-10 animate-float">??</div>
        <div className="absolute top-[25%] right-[15%] text-4xl opacity-10 animate-float" style={{ animationDelay: '1s' }}>??</div>
        <div className="absolute bottom-[20%] left-[15%] text-4xl opacity-10 animate-float" style={{ animationDelay: '2s' }}>??</div>
        <div className="absolute bottom-[15%] right-[10%] text-5xl opacity-10 animate-float" style={{ animationDelay: '1.5s' }}>??</div>
        <div className="absolute inset-0 bg-dots opacity-20" />
      </div>

      <div className="relative max-w-md mx-auto px-4">

        {/* Logo */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 rounded-full border-2 border-gold/40 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-gold/20 animate-pulse" />
            <div className="absolute inset-0 rounded-full bg-gold/40 blur-2xl" />
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
            {isSignup ? 'Create your account' : 'Login to continue'}
          </p>
        </div>

        {/* Login Card */}
        <div className="relative animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 rounded-3xl blur-xl opacity-50 animate-pulse" />

          <div className="relative bg-night-card/80 backdrop-blur-xl border border-gold/20 rounded-3xl p-6 md:p-8 shadow-2xl">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />

            {/* Tab Toggle */}
            <div className="flex gap-2 p-1 bg-night/60 rounded-full mb-6 relative">
              <button
                type="button"
                onClick={() => setIsSignup(false)}
                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  !isSignup ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-gold' : 'text-white/60 hover:text-gold'
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setIsSignup(true)}
                className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                  isSignup ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-gold' : 'text-white/60 hover:text-gold'
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name (signup only) */}
              {isSignup && (
                <div className="animate-fadeInUp">
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Naam</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Aapka naam"
                    className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                  />
                </div>
              )}

              {/* Mobile */}
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Mobile Number</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-sm">+91</span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={form.mobile}
                    onChange={(e) => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="9876543210"
                    className="w-full bg-night border border-white/10 rounded-xl pl-14 pr-4 py-3 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="        "
                    className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 pr-12 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-white/40 hover:text-gold transition"
                    aria-label="Toggle password"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="relative w-full bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-4 rounded-full transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold/40 disabled:opacity-60 overflow-hidden group"
              >
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {isSignup ? 'Creating...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      {isSignup ? 'Create Account' : 'Login'}
                      <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <span className="flex-1 h-px bg-white/10" />
              <span className="text-[10px] text-white/40 uppercase tracking-widest">or</span>
              <span className="flex-1 h-px bg-white/10" />
            </div>

            {/* Google Disabled */}
            <button
              type="button"
              disabled
              className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/10 text-white/40 font-semibold py-3 rounded-full cursor-not-allowed relative"
            >
              <svg className="w-5 h-5 opacity-40" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google Login (Coming Soon)
              <span className="absolute -top-2 -right-2 bg-white/20 text-white/60 text-[9px] font-bold px-2 py-0.5 rounded-full border border-white/20">
                SOON
              </span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
          <Link
            href={basePath || '/'}
            className="group inline-flex items-center gap-2 text-sm text-white/40 hover:text-gold transition-all duration-300"
          >
            <span className="transition-transform duration-300 group-hover:-translate-x-1">?</span>
            Back to {restaurantName}
          </Link>
        </div>

        {/* Feature Badges */}
        <div className="mt-10 grid grid-cols-3 gap-3 animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
          <div className="text-center p-3 bg-night-card/50 backdrop-blur border border-white/5 rounded-2xl hover:border-gold/30 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-1">??</div>
            <p className="text-[10px] text-white/50 font-medium">100% Secure</p>
          </div>
          <div className="text-center p-3 bg-night-card/50 backdrop-blur border border-white/5 rounded-2xl hover:border-gold/30 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-1">?</div>
            <p className="text-[10px] text-white/50 font-medium">Fast Login</p>
          </div>
          <div className="text-center p-3 bg-night-card/50 backdrop-blur border border-white/5 rounded-2xl hover:border-gold/30 transition-all duration-300 hover:scale-105">
            <div className="text-2xl mb-1">??</div>
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
