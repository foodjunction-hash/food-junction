'use client'

import { useEffect, useState } from 'react'
import { Save, Store, Phone, MapPin, Clock, Power, Check } from 'lucide-react'

type Settings = {
  name: string
  address: string
  phone: string
  whatsapp: string
  email: string
  upiId: string
  openingTime: string
  closingTime: string
  isOpen: boolean
  deliveryCharge: number
  freeAbove: number
  taxPercent: number
}

const DEFAULT_SETTINGS: Settings = {
  name: 'Food Junction',
  address: 'Amarpur, Bihar',
  phone: '+91 99733 18421',
  whatsapp: '+91 99733 18421',
  email: 'shubhamydv9272@gmail.com',
  upiId: 'foodjunction@upi',
  openingTime: '10:00',
  closingTime: '22:00',
  isOpen: true,
  deliveryCharge: 30,
  freeAbove: 500,
  taxPercent: 5,
}

const STORAGE_KEY = 'fj-settings'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    try {
      const data = localStorage.getItem(STORAGE_KEY)
      if (data) setSettings(JSON.parse(data))
    } catch {}
    setMounted(true)
  }, [])

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const update = <K extends keyof Settings>(key: K, value: Settings[K]) => {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  if (!mounted) {
    return <div className="p-6 text-white/60 text-sm">Loading settings...</div>
  }

  return (
    <div className="p-4 md:p-8 max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-1">Settings</h1>
        <p className="text-white/50 text-sm">
          Manage your restaurant information and preferences
        </p>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="mb-5 flex items-center gap-2 bg-fresh/10 border border-fresh/30 rounded-xl px-4 py-3 text-sm text-fresh animate-fade-in">
          <Check size={16} />
          Settings saved successfully!
        </div>
      )}

      {/* Restaurant Open/Close */}
      <div
        className={`rounded-2xl border p-5 mb-5 transition ${
          settings.isOpen
            ? 'bg-fresh/5 border-fresh/30'
            : 'bg-red-500/5 border-red-500/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                settings.isOpen ? 'bg-fresh text-night' : 'bg-red-500 text-white'
              }`}
            >
              <Power size={22} />
            </div>
            <div>
              <p className="font-bold text-lg">
                Restaurant is {settings.isOpen ? 'OPEN' : 'CLOSED'}
              </p>
              <p className="text-xs text-white/60">
                {settings.isOpen
                  ? 'Customers can place orders right now'
                  : 'Customers will see "currently closed" message'}
              </p>
            </div>
          </div>
          <button
            onClick={() => update('isOpen', !settings.isOpen)}
            className={`w-14 h-8 rounded-full transition relative flex-shrink-0 ${
              settings.isOpen ? 'bg-fresh' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all ${
                settings.isOpen ? 'left-7' : 'left-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Restaurant Info */}
      <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-5">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Store size={18} className="text-gold" /> Restaurant Info
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">
              Restaurant Name
            </label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => update('name', e.target.value)}
              className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1.5 flex items-center gap-1.5">
              <MapPin size={12} /> Address
            </label>
            <input
              type="text"
              value={settings.address}
              onChange={(e) => update('address', e.target.value)}
              className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 flex items-center gap-1.5">
                <Phone size={12} /> Phone
              </label>
              <input
                type="text"
                value={settings.phone}
                onChange={(e) => update('phone', e.target.value)}
                className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5 flex items-center gap-1.5">
                <Phone size={12} /> WhatsApp
              </label>
              <input
                type="text"
                value={settings.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5">Email</label>
              <input
                type="email"
                value={settings.email}
                onChange={(e) => update('email', e.target.value)}
                className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1.5">UPI ID</label>
              <input
                type="text"
                value={settings.upiId}
                onChange={(e) => update('upiId', e.target.value)}
                className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Timing */}
      <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-5">
        <h2 className="font-bold mb-4 flex items-center gap-2">
          <Clock size={18} className="text-gold" /> Opening Hours
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Opening Time</label>
            <input
              type="time"
              value={settings.openingTime}
              onChange={(e) => update('openingTime', e.target.value)}
              className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">Closing Time</label>
            <input
              type="time"
              value={settings.closingTime}
              onChange={(e) => update('closingTime', e.target.value)}
              className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-5">
        <h2 className="font-bold mb-4">Pricing & Charges</h2>

        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-white/60 mb-1.5">
              Delivery Charge (₹)
            </label>
            <input
              type="number"
              value={settings.deliveryCharge}
              onChange={(e) => update('deliveryCharge', Number(e.target.value))}
              className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">
              Free Delivery Above (₹)
            </label>
            <input
              type="number"
              value={settings.freeAbove}
              onChange={(e) => update('freeAbove', Number(e.target.value))}
              className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs text-white/60 mb-1.5">
              Tax / GST (%)
            </label>
            <input
              type="number"
              value={settings.taxPercent}
              onChange={(e) => update('taxPercent', Number(e.target.value))}
              className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full md:w-auto bg-gold text-night font-bold px-8 py-4 rounded-full hover:bg-gold-light transition flex items-center justify-center gap-2 shadow-gold"
      >
        <Save size={18} /> Save Settings
      </button>

      <p className="text-center md:text-left text-xs text-white/40 mt-4">
        ⚠️ Settings are saved locally. Backend integration coming soon.
      </p>
    </div>
  )
}