'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import {
  Search,
  Phone,
  MapPin,
  Clock,
  Package,
  ArrowRight,
  Loader2,
  X,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OrderTimeline from '@/components/OrderTimeline'
import {
  getOrderById,
  getOrders,
  updateOrderStatus,
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
} from '@/lib/orders'

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [searchId, setSearchId] = useState('')
  const [searched, setSearched] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  const initialId = searchParams.get('id')

  useEffect(() => {
    setRecentOrders(getOrders().slice(0, 3))
  }, [])

  useEffect(() => {
    if (initialId) {
      const found = getOrderById(initialId)
      setOrder(found)
      setSearched(true)
    }
  }, [initialId])

  // Auto-advance status every 8 seconds
  useEffect(() => {
    if (!order || !autoPlay) return
    if (order.status === 'delivered') {
      setAutoPlay(false)
      return
    }

    const timer = setTimeout(() => {
      const currentIndex = ORDER_STATUSES.findIndex((s) => s.key === order.status)
      const nextIndex = Math.min(currentIndex + 1, ORDER_STATUSES.length - 1)
      const nextStatus = ORDER_STATUSES[nextIndex].key
      const updated = updateOrderStatus(order.id, nextStatus)
      if (updated) setOrder(updated)
      if (nextIndex === ORDER_STATUSES.length - 1) setAutoPlay(false)
    }, 8000)

    return () => clearTimeout(timer)
  }, [order, autoPlay])

  const handleSearch = () => {
    if (!searchId.trim()) return
    const found = getOrderById(searchId.trim())
    setOrder(found)
    setSearched(true)
    if (found) {
      router.push(`/track-order?id=${found.id}`)
    }
  }

  // ---------- SEARCH VIEW ----------
  if (!order) {
    return (
      <main className="min-h-[80vh] py-12 md:py-20">
        <div className="max-w-2xl mx-auto px-4">
          <div className="text-center mb-8">
            <div className="text-7xl mb-4">📍</div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Track Your <span className="text-gradient-gold">Order</span>
            </h1>
            <p className="text-white/60">
              Enter your Order ID to see live status
            </p>
          </div>

          {/* Search */}
          <div className="bg-night-card rounded-2xl border border-white/5 p-5 mb-6">
            <label className="block text-sm text-white/70 mb-2">
              Order ID / Order Number
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => setSearchId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="e.g. FJ202609119891 or ord_..."
                  className="w-full bg-night border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-gold text-night font-bold px-6 py-3 rounded-full hover:bg-gold-light transition"
              >
                Track
              </button>
            </div>

            {searched && !order && (
              <div className="mt-4 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300">
                <X size={16} className="flex-shrink-0 mt-0.5" />
                <span>Order not found. Please check your Order ID.</span>
              </div>
            )}
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="bg-night-card rounded-2xl border border-white/5 p-5">
              <h3 className="font-bold mb-3 text-sm text-white/70">
                Recent Orders
              </h3>
              <div className="space-y-2">
                {recentOrders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/track-order?id=${o.id}`}
                    className="flex items-center justify-between bg-night border border-white/5 hover:border-gold/40 rounded-xl px-4 py-3 transition group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gold group-hover:text-gold-light">
                        #{o.orderNumber}
                      </p>
                      <p className="text-xs text-white/40">
                        {new Date(o.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-white/60 capitalize">
                        {o.status}
                      </span>
                      <ArrowRight size={16} className="text-white/40 group-hover:text-gold" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    )
  }

  // ---------- ORDER VIEW ----------
  const orderTypeLabels: Record<string, string> = {
    delivery: 'Home Delivery',
    takeaway: 'Takeaway',
    dinein: 'Dine-in',
  }

  return (
    <main className="min-h-screen py-8 md:py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <Link
            href="/track-order"
            className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold mb-2 transition"
            onClick={(e) => {
              e.preventDefault()
              setOrder(null)
              setSearched(false)
              setSearchId('')
              router.push('/track-order')
            }}
          >
            ← Track another order
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">
            Live <span className="text-gradient-gold">Tracking</span>
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Real-time updates for your order
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left – Timeline */}
          <div className="lg:col-span-2 space-y-5">
            {/* Order ID Card */}
            <div className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-2xl p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-xs text-white/60 tracking-widest mb-1">
                    ORDER ID
                  </p>
                  <p className="text-xl md:text-2xl font-bold text-gold">
                    #{order.orderNumber}
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2 bg-night/50 rounded-full px-3 py-1.5">
                  <span className="w-2 h-2 rounded-full bg-fresh animate-pulse" />
                  <span className="text-xs font-semibold">
                    {autoPlay && order.status !== 'delivered'
                      ? 'Live updating'
                      : 'Up to date'}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <OrderTimeline currentStatus={order.status} />

            {/* Order Items */}
            <div className="bg-night-card rounded-2xl border border-white/5 p-5">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Package size={18} className="text-gold" /> Order Items
              </h2>
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-sm">
                    <span className="text-2xl">{item.image}</span>
                    <span className="flex-1 truncate">{item.name}</span>
                    <span className="text-white/50">×{item.quantity}</span>
                    <span className="font-semibold">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-gold">₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Right – Info */}
          <div className="lg:col-span-1 space-y-5">
            {/* Delivery info */}
            <div className="bg-night-card rounded-2xl border border-white/5 p-5">
              <h2 className="font-bold mb-4 flex items-center gap-2">
                <Clock size={18} className="text-gold" /> Order Info
              </h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/50">Type</span>
                  <span className="font-semibold">
                    {orderTypeLabels[order.orderType]}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Payment</span>
                  <span className="font-semibold capitalize">
                    {order.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">Status</span>
                  <span
                    className={`font-semibold capitalize ${
                      order.paymentStatus === 'paid' ? 'text-fresh' : 'text-gold'
                    }`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">ETA</span>
                  <span className="font-semibold">30 min</span>
                </div>
              </div>
            </div>

            {/* Delivery Address */}
            {order.customer.address && (
              <div className="bg-night-card rounded-2xl border border-white/5 p-5">
                <h2 className="font-bold mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-gold" /> Delivery Address
                </h2>
                <p className="text-sm text-white/70">
                  <span className="font-semibold text-white">
                    {order.customer.name}
                  </span>
                  <br />
                  {order.customer.address}
                  {order.customer.landmark && `, ${order.customer.landmark}`}
                  {order.customer.pincode && ` - ${order.customer.pincode}`}
                </p>
              </div>
            )}

            {/* Contact */}
            <div className="bg-night-card rounded-2xl border border-white/5 p-5">
              <h2 className="font-bold mb-3 flex items-center gap-2">
                <Phone size={18} className="text-gold" /> Need Help?
              </h2>
              <p className="text-sm text-white/60 mb-4">
                Koi problem? Humse baat karein
              </p>
              <a
                href="tel:+919999999999"
                className="w-full flex items-center justify-center gap-2 bg-fresh text-night font-bold py-3 rounded-full hover:bg-fresh-dark transition"
              >
                <Phone size={16} /> Call Restaurant
              </a>
            </div>

            {/* Delivered CTA */}
            {order.status === 'delivered' && (
              <div className="bg-fresh/10 border border-fresh/30 rounded-2xl p-5 text-center">
                <div className="text-4xl mb-2">🎉</div>
                <p className="font-bold mb-1">Order Delivered!</p>
                <p className="text-xs text-white/60 mb-4">
                  Thank you for ordering from Food Junction
                </p>
                <Link
                  href="/menu"
                  className="inline-flex bg-fresh text-night font-bold px-5 py-2.5 rounded-full text-sm"
                >
                  Order Again
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default function TrackOrderPage() {
  return (
    <>
      <Header />
      <Suspense
        fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <Loader2 className="animate-spin text-gold" size={32} />
          </div>
        }
      >
        <TrackOrderContent />
      </Suspense>
      <Footer />
    </>
  )
}