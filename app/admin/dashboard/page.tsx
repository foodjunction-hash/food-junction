'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Package,
  ChefHat,
} from 'lucide-react'
import { getOrders, type Order } from '@/lib/orders'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        const data = await res.json()

        // Map DB format → frontend Order format
        const dbOrders: Order[] = (data.orders || []).map((o: any) => ({
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
        }))
        setOrders(dbOrders)
      } catch (err) {
        console.error('Failed to fetch orders from DB:', err)
        // Fallback to localStorage
        setOrders(getOrders())
      }
      setMounted(true)
    }

    fetchOrders()

    // Auto-refresh every 10 seconds
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="p-6 text-white/60 text-sm">Loading dashboard...</div>
    )
  }

  const today = new Date().toDateString()
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  )

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0)

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      icon: ClipboardList,
      color: 'text-gold',
      bg: 'bg-gold/10',
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue}`,
      icon: IndianRupee,
      color: 'text-fresh',
      bg: 'bg-fresh/10',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: TrendingUp,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: Package,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
  ]

  const statusCount = {
    placed: orders.filter((o) => o.status === 'placed').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-1">Dashboard</h1>
        <p className="text-white/50 text-sm">
          Welcome back, Admin! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-8">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-night-card border border-white/5 rounded-2xl p-4 md:p-5"
          >
            <div
              className={`w-10 h-10 rounded-full ${s.bg} flex items-center justify-center mb-3`}
            >
              <s.icon size={20} className={s.color} />
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">{s.value}</p>
            <p className="text-xs md:text-sm text-white/50">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Status Overview */}
      <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6 md:mb-8">
        <h2 className="font-bold mb-4">Order Status Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Placed', value: statusCount.placed, color: 'text-gold', emoji: '📝' },
            { label: 'Accepted', value: statusCount.accepted, color: 'text-blue-400', emoji: '✅' },
            { label: 'Preparing', value: statusCount.preparing, color: 'text-purple-400', emoji: '👨‍🍳' },
            { label: 'Ready', value: statusCount.ready, color: 'text-fresh', emoji: '🍽️' },
            { label: 'Delivered', value: statusCount.delivered, color: 'text-white/60', emoji: '🎉' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl mb-1">{s.emoji}</div>
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold flex items-center gap-2">
            <Clock size={18} className="text-gold" /> Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm text-gold hover:text-gold-light transition flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-white/60 text-sm mb-2">No orders yet</p>
            <p className="text-white/40 text-xs">
              Orders will appear here once customers place them
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-night border border-white/5 hover:border-gold/40 transition"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-gold truncate">
                      #{order.orderNumber}
                    </p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        order.status === 'delivered'
                          ? 'bg-fresh/20 text-fresh'
                          : order.status === 'placed'
                          ? 'bg-gold/20 text-gold'
                          : 'bg-blue-400/20 text-blue-400'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 truncate">
                    {order.customer.name} • {order.customer.mobile}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <p className="font-bold text-sm">₹{order.total}</p>
                  <p className="text-[10px] text-white/40">
                    {new Date(order.createdAt).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-3 md:gap-5 mt-6 md:mt-8">
        <Link
          href="/admin/menu"
          className="bg-night-card border border-white/5 rounded-2xl p-5 hover:border-gold/40 transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold transition">
            <ChefHat size={22} className="text-gold group-hover:text-night transition" />
          </div>
          <div className="flex-1">
            <p className="font-bold mb-0.5">Manage Menu</p>
            <p className="text-xs text-white/50">Add, edit, delete food items</p>
          </div>
          <ArrowRight
            size={18}
            className="text-white/40 group-hover:text-gold transition"
          />
        </Link>

        <Link
          href="/admin/orders"
          className="bg-night-card border border-white/5 rounded-2xl p-5 hover:border-gold/40 transition flex items-center gap-4 group"
        >
          <div className="w-12 h-12 rounded-full bg-fresh/10 flex items-center justify-center group-hover:bg-fresh transition">
            <CheckCircle2 size={22} className="text-fresh group-hover:text-night transition" />
          </div>
          <div className="flex-1">
            <p className="font-bold mb-0.5">Manage Orders</p>
            <p className="text-xs text-white/50">Accept, reject, track orders</p>
          </div>
          <ArrowRight
            size={18}
            className="text-white/40 group-hover:text-gold transition"
          />
        </Link>
      </div>
    </div>
  )
}