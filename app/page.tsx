'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Store,
  MapPin,
  Sparkles,
  ArrowRight,
  UtensilsCrossed,
  Filter,
  TrendingUp,
  Plus,
} from 'lucide-react'
import { getAllActiveRestaurants, type RestaurantAdmin } from '@/lib/restaurantSupabase'
import AdminLoading from '@/components/AdminLoading'

export default function HubPage() {
  const [restaurants, setRestaurants] = useState<RestaurantAdmin[]>([])
  const [filtered, setFiltered] = useState<RestaurantAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    loadRestaurants()
  }, [])

  const loadRestaurants = async () => {
    setLoading(true)
    const data = await getAllActiveRestaurants()
    setRestaurants(data)
    setFiltered(data)
    setLoading(false)
  }

  const cities = useMemo(() => {
    const unique = new Set(restaurants.map((r) => r.city).filter(Boolean))
    return ['all', ...Array.from(unique)]
  }, [restaurants])

  const categories = useMemo(() => {
    const unique = new Set(restaurants.map((r) => r.category).filter(Boolean))
    return ['all', ...Array.from(unique)]
  }, [restaurants])

  useEffect(() => {
    let result = restaurants

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.tagline?.toLowerCase().includes(q) ||
          r.city?.toLowerCase().includes(q) ||
          r.category?.toLowerCase().includes(q)
      )
    }

    if (cityFilter !== 'all') {
      result = result.filter((r) => r.city === cityFilter)
    }

    if (categoryFilter !== 'all') {
      result = result.filter((r) => r.category === categoryFilter)
    }

    setFiltered(result)
  }, [search, cityFilter, categoryFilter, restaurants])

  if (loading) {
    return <AdminLoading message="Loading Restaurants" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 glass-gold border border-gold/30 text-gold px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles size={14} className="animate-pulse" />
              <span className="font-semibold">Food Hub</span>
            </div>

            <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">
              Discover <span className="text-shimmer">Best Food</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              {restaurants.length} restaurants - Ek hi jagah - Fresh, hygienic, delicious
            </p>

            <div className="max-w-2xl mx-auto">
              <div className="relative group">
                <Search
                  size={20}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold transition"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search restaurants, cuisines, or cities..."
                  className="w-full bg-night-card/80 backdrop-blur-xl border border-white/10 rounded-full pl-14 pr-5 py-4 text-base focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm">
              <div className="flex items-center gap-2 text-white/60">
                <Store size={16} className="text-gold" />
                <span><strong className="text-gold">{restaurants.length}</strong> Restaurants</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <MapPin size={16} className="text-gold" />
                <span><strong className="text-gold">{cities.length - 1}</strong> Cities</span>
              </div>
              <div className="flex items-center gap-2 text-white/60">
                <TrendingUp size={16} className="text-fresh" />
                <span>Live Now</span>
              </div>
            </div>
          </div>
        </section>

        <section className="sticky top-0 z-40 bg-night/95 backdrop-blur-md border-y border-white/5 py-4">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-white/40" />
                <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">City:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => setCityFilter(city)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                      cityFilter === city
                        ? 'bg-gold text-night'
                        : 'bg-night-card text-white/70 border border-white/10 hover:border-gold/50'
                    }`}
                  >
                    {city === 'all' ? 'All Cities' : city}
                  </button>
                ))}
              </div>
            </div>

            {categories.length > 1 && (
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <span className="text-xs text-white/40 font-semibold uppercase tracking-wider">Category:</span>
                <div className="flex flex-wrap gap-2">
                  {categories.slice(0, 8).map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                        categoryFilter === cat
                          ? 'bg-fresh text-night'
                          : 'bg-night-card text-white/70 border border-white/10 hover:border-fresh/50'
                      }`}
                    >
                      {cat === 'all' ? 'All' : cat}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="py-12 md:py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-night-card/80 border border-white/5 rounded-3xl">
                <div className="text-6xl mb-4">🍽️</div>
                <p className="text-xl font-bold mb-2">No restaurants found</p>
                <p className="text-white/50 text-sm mb-6">
                  {search || cityFilter !== 'all' || categoryFilter !== 'all'
                    ? 'Try changing search or filters'
                    : 'No restaurants available yet'}
                </p>
                {(search || cityFilter !== 'all' || categoryFilter !== 'all') && (
                  <button
                    onClick={() => {
                      setSearch('')
                      setCityFilter('all')
                      setCategoryFilter('all')
                    }}
                    className="bg-gold text-night font-bold px-6 py-3 rounded-full text-sm hover:bg-gold-light transition"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-white/50 text-sm">
                    Showing <span className="text-gold font-bold">{filtered.length}</span> of{' '}
                    <span className="text-gold font-bold">{restaurants.length}</span> restaurants
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filtered.map((r, i) => (
                    <Link
                      key={r.id}
                      href={`/${r.slug}`}
                      className="group relative bg-night-card/80 backdrop-blur-xl border border-white/5 hover:border-gold/50 rounded-3xl overflow-hidden transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-gold/10"
                      style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.05}s both` }}
                    >
                      <div className="relative h-32 overflow-hidden">
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{
                            background: `linear-gradient(135deg, ${r.primary_color || '#F5B301'} 0%, transparent 100%)`,
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-night-card to-transparent" />

                        <div className="absolute bottom-0 left-6 translate-y-1/2">
                          <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-gold/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                            <img
                              src={r.logo_url || '/food-junction-logo.png'}
                              alt={r.name}
                              className="relative w-20 h-20 rounded-full object-cover border-4 border-night-card ring-2 ring-gold/30 group-hover:ring-gold transition-all duration-500 group-hover:scale-110"
                            />
                          </div>
                        </div>

                        <div className="absolute top-4 right-4">
                          <span className="inline-flex items-center gap-1.5 bg-fresh/20 backdrop-blur border border-fresh/40 text-fresh px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-fresh animate-pulse" />
                            Live
                          </span>
                        </div>
                      </div>

                      <div className="p-6 pt-12">
                        <h3 className="font-bold text-xl mb-1 group-hover:text-gold transition-colors line-clamp-1">
                          {r.name}
                        </h3>
                        <p className="text-xs text-white/50 line-clamp-1 mb-3">
                          {r.tagline || 'Authentic Food'}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs">
                          {r.category && (
                            <span className="flex items-center gap-1 text-gold">
                              <UtensilsCrossed size={11} />
                              {r.category}
                            </span>
                          )}
                          {r.city && (
                            <span className="flex items-center gap-1 text-white/50">
                              <MapPin size={11} />
                              {r.city}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                          <span className="text-[10px] text-white/40 uppercase tracking-wider font-semibold">
                            Tap to order
                          </span>
                          <div className="flex items-center gap-1.5 text-gold text-sm font-bold group-hover:gap-2.5 transition-all">
                            <span>Order</span>
                            <ArrowRight
                              size={14}
                              className="group-hover:translate-x-0.5 transition-transform"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>

        <section className="py-16 md:py-20 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto text-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/20 via-gold/10 to-transparent rounded-3xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-night-card to-night rounded-3xl border border-gold/30 p-8 md:p-12">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center mx-auto mb-5 shadow-gold">
                  <Plus size={28} className="text-night" strokeWidth={2.5} />
                </div>
                <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
                  Apna Restaurant <span className="text-shimmer">Add Karo</span>
                </h2>
                <p className="text-white/60 mb-6 max-w-xl mx-auto">
                  Food Hub se judo - apni website, admin panel, aur customer base paao. Sirf 999 rupees per month.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://wa.me/919973318421?text=Hi! I want to add my restaurant to Food Hub."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-8 py-4 rounded-full hover:scale-105 transition shadow-gold"
                  >
                    <Sparkles size={18} />
                    Get Started
                  </a>
                  <Link
                    href="/royal-spice"
                    className="inline-flex items-center gap-2 border-2 border-white/20 hover:border-gold text-white/80 hover:text-gold font-bold px-8 py-4 rounded-full transition"
                  >
                    See Demo
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/5 py-8 px-4">
          <div className="max-w-6xl mx-auto text-center text-sm text-white/40">
            <p>
              Copyright {new Date().getFullYear()} Food Junction Hub
            </p>
          </div>
        </footer>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
