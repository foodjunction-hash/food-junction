'use client'

import { useEffect, useState } from 'react'
import {
  Save,
  Settings as SettingsIcon,
  Loader2,
  Sparkles,
  Store,
  Phone,
  Globe,
  Bell,
  Shield,
  CheckCircle2,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'
import AdminLoading from '@/components/AdminLoading'
import { updateRestaurant, type Restaurant } from '@/lib/restaurant'

export default function AdminSettingsPage() {
  const toast = useToast()
  const { restaurant, loading: contextLoading, refresh } = useRestaurant()
  const [settings, setSettings] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (contextLoading) return
    if (restaurant) {
      setSettings(restaurant)
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [restaurant, contextLoading])

  const handleSave = async () => {
    if (!settings) return
    setSaving(true)
    const result = await updateRestaurant(settings.id, settings)
    if (result.success) {
      toast.success('Settings saved!')
      await refresh()
    } else {
      toast.error('Failed to save')
    }
    setSaving(false)
  }

  const update = (key: keyof Restaurant, value: any) => {
    if (!settings) return
    setSettings({ ...settings, [key]: value })
  }

  if (contextLoading || loading || !settings) {
    return <AdminLoading message="Loading Settings" />
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Settings
              </h1>
            </div>
            <p className="text-white/50 text-sm">
              {settings.name} ke settings manage karo
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
              <><Save size={16} /> Save Settings</>
            )}
          </button>
        </div>

        {/* Store Status */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Store size={16} className="text-gold" />
            </span>
            Store Status
          </h2>

          <div className="flex items-center justify-between p-4 rounded-xl bg-night/60 border border-white/5">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                settings.is_active ? 'bg-fresh/20 text-fresh' : 'bg-red-500/20 text-red-400'
              }`}>
                <Shield size={22} />
              </div>
              <div>
                <p className="font-bold">
                  {settings.is_active ? 'Restaurant is LIVE' : 'Restaurant is PAUSED'}
                </p>
                <p className="text-xs text-white/50">
                  {settings.is_active ? 'Customers can place orders' : 'No orders accepted'}
                </p>
              </div>
            </div>
            <button
              onClick={() => update('is_active', !settings.is_active)}
              className={`relative w-16 h-9 rounded-full transition-all ${
                settings.is_active
                  ? 'bg-gradient-to-r from-fresh to-emerald-500'
                  : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-md transition-all ${
                  settings.is_active ? 'left-8' : 'left-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Contact Settings */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Phone size={16} className="text-gold" />
            </span>
            Contact Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Primary Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="contact@restaurant.com"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Google Business */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Globe size={16} className="text-gold" />
            </span>
            Google Business
          </h2>

          <div>
            <label className="block text-xs text-white/60 mb-1.5 font-medium">
              Google Business URL
            </label>
            <input
              type="text"
              value={settings.google_business_url}
              onChange={(e) => update('google_business_url', e.target.value)}
              placeholder="https://g.page/your-restaurant"
              className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
            />
            <p className="text-[10px] text-white/40 mt-1.5">
              💡 Customer reviews dekh sakte hain aur aapko rate kar sakte hain
            </p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-white/70">
              <span className="font-semibold text-gold">Auto-save:</span> Ye
              settings save karte hi customer website par apply ho jayengi.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}