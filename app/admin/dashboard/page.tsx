'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  IndianRupee,
  TrendingUp,
  Package,
  Clock,
  CheckCircle2,
  ChefHat,
  ArrowRight,
  Loader2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

type Order = {
  id: string
  orderNumber: string
  createdAt: string
  total: number
  status: string
  customer: {
    name: string
    mobile: string
  }
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchOrders = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)
    else setLoading(true)
    setError(null)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 10000)

      const res = await fetch('/api/orders', {
        cache: 'no-store',
        signal: controller.signal,
      })

      clearTimeout(timeout)

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const data = await res.json()
      const rawOrders = data.orders || data || []

      const mapped: Order[] = rawOrders.map((o: any) => ({
        id: o.id,
        orderNumber: o.order_number || o.orderNumber || '',
        createdAt: o.created_at || o.createdAt || new Date().toISOString(),
        total: Number(o.total) || 0,
        status: (o.status || 'placed').toLowerCase(),
        customer: {
          name: o.customer_name || o.customer?.name || 'Customer',
          mobile: o.customer_mobile || o.customer?.mobile || '',
        },
      }))

      setOrders(mapped)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Request timeout. Please retry.')
      } else {
        setError(err.message || 'Failed to load orders')
      }
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
    const interval = setInterval(() => fetchOrders(true), 60000)
    return () => clearInterval(interval)
  }, [fetchOrders])

  // Stats
  const today = new Date().toDateString()
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  )
  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0)
  const totalRevenue = orders.reduce((s, o) => s + o.total, 0)

  const statusCount = {
    placed: orders.filter((o) => o.status === 'placed').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      icon: ClipboardList,
      color: 'from-amber-400 to-yellow-600',
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue}`,
      icon: IndianRupee,
      color: 'from-emerald-400 to-green-600',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: TrendingUp,
      color: 'from-blue-400 to-cyan-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: Package,
      color: 'from-purple-400 to-pink-600',
    },
  ]

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  // ===== LOADING =====
  if (loading) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-gold" size={40} />
          <p className="text-white/60 text-sm">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // ===== ERROR =====
  if (error) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center">
        <div className="max-w-md text-center">
          <AlertCircle className="text-red-400 mx-auto mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Failed to load</h2>
          <p className="text-white/60 text-sm mb-6">{error}</p>
          <button
            onClick={() => fetchOrders()}
            className="flex items-center gap-2 bg-gold text-night font-bold px-6 py-3 rounded-full mx-auto hover:scale-105 transition"
          >
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    )
  }

  // ===== MAIN =====
  return (
    <div className="p-4 md:p-8 min-h-screen">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            Dashboard
          </h1>
          <p className="text-white/50 text-sm">
            Welcome back, Admin!
          </p>
        </div>
        <button
          onClick={() => fetchOrders(true)}
          disabled={refreshing}
          className="flex items-center gap-2 bg-night-card border border-white/10 hover:border-gold/50 px-4 py-2.5 rounded-full text-sm font-semibold transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin text-gold' : 'text-gold'} />
          Refresh
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-night-card border border-white/5 rounded-2xl p-5 hover:border-gold/30 transition"
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3`}
            >
              <s.icon size={20} className="text-night" />
            </div>
            <p className="text-2xl md:text-3xl font-bold mb-1">{s.value}</p>
            <p className="text-xs text-white/60">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Status Overview */}
      <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-6">
        <h2 className="font-bold mb-4 text-lg">Order Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Placed', value: statusCount.placed, emoji: '📝' },
            { label: 'Accepted', value: statusCount.accepted, emoji: '✅' },
            { label: 'Preparing', value: statusCount.preparing, emoji: '👨‍🍳' },
            { label: 'Ready', value: statusCount.ready, emoji: '🍽️' },
            { label: 'Delivered', value: statusCount.delivered, emoji: '🎉' },
          ].map((s, i) => (
            <div
              key={i}
              className="text-center p-3 rounded-xl bg-white/5"
            >
              <div className="text-3xl mb-1">{s.emoji}</div>
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-white/50">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-night-card border border-white/5 rounded-2xl p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Clock size={18} className="text-gold" /> Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm text-gold hover:text-gold-light flex items-center gap-1"
          >
            View All <ArrowRight size={14} />
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-white/60 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {orders.slice(0, 5).map((order) => (
              <Link
                key={order.id}
                href="/admin/orders"
                className="flex items-center justify-between p-3 rounded-xl bg-night border border-white/5 hover:border-gold/50 transition group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-sm text-gold">#{order.orderNumber}</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-gold/20 text-gold">
                      {order.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 truncate">
                    {order.customer.name} • {order.customer.mobile}
                  </p>
                </div>
                <div className="text-right ml-3">
                  <p className="font-bold text-sm">₹{order.total}</p>
                  <p className="text-[10px] text-white/40">{timeAgo(order.createdAt)}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <Link
          href="/admin/menu"
          className="group bg-night-card border border-white/5 rounded-2xl p-5 hover:border-gold/50 transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gold/20 flex items-center justify-center">
            <ChefHat size={22} className="text-gold" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Manage Menu</p>
            <p className="text-xs text-white/50">Add or edit food items</p>
          </div>
          <ArrowRight size={18} className="text-white/30 group-hover:text-gold transition" />
        </Link>

        <Link
          href="/admin/orders"
          className="group bg-night-card border border-white/5 rounded-2xl p-5 hover:border-fresh/50 transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-fresh/20 flex items-center justify-center">
            <CheckCircle2 size={22} className="text-fresh" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Manage Orders</p>
            <p className="text-xs text-white/50">Accept and track orders</p>
          </div>
          <ArrowRight size={18} className="text-white/30 group-hover:text-fresh transition" />
        </Link>
      </div>
    </div>
  )
}
