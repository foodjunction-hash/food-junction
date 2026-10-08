'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, User, Loader2, AlertCircle, Eye, EyeOff, Shield, Sparkles } from 'lucide-react'
import { loginSuperAdmin, isSuperAdminLoggedIn } from '@/lib/auth'

export default function SuperAdminLoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isSuperAdminLoggedIn()) {
      router.push('/super-admin/dashboard')
    }
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 600))
    const result = await loginSuperAdmin(username, password)

    if (result.success) {
      router.push('/super-admin/dashboard')
    } else {
      setError(result.error || 'Invalid credentials')
      setLoading(false)
      setPassword('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[100px]" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="relative inline-block group">
            <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_40px_rgba(168,85,247,0.5)] ring-4 ring-purple-500/20 mb-4">
              <Shield size={40} className="text-white" />
              <Sparkles size={16} className="absolute -top-1 -right-1 text-gold animate-pulse" />
            </div>
          </div>
          <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Super Admin
          </h1>
          <p className="text-white/50 text-sm">Platform Owner Panel</p>
        </div>

        <div className="glass-dark border border-purple-500/30 rounded-2xl p-6 shadow-2xl">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Lock size={20} className="text-purple-400" /> Platform Login
          </h2>

          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-red-300">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1.5">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="superadmin"
                  autoComplete="username"
                  autoFocus
                  required
                  className="w-full bg-night/80 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
                />
              </div>
            </div>

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
                  className="w-full bg-night/80 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-purple-400 transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-br from-purple-500 to-pink-600 text-white font-bold py-3.5 rounded-full shadow-[0_10px_30px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_40px_rgba(168,85,247,0.5)] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /><span>Logging in...</span></>
              ) : (
                <span>Login to Super Admin</span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-white/40 hover:text-purple-400 transition inline-flex items-center gap-1 group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Website</span>
          </a>
        </div>

        <div className="text-center mt-4">
          <p className="text-[10px] text-white/20 tracking-wider">🔐 PLATFORM OWNER ACCESS</p>
        </div>
      </div>
    </div>
  )
}