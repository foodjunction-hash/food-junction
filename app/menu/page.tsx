'use client'

import { useState, useMemo } from 'react'
import { Search, MessageCircle } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FoodCard from '@/components/FoodCard'
import { FOOD_ITEMS, CATEGORIES } from '@/lib/data'

type Filter = 'all' | 'veg' | 'nonveg' | 'bestseller'

export default function MenuPage() {
  const [selectedCat, setSelectedCat] = useState('all')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')

  const filtered = useMemo(() => {
    return FOOD_ITEMS.filter((item) => {
      if (selectedCat !== 'all' && item.category !== selectedCat) return false
      if (filter === 'veg' && !item.isVeg) return false
      if (filter === 'nonveg' && item.isVeg) return false
      if (filter === 'bestseller' && !item.isBestseller) return false
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
        return false
      return true
    })
  }, [selectedCat, search, filter])

  return (
    <>
      <Header />

      <main className="min-h-screen pb-20">
        {/* Page Header */}
        <section className="bg-gradient-to-b from-night-soft to-night border-b border-white/5 py-10 md:py-14">
          <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-gold tracking-[0.3em] text-sm mb-2">EXPLORE OUR</p>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Our <span className="text-gradient-gold">Menu</span>
            </h1>
            <p className="text-white/60 max-w-xl mx-auto">
              Delicious food crafted with love • Fresh ingredients • Fast delivery
            </p>
          </div>
        </section>

        {/* Search Bar */}
        <section className="sticky top-16 md:top-20 z-40 bg-night/95 backdrop-blur-md border-b border-white/5 py-3 md:py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative max-w-md mx-auto">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
              />
              <input
                type="text"
                placeholder="Search food items..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-night-card border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-4 md:py-6 overflow-x-auto no-scrollbar">
          <div className="max-w-7xl mx-auto px-4 flex gap-2 md:gap-3 min-w-max">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition ${
                  selectedCat === cat.id
                    ? 'bg-gold text-night'
                    : 'bg-night-card text-white/70 border border-white/10 hover:border-gold/50 hover:text-gold'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Veg / Non-veg / Bestseller Filter */}
        <section className="pb-4">
          <div className="max-w-7xl mx-auto px-4 flex gap-2 flex-wrap">
            {[
              { id: 'all', label: 'All Items', emoji: '🍽️' },
              { id: 'veg', label: 'Veg Only', emoji: '🟢' },
              { id: 'nonveg', label: 'Non-Veg', emoji: '🔴' },
              { id: 'bestseller', label: 'Bestseller', emoji: '⭐' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id as Filter)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  filter === f.id
                    ? 'bg-fresh text-night'
                    : 'bg-night-card text-white/60 border border-white/10 hover:border-fresh/50 hover:text-fresh'
                }`}
              >
                <span>{f.emoji}</span>
                <span>{f.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Food Grid */}
        <section className="py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-4">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🔍</p>
                <p className="text-xl font-bold mb-2">No items found</p>
                <p className="text-white/60 text-sm">
                  Try a different category or search term
                </p>
              </div>
            ) : (
              <>
                <p className="text-sm text-white/50 mb-4">
                  Showing <span className="text-gold font-bold">{filtered.length}</span> items
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
                  {filtered.map((item) => (
                    <FoodCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
                {/* Floating WhatsApp Button */}
        <a
          href={`https://wa.me/919973318421?text=${encodeURIComponent(
            'Hi Food Junction! I want to place an order. Can you help?'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Order on WhatsApp"
          className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-fresh text-night flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle size={26} />
        </a>

      </main>

      <Footer />
    </>
  )
}