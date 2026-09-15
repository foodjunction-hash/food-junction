import Link from 'next/link'
import Header from '@/components/Header'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import FoodCard from '@/components/FoodCard'
import { FOOD_ITEMS } from '@/lib/data'
import {
  ShoppingBag,
  Star,
  Leaf,
  Zap,
  ShieldCheck,
  Award,
  Heart,
  Truck,
  ArrowRight,
} from 'lucide-react'

export default function Home() {
  const bestsellers = FOOD_ITEMS.filter((f) => f.isBestseller).slice(0, 4)

  const features = [
    {
      icon: Leaf,
      title: 'Fresh Ingredients',
      desc: 'Daily sourced fresh vegetables & meat',
      emoji: '🌿',
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      desc: 'Hot food delivered within 30 minutes',
      emoji: '⚡',
    },
    {
      icon: ShieldCheck,
      title: 'Hygienic Kitchen',
      desc: 'FSSAI certified clean kitchen',
      emoji: '🛡️',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      desc: 'Best taste in Amarpur guaranteed',
      emoji: '🏆',
    },
    {
      icon: Heart,
      title: 'Family Friendly',
      desc: 'Perfect ambiance for families',
      emoji: '❤️',
    },
    {
      icon: Truck,
      title: 'Free Delivery',
      desc: 'On orders above ₹500',
      emoji: '🚚',
    },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen">
        <Hero />

        {/* ============================================
            BEST SELLERS SECTION
            ============================================ */}
        <section className="relative py-20 md:py-28 bg-night-soft overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-dots opacity-20" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gold/5 rounded-full blur-[120px]" />

          <div className="relative max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-gold tracking-[0.3em] text-xs md:text-sm mb-3">
                <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold" />
                <span className="font-semibold">OUR SPECIALTIES</span>
                <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold" />
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Best <span className="text-shimmer">Sellers</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                Handpicked dishes loved by our customers
              </p>
              {/* Underline */}
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6 opacity-60" />
            </div>

            {/* Grid using premium FoodCard */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
              {bestsellers.map((item) => (
                <FoodCard key={item.id} item={item} />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center mt-14">
              <Link
                href="/menu"
                className="group inline-flex items-center gap-2 border-2 border-gold text-gold font-bold px-8 py-4 rounded-full hover:bg-gold hover:text-night transition-all duration-300 hover:shadow-[0_10px_30px_rgba(245,179,1,0.3)] hover:scale-105"
              >
                <span>View Full Menu</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================================
            WHY CHOOSE US SECTION
            ============================================ */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          {/* Background effects */}
          <div className="absolute inset-0 bg-mesh opacity-50" />

          <div className="relative max-w-7xl mx-auto px-4">
            {/* Section Header */}
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 text-gold tracking-[0.3em] text-xs md:text-sm mb-3">
                <span className="w-8 h-px bg-gradient-to-r from-transparent to-gold" />
                <span className="font-semibold">WHY CHOOSE US</span>
                <span className="w-8 h-px bg-gradient-to-l from-transparent to-gold" />
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
                The <span className="text-shimmer">Food Junction</span> Promise
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto text-sm md:text-base">
                We promise fresh, hygienic, and delicious food with every order
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mt-6 opacity-60" />
            </div>

            {/* Feature cards grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group relative glass border border-white/5 rounded-2xl p-6 text-center card-premium overflow-hidden"
                >
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold/20 rounded-full blur-3xl" />
                  </div>

                  {/* Icon circle */}
                  <div className="relative w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-[0_0_20px_rgba(245,179,1,0.1)] group-hover:shadow-[0_0_30px_rgba(245,179,1,0.4)]">
                    <f.icon
                      size={28}
                      className="text-gold group-hover:scale-110 transition-transform"
                    />
                    {/* Emoji floating */}
                    <span className="absolute -top-2 -right-2 text-2xl opacity-0 group-hover:opacity-100 group-hover:animate-bounce-soft transition-opacity">
                      {f.emoji}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-lg mb-2 group-hover:text-gold transition-colors">
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors leading-relaxed">
                    {f.desc}
                  </p>

                  {/* Bottom gold line */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 group-hover:w-3/4 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-500" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================
            FINAL CTA SECTION
            ============================================ */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-night to-night" />
          <div className="absolute inset-0 bg-dots opacity-30" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gold/20 rounded-full blur-[100px]" />

          <div className="relative max-w-4xl mx-auto px-4 text-center">
            <div className="text-6xl mb-6 animate-bounce-soft">🍽️</div>
            <h2 className="font-display text-4xl md:text-6xl font-bold mb-4">
              Hungry? <span className="text-shimmer">Order Now!</span>
            </h2>
            <p className="text-white/60 mb-10 text-base md:text-lg max-w-2xl mx-auto">
              Fresh, delicious, hygienic food delivered to your doorstep in just
              30 minutes. Ab kya sochna? 🍕
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/menu"
                className="group relative bg-gradient-to-br from-gold to-gold-dark text-night font-bold px-10 py-4 rounded-full btn-premium text-base md:text-lg shadow-gold hover:shadow-[0_15px_40px_rgba(245,179,1,0.5)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ShoppingBag size={20} />
                  <span>Order Now</span>
                </span>
              </Link>
              <a
                href="tel:+919973318421"
                className="group border-2 border-gold text-gold font-bold px-10 py-4 rounded-full hover:bg-gold hover:text-night transition-all duration-300 text-base md:text-lg hover:scale-105"
              >
                <span className="flex items-center gap-2">
                  📞 Call Now
                </span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}