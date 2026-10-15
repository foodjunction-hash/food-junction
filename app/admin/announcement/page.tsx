'use client'

import { useEffect, useState } from 'react'
import {
  Save,
  Loader2,
  Sparkles,
  Megaphone,
  ToggleLeft,
  ToggleRight,
  Palette,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'
import {
  getAnnouncement,
  saveAnnouncement,
  type Announcement,
} from '@/lib/announcementSupabase'

export default function AdminAnnouncementPage() {
  const toast = useToast()
  const { restaurant } = useRestaurant()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadAnnouncement()
  }, [restaurant])

  const loadAnnouncement = async () => {
    if (!restaurant) return
    setLoading(true)
    const data = await getAnnouncement(restaurant.id)
    setAnnouncement(
      data || {
        id: '',
        restaurant_id: restaurant.id,
        text: '',
        button_text: '',
        button_link: '',
        background_color: '#F5B301',
        text_color: '#0A0A0F',
        is_active: false,
      }
    )
    setLoading(false)
  }

  const handleSave = async () => {
    if (!announcement) return
    setSaving(true)
    const result = await saveAnnouncement(announcement)
    if (result.success && result.data) {
      setAnnouncement(result.data)
      toast.success('Announcement saved!')
    } else {
      toast.error('Failed to save')
    }
    setSaving(false)
  }

  const update = (key: keyof Announcement, value: any) => {
    if (!announcement) return
    setAnnouncement({ ...announcement, [key]: value })
  }

  if (loading || !announcement) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} />
        Loading...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Announcement Bar
              </h1>
            </div>
            <p className="text-white/50 text-sm">
              Top par offer message dikhao (festival, sale, etc.)
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/30 flex items-center gap-2 text-sm disabled:opacity-60"
          >
            {saving ? (
              <><Loader2 size={16} className="animate-spin" /> Saving...</>
            ) : (
              <><Save size={16} /> Save</>
            )}
          </button>
        </div>

        {/* Live Preview */}
        {announcement.text && (
          <div
            className="relative rounded-2xl p-3 mb-5 text-center text-sm font-semibold"
            style={{
              backgroundColor: announcement.background_color,
              color: announcement.text_color,
            }}
          >
            <p>{announcement.text}</p>
            {announcement.button_text && (
              <span
                className="inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full"
                style={{
                  backgroundColor: announcement.text_color,
                  color: announcement.background_color,
                }}
              >
                {announcement.button_text} →
              </span>
            )}
            <p className="text-[10px] mt-2 opacity-70">👆 Live Preview</p>
          </div>
        )}

        {/* Status Toggle */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                announcement.is_active ? 'bg-fresh/20 text-fresh' : 'bg-white/5 text-white/40'
              }`}>
                <Megaphone size={22} />
              </div>
              <div>
                <p className="font-bold">
                  {announcement.is_active ? 'Announcement is ACTIVE' : 'Announcement is INACTIVE'}
                </p>
                <p className="text-xs text-white/50">
                  {announcement.is_active ? 'Website par dikhega' : 'Website par nahi dikhega'}
                </p>
              </div>
            </div>
            <button
              onClick={() => update('is_active', !announcement.is_active)}
              className={`relative w-16 h-9 rounded-full transition-all ${
                announcement.is_active
                  ? 'bg-gradient-to-r from-fresh to-emerald-500'
                  : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-md transition-all ${
                  announcement.is_active ? 'left-8' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Megaphone size={16} className="text-gold" />
            </span>
            Content
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Announcement Text *
              </label>
              <input
                type="text"
                value={announcement.text}
                onChange={(e) => update('text', e.target.value)}
                placeholder="🔥 Weekend Special – Get 20% OFF Today!"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">
                  Button Text
                </label>
                <input
                  type="text"
                  value={announcement.button_text}
                  onChange={(e) => update('button_text', e.target.value)}
                  placeholder="Order Now"
                  className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">
                  Button Link
                </label>
                <input
                  type="text"
                  value={announcement.button_link}
                  onChange={(e) => update('button_link', e.target.value)}
                  placeholder="/menu"
                  className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Colors */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Palette size={16} className="text-gold" />
            </span>
            Colors
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Background Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={announcement.background_color}
                  onChange={(e) => update('background_color', e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border border-white/10"
                />
                <input
                  type="text"
                  value={announcement.background_color}
                  onChange={(e) => update('background_color', e.target.value)}
                  className="flex-1 bg-night/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Text Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={announcement.text_color}
                  onChange={(e) => update('text_color', e.target.value)}
                  className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border border-white/10"
                />
                <input
                  type="text"
                  value={announcement.text_color}
                  onChange={(e) => update('text_color', e.target.value)}
                  className="flex-1 bg-night/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}