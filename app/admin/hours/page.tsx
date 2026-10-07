'use client'

import { useEffect, useState } from 'react'
import {
  Save,
  Loader2,
  Sparkles,
  Clock,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'
import {
  getOpeningHours,
  updateOpeningHour,
  DAYS_OF_WEEK,
  type OpeningHour,
} from '@/lib/hoursSupabase'

export default function AdminHoursPage() {
  const toast = useToast()
  const { restaurant } = useRestaurant()
  const [hours, setHours] = useState<OpeningHour[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [restaurant])

  const load = async () => {
    if (!restaurant) return
    setLoading(true)
    const data = await getOpeningHours(restaurant.id)
    setHours(data)
    setLoading(false)
  }

  const update = async (id: string, updates: Partial<OpeningHour>) => {
    setSaving(id)
    setHours(hours.map((h) => (h.id === id ? { ...h, ...updates } : h)))
    const result = await updateOpeningHour(id, updates)
    if (result.success) {
      toast.success('Updated')
    } else {
      toast.error('Failed to update')
      await load()
    }
    setSaving(null)
  }

  if (loading) {
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
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-gold animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
              Opening Hours
            </h1>
          </div>
          <p className="text-white/50 text-sm">
            Har din ka timing set karo
          </p>
        </div>

        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Clock size={16} className="text-gold" />
            </span>
            Weekly Schedule
          </h2>

          <div className="space-y-3">
            {DAYS_OF_WEEK.map((day) => {
              const dayHours = hours.find((h) => h.day_of_week === day.key)
              if (!dayHours) return null
              const isSaving = saving === dayHours.id

              return (
                <div
                  key={day.key}
                  className={`flex flex-wrap items-center gap-3 p-3 rounded-xl border transition ${
                    dayHours.is_open
                      ? 'bg-night/60 border-white/5'
                      : 'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <div className="w-24 font-semibold text-sm">
                    {day.label}
                  </div>

                  <button
                    onClick={() =>
                      update(dayHours.id, { is_open: !dayHours.is_open })
                    }
                    disabled={isSaving}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition ${
                      dayHours.is_open
                        ? 'bg-fresh/20 text-fresh border border-fresh/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {dayHours.is_open ? (
                      <><ToggleRight size={12} /> Open</>
                    ) : (
                      <><ToggleLeft size={12} /> Closed</>
                    )}
                  </button>

                  {dayHours.is_open && (
                    <div className="flex items-center gap-2 flex-1 min-w-[240px]">
                      <input
                        type="time"
                        value={dayHours.opening_time}
                        onChange={(e) =>
                          update(dayHours.id, { opening_time: e.target.value })
                        }
                        className="bg-night border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                      />
                      <span className="text-white/40">to</span>
                      <input
                        type="time"
                        value={dayHours.closing_time}
                        onChange={(e) =>
                          update(dayHours.id, { closing_time: e.target.value })
                        }
                        className="bg-night border border-white/10 rounded-lg px-3 py-1.5 text-sm"
                      />
                    </div>
                  )}

                  {isSaving && (
                    <Loader2 size={14} className="animate-spin text-gold" />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}