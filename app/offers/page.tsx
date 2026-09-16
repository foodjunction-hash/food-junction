import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  Tag,
  Percent,
  Gift,
  Clock,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Copy,
} from 'lucide-react'

const OFFERS = [
  {
    code: 'WELCOME20',
    title: '20% OFF on First Order',
    description: 'New customer ho? Pehle order pe 20% discount paao!',
    discount: '20%',
    minOrder: 199,
    maxDiscount: 100,
    emoji: '🎉',
    color: 'from-gold to-gold-dark',
    expires: 'Limited Time',
    highlight: true,
  },
  {
    code: 'FAMILY50',
    title: '₹50 OFF on Family Orders',
    description: '₹500+ ke order pe ₹50 instant discount',
    discount: '₹50 OFF',
    minOrder: 500,
    maxDiscount: 50,
    emoji: '👨‍👩‍👧‍👦',
    color: 'from-fresh to-fresh-dark',
    expires: 'Valid Till Month End',
    highlight: false,
  },
  {
    code: 'PIZZA30',
    title: '30% OFF on Pizza',
    description: 'Saare pizzas pe 30% discount — aaj hi order karo!',
    discount: '30%',
    minOrder: 299,
    maxDiscount: 150,
    emoji: '🍕',
    color: 'from-red-500 to-red-700',
    expires: 'Today Only',
    highlight: true,
  },
  {
    code: 'FREEDEL',
    title: 'FREE Delivery',
    description: 'Koi bhi order karo — delivery free!',
    discount: 'FREE',
    minOrder: 199,
    maxDiscount: 30,
    emoji: '🚚',
    color: 'from-blue-500 to-blue-700',
    expires: 'Every Day',
    highlight: false,
  },
  {
    code: 'BIRYANI25',
    title: '25% OFF on Biryani',
    description: 'Hyderabadi Biryani pe special discount',
    discount: '25%',
    minOrder: 249,
    maxDiscount: 100,
    emoji: '🍚',
    color: 'from-purple-500 to-purple-700',
    expires: 'Weekend Special',
    highlight: false,
  },
  {
    code: 'COMBO100',
    title: '₹100 OFF on Combos',
    description: 'Family combo order karo, ₹100 bachao',
    discount: '₹100 OFF',
    minOrder: 799,
    maxDiscount: 100,
    emoji: '🎁',
    color: 'from-pink-500 to-pink-700',
    expires: 'Limited Stock',
    highlight: true,
  },
]

export default function OffersPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen">
        {/* ===== Hero Section ===== */}
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

        {/* ===== Offers Grid ===== */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {OFFERS.map((offer, i) => (
                <div
                  key={i}
                  className="group relative bg-night-card rounded-2xl overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-500 card-premium"
                >
                  {/* Highlight badge */}
                  {offer.highlight && (
                    <div className="absolute top-4 right-4 z-10">
                      <span className="inline-flex items-center gap-1 bg-gold text-night text-[10px] font-bold px-2.5 py-1 rounded-full shadow-gold animate-pulse">
                        🔥 HOT
                      </span>
                    </div>
                  )}

                  {/* Discount badge */}
                  <div
                    className={`relative bg-gradient-to-br ${offer.color} p-6 text-center`}
                  >
                    <div className="text-5xl mb-2">{offer.emoji}</div>
                    <p className="text-3xl md:text-4xl font-bold text-white drop-shadow">
                      {offer.discount}
                    </p>
                    <p className="text-white/90 text-xs tracking-wider mt-1">
                      DISCOUNT
                    </p>
                  </div>

                  {/* Details */}
                  <div className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-gold transition">
                      {offer.title}
                    </h3>
                    <p className="text-sm text-white/60 mb-4 min-h-[40px]">
                      {offer.description}
                    </p>

                    {/* Info row */}
                    <div className="space-y-2 mb-4 text-xs">
                      <div className="flex justify-between">
                        <span className="text-white/40">Min Order</span>
                        <span className="font-semibold">₹{offer.minOrder}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Max Discount</span>
                        <span className="font-semibold">₹{offer.maxDiscount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/40">Validity</span>
                        <span className="text-gold font-semibold">
                          {offer.expires}
                        </span>
                      </div>
                    </div>

                    {/* Coupon code */}
                    <div className="bg-night border-2 border-dashed border-gold/40 rounded-xl p-3 flex items-center justify-between gap-2 group-hover:border-gold transition">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] text-white/40 mb-0.5">
                          COUPON CODE
                        </p>
                        <p className="font-mono font-bold text-gold text-sm tracking-wider truncate">
                          {offer.code}
                        </p>
                      </div>
                      <Tag
                        size={18}
                        className="text-gold group-hover:scale-110 transition-transform flex-shrink-0"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== How to Use ===== */}
        <section className="relative py-16 md:py-24 bg-mesh">
          <div className="absolute inset-0 bg-dots opacity-30" />

          <div className="relative max-w-5xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
                How to <span className="text-shimmer">Use</span> Coupons?
              </h2>
              <p className="text-white/60">
                3 easy steps me paise bachao
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  title: 'Order Karo',
                  desc: 'Menu se apne favourite items select karo',
                  emoji: '🍽️',
                },
                {
                  step: '2',
                  title: 'Code Apply Karo',
                  desc: 'Checkout pe coupon code daalo',
                  emoji: '🎟️',
                },
                {
                  step: '3',
                  title: 'Paise Bachao',
                  desc: 'Instant discount paao! 🎉',
                  emoji: '💰',
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="relative bg-night-card rounded-2xl border border-white/5 p-6 text-center card-premium"
                >
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold shadow-gold">
                    {s.step}
                  </div>
                  <div className="text-5xl mb-4 mt-2">{s.emoji}</div>
                  <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                  <p className="text-sm text-white/60">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ===== Bottom CTA ===== */}
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

        {/* ===== Terms ===== */}
        <section className="py-12 bg-night-soft">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-night-card border border-white/5 rounded-2xl p-6">
              <h3 className="font-bold text-gold mb-4 flex items-center gap-2">
                <Clock size={16} /> Terms & Conditions
              </h3>
              <ul className="text-xs text-white/50 space-y-2 list-disc list-inside">
                <li>Ek order me sirf ek coupon use ho sakta hai</li>
                <li>Minimum order value coupon ke saath match hona chahiye</li>
                <li>Coupons limited time ke liye valid hain</li>
                <li>Food Junction kisi bhi coupon ko cancel karne ka adhikaar rakhta hai</li>
                <li>Coupon code checkout pe daalna zaroori hai</li>
                <li>Cash orders pe bhi coupons valid hain</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}