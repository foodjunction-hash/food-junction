'use client'

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, MessageCircle, Loader2, Crown, Code2, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import FoodCard from '@/components/FoodCard'
import { CATEGORIES, type FoodItem } from '@/lib/data'
import { getMenuItems } from '@/lib/menuSupabase'

type Filter = 'all' | 'veg' | 'nonveg' | 'bestseller'

function MenuPageContent() {
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get('table')
  const [selectedCat, setSelectedCat] = useState('all')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [menuItems, setMenuItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (tableNumber && typeof window !== 'undefined') {
      sessionStorage.setItem('fj-table-number', tableNumber)
    }
  }, [tableNumber])

  useEffect(() => {
    const loadMenu = async () => {
      setLoading(true)
      const items = await getMenuItems()
      setMenuItems(items)
      setLoading(false)
    }
    loadMenu()
  }, [])

  const filtered = useMemo(() => {
    return menuItems.filter((item) => {
      if (selectedCat !== 'all' && item.category !== selectedCat) return false
      if (filter === 'veg' && !item.isVeg) return false
      if (filter === 'nonveg' && item.isVeg) return false
      if (filter === 'bestseller' && !item.isBestseller) return false
      if (search && !item.name.toLowerCase().includes(search.toLowerCase()))
        return false
      return true
    })
  }, [menuItems, selectedCat, search, filter])

  return (
    <>
      <Header />

      {tableNumber && (
        <div className="bg-gradient-to-r from-gold via-gold-light to-gold text-night py-3 px-4 shadow-gold relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 relative z-10">
            <span className="text-xl">🍽️</span>
            <p className="font-bold text-sm md:text-base text-center">
              Welcome! You are ordering for{' '}
              <span className="bg-night text-gold px-3 py-1 rounded-full font-bold inline-block">
                Table {tableNumber}
              </span>
            </p>
          </div>
        </div>
      )}

      <main className="min-h-screen pb-20">
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

        <section className="sticky top-16 md:top-20 z-40 bg-night/95 backdrop-blur-md border-b border-white/5 py-3 md:py-4">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative max-w-md mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
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

        <section className="py-4 md:py-8">
          <div className="max-w-7xl mx-auto px-4">
            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="animate-spin text-gold mx-auto mb-3" size={32} />
                <p className="text-white/60 text-sm">Loading menu...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🔍</p>
                <p className="text-xl font-bold mb-2">No items found</p>
                <p className="text-white/60 text-sm">Try a different category or search term</p>
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

        {/* ============================================
            MEET THE TEAM BANNER (Compact)
            ============================================ */}
        <section className="py-10 md:py-14 bg-night-soft border-t border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-gold/10 rounded-full blur-[100px]" />

          <div className="relative max-w-4xl mx-auto px-4">
            {/* Header */}
            <div className="text-center mb-6">
              <p className="text-gold tracking-[0.3em] text-xs mb-2 font-semibold">
                MEET THE TEAM
              </p>
              <h3 className="text-2xl md:text-3xl font-bold">
                The <span className="text-shimmer">People</span> Behind
              </h3>
            </div>

            {/* Compact Team Cards */}
            <div className="grid grid-cols-2 gap-3 md:gap-5 max-w-xl mx-auto">
              {/* Owner */}
              <div className="group relative bg-night-card border border-white/5 rounded-2xl p-4 text-center hover:border-gold/40 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-gold to-gold-dark rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />

                <div className="relative mx-auto mb-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold to-gold-dark blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden border-2 border-gold/40 group-hover:border-gold transition-all group-hover:scale-105">
                    <img
                      src="/team/owner.jpg"
                      alt="Owner"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <p className="font-bold text-sm md:text-base group-hover:text-gold transition-colors">
                  Raj Nandni
                </p>
                <span className="inline-flex items-center gap-1 bg-gradient-to-br from-gold to-gold-dark text-night text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                  <Crown size={9} />
                  Owner
                </span>
              </div>

              {/* Developer */}
              <div className="group relative bg-night-card border border-white/5 rounded-2xl p-4 text-center hover:border-fresh/40 transition-all">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-fresh to-fresh-dark rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />

                <div className="relative mx-auto mb-3">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-fresh to-fresh-dark blur-md opacity-40 group-hover:opacity-70 transition-opacity" />
                  <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full overflow-hidden border-2 border-fresh/40 group-hover:border-fresh transition-all group-hover:scale-105">
                    <img
                      src="/team/developer-new.jpg"
                      alt="Developer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <p className="font-bold text-sm md:text-base group-hover:text-fresh transition-colors">
                  Shubham Yadav
                </p>
                <span className="inline-flex items-center gap-1 bg-gradient-to-br from-fresh to-fresh-dark text-night text-[10px] font-bold px-2 py-0.5 rounded-full mt-1">
                  <Code2 size={9} />
                  Developer
                </span>
              </div>
            </div>

            {/* Link to about */}
            <div className="text-center mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-gold hover:text-gold-light text-sm font-semibold transition group"
              >
                Read Full Story
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        <a
          href={`https://wa.me/919973318421?text=${encodeURIComponent(
            tableNumber
              ? `Hi Food Junction! I'm ordering from Table ${tableNumber}. Can you help?`
              : 'Hi Food Junction! I want to place an order. Can you help?'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 md:bottom-6 right-4 md:right-6 z-40 w-14 h-14 rounded-full bg-fresh text-night flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
        >
          <MessageCircle size={26} />
        </a>
      </main>

      <Footer />
    </>
  )
}

export default function MenuPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-night">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">🍽️</div>
            <p className="text-white/60">Loading menu...</p>
          </div>
        </div>
      }
    >
      <MenuPageContent />
    </Suspense>
  )
}