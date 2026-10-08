'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, User, Loader2, AlertCircle, Eye, EyeOff, Store, ArrowLeft } from 'lucide-react'
import { loginRestaurantAdmin, isRestaurantAdminLoggedIn } from '@/lib/auth'
import { getRestaurant } from '@/lib/restaurant'

export default function RestaurantAdminLoginPage() {
  const router = useRouter()
  const params = useParams()
  const slug = (params?.slug as string) || ''

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [restaurantName, setRestaurantName] = useState('Restaurant')
  const [restaurantLogo, setRestaurantLogo] = useState('/food-junction-logo.png')

  useEffect(() => {
    const check = async () => {
      // Already logged in check
      const stored = localStorage.getItem('fj-restaurant-admin-session')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (parsed.restaurantSlug === slug && parsed.expiresAt > Date.now()) {
            router.push(`/${slug}/admin/dashboard`)
            return
          }
        } catch {}
      }

      // Load restaurant info for branding
      if (slug) {
        const data = await getRestaurant(slug)
        if (data) {
          setRestaurantName(data.name)
          if (data.logo_url) setRestaurantLogo(data.logo_url)
        }
      }
    }
    check()
  }, [slug, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 600))

    const result = await loginRestaurantAdmin(slug, username, password)

    if (result.success) {
      router.push(`/${slug}/admin/dashboard`)
    } else {
      setError(result.error || 'Invalid credentials')
      setLoading(false)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-fresh/5 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo & Name */}
        <div className="text-center mb-8">
          <div className="relative inline-block group">
            <div className="absolute inset-0 rounded-full bg-gold/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src={restaurantLogo}
              alt={restaurantName}
              className="relative w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-gold transition-transform duration-500 group-hover:scale-105 ring-4 ring-gold/30"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            {restaurantName} <span className="text-shimmer">Admin</span>
          </h1>
          <p className="text-white/50 text-sm">Restaurant Owner Panel</p>
        </div>

        {/* Card */}
        <div className="glass-dark border border-gold/20 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock size={20} className="text-gold" /> Admin Login
          </h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-red-300 animate-fade-in">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Admin Username</label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={`${slug}-admin`}
                  autoComplete="username"
                  autoFocus
                  required
                  className="w-full bg-night/80 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-night/80 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative overflow-hidden bg-gradient-to-br from-gold to-gold-dark text-night font-bold py-3.5 rounded-full btn-premium shadow-gold hover:shadow-[0_10px_30px_rgba(245,179,1,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Logging in...</span>
                  </>
                ) : (
                  <span>Login to Dashboard</span>
                )}
              </span>
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <Link
            href={`/${slug}`}
            className="text-sm text-white/40 hover:text-gold transition inline-flex items-center gap-1 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Back to {restaurantName}</span>
          </Link>
        </div>

        <div className="text-center mt-4">
          <p className="text-[10px] text-white/20 tracking-wider">
            🔒 SECURE RESTAURANT ADMIN ACCESS
          </p>
        </div>
      </div>
    </div>
  )
}