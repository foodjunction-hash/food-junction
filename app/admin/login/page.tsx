'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import GoogleLoginButton from '@/components/GoogleLoginButton'
import { supabase } from '@/lib/supabase'
import { loginAdmin, isAdminLoggedIn } from '@/lib/auth'

type Tab = 'customer' | 'admin'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/profile'

  const [tab, setTab] = useState<Tab>('customer')
  const [adminUser, setAdminUser] = useState('')
  const [adminPass, setAdminPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)

  // ============================================
  // AUTO-REDIRECT if already logged in
  // ============================================
  useEffect(() => {
    const checkAuth = async () => {
      if (isAdminLoggedIn()) {
        router.push('/admin/dashboard')
        return
      }

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

  if (checkingAuth) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </main>
    )
  }

  return (
    <main className="min-h-screen py-10 md:py-16">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <img
            src="/food-junction-logo.png"
            alt="Food Junction Logo"
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-gold"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome to{' '}
            <span className="text-gradient-gold">Food Junction</span>
          </h1>
          <p className="text-white/50 text-sm">Login to continue</p>
        </div>

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

        <div className="bg-night-card border border-white/10 rounded-2xl p-6 shadow-card">
          {error && (
            <div className="mb-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-red-300">
              <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {tab === 'customer' && (
            <div className="space-y-4">
              <GoogleLoginButton />
              <p className="text-center text-xs text-white/40 pt-2">
                More login options coming soon
              </p>
            </div>
          )}

          {tab === 'admin' && (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-sm text-white/70 mb-1.5">
                  Username
                </label>
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
                <label className="block text-sm text-white/70 mb-1.5">
                  Password
                </label>
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
  )
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        }
      >
        <LoginContent />
      </Suspense>
      <Footer />
    </>
  )
}