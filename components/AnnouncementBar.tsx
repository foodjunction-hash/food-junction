'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { X, ArrowRight } from 'lucide-react'
import { useRestaurant } from '@/lib/restaurantContext'
import { getAnnouncement, type Announcement } from '@/lib/announcementSupabase'

export default function AnnouncementBar() {
  const { restaurant } = useRestaurant()
  const [announcement, setAnnouncement] = useState<Announcement | null>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const load = async () => {
      if (!restaurant) return
      const data = await getAnnouncement(restaurant.id)
      if (data?.is_active && data.text) {
        setAnnouncement(data)
      }
    }
    load()
  }, [restaurant])

  if (!announcement || dismissed) return null

  return (
    <div
      className="relative w-full py-2.5 px-4 transition-all"
      style={{
        backgroundColor: announcement.background_color,
        color: announcement.text_color,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap text-sm">
        <p className="font-semibold text-center">{announcement.text}</p>
        {announcement.button_text && announcement.button_link && (
          <Link
            href={announcement.button_link}
            className="inline-flex items-center gap-1 font-bold px-3 py-1 rounded-full transition hover:scale-105"
            style={{
              backgroundColor: announcement.text_color,
              color: announcement.background_color,
            }}
          >
            {announcement.button_text}
            <ArrowRight size={12} />
          </Link>
        )}
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-black/20 transition"
        aria-label="Dismiss"
      >
        <X size={14} style={{ color: announcement.text_color }} />
      </button>
    </div>
  )
}