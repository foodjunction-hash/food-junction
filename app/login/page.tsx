'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import GoogleLoginButton from '@/components/GoogleLoginButton'
import { supabase } from '@/lib/supabase'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/profile'

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

        <div className="bg-night-card border border-white/10 rounded-2xl p-6 shadow-card">
          <div className="space-y-4">
            <GoogleLoginButton />
            <p className="text-center text-xs text-white/40 pt-2">
              More login options coming soon
            </p>
          </div>
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