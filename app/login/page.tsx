'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Lock,
  Loader2,
  AlertCircle,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { loginAdmin, isAdminLoggedIn } from '@/lib/auth'
import { loginCustomer, isCustomerLoggedIn } from '@/lib/customerAuth'

type Tab = 'customer' | 'admin'

export default function LoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('customer')
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isAdminLoggedIn()) router.push('/admin/dashboard')
    else if (isCustomerLoggedIn()) router.push('/profile')
  }, [router])

  const handleCustomerLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    const result = loginCustomer(identifier, password)
    if (result.success) {
      router.push('/profile')
    } else {
      setError(result.error || 'Login failed')
      setLoading(false)
    }
  }

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 500))

    const ok = loginAdmin(adminUser.trim(), adminPass)
    if (ok) {
      router.push('/admin/dashboard')
    } else {
      setError('Invalid admin credentials')
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen py-10 md:py-16">
        <div className="max-w-md mx-auto px-4">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold text-3xl mb-4 shadow-gold">
              FJ
            </div>
            <h1 className="text-2xl md:text-3xl font-bold mb-1">
              Welcome to <span className="text-gradient-gold">Food Junction</span>
            </h1>
            <p className="text-white/50 text-sm">Login to continue</p>
          </div>

          {/* Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6 bg-night-card border border-white/10 rounded-full p-1.5">
            <button
              onClick={() => {
                setTab('customer')
                setError('')
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition ${
                tab === 'customer'
                  ? 'bg-gold text-night'
                  : 'text-white/60 hover:text-gold'
              }`}
            >
              <ShoppingBag size={16} /> Customer
            </button>
            <button
              onClick={() => {
                setTab('admin')
                setError('')
              }}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition ${
                tab === 'admin'
                  ? 'bg-gold text-night'
                  : 'text-white/60 hover:text-gold'
              }`}
            >
              <ShieldCheck size={16} /> Admin
            </button>
          </div>

          {/* Card */}
          <div className="bg-night-card border border-white/10 rounded-2xl p-6 shadow-card">
            {/* Error */}
            {error && (
              <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-red-300">
                <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Customer Form */}
            {tab === 'customer' && (
              <form onSubmit={handleCustomerLogin} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">
                    Mobile Number or Email
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="9876543210 or you@email.com"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
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
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                    />
                  </div>
                </div>

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
                    'Login'
                  )}
                </button>

                <p className="text-center text-sm text-white/50 pt-2">
                  New to Food Junction?{' '}
                  <Link href="/register" className="text-gold hover:text-gold-light font-semibold">
                    Create Account
                  </Link>
                </p>
              </form>
            )}

            {/* Admin Form */}
            {tab === 'admin' && (
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Username</label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                    />
                    <input
                      type="text"
                      value={adminUser}
                      onChange={(e) => setAdminUser(e.target.value)}
                      placeholder="admin"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
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
                      type="password"
                      value={adminPass}
                      onChange={(e) => setAdminPass(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                    />
                  </div>
                </div>

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
                    'Login as Admin'
                  )}
                </button>

                <div className="pt-3 border-t border-white/10">
                  <p className="text-xs text-white/40 text-center mb-1">
                    Demo Admin Credentials:
                  </p>
                  <p className="text-xs text-center font-mono">
                    <span className="text-gold">admin</span> /{' '}
                    <span className="text-gold">foodjunction@2025</span>
                  </p>
                </div>
              </form>
            )}
          </div>

          <div className="text-center mt-6">
            <Link
              href="/"
              className="text-sm text-white/40 hover:text-gold transition"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}