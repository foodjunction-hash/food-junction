'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showInstall, setShowInstall] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const isDismissed = localStorage.getItem('fj-pwa-dismissed')
    if (isDismissed) {
      setDismissed(true)
    }

    if (window.matchMedia('(display-mode: standalone)').matches) {
      return
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setTimeout(() => setShowInstall(true), 30000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setShowInstall(false)
    }

    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowInstall(false)
    setDismissed(true)
    localStorage.setItem('fj-pwa-dismissed', 'true')
  }

  if (!showInstall || dismissed || !deferredPrompt) return null

  return (
    <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50">
      <div className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/40 rounded-2xl p-4 backdrop-blur-md shadow-gold relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 hover:bg-white/10 rounded-full transition"
          aria-label="Dismiss"
        >
          <X size={16} className="text-white/60" />
        </button>

        <div className="flex items-start gap-3 mb-3">
          <img
            src="/food-junction-logo.png"
            alt="Food Junction"
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          />
          <div>
            <p className="font-bold text-sm mb-0.5">Install Food Junction App</p>
            <p className="text-xs text-white/60">
              Home screen pe icon add karo — fast access ke liye!
            </p>
          </div>
        </div>

        <button
          onClick={handleInstall}
          className="w-full bg-gold text-night font-bold py-2.5 rounded-full hover:bg-gold-light transition flex items-center justify-center gap-2 text-sm"
        >
          <Download size={16} /> Install App
        </button>
      </div>
    </div>
  )
}