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
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getOrderById, type Order } from '@/lib/orders'

function OrderSuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get('id')
  const [order, setOrder] = useState<Order | null>(null)

  useEffect(() => {
    if (orderId) {
      setOrder(getOrderById(orderId))
    }
  }, [orderId])

  if (!order) {
    return (
      <main className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-3">Order not found</h1>
          <Link
            href="/"
            className="inline-flex bg-gold text-night font-bold px-6 py-3 rounded-full"
          >
            Go Home
          </Link>
        </div>
      </main>
    )
  }

  const orderTypeLabels = {
    delivery: 'Home Delivery',
    takeaway: 'Takeaway',
    dinein: 'Dine-in',
  }

  return (
    <main className="min-h-screen py-10 md:py-16">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Banner */}
        <div className="text-center mb-8 md:mb-10">
          <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-fresh/20 border-2 border-fresh flex items-center justify-center mb-4 animate-pulse">
            <CheckCircle2 size={48} className="text-fresh" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-3">
            Order Placed <span className="text-gradient-gold">Successfully!</span> 🎉
          </h1>
          <p className="text-white/60">
            Thank you {order.customer.name}! Your order is confirmed.
          </p>
        </div>

        {/* Order ID Card */}
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

        {/* Status grid */}
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
            <p className="text-xs font-bold">{orderTypeLabels[order.orderType]}</p>
          </div>
          <div className="bg-night-card border border-white/5 rounded-xl p-3 text-center">
            <Clock size={20} className="text-gold mx-auto mb-1" />
            <p className="text-[10px] text-white/50">ETA</p>
            <p className="text-xs font-bold">30 min</p>
          </div>
        </div>

        {/* Items */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-4">Order Items</h2>
          <div className="space-y-2 mb-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <span className="text-2xl">{item.image}</span>
                <span className="flex-1 truncate">{item.name}</span>
                <span className="text-white/50">×{item.quantity}</span>
                <span className="font-semibold">₹{item.price * item.quantity}</span>
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
                {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
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

        {/* Customer info */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-5">
          <h2 className="font-bold mb-3 flex items-center gap-2">
            <Phone size={16} className="text-gold" /> Contact Info
          </h2>
          <div className="text-sm space-y-1 text-white/70">
            <p><span className="text-white/40">Name:</span> {order.customer.name}</p>
            <p><span className="text-white/40">Mobile:</span> {order.customer.mobile}</p>
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

        {/* Buttons */}
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
      <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center">Loading...</div>}>
        <OrderSuccessContent />
      </Suspense>
      <Footer />
    </>
  )
}