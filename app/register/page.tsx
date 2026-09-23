'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Lock, Phone, Mail, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { registerCustomer } from '@/lib/customerAuth'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    password: '',
    confirm: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const update = (key: string, value: string) => {
    setForm((s) => ({ ...s, [key]: value }))
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)
    await new Promise((r) => setTimeout(r, 600))

    const result = registerCustomer({
      name: form.name,
      mobile: form.mobile,
      email: form.email || undefined,
      password: form.password,
    })

    if (result.success) {
      setSuccess(true)
      setTimeout(() => router.push('/login'), 1800)
    } else {
      setError(result.error || 'Registration failed')
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen py-10 md:py-16">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
                        <img
              src="/food-junction-logo.png"
              alt="Food Junction Logo"
              className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-gold"
            />
            <h1 className="text-2xl md:text-3xl font-bold mb-1">Create Account</h1>
            <p className="text-white/50 text-sm">Join Food Junction today</p>
          </div>

          <div className="bg-night-card border border-white/10 rounded-2xl p-6 shadow-card">
            {success ? (
              <div className="text-center py-8">
                <CheckCircle2 size={48} className="text-fresh mx-auto mb-4" />
                <p className="font-bold text-lg mb-1">Account Created!</p>
                <p className="text-sm text-white/60">
                  Redirecting to login...
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2.5 text-sm text-red-300">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Full Name *</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => update('name', e.target.value)}
                      placeholder="Your name"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Mobile Number *</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="tel"
                      value={form.mobile}
                      onChange={(e) => update('mobile', e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="10-digit mobile"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Email (optional)</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update('email', e.target.value)}
                      placeholder="you@example.com"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Password *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => update('password', e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-1.5">Confirm Password *</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40" />
                    <input
                      type="password"
                      value={form.confirm}
                      onChange={(e) => update('confirm', e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none"
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
                      <Loader2 size={18} className="animate-spin" /> Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <p className="text-center text-sm text-white/50 pt-2">
                  Already have an account?{' '}
                  <Link href="/login" className="text-gold hover:text-gold-light font-semibold">
                    Login
                  </Link>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}