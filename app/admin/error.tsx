'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Admin error:', error)
  }, [error])

  return (
    <div className="p-6 min-h-screen flex items-center justify-center">
      <div className="max-w-md text-center">
        <AlertTriangle className="text-red-400 mx-auto mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2">Admin Page Error</h1>
        <p className="text-white/60 text-sm mb-6">
          {error.message || 'Page load nahi ho paya'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-gold text-night font-bold px-5 py-3 rounded-full hover:scale-105 transition"
          >
            <RefreshCw size={16} /> Retry
          </button>
          <Link
            href="/admin/login"
            className="flex items-center gap-2 bg-white/10 text-white font-bold px-5 py-3 rounded-full hover:bg-white/20 transition"
          >
            <ArrowLeft size={16} /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}
