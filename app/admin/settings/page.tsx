'use client'

import { useEffect, useState } from 'react'
import {
  Save,
  Store,
  Phone,
  MapPin,
  Clock,
  Power,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  IndianRupee,
  Percent,
  Truck,
  CheckCircle2,
  XCircle,
  Activity,
  Mail,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Settings = {
  id: string
  name: string
  address: string
  phone: string
  whatsapp: string
  email: string
  upi_id: string
  opening_time: string
  closing_time: string
  is_open: boolean
  delivery_charge: number
  free_above: number
  tax_percent: number
}

const DEFAULT_SETTINGS: Settings = {
  id: 'main',
  name: 'Food Junction',
  address: 'Amarpur, Bihar',
  phone: '+91 99733 18421',
  whatsapp: '+91 99733 18421',
  email: 'shubhamydv9272@gmail.com',
  upi_id: 'foodjunction@upi',
  opening_time: '10:00',
  closing_time: '22:00',
  is_open: true,
  delivery_charge: 30,
  free_above: 500,
  tax_percent: 5,
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .eq('id', 'main')
        .maybeSingle()

      if (error) throw error
      if (data) setSettings(data)
    } catch (err: any) {
      console.error('Failed to load settings:', err)
      setError('Failed to load settings')
      setTimeout(() => setError(''), 3000)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const { error } = await supabase.from('settings').upsert({
        ...settings,
        id: 'main',
        updated_at: new Date().toISOString(),
      })

      if (error) throw error
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err: any) {
      console.error('Failed to save settings:', err)
      setError('Failed to save settings')
      setTimeout(() => setError(''), 3000)
    }
    setSaving(false)
  }

  const toggleOpen = async () => {
    const newValue = !settings.is_open
    setSettings({ ...settings, is_open: newValue })
    try {
      await supabase.from('settings').upsert({
        ...settings,
        is_open: newValue,
        id: 'main',
        updated_at: new Date().toISOString(),
      })
    } catch (err) {
      console.error('Failed to toggle:', err)
      setSettings({ ...settings, is_open: !newValue })
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} />
        Loading settings...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-gold animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
              Settings
            </h1>
          </div>
          <p className="text-white/50 text-sm flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-fresh animate-pulse" />
              Live sync
            </span>
            <span>•</span>
            <span>Changes apply to customer website instantly</span>
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300 animate-fadeIn">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Restaurant Status Card */}
        <div
          className={`relative group overflow-hidden bg-gradient-to-br rounded-2xl border p-5 mb-6 transition-all duration-500 ${
            settings.is_open
              ? 'from-emerald-500/20 via-green-500/5 to-transparent border-emerald-500/30'
              : 'from-red-500/20 via-pink-500/5 to-transparent border-red-500/30'
          }`}
          style={{ animation: 'fadeInUp 0.5s ease-out both' }}
        >
          <div
            className={`absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl ${
              settings.is_open ? 'bg-fresh/20' : 'bg-red-500/20'
            }`}
          />
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 ${
                  settings.is_open
                    ? 'bg-gradient-to-br from-fresh to-emerald-600 shadow-lg shadow-fresh/30'
                    : 'bg-gradient-to-br from-red-400 to-red-600 shadow-lg shadow-red-500/30'
                }`}
              >
                <Power size={26} className="text-night" strokeWidth={2.5} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h2 className="text-xl font-bold">
                    Restaurant is {settings.is_open ? 'OPEN' : 'CLOSED'}
                  </h2>
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 ${
                      settings.is_open
                        ? 'bg-fresh/20 text-fresh border border-fresh/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {settings.is_open ? (
                      <>
                        <CheckCircle2 size={9} /> Accepting Orders
                      </>
                    ) : (
                      <>
                        <XCircle size={9} /> Not Accepting
                      </>
                    )}
                  </span>
                </div>
                <p className="text-sm text-white/60">
                  {settings.is_open
                    ? 'Customers can place orders right now'
                    : 'Customers cannot place new orders'}
                </p>
              </div>
            </div>
            <button
              onClick={toggleOpen}
              className={`relative w-16 h-9 rounded-full transition-all duration-500 shadow-lg ${
                settings.is_open
                  ? 'bg-gradient-to-r from-fresh to-emerald-500 shadow-fresh/30'
                  : 'bg-white/10'
              }`}
            >
              <span
                className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-md transition-all duration-500 flex items-center justify-center ${
                  settings.is_open ? 'left-8' : 'left-1'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    settings.is_open ? 'bg-fresh' : 'bg-gray-400'
                  } animate-pulse`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Restaurant Info */}
        <div
          className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5 hover:border-gold/30 transition-all duration-300 overflow-hidden"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.1s both' }}
        >
          <h2 className="font-bold mb-5 flex items-center gap-2 relative z-10">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Store size={16} className="text-gold" />
            </span>
            Restaurant Info
          </h2>

          <div className="grid md:grid-cols-2 gap-4 relative z-10">
            <div className="md:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Restaurant Name
              </label>
              <div className="relative">
                <Store
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) =>
                    setSettings({ ...settings, name: e.target.value })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Address
              </label>
              <div className="relative">
                <MapPin
                  size={14}
                  className="absolute left-3.5 top-3.5 text-white/40"
                />
                <textarea
                  value={settings.address}
                  onChange={(e) =>
                    setSettings({ ...settings, address: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Phone
              </label>
              <div className="relative">
                <Phone
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={settings.phone}
                  onChange={(e) =>
                    setSettings({ ...settings, phone: e.target.value })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                WhatsApp
              </label>
              <div className="relative">
                <Phone
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={settings.whatsapp}
                  onChange={(e) =>
                    setSettings({ ...settings, whatsapp: e.target.value })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) =>
                    setSettings({ ...settings, email: e.target.value })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                UPI ID
              </label>
              <div className="relative">
                <IndianRupee
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={settings.upi_id}
                  onChange={(e) =>
                    setSettings({ ...settings, upi_id: e.target.value })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Opening Hours */}
        <div
          className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5 hover:border-gold/30 transition-all duration-300 overflow-hidden"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.2s both' }}
        >
          <h2 className="font-bold mb-5 flex items-center gap-2 relative z-10">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Clock size={16} className="text-gold" />
            </span>
            Opening Hours
          </h2>

          <div className="grid md:grid-cols-2 gap-4 relative z-10">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Opening Time
              </label>
              <div className="relative">
                <Clock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="time"
                  value={settings.opening_time}
                  onChange={(e) =>
                    setSettings({ ...settings, opening_time: e.target.value })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Closing Time
              </label>
              <div className="relative">
                <Clock
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="time"
                  value={settings.closing_time}
                  onChange={(e) =>
                    setSettings({ ...settings, closing_time: e.target.value })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pricing & Charges */}
        <div
          className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-6 hover:border-gold/30 transition-all duration-300 overflow-hidden"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
        >
          <h2 className="font-bold mb-5 flex items-center gap-2 relative z-10">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <IndianRupee size={16} className="text-gold" />
            </span>
            Pricing & Charges
          </h2>

          <div className="grid md:grid-cols-3 gap-4 relative z-10">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Delivery Charge (₹)
              </label>
              <div className="relative">
                <Truck
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="number"
                  value={settings.delivery_charge}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      delivery_charge: Number(e.target.value),
                    })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Free Delivery Above (₹)
              </label>
              <div className="relative">
                <IndianRupee
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="number"
                  value={settings.free_above}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      free_above: Number(e.target.value),
                    })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Tax / GST (%)
              </label>
              <div className="relative">
                <Percent
                  size={14}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="number"
                  value={settings.tax_percent}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      tax_percent: Number(e.target.value),
                    })
                  }
                  className="w-full bg-night/60 border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div
          className="flex items-center gap-3 flex-wrap"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
        >
          <button
            onClick={handleSave}
            disabled={saving}
            className="relative group bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-8 py-3.5 rounded-full transition-all duration-300 hover:scale-105 shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save
                  size={18}
                  className="group-hover:rotate-12 transition-transform"
                />
                Save Settings
              </>
            )}
          </button>

          {saved && (
            <div className="flex items-center gap-2 bg-fresh/20 border border-fresh/30 rounded-full px-4 py-2.5 text-sm text-fresh font-semibold animate-fadeIn">
              <div className="w-5 h-5 rounded-full bg-fresh/30 flex items-center justify-center">
                <Check size={12} strokeWidth={3} />
              </div>
              Settings saved to database!
            </div>
          )}
        </div>

        {/* Info */}
        <div
          className="mt-6 bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-2xl p-4 flex items-start gap-3"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.5s both' }}
        >
          <Activity size={16} className="text-gold flex-shrink-0 mt-0.5" />
          <p className="text-xs text-white/70">
            <span className="font-semibold text-gold">Live sync:</span> Ye
            settings Supabase database mein save hoti hain aur customer website
            par turant apply ho jati hain.
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}