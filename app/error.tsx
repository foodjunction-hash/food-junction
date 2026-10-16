'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Global error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-night px-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-2xl font-bold mb-2">Kuch galat ho gaya</h1>
        <p className="text-white/60 text-sm mb-6">
          {error.message || 'Unexpected error. Please try again.'}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="flex items-center gap-2 bg-gold text-night font-bold px-5 py-3 rounded-full hover:scale-105 transition"
          >
            <RefreshCw size={16} /> Retry
          </button>
          <a
            href="/"
            className="flex items-center gap-2 bg-white/10 text-white font-bold px-5 py-3 rounded-full hover:bg-white/20 transition"
          >
            <Home size={16} /> Home
          </a>
        </div>
      </div>
    </div>
  )
}
