'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  ClipboardList,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Package,
  ChefHat,
  Loader2,
  Sparkles,
  Users,
  Activity,
  CheckCircle2,
  Clock,
} from 'lucide-react'
import { getRestaurantAdminSession } from '@/lib/auth'

export default function RestaurantAdminDashboard() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const [orders, setOrders] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    setSession(getRestaurantAdminSession())
    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [slug])

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders?slug=${slug}`, { cache: 'no-store' })
      const data = await res.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
    setMounted(true)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchOrders()
    setRefreshing(false)
  }

  if (!mounted) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} />
        Loading dashboard...
      </div>
    )
  }

  const today = new Date().toDateString()
  const todayOrders = orders.filter(
    (o) => new Date(o.created_at).toDateString() === today
  )
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0)
  const todayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0)

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      icon: ClipboardList,
      gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
      border: 'border-amber-500/30',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue}`,
      icon: IndianRupee,
      gradient: 'from-emerald-500/20 via-green-500/5 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: TrendingUp,
      gradient: 'from-blue-500/20 via-cyan-500/5 to-transparent',
      border: 'border-blue-500/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-600',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: Package,
      gradient: 'from-purple-500/20 via-pink-500/5 to-transparent',
      border: 'border-purple-500/30',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-600',
    },
  ]

  const statusCount = {
    placed: orders.filter((o) => o.status === 'placed').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  const statusData = [
    { label: 'Placed', value: statusCount.placed, emoji: '📝', color: 'text-gold' },
    { label: 'Accepted', value: statusCount.accepted, emoji: '✅', color: 'text-blue-400' },
    { label: 'Preparing', value: statusCount.preparing, emoji: '👨‍🍳', color: 'text-purple-400' },
    { label: 'Ready', value: statusCount.ready, emoji: '🍽️', color: 'text-fresh' },
    { label: 'Delivered', value: statusCount.delivered, emoji: '🎉', color: 'text-white/70' },
  ]

  const restaurantName = session?.restaurantName || 'Restaurant'

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                {restaurantName}
              </h1>
            </div>
            <p className="text-white/50 text-sm flex items-center gap-2">
              <Activity size={14} className="text-fresh" />
              Welcome back, {session?.username || 'Admin'}! Here&apos;s your dashboard.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-night-card border border-white/10 hover:border-gold/50 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50"
          >
            <Loader2 size={14} className={refreshing ? 'animate-spin text-gold' : 'text-gold'} />
            Refresh
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card border ${s.border} rounded-2xl p-5 overflow-hidden transition-all duration-500 hover:scale-[1.03]`}
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}>
                  <s.icon size={22} className="text-night" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">{s.value}</p>
              <p className="text-xs md:text-sm text-white/60 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Status */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6 md:mb-8">
          <h2 className="font-bold flex items-center gap-2 text-lg mb-5">
            <Activity size={18} className="text-gold" />
            Order Status
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {statusData.map((s, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition">
                <div className="text-3xl mb-2">{s.emoji}</div>
                <p className={`text-2xl font-bold ${s.color} mb-1`}>{s.value}</p>
                <p className="text-xs text-white/50">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <Clock size={18} className="text-gold" /> Recent Orders
            </h2>
            <Link
              href={`/${slug}/admin/orders`}
              className="text-sm text-gold hover:text-gold-light transition flex items-center gap-1 group"
            >
              View All
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-white/60 text-sm mb-2">No orders yet</p>
              <p className="text-white/40 text-xs">
                Orders will appear here when customers place them
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-night border border-white/5 hover:border-gold/50 transition"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-sm text-gold truncate">
                        #{order.order_number}
                      </p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-gold/20 text-gold">
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 truncate flex items-center gap-2">
                      <Users size={11} className="text-gold/60" />
                      {order.customer_name} • {order.customer_mobile}
                    </p>
                  </div>
                  <p className="font-bold text-sm ml-3">₹{order.total}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-5">
          <Link
            href={`/${slug}/admin/menu`}
            className="relative group bg-night-card border border-white/5 rounded-2xl p-5 hover:border-gold/50 transition-all flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChefHat size={24} className="text-gold" />
            </div>
            <div className="flex-1">
              <p className="font-bold mb-0.5 text-lg">Manage Menu</p>
              <p className="text-xs text-white/50">Add, edit, delete food items</p>
            </div>
            <ArrowRight size={18} className="text-white/40 group-hover:text-gold group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href={`/${slug}/admin/orders`}
            className="relative group bg-night-card border border-white/5 rounded-2xl p-5 hover:border-fresh/50 transition-all flex items-center gap-4"
          >
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fresh/30 to-fresh/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 size={24} className="text-fresh" />
            </div>
            <div className="flex-1">
              <p className="font-bold mb-0.5 text-lg">Manage Orders</p>
              <p className="text-xs text-white/50">Accept, reject, track orders</p>
            </div>
            <ArrowRight size={18} className="text-white/40 group-hover:text-fresh group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}