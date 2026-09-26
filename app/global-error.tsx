'use client'

import { useEffect } from 'react'
import { AlertTriangle } from 'lucide-react'

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
    <html lang="en">
      <body>
        <div className="min-h-screen bg-night flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-red-500/40 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/40 border-4 border-red-400/30">
                <AlertTriangle
                  size={36}
                  className="text-white"
                  strokeWidth={2.5}
                />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold mb-3 text-white">
              Something went wrong
            </h1>
            <p className="text-white/60 text-sm mb-6">
              We&apos;re sorry for the trouble. Please try again.
            </p>

            <button
              onClick={reset}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}