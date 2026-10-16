'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    fetch('/api/admin/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push('/admin/dashboard')
        } else {
          setChecking(false)
        }
      })
      .catch(() => setChecking(false))
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim(), password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push('/admin/dashboard')
      } else {
        setError(data.error || 'Invalid credentials')
        setLoading(false)
        setPassword('')
      }
    } catch (err) {
      setError('Network error. Please try again.')
      setLoading(false)
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <Loader2 className="animate-spin text-gold" size={40} />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-fresh/5 rounded-full blur-[100px] animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8 animate-fadeInUp">
          <div className="relative inline-block group">
            <div className="absolute inset-0 rounded-full border-2 border-gold/40 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-gold/30 blur-2xl" />
            <img
              src="/food-junction-logo.png"
              alt="Food Junction Logo"
              className="relative w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-gold ring-4 ring-gold/50 transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <h1 className="text-2xl font-bold mb-1">
            Food Junction <span className="text-shimmer">Admin</span>
          </h1>
          <p className="text-white/50 text-sm">Restaurant Management Panel</p>
        </div>

        {/* Card */}
        <div className="glass-dark border border-gold/20 rounded-2xl p-6 shadow-2xl animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock size={20} className="text-gold" /> Admin Login
          </h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-red-300 animate-fadeInUp">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Admin"
                  autoComplete="username"
                  autoFocus
                  required
                  className="w-full bg-night/80 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full bg-night/80 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-gold transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-gold to-gold-dark text-night font-bold py-3.5 rounded-full btn-premium shadow-gold hover:shadow-[0_10px_30px_rgba(245,179,1,0.4)] transition-all flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.02]"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Logging in...</span>
                </>
              ) : (
                <span>Login to Dashboard</span>
              )}
            </button>
          </form>
        </div>

        {/* Back link */}
        <div className="text-center mt-6 animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
          <a href="/" className="text-sm text-white/40 hover:text-gold transition inline-flex items-center gap-1 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Website</span>
          </a>
        </div>
      </div>
    </div>
  )
}
