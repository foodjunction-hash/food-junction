'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Package,
  ChefHat,
  Loader2,
  Sparkles,
  Users,
  Activity,
} from 'lucide-react'
import { type Order } from '@/lib/orders'

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        const data = await res.json()

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
        console.error('Failed to fetch orders:', err)
      }
      setMounted(true)
    }

    fetchOrders()
    const interval = setInterval(fetchOrders, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
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
      console.error(err)
    }
    setRefreshing(false)
  }

  if (!mounted) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin" size={16} />
        Loading dashboard...
      </div>
    )
  }

  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today
  )
  const yesterdayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === yesterday
  )

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0)
  const yesterdayRevenue = yesterdayOrders.reduce((sum, o) => sum + o.total, 0)

  // Calculate trends
  const ordersTrend = yesterdayOrders.length
    ? Math.round(
        ((todayOrders.length - yesterdayOrders.length) /
          yesterdayOrders.length) *
          100
      )
    : todayOrders.length > 0
    ? 100
    : 0

  const revenueTrend = yesterdayRevenue
    ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : todayRevenue > 0
    ? 100
    : 0

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      icon: ClipboardList,
      gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
      border: 'border-amber-500/30',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
      iconColor: 'text-night',
      trend: ordersTrend,
      trendLabel: 'vs yesterday',
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue}`,
      icon: IndianRupee,
      gradient: 'from-emerald-500/20 via-green-500/5 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
      iconColor: 'text-night',
      trend: revenueTrend,
      trendLabel: 'vs yesterday',
    },
    {
      label: 'Total Orders',
      value: orders.length,
      icon: TrendingUp,
      gradient: 'from-blue-500/20 via-cyan-500/5 to-transparent',
      border: 'border-blue-500/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-600',
      iconColor: 'text-night',
      trend: null,
      trendLabel: 'all time',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: Package,
      gradient: 'from-purple-500/20 via-pink-500/5 to-transparent',
      border: 'border-purple-500/30',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-600',
      iconColor: 'text-night',
      trend: null,
      trendLabel: 'all time',
    },
  ]

  const statusCount = {
    placed: orders.filter((o) => o.status === 'placed').length,
    accepted: orders.filter((o) => o.status === 'accepted').length,
    preparing: orders.filter((o) => o.status === 'preparing').length,
    ready: orders.filter((o) => o.status === 'ready').length,
    delivered: orders.filter((o) => o.status === 'delivered').length,
  }

  const totalOrdersForProgress = orders.length || 1

  const statusData = [
    {
      label: 'Placed',
      value: statusCount.placed,
      emoji: '📝',
      color: 'text-gold',
      bg: 'from-gold/30 to-gold/10',
      barColor: 'bg-gradient-to-r from-amber-400 to-yellow-600',
    },
    {
      label: 'Accepted',
      value: statusCount.accepted,
      emoji: '✅',
      color: 'text-blue-400',
      bg: 'from-blue-400/30 to-blue-400/10',
      barColor: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    },
    {
      label: 'Preparing',
      value: statusCount.preparing,
      emoji: '👨‍🍳',
      color: 'text-purple-400',
      bg: 'from-purple-400/30 to-purple-400/10',
      barColor: 'bg-gradient-to-r from-purple-400 to-pink-500',
    },
    {
      label: 'Ready',
      value: statusCount.ready,
      emoji: '🍽️',
      color: 'text-fresh',
      bg: 'from-fresh/30 to-fresh/10',
      barColor: 'bg-gradient-to-r from-emerald-400 to-green-600',
    },
    {
      label: 'Delivered',
      value: statusCount.delivered,
      emoji: '🎉',
      color: 'text-white/70',
      bg: 'from-white/20 to-white/5',
      barColor: 'bg-gradient-to-r from-gray-400 to-gray-600',
    },
  ]

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      {/* Animated Background Effects */}
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
                Dashboard
              </h1>
            </div>
            <p className="text-white/50 text-sm flex items-center gap-2">
              <Activity size={14} className="text-fresh" />
              Welcome back, Admin! Here&apos;s what&apos;s happening today.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 bg-night-card border border-white/10 hover:border-gold/50 px-4 py-2.5 rounded-full text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50"
          >
            <Loader2
              size={14}
              className={refreshing ? 'animate-spin text-gold' : 'text-gold'}
            />
            Refresh
          </button>
        </div>

        {/* Stats Cards with Animations */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card border ${s.border} rounded-2xl p-5 overflow-hidden transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-gold/10 cursor-pointer`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
              }}
            >
              {/* Glow effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <s.icon size={22} className={s.iconColor} strokeWidth={2.5} />
                  </div>
                  {s.trend !== null && s.trend !== 0 && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold ${
                        s.trend > 0
                          ? 'bg-fresh/20 text-fresh'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {s.trend > 0 ? (
                        <TrendingUp size={10} />
                      ) : (
                        <TrendingDown size={10} />
                      )}
                      {Math.abs(s.trend)}%
                    </div>
                  )}
                </div>

                <p className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">
                  {s.value}
                </p>
                <p className="text-xs md:text-sm text-white/60 font-medium">
                  {s.label}
                </p>
                {s.trend !== null && (
                  <p className="text-[10px] text-white/30 mt-1">
                    {s.trendLabel}
                  </p>
                )}
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Status Overview with Progress Bars */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6 md:mb-8 hover:border-gold/20 transition-colors">
          <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <Activity size={18} className="text-gold" />
              Order Status Overview
            </h2>
            <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
              {orders.length} total orders
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {statusData.map((s, i) => (
              <div
                key={i}
                className="relative group text-center p-4 rounded-xl bg-gradient-to-br from-white/[0.02] to-transparent hover:from-white/[0.05] transition-all duration-300"
                style={{
                  animation: `fadeInUp 0.5s ease-out ${0.4 + i * 0.08}s both`,
                }}
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300 inline-block">
                  {s.emoji}
                </div>
                <p className={`text-3xl font-bold ${s.color} mb-1`}>
                  {s.value}
                </p>
                <p className="text-xs text-white/50 font-medium mb-3">
                  {s.label}
                </p>

                {/* Progress bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${s.barColor} rounded-full transition-all duration-1000`}
                    style={{
                      width: `${(s.value / totalOrdersForProgress) * 100}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6 md:mb-8 hover:border-gold/20 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <Clock size={18} className="text-gold" /> Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-sm text-gold hover:text-gold-light transition flex items-center gap-1 group"
            >
              View All
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3 animate-bounce">📭</div>
              <p className="text-white/60 text-sm mb-2">No orders yet</p>
              <p className="text-white/40 text-xs">
                Orders will appear here once customers place them
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {orders.slice(0, 5).map((order, i) => (
                <Link
                  key={order.id}
                  href="/admin/orders"
                  className="flex items-center justify-between p-3.5 rounded-xl bg-night border border-white/5 hover:border-gold/50 hover:bg-night-soft transition-all duration-300 group"
                  style={{
                    animation: `fadeInUp 0.4s ease-out ${0.6 + i * 0.05}s both`,
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-bold text-sm text-gold truncate group-hover:text-gold-light">
                        #{order.orderNumber}
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          order.status === 'delivered'
                            ? 'bg-fresh/20 text-fresh'
                            : order.status === 'placed'
                            ? 'bg-gold/20 text-gold'
                            : order.status === 'preparing'
                            ? 'bg-purple-400/20 text-purple-400'
                            : 'bg-blue-400/20 text-blue-400'
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 truncate flex items-center gap-2">
                      <Users size={11} className="text-gold/60" />
                      {order.customer.name} • {order.customer.mobile}
                    </p>
                  </div>
                  <div className="text-right ml-3 flex items-center gap-3">
                    <div>
                      <p className="font-bold text-sm">₹{order.total}</p>
                      <p className="text-[10px] text-white/40">
                        {timeAgo(order.createdAt)}
                      </p>
                    </div>
                    <ArrowRight
                      size={16}
                      className="text-white/20 group-hover:text-gold group-hover:translate-x-1 transition-all"
                    />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-5">
          <Link
            href="/admin/menu"
            className="relative group bg-night-card border border-white/5 rounded-2xl p-5 hover:border-gold/50 transition-all duration-300 flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ChefHat
                size={24}
                className="text-gold group-hover:rotate-12 transition-transform"
              />
            </div>
            <div className="flex-1 relative">
              <p className="font-bold mb-0.5 text-lg">Manage Menu</p>
              <p className="text-xs text-white/50">
                Add, edit, delete food items
              </p>
            </div>
            <ArrowRight
              size={18}
              className="relative text-white/40 group-hover:text-gold group-hover:translate-x-1 transition-all"
            />
          </Link>

          <Link
            href="/admin/orders"
            className="relative group bg-night-card border border-white/5 rounded-2xl p-5 hover:border-fresh/50 transition-all duration-300 flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fresh/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-fresh/30 to-fresh/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2
                size={24}
                className="text-fresh group-hover:rotate-12 transition-transform"
              />
            </div>
            <div className="flex-1 relative">
              <p className="font-bold mb-0.5 text-lg">Manage Orders</p>
              <p className="text-xs text-white/50">
                Accept, reject, track orders
              </p>
            </div>
            <ArrowRight
              size={18}
              className="relative text-white/40 group-hover:text-fresh group-hover:translate-x-1 transition-all"
            />
          </Link>
        </div>
      </div>

      {/* Animations */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}