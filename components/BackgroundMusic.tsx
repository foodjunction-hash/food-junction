'use client'

import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if user already dismissed music
    const isDismissed = localStorage.getItem('fj-music-dismissed')
    if (isDismissed) {
      setDismissed(true)
      return
    }

    // Check if music was already playing
    const wasPlaying = localStorage.getItem('fj-music-playing')

    const audio = audioRef.current
    if (!audio) return

    // Try to autoplay
    const tryAutoplay = async () => {
      try {
        audio.volume = 0.3 // 30% volume (soft background)
        await audio.play()
        setIsPlaying(true)
        localStorage.setItem('fj-music-playing', 'true')
      } catch (err) {
        // Autoplay blocked by browser
        console.log('Autoplay blocked:', err)
        // Show "Click to play" prompt after 2 seconds
        setTimeout(() => setShowPrompt(true), 2000)
      }
    }

    // Only autoplay if was playing before OR first time
    if (wasPlaying !== 'false') {
      tryAutoplay()
    } else {
      setShowPrompt(true)
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
      localStorage.setItem('fj-music-playing', 'false')
    } else {
      audio.volume = 0.3
      audio
        .play()
        .then(() => {
          setIsPlaying(true)
          setShowPrompt(false)
          localStorage.setItem('fj-music-playing', 'true')
        })
        .catch((err) => console.error('Play failed:', err))
    }
  }

  const handlePromptClick = () => {
    setShowPrompt(false)
    togglePlay()
  }

  const dismissPrompt = () => {
    setShowPrompt(false)
    setDismissed(true)
    localStorage.setItem('fj-music-dismissed', 'true')
  }

  return (
    <>
      {/* Hidden audio element */}
      <audio ref={audioRef} src="/music.mp3" loop preload="auto" />

      {/* Play/Pause Floating Button */}
      <button
        onClick={togglePlay}
        aria-label={isPlaying ? 'Pause music' : 'Play music'}
        className="fixed bottom-24 md:bottom-6 left-4 md:left-6 z-40 w-11 h-11 md:w-12 md:h-12 rounded-full bg-night-card border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-night transition-all shadow-gold group"
        style={{ display: dismissed ? 'none' : 'flex' }}
      >
        {isPlaying ? (
          <Volume2
            size={20}
            className="text-gold group-hover:text-night transition"
          />
        ) : (
          <VolumeX
            size={20}
            className="text-white/40 group-hover:text-night transition"
          />
        )}
      </button>

      {/* Auto-play Prompt (only shows if autoplay was blocked) */}
      {showPrompt && !dismissed && (
        <div className="fixed bottom-24 md:bottom-6 left-16 md:left-20 z-40 animate-fade-in">
          <div className="bg-night-card border border-gold/40 rounded-2xl p-3 shadow-gold flex items-center gap-3 max-w-xs">
            <div className="text-2xl">🎵</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold mb-0.5">Play Music?</p>
              <p className="text-[10px] text-white/50">
                Restaurant ambience ke liye
              </p>
            </div>
            <button
              onClick={handlePromptClick}
              className="bg-gold text-night text-xs font-bold px-3 py-1.5 rounded-full hover:bg-gold-light transition flex-shrink-0"
            >
              Play
            </button>
            <button
              onClick={dismissPrompt}
              className="p-1 hover:bg-white/10 rounded-full transition flex-shrink-0"
              aria-label="Dismiss"
            >
              <VolumeX size={14} className="text-white/40" />
            </button>
          </div>
        </div>
      )}
    </>
  )
}