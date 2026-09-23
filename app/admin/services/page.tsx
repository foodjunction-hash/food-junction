'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Truck,
  ShoppingBag,
  UtensilsCrossed,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Save,
  Check,
  AlertCircle,
} from 'lucide-react'

type Service = {
  id: string
  name: string
  description: string
  emoji: string
  is_enabled: boolean
  coming_soon_message: string
}

const ICONS: Record<string, any> = {
  delivery: Truck,
  takeaway: ShoppingBag,
  dinein: UtensilsCrossed,
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)
  const [saved, setSaved] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      setServices(data || [])
    } catch (err: any) {
      console.error('Failed to load services:', err)
      setError('Failed to load services')
    }
    setLoading(false)
  }

  const updateService = async (id: string, updates: Partial<Service>) => {
    try {
      const { error } = await supabase
        .from('services')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error
      await loadServices()
    } catch (err: any) {
      console.error('Failed to update service:', err)
      setError('Failed to update service')
    }
  }

  const toggleEnabled = async (service: Service) => {
    setSaving(service.id)
    await updateService(service.id, { is_enabled: !service.is_enabled })
    setSaving(null)
    setSaved(service.id)
    setTimeout(() => setSaved(null), 2000)
  }

  const updateMessage = async (id: string, message: string) => {
    setSaving(id)
    await updateService(id, { coming_soon_message: message })
    setSaving(null)
    setSaved(id)
    setTimeout(() => setSaved(null), 2000)
  }

  if (loading) {
    return (
      <div className="p-6 text-white/60 flex items-center gap-3">
        <Loader2 className="animate-spin" size={20} />
        Loading services...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-1">
          Service Management
        </h1>
        <p className="text-white/50 text-sm">
          Control which services are available to customers
        </p>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-2xl p-5 mb-6">
        <h2 className="font-bold text-gold mb-2">💡 How It Works</h2>
        <ul className="text-sm text-white/70 space-y-1.5 list-disc list-inside">
          <li>
            <strong>Enabled</strong> → Customer can select this service at checkout
          </li>
          <li>
            <strong>Disabled</strong> → Customer sees "Coming Soon" message and
            cannot use this service
          </li>
          <li>Custom message dikhao jab service disabled ho</li>
        </ul>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Services List */}
      <div className="space-y-4">
        {services.map((service) => {
          const Icon = ICONS[service.id] || UtensilsCrossed
          const isSaving = saving === service.id
          const isSaved = saved === service.id

          return (
            <div
              key={service.id}
              className={`bg-night-card border rounded-2xl p-5 transition-all ${
                service.is_enabled
                  ? 'border-fresh/30'
                  : 'border-red-500/30 opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    service.is_enabled
                      ? 'bg-fresh/10 border border-fresh/30'
                      : 'bg-red-500/10 border border-red-500/30'
                  }`}
                >
                  <Icon
                    size={26}
                    className={
                      service.is_enabled ? 'text-fresh' : 'text-red-400'
                    }
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h3 className="font-bold text-lg">
                      {service.emoji} {service.name}
                    </h3>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        service.is_enabled
                          ? 'bg-fresh/20 text-fresh'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {service.is_enabled ? '✓ Active' : '⏸ Coming Soon'}
                    </span>
                  </div>
                  <p className="text-sm text-white/50 mb-3">
                    {service.description}
                  </p>

                  {/* Custom message input */}
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5">
                      Message shown when disabled:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        defaultValue={service.coming_soon_message}
                        onBlur={(e) => {
                          if (e.target.value !== service.coming_soon_message) {
                            updateMessage(service.id, e.target.value)
                          }
                        }}
                        placeholder="e.g. Coming soon!"
                        className="flex-1 bg-night border border-white/10 rounded-xl px-3 py-2 text-sm focus:border-gold/50 focus:outline-none transition"
                      />
                      {isSaving && (
                        <div className="flex items-center px-3">
                          <Loader2 size={16} className="animate-spin text-gold" />
                        </div>
                      )}
                      {isSaved && !isSaving && (
                        <div className="flex items-center px-3">
                          <Check size={16} className="text-fresh" />
                        </div>
                      )}
                    </div>
                    <p className="text-[10px] text-white/30 mt-1">
                      Press Tab or click outside to save
                    </p>
                  </div>
                </div>

                {/* Toggle Button */}
                <button
                  onClick={() => toggleEnabled(service)}
                  disabled={isSaving}
                  className={`flex-shrink-0 p-2 rounded-xl transition-all disabled:opacity-50 ${
                    service.is_enabled
                      ? 'text-fresh hover:bg-fresh/10'
                      : 'text-white/30 hover:bg-white/5'
                  }`}
                  aria-label={service.is_enabled ? 'Disable' : 'Enable'}
                  title={
                    service.is_enabled
                      ? 'Click to disable'
                      : 'Click to enable'
                  }
                >
                  {isSaving ? (
                    <Loader2 size={32} className="animate-spin" />
                  ) : service.is_enabled ? (
                    <ToggleRight size={40} />
                  ) : (
                    <ToggleLeft size={40} />
                  )}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-night-card border border-white/5 rounded-2xl p-5">
        <h3 className="font-bold mb-3">📊 Current Status</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-fresh">
              {services.filter((s) => s.is_enabled).length}
            </p>
            <p className="text-xs text-white/50 mt-1">Active Services</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-red-400">
              {services.filter((s) => !s.is_enabled).length}
            </p>
            <p className="text-xs text-white/50 mt-1">Coming Soon</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gold">{services.length}</p>
            <p className="text-xs text-white/50 mt-1">Total Services</p>
          </div>
        </div>
      </div>
    </div>
  )
}