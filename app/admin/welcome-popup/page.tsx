'use client'

import { useEffect, useState } from 'react'
import {
  Save, Loader2, Sparkles, Layout, Eye, EyeOff,
  ToggleLeft, ToggleRight, Type, Link2,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'
import {
  getWelcomePopup,
  saveWelcomePopup,
  type WelcomePopup,
} from '@/lib/welcomePopupSupabase'

export default function AdminWelcomePopupPage() {
  const toast = useToast()
  const { restaurant } = useRestaurant()
  const [popup, setPopup] = useState<WelcomePopup | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    load()
  }, [restaurant])

  const load = async () => {
    if (!restaurant) return
    setLoading(true)
    const data = await getWelcomePopup(restaurant.id)
    setPopup(
      data || {
        id: '',
        restaurant_id: restaurant.id,
        is_active: true,
        badge_text: 'WELCOME TO',
        badge_visible: true,
        title: restaurant.name || '',
        subtitle: '',
        footer_text: 'FRESH • DELICIOUS • HYGIENIC',
        primary_button_text: 'Order Now',
        primary_button_link: '/menu',
        primary_button_visible: true,
        secondary_button_text: 'View Menu',
        secondary_button_link: '/menu',
        secondary_button_visible: true,
        show_open_now: true,
        show_opening_hours: true,
        show_on_load: true,
        delay_ms: 1500,
      }
    )
    setLoading(false)
  }

  const handleSave = async () => {
    if (!popup) return
    setSaving(true)
    const result = await saveWelcomePopup(popup)
    if (result.success && result.data) {
      setPopup(result.data)
      toast.success('Welcome popup saved!')
    } else {
      toast.error('Failed to save')
    }
    setSaving(false)
  }

  const update = (key: keyof WelcomePopup, value: any) => {
    if (!popup) return
    setPopup({ ...popup, [key]: value })
  }

  if (loading || !popup) {
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
                Welcome Popup
              </h1>
            </div>
            <p className="text-white/50 text-sm">
              Website khulte hi jo popup dikhta hai use customize karo
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

        {/* Master Toggle */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 mb-5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                popup.is_active ? 'bg-fresh/20 text-fresh' : 'bg-white/5 text-white/40'
              }`}>
                <Layout size={22} />
              </div>
              <div>
                <p className="font-bold">
                  {popup.is_active ? 'Welcome Popup ACTIVE' : 'Welcome Popup INACTIVE'}
                </p>
                <p className="text-xs text-white/50">
                  {popup.is_active ? 'Website par dikhega' : 'Website par nahi dikhega'}
                </p>
              </div>
            </div>
            <button
              onClick={() => update('is_active', !popup.is_active)}
              className={`relative w-16 h-9 rounded-full transition-all ${
                popup.is_active
                  ? 'bg-gradient-to-r from-fresh to-emerald-500'
                  : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-md transition-all ${
                  popup.is_active ? 'left-8' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Preview */}
        {popup.title && (
          <div className="bg-night-card/80 backdrop-blur-xl border border-gold/30 rounded-2xl p-4 mb-5">
            <p className="text-[10px] text-gold tracking-widest mb-3 text-center">
              👁️ LIVE PREVIEW
            </p>
            <div className="bg-night rounded-2xl p-6 text-center border border-gold/20">
              {popup.badge_visible && popup.badge_text && (
                <div className="inline-flex items-center gap-1 bg-gold/15 border border-gold/40 text-gold px-3 py-1 rounded-full text-[10px] font-bold tracking-widest mb-3">
                  ⭐ {popup.badge_text}
                </div>
              )}
              <h3 className="font-bold text-xl mb-1 text-gold">{popup.title}</h3>
              {popup.subtitle && (
                <p className="text-xs text-white/60 mb-3">{popup.subtitle}</p>
              )}
              <div className="flex justify-center gap-2 text-[10px]">
                {popup.show_open_now && (
                  <span className="px-3 py-1 rounded-full bg-fresh/10 border border-fresh/40 text-fresh font-bold">
                    OPEN NOW
                  </span>
                )}
                {popup.show_opening_hours && (
                  <span className="px-3 py-1 rounded-full bg-gold/10 border border-gold/40 text-gold font-bold">
                    10:00 AM - 10:00 PM
                  </span>
                )}
              </div>
              {popup.footer_text && (
                <p className="text-[9px] text-white/40 tracking-[0.3em] mt-4">
                  {popup.footer_text}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Badge */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Type size={16} className="text-gold" />
            </span>
            Top Badge
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Show Badge</label>
              <button
                type="button"
                onClick={() => update('badge_visible', !popup.badge_visible)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                  popup.badge_visible
                    ? 'bg-fresh/20 text-fresh border border-fresh/30'
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}
              >
                {popup.badge_visible ? (
                  <><ToggleRight size={14} /> Visible</>
                ) : (
                  <><ToggleLeft size={14} /> Hidden</>
                )}
              </button>
            </div>

            {popup.badge_visible && (
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">
                  Badge Text
                </label>
                <input
                  type="text"
                  value={popup.badge_text}
                  onChange={(e) => update('badge_text', e.target.value)}
                  placeholder="WELCOME TO"
                  className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                />
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Type size={16} className="text-gold" />
            </span>
            Main Content
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Title *
              </label>
              <input
                type="text"
                value={popup.title}
                onChange={(e) => update('title', e.target.value)}
                placeholder="e.g. Welcome to Food Junction"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Subtitle
              </label>
              <input
                type="text"
                value={popup.subtitle}
                onChange={(e) => update('subtitle', e.target.value)}
                placeholder="e.g. The Family Restaurant • Amarpur"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Footer Text
              </label>
              <input
                type="text"
                value={popup.footer_text}
                onChange={(e) => update('footer_text', e.target.value)}
                placeholder="e.g. FRESH • DELICIOUS • HYGIENIC"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Link2 size={16} className="text-gold" />
            </span>
            Buttons
          </h2>

          <div className="space-y-5">
            {/* Primary */}
            <div className="border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold text-gold">Primary Button</p>
                <button
                  type="button"
                  onClick={() => update('primary_button_visible', !popup.primary_button_visible)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${
                    popup.primary_button_visible
                      ? 'bg-fresh/20 text-fresh border border-fresh/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {popup.primary_button_visible ? (
                    <><Eye size={10} /> Visible</>
                  ) : (
                    <><EyeOff size={10} /> Hidden</>
                  )}
                </button>
              </div>
              {popup.primary_button_visible && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={popup.primary_button_text}
                    onChange={(e) => update('primary_button_text', e.target.value)}
                    placeholder="Order Now"
                    className="bg-night/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    value={popup.primary_button_link}
                    onChange={(e) => update('primary_button_link', e.target.value)}
                    placeholder="/menu"
                    className="bg-night/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono"
                  />
                </div>
              )}
            </div>

            {/* Secondary */}
            <div className="border border-white/5 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold">Secondary Button</p>
                <button
                  type="button"
                  onClick={() => update('secondary_button_visible', !popup.secondary_button_visible)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold ${
                    popup.secondary_button_visible
                      ? 'bg-fresh/20 text-fresh border border-fresh/30'
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  {popup.secondary_button_visible ? (
                    <><Eye size={10} /> Visible</>
                  ) : (
                    <><EyeOff size={10} /> Hidden</>
                  )}
                </button>
              </div>
              {popup.secondary_button_visible && (
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={popup.secondary_button_text}
                    onChange={(e) => update('secondary_button_text', e.target.value)}
                    placeholder="View Menu"
                    className="bg-night/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    value={popup.secondary_button_link}
                    onChange={(e) => update('secondary_button_link', e.target.value)}
                    placeholder="/menu"
                    className="bg-night/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Display Settings */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Layout size={16} className="text-gold" />
            </span>
            Display Settings
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show "Open Now" Badge</p>
                <p className="text-xs text-white/40">Real-time open/closed status</p>
              </div>
              <button
                type="button"
                onClick={() => update('show_open_now', !popup.show_open_now)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                  popup.show_open_now
                    ? 'bg-fresh/20 text-fresh border border-fresh/30'
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}
              >
                {popup.show_open_now ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                {popup.show_open_now ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Opening Hours</p>
                <p className="text-xs text-white/40">Today's timing (from Opening Hours)</p>
              </div>
              <button
                type="button"
                onClick={() => update('show_opening_hours', !popup.show_opening_hours)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                  popup.show_opening_hours
                    ? 'bg-fresh/20 text-fresh border border-fresh/30'
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}
              >
                {popup.show_opening_hours ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                {popup.show_opening_hours ? 'On' : 'Off'}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show Popup on Page Load</p>
                <p className="text-xs text-white/40">Agar off karo toh popup nahi dikhega</p>
              </div>
              <button
                type="button"
                onClick={() => update('show_on_load', !popup.show_on_load)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
                  popup.show_on_load
                    ? 'bg-fresh/20 text-fresh border border-fresh/30'
                    : 'bg-white/5 text-white/40 border border-white/10'
                }`}
              >
                {popup.show_on_load ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                {popup.show_on_load ? 'On' : 'Off'}
              </button>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Delay Before Showing (milliseconds)
              </label>
              <input
                type="number"
                value={popup.delay_ms}
                onChange={(e) => update('delay_ms', Number(e.target.value))}
                min={0}
                max={10000}
                step={100}
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
              <p className="text-[10px] text-white/40 mt-1.5">
                💡 1000 = 1 second. Recommended: 1500 (1.5 sec)
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-2xl p-4 flex items-start gap-3">
          <Sparkles size={16} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-white/70">
              <span className="font-semibold text-gold">Tip:</span> Save karne ke
              baad website refresh karo. Popup sirf ek baar per session dikhta hai
              (user experience ke liye).
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}