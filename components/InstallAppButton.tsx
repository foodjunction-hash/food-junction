'use client'

import { useEffect, useState } from 'react'
import { Download, Smartphone } from 'lucide-react'

export default function InstallAppButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    const checkInstalled = () => {
      if (typeof window === 'undefined') return false

      // Check display mode
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches
      // Check iOS
      const isIOSStandalone = (window.navigator as any).standalone === true

      return isStandalone || isIOSStandalone
    }

    setIsInstalled(checkInstalled())

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsSupported(true)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Listen for successful install
    const installedHandler = () => {
      setIsInstalled(true)
      setDeferredPrompt(null)
    }

    window.addEventListener('appinstalled', installedHandler)

    // Check if browser supports it (even if prompt not fired yet)
    if ('serviceWorker' in navigator) {
      setIsSupported(true)
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      window.removeEventListener('appinstalled', installedHandler)
    }
  }, [])

  const handleInstall = async () => {
    // If already installed, open the app
    if (isInstalled) {
      window.location.href = '/'
      return
    }

    // If no prompt available, show fallback
    if (!deferredPrompt) {
      // Show instructions for manual install
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent)
      const isAndroid = /Android/.test(navigator.userAgent)

      if (isIOS) {
        alert(
          '📱 Install on iPhone:\n\n1. Tap the Share button (bottom)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"'
        )
      } else if (isAndroid) {
        alert(
          '📱 Install on Android:\n\n1. Tap the menu (3 dots) at top-right\n2. Tap "Install app" or "Add to Home Screen"\n3. Tap "Install"'
        )
      } else {
        alert(
          '📱 Install on Desktop:\n\n1. Look for the install icon (⊕) in the address bar\n2. Click it and choose "Install"'
        )
      }
      return
    }

    // Trigger native install prompt
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice

      if (outcome === 'accepted') {
        setIsInstalled(true)
      }

      setDeferredPrompt(null)
    } catch (err) {
      console.error('Install failed:', err)
    }
  }

  // Don't show button if PWA already installed
  if (isInstalled) {
    return (
      <a
        href="/"
        className="group relative border-2 border-gold/60 text-gold font-bold px-7 md:px-9 py-4 rounded-full hover:bg-gold hover:text-night transition-all duration-300 hover:border-gold hover:shadow-[0_10px_30px_rgba(245,179,1,0.3)] flex items-center justify-center gap-2 text-sm md:text-base"
      >
        <Smartphone
          size={18}
          className="group-hover:scale-110 transition-transform"
        />
        <span>Open App</span>
      </a>
    )
  }

  // Don't show if browser doesn't support
  if (!isSupported) {
    return null
  }

  return (
    <button
      onClick={handleInstall}
      className="group relative overflow-hidden bg-gradient-to-br from-gold via-gold-light to-gold-dark text-night font-bold px-7 md:px-9 py-4 rounded-full btn-premium shadow-[0_10px_30px_rgba(245,179,1,0.4)] hover:shadow-[0_15px_40px_rgba(245,179,1,0.6)] transition-all duration-300 flex items-center justify-center gap-2 text-sm md:text-base"
    >
      <span className="relative z-10 flex items-center gap-2">
        <Download
          size={18}
          className="group-hover:animate-bounce-soft transition-transform"
        />
        <span>INSTALL APP</span>
      </span>
    </button>
  )
}