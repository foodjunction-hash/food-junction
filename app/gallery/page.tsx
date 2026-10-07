'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useRestaurant } from '@/lib/restaurantContext'
import { getActiveGallery, type GalleryItem } from '@/lib/gallerySupabase'
import {
  Sparkles,
  Camera,
  Utensils,
  Heart,
  Building2,
  ShoppingBag,
  X,
  Maximize2,
  Users,
  Loader2,
} from 'lucide-react'

type Category = 'all' | string

const CATEGORIES = [
  { id: 'all', label: 'All Photos', emoji: '✨', icon: Sparkles },
  { id: 'food', label: 'Food', emoji: '🍽️', icon: Utensils },
  { id: 'ambience', label: 'Ambience', emoji: '🏪', icon: Building2 },
  { id: 'moments', label: 'Moments', emoji: '❤️', icon: Heart },
  { id: 'team', label: 'Team', emoji: '👥', icon: Users },
]

export default function GalleryPage() {
  const { restaurant } = useRestaurant()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [filtered, setFiltered] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Category>('all')
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  useEffect(() => {
    const load = async () => {
      if (!restaurant) return
      setLoading(true)
      const data = await getActiveGallery(restaurant.id)
      setItems(data)
      setFiltered(data)
      setLoading(false)
    }
    load()
  }, [restaurant])

  useEffect(() => {
    if (filter === 'all') setFiltered(items)
    else setFiltered(items.filter((i) => i.category === filter))
  }, [filter, items])

  const counts: Record<string, number> = {
    all: items.length,
    food: items.filter((i) => i.category === 'food').length,
    ambience: items.filter((i) => i.category === 'ambience').length,
    moments: items.filter((i) => i.category === 'moments').length,
    team: items.filter((i) => i.category === 'team').length,
  }

  const restaurantName = restaurant?.name || 'Food Junction'

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* ===== Hero ===== */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-fresh/10 blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-gold border border-gold/30 text-gold px-4 py-2 rounded-full text-sm mb-6">
              <Camera size={14} />
              <span className="font-semibold">Photo Gallery</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              A Glimpse of{' '}
              <span className="text-shimmer">{restaurantName}</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Food, ambience aur moments — sab yahan dekho 📸
            </p>
          </div>
        </section>

        {/* ===== Filters + Grid ===== */}
        <section className="relative py-12 md:py-16 bg-night-soft">
          <div className="absolute inset-0 bg-dots opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="animate-spin text-gold mx-auto mb-3" size={32} />
                <p className="text-white/60 text-sm">Loading gallery...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-20 bg-night-card/80 border border-white/5 rounded-2xl">
                <Camera size={48} className="text-gold/40 mx-auto mb-3" />
                <p className="text-white/60 text-sm">
                  No photos yet. Come back soon! 🍽️
                </p>
              </div>
            ) : (
              <>
                {/* Filter Tabs */}
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {CATEGORIES.map((cat) => {
                    const isActive = filter === cat.id
                    const count = counts[cat.id] || 0
                    if (cat.id !== 'all' && count === 0) return null
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setFilter(cat.id)}
                        className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? 'bg-gradient-to-br from-gold to-gold-dark text-night shadow-gold scale-105'
                            : 'bg-night-card border border-white/10 text-white/70 hover:border-gold/40 hover:text-gold hover:scale-105'
                        }`}
                      >
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-night/20' : 'bg-white/5'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
                  {filtered.map((item, i) => (
                    <button
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-500 card-premium animate-fade-up"
                      style={{ animationDelay: `${i * 30}ms` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gold/20 to-fresh/20" />
                      <img
                        src={item.image_url}
                        alt={item.caption || 'Gallery'}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                      {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                          <p className="text-sm font-bold text-white truncate">
                            {item.caption}
                          </p>
                          <p className="text-[10px] text-gold capitalize">
                            {item.category}
                          </p>
                        </div>
                      )}

                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-night/60 backdrop-blur border border-gold/40 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                        <Maximize2 size={14} className="text-gold" />
                      </div>
                    </button>
                  ))}
                </div>

                {filtered.length === 0 && (
                  <div className="text-center py-20">
                    <div className="text-6xl mb-4">📷</div>
                    <p className="text-white/60">No photos in this category yet</p>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        {/* ===== Bottom CTA ===== */}
        <section className="relative py-16 md:py-24 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6 animate-bounce-soft">📸</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Liked What You <span className="text-shimmer">Saw</span>?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Aaiye, khud taste karein — order karein aur ghar pe enjoy karein! 🍽️
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-night font-bold px-10 py-4 rounded-full btn-premium shadow-gold text-lg"
            >
              <ShoppingBag size={20} />
              <span>Order Now</span>
            </Link>
          </div>
        </section>
      </main>

      {/* ===== Lightbox Modal ===== */}
      {selected && (
        <div
          className="fixed inset-0 z-50 bg-night/95 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setSelected(null)}
        >
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-night-card border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-night transition z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-square rounded-3xl overflow-hidden border-2 border-gold/40 bg-night relative">
              <img
                src={selected.image_url}
                alt={selected.caption || 'Gallery'}
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>

            {selected.caption && (
              <div className="mt-5 text-center">
                <p className="font-display text-2xl font-bold text-gold mb-1">
                  {selected.caption}
                </p>
                <p className="text-white/50 capitalize text-sm">
                  {selected.category}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}