'use client'

import { useEffect, useState } from 'react'
import { UtensilsCrossed, Sparkles } from 'lucide-react'

const TIPS = [
  '🍕 Fresh ingredients, daily sourced',
  '⚡ 30 minute delivery guaranteed',
  '🛡️ 100% hygienic kitchen',
  '❤️ Made with love, served with care',
  '🏆 Best taste in town',
  '🎉 Order karo, party karo!',
]

const MIN_LOADING_TIME = 5000

export default function Loading() {
  const [tipIndex, setTipIndex] = useState(0)
  const [progress, setProgress] = useState(0)
  const [startTime] = useState(Date.now())

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((i) => (i + 1) % TIPS.length)
    }, 1200)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const percent = Math.min((elapsed / MIN_LOADING_TIME) * 100, 100)
      setProgress(percent)
    }, 50)
    return () => clearInterval(interval)
  }, [startTime])

  return (
    <div className="fixed inset-0 z-[9999] bg-night flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute inset-0 bg-mesh opacity-40" />

      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-gold/10 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-fresh/10 rounded-full blur-[100px] animate-pulse"
        style={{ animationDelay: '0.5s' }}
      />

      <div className="absolute top-[15%] left-[10%] text-4xl opacity-[0.06] animate-float select-none">
        🍕
      </div>
      <div
        className="absolute top-[25%] right-[12%] text-5xl opacity-[0.06] animate-float select-none"
        style={{ animationDelay: '1s' }}
      >
        🍔
      </div>
      <div
        className="absolute bottom-[20%] left-[15%] text-5xl opacity-[0.06] animate-float select-none"
        style={{ animationDelay: '1.5s' }}
      >
        🍜
      </div>
      <div
        className="absolute bottom-[25%] right-[18%] text-4xl opacity-[0.06] animate-float select-none"
        style={{ animationDelay: '2s' }}
      >
        🍰
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex items-center justify-center">
          <div
            className="absolute inset-0 rounded-full border-2 border-dashed border-gold/30 animate-spin-slow"
            style={{ animationDuration: '12s' }}
          />
          <div
            className="absolute inset-3 rounded-full border border-gold/20 animate-spin-slow"
            style={{ animationDirection: 'reverse', animationDuration: '8s' }}
          />
          <div className="absolute inset-6 rounded-full bg-gold/20 blur-2xl animate-pulse" />

          <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-[0_0_40px_rgba(245,179,1,0.5)] ring-4 ring-gold/20">
            <UtensilsCrossed size={40} className="text-night animate-bounce-soft" />
            <Sparkles size={16} className="absolute -top-1 -right-1 text-gold animate-pulse" />
          </div>

          <div className="absolute inset-0 animate-spin-slow" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_12px_rgba(245,179,1,0.9)]" />
          </div>
        </div>

        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold" />
            <p className="text-gold tracking-[0.3em] text-[10px] md:text-xs font-semibold">
              LOADING
            </p>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent animate-shimmer">
            Please Wait
          </h1>
        </div>

        <div className="w-64 md:w-80 h-1.5 bg-white/5 rounded-full overflow-hidden relative">
          <div
            className="h-full bg-gradient-to-r from-gold via-amber-400 to-gold rounded-full transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(245,179,1,0.6)]"
            style={{ width: `${progress}%` }}
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-xs text-white/40 font-mono tabular-nums">
          {Math.round(progress)}%
        </p>

        <div className="h-6 flex items-center justify-center relative w-full">
          {TIPS.map((tip, i) => (
            <p
              key={i}
              className={`absolute text-xs md:text-sm text-white/50 transition-all duration-500 ${
                i === tipIndex ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {tip}
            </p>
          ))}
        </div>

        <div className="flex items-center gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-gold/60 animate-bounce-soft"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}