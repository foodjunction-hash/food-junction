'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Sparkles,
  Camera,
  Utensils,
  Heart,
  Building2,
  ShoppingBag,
  X,
  Maximize2,
} from 'lucide-react'

type Category = 'all' | 'food' | 'ambience' | 'moments'

type GalleryItem = {
  id: number
  emoji: string
  title: string
  category: Category
  bgColor: string
}

const GALLERY_ITEMS: GalleryItem[] = [
  // Food
  { id: 1, emoji: '🍕', title: 'Farmhouse Pizza', category: 'food', bgColor: 'from-gold/20 to-red-500/20' },
  { id: 2, emoji: '🍔', title: 'Chicken Zinger Burger', category: 'food', bgColor: 'from-orange-500/20 to-yellow-500/20' },
  { id: 3, emoji: '🍚', title: 'Hyderabadi Biryani', category: 'food', bgColor: 'from-amber-500/20 to-red-500/20' },
  { id: 4, emoji: '🍜', title: 'Hakka Noodles', category: 'food', bgColor: 'from-yellow-500/20 to-orange-500/20' },
  { id: 5, emoji: '🍛', title: 'Paneer Butter Masala', category: 'food', bgColor: 'from-red-500/20 to-orange-500/20' },
  { id: 6, emoji: '☕', title: 'Masala Chai', category: 'food', bgColor: 'from-amber-700/20 to-orange-500/20' },
  { id: 7, emoji: '🍰', title: 'Chocolate Brownie', category: 'food', bgColor: 'from-pink-500/20 to-purple-500/20' },
  { id: 8, emoji: '🥟', title: 'Chicken Momos', category: 'food', bgColor: 'from-green-500/20 to-teal-500/20' },
  { id: 9, emoji: '🍽️', title: 'Family Thali', category: 'food', bgColor: 'from-gold/20 to-amber-500/20' },
  
  // Ambience
  { id: 10, emoji: '🏪', title: 'Restaurant Interior', category: 'ambience', bgColor: 'from-blue-500/20 to-purple-500/20' },
  { id: 11, emoji: '🪑', title: 'Family Seating', category: 'ambience', bgColor: 'from-gold/20 to-fresh/20' },
  { id: 12, emoji: '💡', title: 'Warm Lighting', category: 'ambience', bgColor: 'from-yellow-500/20 to-orange-500/20' },
  { id: 13, emoji: '🍽️', title: 'Dining Tables', category: 'ambience', bgColor: 'from-fresh/20 to-blue-500/20' },
  { id: 14, emoji: '🎨', title: 'Wall Decor', category: 'ambience', bgColor: 'from-purple-500/20 to-pink-500/20' },
  { id: 15, emoji: '🌿', title: 'Green Corner', category: 'ambience', bgColor: 'from-fresh/20 to-green-500/20' },
  
  // Moments
  { id: 16, emoji: '👨‍👩‍👧‍👦', title: 'Family Time', category: 'moments', bgColor: 'from-gold/20 to-fresh/20' },
  { id: 17, emoji: '🎂', title: 'Birthday Celebrations', category: 'moments', bgColor: 'from-pink-500/20 to-purple-500/20' },
  { id: 18, emoji: '🥳', title: 'Party Moments', category: 'moments', bgColor: 'from-purple-500/20 to-blue-500/20' },
  { id: 19, emoji: '💑', title: 'Couple Dinners', category: 'moments', bgColor: 'from-red-500/20 to-pink-500/20' },
  { id: 20, emoji: '😊', title: 'Happy Customers', category: 'moments', bgColor: 'from-gold/20 to-orange-500/20' },
  { id: 21, emoji: '🎉', title: 'Special Events', category: 'moments', bgColor: 'from-fresh/20 to-blue-500/20' },
]

const CATEGORIES: { id: Category; label: string; emoji: string; icon: any }[] = [
  { id: 'all', label: 'All Photos', emoji: '✨', icon: Sparkles },
  { id: 'food', label: 'Food', emoji: '🍽️', icon: Utensils },
  { id: 'ambience', label: 'Ambience', emoji: '🏪', icon: Building2 },
  { id: 'moments', label: 'Moments', emoji: '❤️', icon: Heart },
]

export default function GalleryPage() {
  const [filter, setFilter] = useState<Category>('all')
  const [selected, setSelected] = useState<GalleryItem | null>(null)

  const filtered =
    filter === 'all'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === filter)

  const counts = {
    all: GALLERY_ITEMS.length,
    food: GALLERY_ITEMS.filter((i) => i.category === 'food').length,
    ambience: GALLERY_ITEMS.filter((i) => i.category === 'ambience').length,
    moments: GALLERY_ITEMS.filter((i) => i.category === 'moments').length,
  }

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
              Our <span className="text-shimmer">Gallery</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Food, ambience aur moments ki ek jhalak — dekhiye hamari duniya 🎨
            </p>
          </div>
        </section>

        {/* ===== Filters + Grid ===== */}
        <section className="relative py-12 md:py-16 bg-night-soft">
          <div className="absolute inset-0 bg-dots opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4">
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {CATEGORIES.map((cat) => {
                const isActive = filter === cat.id
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
                      {counts[cat.id]}
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
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${item.bgColor}`}
                  />

                  {/* Emoji */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl md:text-7xl group-hover:scale-125 group-hover:rotate-6 transition-all duration-500 select-none">
                      {item.emoji}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Title */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-sm font-bold text-white truncate">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gold capitalize">
                      {item.category}
                    </p>
                  </div>

                  {/* Expand icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-night/60 backdrop-blur border border-gold/40 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300">
                    <Maximize2 size={14} className="text-gold" />
                  </div>
                </button>
              ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📷</div>
                <p className="text-white/60">No photos in this category yet</p>
              </div>
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
          {/* Close button */}
          <button
            onClick={() => setSelected(null)}
            className="absolute top-4 right-4 w-12 h-12 rounded-full bg-night-card border border-gold/40 flex items-center justify-center hover:bg-gold hover:text-night transition z-10"
            aria-label="Close"
          >
            <X size={20} />
          </button>

          {/* Content */}
          <div
            className="relative max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`aspect-square rounded-3xl overflow-hidden border-2 border-gold/40 bg-gradient-to-br ${selected.bgColor} relative`}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[240px] animate-float select-none">
                  {selected.emoji}
                </span>
              </div>
            </div>

            <div className="mt-5 text-center">
              <p className="font-display text-3xl font-bold text-gold mb-1">
                {selected.title}
              </p>
              <p className="text-white/50 capitalize text-sm">
                {selected.category}
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  )
}