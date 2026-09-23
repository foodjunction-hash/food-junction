'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ShoppingBag, Trash2, Tag } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CartItem from '@/components/CartItem'
import { useCart } from '@/lib/store'
import { getCustomerSession } from '@/lib/customerAuth'

export default function CartPage() {
  const router = useRouter()
  const items = useCart((s) => s.items)
  const getSubtotal = useCart((s) => s.getSubtotal)
  const clear = useCart((s) => s.clear)

  const subtotal = getSubtotal()
  const deliveryCharge = subtotal >= 500 || subtotal === 0 ? 0 : 30
  const tax = Math.round(subtotal * 0.05)
  const grandTotal = subtotal + deliveryCharge + tax

  // ============================================
  // LOGIN CHECK — Checkout pe jaane ke liye
  // ============================================
  const handleProceedToCheckout = () => {
    const session = getCustomerSession()

    if (!session) {
      // Save redirect intent
      sessionStorage.setItem('fj-redirect-after-login', '/checkout')
      router.push('/login?redirect=/checkout')
      return
    }

    // Logged in — go to checkout
    router.push('/checkout')
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-8xl mb-6">🛒</div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Your Cart is <span className="text-gradient-gold">Empty</span>
            </h1>
            <p className="text-white/60 mb-8">
              Lagta hai aapne abhi tak kuch order nahi kiya. Chalo menu dekhte hain!
            </p>
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 bg-gold text-night font-bold px-8 py-4 rounded-full hover:bg-gold-light transition shadow-gold"
            >
              <ShoppingBag size={20} /> Browse Menu
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div>
              <Link
                href="/menu"
                className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold mb-2 transition"
              >
                <ArrowLeft size={16} /> Continue Shopping
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold">
                Your <span className="text-gradient-gold">Cart</span>
              </h1>
              <p className="text-white/50 text-sm mt-1">
                {items.length} {items.length === 1 ? 'item' : 'items'} in cart
              </p>
            </div>

            <button
              onClick={clear}
              className="hidden md:flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 px-3 py-2 rounded-full transition"
            >
              <Trash2 size={16} /> Clear Cart
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              {/* Mobile clear button */}
              <button
                onClick={clear}
                className="md:hidden w-full flex items-center justify-center gap-1.5 text-sm text-red-400 hover:text-red-300 border border-red-500/30 hover:bg-red-500/10 py-3 rounded-full transition"
              >
                <Trash2 size={16} /> Clear Cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 bg-night-card rounded-2xl border border-white/5 p-5 md:p-6">
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Tag size={18} className="text-gold" /> Order Summary
                </h2>

                <div className="space-y-3 text-sm pb-4 border-b border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Delivery Charge</span>
                    <span className={deliveryCharge === 0 ? 'text-fresh font-semibold' : 'font-semibold'}>
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Tax (5% GST)</span>
                    <span className="font-semibold">₹{tax}</span>
                  </div>

                  {subtotal < 500 && subtotal > 0 && (
                    <div className="bg-gold/10 border border-gold/30 rounded-xl px-3 py-2 text-xs text-gold">
                      💡 ₹{500 - subtotal} aur add karo, FREE delivery paao!
                    </div>
                  )}
                </div>

                <div className="flex justify-between items-center py-4">
                  <span className="font-bold text-lg">Grand Total</span>
                  <span className="font-bold text-2xl text-gold">₹{grandTotal}</span>
                </div>

                {/* Proceed to Checkout — with login guard */}
                <button
                  onClick={handleProceedToCheckout}
                  className="w-full bg-gold text-night font-bold py-4 rounded-full hover:bg-gold-light transition shadow-gold flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={18} /> Proceed to Checkout
                </button>

                <Link
                  href="/menu"
                  className="w-full mt-3 border border-white/10 text-white/70 hover:text-gold hover:border-gold/40 font-medium py-3 rounded-full transition flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowLeft size={16} /> Add More Items
                </Link>

                <p className="text-center text-xs text-white/40 mt-4">
                  🔒 Secure checkout • Fresh food guaranteed
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}