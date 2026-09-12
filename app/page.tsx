import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Phone, UtensilsCrossed, ShoppingBag, Star } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Header />

      <main className="min-h-screen">

        {/* ============ HERO SECTION ============ */}
        <section className="relative overflow-hidden min-h-[85vh] flex items-center">
          <div className="absolute inset-0">
            <div className="w-full h-full bg-gradient-to-br from-night via-night-soft to-night" />
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,#F5B301_0%,transparent_50%)]" />
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_80%_80%,#22C55E_0%,transparent_50%)]" />
          </div>

          <div className="absolute top-20 left-10 text-6xl opacity-10 animate-pulse">🍕</div>
          <div className="absolute bottom-20 right-10 text-6xl opacity-10 animate-pulse">🍔</div>

          <div className="relative max-w-7xl mx-auto px-4 py-20 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-sm mb-6">
                  <Star size={14} fill="currentColor" />
                  <span>Amarpur&apos;s Favorite Family Restaurant</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
                  Taste That Brings
                  <br />
                  <span className="text-gradient-gold">Family</span> Together
                </h1>

                <p className="text-xl md:text-2xl text-white/80 mb-2">
                  Fresh • Delicious • Hygienic
                </p>
                <p className="text-white/50 mb-10 text-sm md:text-base">
                  Order online • Home delivery • Takeaway • Dine-in
                </p>

                <div className="flex flex-wrap gap-3 md:gap-4 justify-center lg:justify-start">
                  <Link
                    href="/menu"
                    className="bg-gold text-night font-bold px-6 md:px-8 py-3.5 md:py-4 rounded-full hover:bg-gold-light transition-all flex items-center gap-2 text-sm md:text-base"
                  >
                    <ShoppingBag size={18} /> ORDER NOW
                  </Link>
                  <Link
                    href="/menu"
                    className="border-2 border-gold text-gold font-bold px-6 md:px-8 py-3.5 md:py-4 rounded-full hover:bg-gold hover:text-night transition flex items-center gap-2 text-sm md:text-base"
                  >
                    <UtensilsCrossed size={18} /> VIEW MENU
                  </Link>
                  <a
  href="tel:+919973318421"
  className="border-2 border-fresh text-fresh font-bold px-6 md:px-8 py-3.5 md:py-4 rounded-full hover:bg-fresh hover:text-night transition flex items-center gap-2 text-sm md:text-base"
>
  <Phone size={18} /> CALL NOW
</a>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12 max-w-md mx-auto lg:mx-0">
                  <div>
                    <p className="text-3xl md:text-4xl text-gold font-bold">50+</p>
                    <p className="text-xs md:text-sm text-white/60">Dishes</p>
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl text-gold font-bold">10K+</p>
                    <p className="text-xs md:text-sm text-white/60">Happy Customers</p>
                  </div>
                  <div>
                    <p className="text-3xl md:text-4xl text-gold font-bold">30min</p>
                    <p className="text-xs md:text-sm text-white/60">Fast Delivery</p>
                  </div>
                </div>
              </div>

              <div className="relative hidden lg:block">
                <div className="relative w-full aspect-square max-w-md mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/30 to-fresh/20 blur-3xl" />
                  <div className="relative w-full h-full rounded-full border-4 border-gold/20 flex items-center justify-center bg-night-card/50">
                    <span className="text-[180px]">🍽️</span>
                  </div>

                  <div className="absolute top-10 -left-4 bg-night-card border border-gold/30 rounded-2xl px-4 py-3">
                    <p className="text-xs text-white/60">Bestseller</p>
                    <p className="text-sm font-bold text-gold">Hyderabadi Biryani</p>
                  </div>
                  <div className="absolute bottom-10 -right-4 bg-night-card border border-fresh/30 rounded-2xl px-4 py-3">
                    <p className="text-xs text-white/60">Delivery in</p>
                    <p className="text-sm font-bold text-fresh">30 minutes ⚡</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============ BEST SELLERS ============ */}
        <section className="py-16 md:py-24 bg-night-soft">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-gold tracking-[0.3em] text-sm mb-2">OUR SPECIALTIES</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                Best <span className="text-gradient-gold">Sellers</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { name: 'Farmhouse Pizza', price: 249, old: 299, emoji: '🍕' },
                { name: 'Chicken Zinger Burger', price: 139, old: 159, emoji: '🍔' },
                { name: 'Hyderabadi Biryani', price: 249, old: 0, emoji: '🍚' },
                { name: 'Paneer Butter Masala', price: 219, old: 0, emoji: '🍛' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group bg-night-card rounded-2xl overflow-hidden border border-white/5 hover:border-gold/40 transition-all"
                >
                  <div className="aspect-square flex items-center justify-center text-8xl bg-gradient-to-br from-gold/10 to-fresh/10 group-hover:scale-110 transition-transform duration-500">
                    {item.emoji}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-base mb-2 group-hover:text-gold transition">
                      {item.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-baseline gap-2">
                        <span className="text-gold font-bold text-lg">₹{item.price}</span>
                        {item.old > 0 && (
                          <span className="text-white/40 text-sm line-through">₹{item.old}</span>
                        )}
                      </div>
                      <span className="text-xs bg-gold/10 text-gold border border-gold/30 px-3 py-1.5 rounded-full font-semibold">
                        ADD +
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link
                href="/menu"
                className="inline-flex border-2 border-gold text-gold font-bold px-8 py-3.5 rounded-full hover:bg-gold hover:text-night transition"
              >
                View Full Menu →
              </Link>
            </div>
          </div>
        </section>

        {/* ============ WHY CHOOSE US ============ */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <p className="text-gold tracking-[0.3em] text-sm mb-2">WHY CHOOSE US</p>
              <h2 className="text-4xl md:text-5xl font-bold">
                The <span className="text-gradient-gold">Food Junction</span> Promise
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { emoji: '🌿', title: 'Fresh Ingredients', desc: 'Daily sourced fresh vegetables & meat' },
                { emoji: '⚡', title: 'Fast Delivery', desc: 'Hot food delivered within 30 minutes' },
                { emoji: '🛡️', title: 'Hygienic Kitchen', desc: 'FSSAI certified clean kitchen' },
                { emoji: '🏆', title: 'Premium Quality', desc: 'Best taste in Amarpur guaranteed' },
                { emoji: '❤️', title: 'Family Friendly', desc: 'Perfect ambiance for families' },
                { emoji: '🚚', title: 'Free Delivery', desc: 'On orders above ₹500' },
              ].map((f, i) => (
                <div
                  key={i}
                  className="bg-night-card rounded-2xl p-5 border border-white/5 hover:border-gold/30 transition-all text-center"
                >
                  <div className="text-4xl mb-3">{f.emoji}</div>
                  <h3 className="font-bold text-lg mb-1">{f.title}</h3>
                  <p className="text-sm text-white/60">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}