'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import {
  CheckCircle2,
  MapPin,
  Phone,
  Clock,
  Package,
  ArrowRight,
  MessageCircle,
  Loader2,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { type Order } from '@/lib/orders'

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
    transactionId: o.transaction_id,
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

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setLoading(false)
        return
      }

      // Try sessionStorage first (sabse fast)
      try {
        const lastId = sessionStorage.getItem('fj-last-order-id')
        if (lastId) {
          const res = await fetch('/api/orders', { cache: 'no-store' })
          const data = await res.json()
          const all: Order[] = (data.orders || []).map(mapDbOrder)

          // Match by: orderId, orderNumber, or sessionStorage ID
          const found = all.find(
            (o) =>
              o.id === orderId ||
              o.orderNumber === orderId ||
              o.id === lastId ||
              o.orderNumber === lastId
          )

          if (found) {
            setOrder(found)
            setLoading(false)
            return
          }
        }
      } catch (err) {
        console.error('Failed to fetch order:', err)
      }

      // Fallback: fetch all and match by orderId
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        const data = await res.json()
        const all: Order[] = (data.orders || []).map(mapDbOrder)
        const found = all.find(
          (o) => o.id === orderId || o.orderNumber === orderId
        )
        if (found) setOrder(found)
      } catch (err) {
        console.error('Failed to fetch order:', err)
      }

      setLoading(false)
    }

    fetchOrder()
  }, [orderId])

  if (loading) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-gold" size={32} />
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <div className="text-7xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-3">Order not found</h1>
          <p className="text-white/60 mb-6 text-sm">
            Agar tumne order place kiya hai, toh kuch seconds wait karo aur
            page refresh karo. Ya Track Order page se order ID daal kar dhundho.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => window.location.reload()}
              className="bg-gold text-night font-bold px-6 py-3 rounded-full hover:bg-gold-light transition"
            >
              Refresh
            </button>
            <Link
              href="/track-order"
              className="border-2 border-gold/40 text-gold font-bold px-6 py-3 rounded-full hover:bg-gold/10 transition"
            >
              Track Order
            </Link>
          </div>
        </div>
      </main>
    )
  }

  const orderTypeLabels: Record<string, string> = {
    delivery: 'Home Delivery',
    takeaway: 'Takeaway',
    dinein: 'Dine-in',
  }

  return (
    <main className="min-h-screen py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-fresh/20 border-2 border-fresh flex items-center justify-center mb-4 animate-pulse">
            <CheckCircle2 size={48} className="text-fresh" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Order Placed{' '}
            <span className="text-gradient-gold">Successfully!</span> 🎉
          </h1>
          <p className="text-white/60">
            Thank you {order.customer.name}! Your order is confirmed.
          </p>
        </div>

        <div className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-2xl p-5 mb-5 text-center">
          <p className="text-xs text-white/60 tracking-widest mb-1">ORDER ID</p>
          <p className="text-2xl md:text-3xl font-bold text-gold mb-1">
            #{order.orderNumber}
          </p>
          <p className="text-xs text-white/50">
            {new Date(order.createdAt).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
          <div className="bg-night-card border border-white/5 rounded-xl p-3 text-center">
            <Package size={20} className="text-gold mx-auto mb-1" />
            <p className="text-[10px] text-white/50">STATUS</p>
            <p className="text-xs font-bold capitalize">{order.status}</p>
          </div>
          <div className="bg-night-card border border-white/5 rounded-xl p-3 text-center">
            <Clock size={20} className="text-gold mx-auto mb-1" />
            <p className="text-[10px] text-white/50">PAYMENT</p>
            <p className="text-xs font-bold capitalize">
              {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
            </p>
          </div>
          <div className="bg-night-card border border-white/5 rounded-xl p-3 text-center">
            <MapPin size={20} className="text-gold mx-auto mb-1" />
            <p className="text-[10px] text-white/50">TYPE</p>
            <p className="text-xs font-bold">
              {orderTypeLabels[order.orderType]}
            </p>
          </div>
          <div className="bg-night-card border border-white/5 rounded-xl p-3 text-center">
            <Clock size={20} className="text-gold mx-auto mb-1" />
            <p className="text-[10px] text-white/50">ETA</p>
            <p className="text-xs font-bold">30 min</p>
          </div>
        </div>

        <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-4">Order Items</h2>
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

          <div className="border-t border-white/10 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-white/60">Subtotal</span>
              <span>₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Delivery</span>
              <span className={order.deliveryCharge === 0 ? 'text-fresh' : ''}>
                {order.deliveryCharge === 0
                  ? 'FREE'
                  : `₹${order.deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Tax</span>
              <span>₹{order.tax}</span>
            </div>
            <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
              <span>Total</span>
              <span className="text-gold">₹{order.total}</span>
            </div>
          </div>
        </div>

        <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <Phone size={16} className="text-gold" /> Contact Info
          </h2>
          <div className="text-sm space-y-1 text-white/70">
            <p>
              <span className="text-white/40">Name:</span>{' '}
              {order.customer.name}
            </p>
            <p>
              <span className="text-white/40">Mobile:</span>{' '}
              {order.customer.mobile}
            </p>
            {order.customer.address && (
              <p>
                <span className="text-white/40">Address:</span>{' '}
                {order.customer.address}
                {order.customer.landmark && `, ${order.customer.landmark}`}
                {order.customer.pincode && ` - ${order.customer.pincode}`}
              </p>
            )}
            {order.customer.tableNumber && (
              <p>
                <span className="text-white/40">Table No:</span>{' '}
                {order.customer.tableNumber}
              </p>
            )}
          </div>
        </div>

        <div className="bg-fresh/10 border border-fresh/30 rounded-2xl p-5 mb-5 text-center">
          <div className="text-4xl mb-2">🎉</div>
          <p className="font-bold mb-1">
            Loved our food? Share it with friends!
          </p>
          <p className="text-xs text-white/60 mb-4">
            Help us grow — share Food Junction on WhatsApp
          </p>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(
              `🍽️ I just ordered from *Food Junction - The Family Restaurant*!\n\n` +
                `Order #${order.orderNumber}\n` +
                `Total: ₹${order.total}\n\n` +
                `You should try it too! 👇\n` +
                `https://food-junction-gamma.vercel.app/`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-fresh text-night font-bold px-6 py-3 rounded-full hover:bg-fresh-dark transition"
          >
            <MessageCircle size={18} /> Share on WhatsApp
          </a>
        </div>

        <div className="grid md:grid-cols-2 gap-3">
          <Link
            href={`/track-order?id=${order.id}`}
            className="bg-gold text-night font-bold py-4 rounded-full hover:bg-gold-light transition flex items-center justify-center gap-2"
          >
            Track My Order <ArrowRight size={18} />
          </Link>
          <Link
            href="/menu"
            className="border-2 border-gold/40 text-gold font-bold py-4 rounded-full hover:bg-gold/10 transition flex items-center justify-center gap-2"
          >
            Order More Food
          </Link>
        </div>
      </div>
    </main>
  )
}

export default function OrderSuccessPage() {
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
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  )
}