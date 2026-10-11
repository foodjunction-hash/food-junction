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
    <main className="min-h-screen py-10 md:py-16">
      <div className="max-w-md mx-auto px-4">
        <div className="text-center mb-8">
          <img
            src={restaurantLogo}
            alt={restaurantName}
            className="w-24 h-24 mx-auto rounded-full object-cover mb-4 shadow-gold ring-4 ring-gold/30"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-1">
            Welcome to{' '}
            <span className="text-gradient-gold">{restaurantName}</span>
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
            href={basePath || '/'}
            className="text-sm text-white/40 hover:text-gold transition"
          >
            ← Back to {restaurantName}
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
      <Suspense fallback={<AdminLoading message="Loading Login" />}>
        <LoginContent />
      </Suspense>
      <Footer />
    </>
  )
}