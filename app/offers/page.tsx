'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useRestaurant } from '@/lib/restaurantContext'
import {
  getActiveOffers,
  type HomepageOffer,
} from '@/lib/offersSupabase'
import {
  Tag,
  Clock,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Loader2,
} from 'lucide-react'

export default function OffersPage() {
  const { restaurant } = useRestaurant()
  const [offers, setOffers] = useState<HomepageOffer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const data = await getActiveOffers(restaurant?.id)
      setOffers(data)
      setLoading(false)
    }
    if (restaurant) load()
  }, [restaurant])

  const restaurantName = restaurant?.name || 'Food Junction'

  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden py-16 md:py-24 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-gold/10 blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-fresh/10 blur-[100px]" />

          <div className="relative max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 glass-gold border border-gold/30 text-gold px-4 py-2 rounded-full text-sm mb-6">
              <Sparkles size={14} />
              <span className="font-semibold">Limited Time Offers</span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
              Special <span className="text-shimmer">Offers</span>
            </h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto mb-8">
              Har order pe paise bachao! Exclusive coupons aur deals sirf aapke liye 🎉
            </p>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-night font-bold px-8 py-4 rounded-full btn-premium shadow-gold hover:shadow-[0_15px_40px_rgba(245,179,1,0.5)] transition-all"
            >
              <ShoppingBag size={20} />
              <span>Order Now</span>
            </Link>
          </div>
        </section>

        {/* Offers Grid */}
        <section className="relative py-16 md:py-24 bg-night-soft">
          <div className="absolute inset-0 bg-dots opacity-20" />

          <div className="relative max-w-7xl mx-auto px-4">
            <div className="text-center mb-14">
              <p className="text-gold tracking-[0.3em] text-sm mb-3">
                ACTIVE COUPONS
              </p>
              <h2 className="font-display text-4xl md:text-5xl font-bold">
                Save on Every <span className="text-shimmer">Order</span>
              </h2>
            </div>

            {loading ? (
              <div className="text-center py-20">
                <Loader2 className="animate-spin text-gold mx-auto mb-3" size={32} />
                <p className="text-white/60 text-sm">Loading offers...</p>
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-3">🎁</div>
                <p className="text-white/60 text-sm mb-4">
                  No offers available right now
                </p>
                <Link
                  href="/menu"
                  className="inline-flex bg-gold text-night font-bold px-6 py-3 rounded-full text-sm"
                >
                  Browse Menu
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {offers.map((offer, i) => (
                  <div
                    key={offer.id}
                    className="group relative bg-night-card rounded-2xl overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-500 card-premium"
                    style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}
                  >
                    {offer.is_hot && (
                      <div className="absolute top-4 right-4 z-10">
                        <span className="inline-flex items-center gap-1 bg-gold text-night text-[10px] font-bold px-2.5 py-1 rounded-full shadow-gold animate-pulse">
                          🔥 HOT
                        </span>
                      </div>
                    )}

                    <div
                      className="relative p-6 text-center"
                      style={{
                        background: `linear-gradient(135deg, ${offer.color} 0%, ${offer.color}dd 100%)`,
                      }}
                    >
                      <div className="text-5xl mb-2">{offer.emoji}</div>
                      <p className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                        {offer.badge}
                      </p>
                      <p className="text-white/90 text-xs tracking-wider mt-1">
                        {offer.badge_label || 'DISCOUNT'}
                      </p>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-lg mb-2 group-hover:text-gold transition">
                        {offer.title}
                      </h3>
                      <p className="text-sm text-white/60 mb-4 min-h-[40px]">
                        {offer.description}
                      </p>

                      <div className="space-y-2 mb-4 text-xs">
                        {offer.min_order > 0 && (
                          <div className="flex justify-between">
                            <span className="text-white/40">Min Order</span>
                            <span className="font-semibold">₹{offer.min_order}</span>
                          </div>
                        )}
                        {offer.max_discount > 0 && (
                          <div className="flex justify-between">
                            <span className="text-white/40">Max Discount</span>
                            <span className="font-semibold">₹{offer.max_discount}</span>
                          </div>
                        )}
                        {offer.validity && (
                          <div className="flex justify-between">
                            <span className="text-white/40">Validity</span>
                            <span className="text-gold font-semibold">
                              {offer.validity}
                            </span>
                          </div>
                        )}
                      </div>

                      {offer.coupon_code && (
                        <div className="bg-night border-2 border-dashed border-gold/40 rounded-xl p-3 flex items-center justify-between gap-2 group-hover:border-gold transition">
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-white/40 mb-0.5">
                              COUPON CODE
                            </p>
                            <p className="font-mono font-bold text-gold text-sm tracking-wider truncate">
                              {offer.coupon_code}
                            </p>
                          </div>
                          <Tag size={18} className="text-gold group-hover:scale-110 transition-transform flex-shrink-0" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="relative py-16 md:py-24 bg-gradient-to-br from-gold/10 via-night to-night">
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6 animate-bounce-soft">🎁</div>
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Ready to <span className="text-shimmer">Save</span>?
            </h2>
            <p className="text-white/60 mb-8 text-lg">
              Offer valid till stocks last — jaldi karo! 🏃‍♂️
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gradient-to-br from-gold to-gold-dark text-night font-bold px-10 py-4 rounded-full btn-premium shadow-gold text-lg"
            >
              <ShoppingBag size={20} />
              <span>Order Now</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  )
}