'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Loader2, AlertCircle } from 'lucide-react'
import { loginAdmin, isAdminLoggedIn } from '@/lib/auth'

export default function AdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) {
      router.push('/admin/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 600))

    const success = loginAdmin(username.trim(), password)
    if (success) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid username or password')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
                    <img
            src="/food-junction-logo.png"
            alt="Food Junction Logo"
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-gold"
          />
          <h1 className="text-2xl font-bold mb-1">Food Junction Admin</h1>
          <p className="text-white/50 text-sm">Restaurant Management Panel</p>
        </div>

        {/* Card */}
        <div className="bg-night-card border border-white/10 rounded-2xl p-6 shadow-card">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock size={20} className="text-gold" /> Admin Login
          </h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-red-300">
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
                  placeholder="admin"
                  autoComplete="username"
                  className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-night font-bold py-3.5 rounded-full hover:bg-gold-light transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Logging in...
                </>
              ) : (
                'Login to Dashboard'
              )}
            </button>
          </form>

          {/* Hint */}
          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-xs text-white/40 text-center">
              Demo Credentials:
            </p>
            <p className="text-xs text-center mt-1 font-mono">
              <span className="text-gold">admin</span> /{' '}
              <span className="text-gold">foodjunction@2025</span>
            </p>
          </div>
        </div>

        {/* Back link */}
        <div className="text-center mt-6">
          <a
            href="/"
            className="text-sm text-white/40 hover:text-gold transition"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  )
}