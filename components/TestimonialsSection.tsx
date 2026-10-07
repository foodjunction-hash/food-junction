'use client'

import { useEffect, useState } from 'react'
import { Star, Quote } from 'lucide-react'
import { useRestaurant } from '@/lib/restaurantContext'
import { getActiveTestimonials, type Testimonial } from '@/lib/testimonialsSupabase'

export default function TestimonialsSection() {
  const { restaurant } = useRestaurant()
  const [items, setItems] = useState<Testimonial[]>([])

  useEffect(() => {
    const load = async () => {
      if (!restaurant) return
      const data = await getActiveTestimonials(restaurant.id)
      setItems(data)
    }
    load()
  }, [restaurant])

  if (items.length === 0) return null

  return (
    <section className="relative py-20 md:py-28 bg-night-soft overflow-hidden">
      <div className="absolute inset-0 bg-dots opacity-20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 text-gold tracking-[0.3em] text-xs md:text-sm mb-3">
            <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold" />
            <span className="font-semibold">CUSTOMER LOVE</span>
            <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold" />
          </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
            What Our <span className="text-shimmer">Customers</span> Say
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
            Real reviews from real food lovers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="group relative bg-night-card border border-white/5 rounded-2xl p-6 card-premium overflow-hidden"
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
            >
              <Quote size={40} className="absolute top-4 right-4 text-gold/10 group-hover:text-gold/20 transition" />

              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                  <Star key={idx} size={16} fill={idx < item.rating ? '#F5B301' : 'none'} className={idx < item.rating ? 'text-gold' : 'text-white/20'} />
                ))}
              </div>

              <p className="text-sm text-white/70 mb-5 leading-relaxed min-h-[80px]">
                "{item.review}"
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/30 flex-shrink-0 bg-night">
                  {item.customer_photo_url ? (
                    <img src={item.customer_photo_url} alt={item.customer_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold">
                      {item.customer_name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm">{item.customer_name}</p>
                  {item.location && <p className="text-[11px] text-white/40">{item.location}</p>}
                </div>
              </div>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500" />
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}