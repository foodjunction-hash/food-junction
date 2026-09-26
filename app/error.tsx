'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('App error:', error)
  }, [error])

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-red-500/40 rounded-full blur-2xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/40 border-4 border-red-400/30">
            <AlertTriangle size={36} className="text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold mb-3">
          Something went wrong
        </h1>
        <p className="text-white/60 text-sm mb-6">
          We&apos;re sorry for the trouble. Please try again.
        </p>

        {process.env.NODE_ENV === 'development' && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-left">
            <p className="text-xs font-mono text-red-300 break-all">
              {error.message}
            </p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/20"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 font-semibold px-6 py-3 rounded-full transition-all border border-white/10 hover:border-white/20"
          >
            <Home size={16} />
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}