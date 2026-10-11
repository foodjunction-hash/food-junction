'use client'

import { useEffect, useState } from 'react'
import {
  Save,
  Sparkles,
  Truck,
  ShoppingBag,
  UtensilsCrossed,
  ToggleLeft,
  ToggleRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'
import AdminLoading from '@/components/AdminLoading'
import { supabase } from '@/lib/supabase'

type Service = {
  id: string
  name: string
  description: string
  emoji: string
  is_enabled: boolean
  coming_soon_message: string
}

const SERVICE_ICONS: Record<string, any> = {
  delivery: Truck,
  takeaway: ShoppingBag,
  dinein: UtensilsCrossed,
}

export default function AdminServicesPage() {
  const toast = useToast()
  const { restaurant, loading: contextLoading } = useRestaurant()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    if (contextLoading) return
    if (restaurant) {
      loadServices()
    }
  }, [restaurant, contextLoading])

  const loadServices = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('id')

      if (error) throw error
      setServices(data || [])
    } catch (err: any) {
      console.error('Failed to load services:', err)
      toast.error('Failed to load services')
    }
    setLoading(false)
  }

  const handleToggle = async (service: Service) => {
    setSaving(service.id)
    try {
      const { error } = await supabase
        .from('services')
        .update({
          is_enabled: !service.is_enabled,
          updated_at: new Date().toISOString(),
        })
        .eq('id', service.id)

      if (error) throw error

      setServices(
        services.map((s) =>
          s.id === service.id ? { ...s, is_enabled: !s.is_enabled } : s
        )
      )
      toast.success(
        `${service.name} ${!service.is_enabled ? 'enabled' : 'disabled'}`
      )
    } catch (err: any) {
      toast.error('Failed to update')
    }
    setSaving(null)
  }

  const handleMessageChange = async (id: string, message: string) => {
    setServices(
      services.map((s) =>
        s.id === id ? { ...s, coming_soon_message: message } : s
      )
    )
  }

  const handleSaveMessage = async (service: Service) => {
    setSaving(service.id)
    try {
      const { error } = await supabase
        .from('services')
        .update({
          coming_soon_message: service.coming_soon_message,
          updated_at: new Date().toISOString(),
        })
        .eq('id', service.id)

      if (error) throw error
      toast.success('Message saved')
    } catch (err: any) {
      toast.error('Failed to save')
    }
    setSaving(null)
  }

  // 🚨 KHATARNAK LOADING SCREEN
  if (contextLoading || loading) {
    return <AdminLoading message="Loading Services" />
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-gold animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
              Services
            </h1>
          </div>
          <p className="text-white/50 text-sm">
            {restaurant?.name || 'Restaurant'} ke services enable/disable karo
          </p>
        </div>

        {/* Info */}
        <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <AlertCircle size={16} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-white/70">
              <span className="font-semibold text-gold">Note:</span> Jo service
              disable karo, customer checkout mein wo option nahi dikhega.
              Coming soon message bhi add kar sakte ho.
            </p>
          </div>
        </div>

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => {
            const Icon = SERVICE_ICONS[service.id] || Truck
            const isSaving = saving === service.id

            return (
              <div
                key={service.id}
                className={`relative bg-night-card/80 backdrop-blur-xl border rounded-2xl p-5 md:p-6 transition-all ${
                  service.is_enabled
                    ? 'border-fresh/30'
                    : 'border-red-500/20 opacity-80'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        service.is_enabled
                          ? 'bg-gradient-to-br from-gold/30 to-gold/10'
                          : 'bg-white/5'
                      }`}
                    >
                      <Icon
                        size={26}
                        className={service.is_enabled ? 'text-gold' : 'text-white/40'}
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {service.emoji} {service.name}
                      </h3>
                      <p className="text-xs text-white/50">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleToggle(service)}
                    disabled={isSaving}
                    className={`relative w-16 h-9 rounded-full transition-all flex-shrink-0 ${
                      service.is_enabled
                        ? 'bg-gradient-to-r from-fresh to-emerald-500'
                        : 'bg-white/10'
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-7 h-7 rounded-full bg-white shadow-md transition-all ${
                        service.is_enabled ? 'left-8' : 'left-1'
                      }`}
                    />
                    {isSaving && (
                      <Loader2
                        size={12}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin text-white"
                      />
                    )}
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-4">
                  {service.is_enabled ? (
                    <span className="inline-flex items-center gap-1.5 bg-fresh/20 text-fresh border border-fresh/30 px-3 py-1.5 rounded-full text-xs font-bold">
                      <CheckCircle2 size={12} /> ENABLED
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1.5 rounded-full text-xs font-bold">
                      <AlertCircle size={12} /> DISABLED
                    </span>
                  )}
                </div>

                {/* Coming Soon Message (only when disabled) */}
                {!service.is_enabled && (
                  <div>
                    <label className="block text-xs text-white/60 mb-1.5 font-medium">
                      Coming Soon Message
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={service.coming_soon_message}
                        onChange={(e) =>
                          handleMessageChange(service.id, e.target.value)
                        }
                        placeholder="e.g. Launching soon — stay tuned!"
                        className="flex-1 bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                      />
                      <button
                        onClick={() => handleSaveMessage(service)}
                        disabled={isSaving}
                        className="bg-gold text-night font-bold px-4 py-3 rounded-xl hover:bg-gold-light transition text-sm disabled:opacity-50"
                      >
                        {isSaving ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Save size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}