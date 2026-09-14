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
  User,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import OrderTimeline from '@/components/OrderTimeline'
import {
  getOrderById as getLocalOrderById,
  getOrders as getLocalOrders,
  ORDER_STATUSES,
  type Order,
  type OrderStatus,
} from '@/lib/orders'
import { getCustomerSession } from '@/lib/customerAuth'

// Map DB format → frontend Order format
function mapDbOrder(o: any): Order {
  return {
    id: o.id,
    orderNumber: o.order_number,
    createdAt: o.created_at,
    items: o.items || [],
    subtotal: o.subtotal,
    deliveryCharge: o.delivery_charge,
    tax: o.tax,
    total: o.total,
    orderType: o.order_type,
    paymentMethod: o.payment_method,
    paymentStatus: o.payment_status,
    status: o.status,
    customer: {
      name: o.customer_name,
      mobile: o.customer_mobile,
      email: o.customer_email,
      address: o.customer_address,
      landmark: o.customer_landmark,
      pincode: o.customer_pincode,
      instructions: o.customer_instructions,
      tableNumber: o.customer_table_number,
    },
  }
}

function TrackOrderContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [order, setOrder] = useState<Order | null>(null)
  const [searchId, setSearchId] = useState('')
  const [searched, setSearched] = useState(false)
  const [autoPlay, setAutoPlay] = useState(true)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [myOrders, setMyOrders] = useState<Order[]>([])
  const [customerName, setCustomerName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const initialId = searchParams.get('id')

  // Load customer session + orders
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const session = getCustomerSession()
      setCustomerName(session?.name || null)

      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        const data = await res.json()
        const allDbOrders: Order[] = (data.orders || []).map(mapDbOrder)

        setRecentOrders(allDbOrders.slice(0, 3))

        if (session) {
          const mine = allDbOrders.filter(
            (o) => o.customer.mobile === session.mobile
          )
          setMyOrders(mine)
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        const local = getLocalOrders()
        setRecentOrders(local.slice(0, 3))
        if (session) {
          setMyOrders(local.filter((o) => o.customer.mobile === session.mobile))
        }
      }

      setLoading(false)
    }
    load()
  }, [])

  // Load specific order by ID
  useEffect(() => {
    const fetchOrder = async () => {
      if (!initialId) return
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        const data = await res.json()
        const all: Order[] = (data.orders || []).map(mapDbOrder)
        const found = all.find(
          (o) => o.id === initialId || o.orderNumber === initialId
        )
        if (found) {
          setOrder(found)
          setSearched(true)
          return
        }
      } catch {}
      const local = getLocalOrderById(initialId)
      setOrder(local)
      setSearched(true)
    }
    fetchOrder()
  }, [initialId])

  // Auto-advance status
  useEffect(() => {
    if (!order || !autoPlay) return
    if (order.status === 'delivered') {
      setAutoPlay(false)
      return
    }

    const timer = setTimeout(async () => {
      const currentIndex = ORDER_STATUSES.findIndex((s) => s.key === order.status)
      const nextIndex = Math.min(currentIndex + 1, ORDER_STATUSES.length - 1)
      if (nextIndex === currentIndex) return

      const nextStatus: OrderStatus = ORDER_STATUSES[nextIndex].key
      try {
        await fetch(`/api/orders?id=${order.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus }),
        })
        setOrder({ ...order, status: nextStatus })
        if (nextIndex === ORDER_STATUSES.length - 1) setAutoPlay(false)
      } catch (err) {
        console.error(err)
      }
    }, 8000)

    return () => clearTimeout(timer)
  }, [order, autoPlay])

  const handleSearch = async () => {
    if (!searchId.trim()) return

    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      const all: Order[] = (data.orders || []).map(mapDbOrder)
      const found = all.find(
        (o) =>
          o.id === searchId.trim() ||
          o.orderNumber.toLowerCase() === searchId.trim().toLowerCase() ||
          o.customer.mobile === searchId.trim()
      )
      if (found) {
        setOrder(found)
        setSearched(true)
        router.push(`/track-order?id=${found.id}`)
        return
      }
    } catch {}

    const local = getLocalOrderById(searchId.trim())
    setOrder(local)
    setSearched(true)
    if (local) router.push(`/track-order?id=${local.id}`)
  }

  // ---------- LOADING ----------
  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </main>
    )
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
              {customerName
                ? `Welcome back, ${customerName}!`
                : 'Enter your Order ID to see live status'}
            </p>
          </div>

          {/* Search */}
          <div className="bg-night-card rounded-2xl border border-white/5 p-5 mb-6">
            <label className="block text-sm text-white/70 mb-2">
              Order ID / Order Number / Mobile
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
                  placeholder="e.g. FJ2026... or 9876543210"
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

          {/* My Orders (logged in) */}
          {customerName && myOrders.length > 0 && (
            <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-2xl p-5 mb-6">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <User size={18} className="text-gold" /> My Orders ({myOrders.length})
              </h3>
              <div className="space-y-2">
                {myOrders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/track-order?id=${o.id}`}
                    className="flex items-center justify-between bg-night/50 hover:bg-night/80 border border-white/5 hover:border-gold/40 rounded-xl px-4 py-3 transition group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-gold group-hover:text-gold-light">
                        #{o.orderNumber}
                      </p>
                      <p className="text-xs text-white/40">
                        {new Date(o.createdAt).toLocaleDateString('en-IN')} • ₹{o.total}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-semibold capitalize ${
                          o.status === 'delivered'
                            ? 'bg-fresh/20 text-fresh'
                            : o.status === 'placed'
                            ? 'bg-gold/20 text-gold'
                            : 'bg-blue-400/20 text-blue-400'
                        }`}
                      >
                        {o.status}
                      </span>
                      <ArrowRight size={16} className="text-white/40 group-hover:text-gold" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Orders (not logged in) */}
          {recentOrders.length > 0 && !customerName && (
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

          {/* Login CTA */}
          {!customerName && (
            <div className="mt-6 text-center">
              <p className="text-sm text-white/50 mb-3">
                Login to see all your orders in one place
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 bg-gold text-night font-bold px-6 py-3 rounded-full hover:bg-gold-light transition"
              >
                <User size={16} /> Login / Register
              </Link>
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
            {/* Order Info */}
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
                href="tel:+919973318421"
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