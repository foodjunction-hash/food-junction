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
  Sparkles,
  Activity,
  XCircle,
  CheckCircle2,
  Briefcase,
  Layers,
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
      setTimeout(() => setError(''), 3000)
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
      <div className="p-6 text-white/60 flex items-center gap-3 text-sm">
        <Loader2 className="animate-spin text-gold" size={18} />
        Loading services...
      </div>
    )
  }

  const activeCount = services.filter((s) => s.is_enabled).length
  const inactiveCount = services.filter((s) => !s.is_enabled).length

  const statsData = [
    {
      label: 'Total Services',
      value: services.length,
      icon: Briefcase,
      gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
      border: 'border-amber-500/30',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
      color: 'text-gold',
      trend: 'all services',
    },
    {
      label: 'Active',
      value: activeCount,
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 via-green-500/5 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
      color: 'text-fresh',
      trend: 'live for customers',
    },
    {
      label: 'Coming Soon',
      value: inactiveCount,
      icon: XCircle,
      gradient: 'from-red-500/20 via-pink-500/5 to-transparent',
      border: 'border-red-500/30',
      iconBg: 'bg-gradient-to-br from-red-400 to-pink-600',
      color: 'text-red-400',
      trend: 'temporarily disabled',
    },
  ]

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-gold animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
              Service Management
            </h1>
          </div>
          <p className="text-white/50 text-sm flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-fresh animate-pulse" />
              Live updating
            </span>
            <span>•</span>
            <span>Control which services are available to customers</span>
          </p>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
          {statsData.map((s, i) => (
            <div
              key={s.label}
              className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card/80 backdrop-blur-xl border ${s.border} rounded-2xl p-4 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-gold/10 overflow-hidden`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both`,
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

              <div className="relative z-10">
                <div
                  className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <s.icon size={18} className="text-night" strokeWidth={2.5} />
                </div>

                <p
                  className={`text-3xl font-bold ${s.color} mb-0.5 tracking-tight`}
                >
                  {s.value}
                </p>
                <p className="text-xs text-white/50 font-medium">{s.label}</p>
                <p className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">
                  {s.trend}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div
          className="relative overflow-hidden bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-2xl p-5 mb-6"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="font-bold text-gold mb-3 flex items-center gap-2">
              <Sparkles size={16} />
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="flex items-start gap-2 bg-night/40 backdrop-blur rounded-xl p-3 border border-white/5">
                <CheckCircle2
                  size={16}
                  className="text-fresh flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-semibold mb-0.5">Enabled</p>
                  <p className="text-xs text-white/60">
                    Customer can select this service at checkout
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-night/40 backdrop-blur rounded-xl p-3 border border-white/5">
                <XCircle
                  size={16}
                  className="text-red-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-semibold mb-0.5">Disabled</p>
                  <p className="text-xs text-white/60">
                    Customer sees &quot;Coming Soon&quot; message
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 bg-night/40 backdrop-blur rounded-xl p-3 border border-white/5">
                <Activity
                  size={16}
                  className="text-gold flex-shrink-0 mt-0.5"
                />
                <div>
                  <p className="text-sm font-semibold mb-0.5">Custom Message</p>
                  <p className="text-xs text-white/60">
                    Dikhao jab service disabled ho
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300 animate-fadeIn">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service, i) => {
            const Icon = ICONS[service.id] || UtensilsCrossed
            const isSaving = saving === service.id
            const isSaved = saved === service.id

            return (
              <div
                key={service.id}
                className={`relative group bg-night-card/80 backdrop-blur-xl border rounded-2xl p-5 transition-all duration-300 overflow-hidden ${
                  service.is_enabled
                    ? 'border-fresh/30 hover:border-fresh/60 hover:shadow-xl hover:shadow-fresh/5'
                    : 'border-red-500/30 opacity-80 hover:opacity-100 hover:border-red-500/60'
                }`}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${0.4 + i * 0.06}s both`,
                }}
              >
                {/* Hover glow */}
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
                    service.is_enabled
                      ? 'bg-gradient-to-br from-fresh/[0.03] to-transparent'
                      : 'bg-gradient-to-br from-red-500/[0.03] to-transparent'
                  }`}
                />

                <div className="relative z-10">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        service.is_enabled
                          ? 'bg-gradient-to-br from-fresh/20 via-fresh/10 to-transparent border border-fresh/30'
                          : 'bg-gradient-to-br from-red-500/20 via-red-500/10 to-transparent border border-red-500/30'
                      }`}
                    >
                      <Icon
                        size={28}
                        className={
                          service.is_enabled ? 'text-fresh' : 'text-red-400'
                        }
                        strokeWidth={2}
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-lg">
                          {service.emoji} {service.name}
                        </h3>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 ${
                            service.is_enabled
                              ? 'bg-fresh/20 text-fresh border border-fresh/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {service.is_enabled ? (
                            <>
                              <CheckCircle2 size={9} /> Active
                            </>
                          ) : (
                            <>
                              <XCircle size={9} /> Coming Soon
                            </>
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-white/50 mb-3">
                        {service.description}
                      </p>

                      {/* Custom message input */}
                      <div>
                        <label className="block text-xs text-white/50 mb-1.5 font-medium flex items-center gap-1.5">
                          <Layers size={11} />
                          Message shown when disabled:
                        </label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="text"
                            defaultValue={service.coming_soon_message}
                            onBlur={(e) => {
                              if (
                                e.target.value !== service.coming_soon_message
                              ) {
                                updateMessage(service.id, e.target.value)
                              }
                            }}
                            placeholder="e.g. Coming soon!"
                            className="flex-1 bg-night/60 backdrop-blur border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                          />
                          {isSaving && (
                            <div className="flex items-center px-2">
                              <Loader2
                                size={18}
                                className="animate-spin text-gold"
                              />
                            </div>
                          )}
                          {isSaved && !isSaving && (
                            <div className="flex items-center px-2 animate-fadeIn">
                              <div className="w-7 h-7 rounded-full bg-fresh/20 border border-fresh/30 flex items-center justify-center">
                                <Check size={14} className="text-fresh" />
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-white/30 mt-1.5">
                          Press Tab or click outside to save
                        </p>
                      </div>
                    </div>

                    {/* Toggle */}
                    <button
                      onClick={() => toggleEnabled(service)}
                      disabled={isSaving}
                      className={`flex-shrink-0 p-2 rounded-2xl transition-all disabled:opacity-50 hover:scale-110 ${
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
                        <Loader2 size={36} className="animate-spin text-gold" />
                      ) : service.is_enabled ? (
                        <ToggleRight size={44} strokeWidth={1.5} />
                      ) : (
                        <ToggleLeft size={44} strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
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