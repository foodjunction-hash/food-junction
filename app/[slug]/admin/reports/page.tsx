'use client'

import { useEffect, useState, useMemo } from 'react'
import { useParams } from 'next/navigation'
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Users,
  Calendar,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Sparkles,
  Package,
  ChefHat,
} from 'lucide-react'
import { useRestaurant } from '@/lib/restaurantContext'
import AdminLoading from '@/components/AdminLoading'

export default function AdminReportsPage() {
  const params = useParams()
  const slug = (params?.slug as string) || ''
  const { restaurant, loading: contextLoading } = useRestaurant()
  const [orders, setOrders] = useState<any[]>([])
  const [mounted, setMounted] = useState(false)
  const [period, setPeriod] = useState<'today' | 'week' | 'month' | 'all'>('week')

  useEffect(() => {
    if (!slug) return
    fetchOrders()
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

  const filteredOrders = useMemo(() => {
    const now = new Date()
    return orders.filter((o) => {
      const orderDate = new Date(o.created_at)
      if (period === 'today') {
        return orderDate.toDateString() === now.toDateString()
      }
      if (period === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        return orderDate >= weekAgo
      }
      if (period === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        return orderDate >= monthAgo
      }
      return true
    })
  }, [orders, period])

  const stats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce(
      (sum, o) => sum + (o.total || 0),
      0
    )
    const totalOrders = filteredOrders.length
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0
    const deliveredOrders = filteredOrders.filter(
      (o) => o.status === 'delivered'
    ).length
    const uniqueCustomers = new Set(
      filteredOrders.map((o) => o.customer_mobile)
    ).size

    return {
      totalRevenue,
      totalOrders,
      avgOrderValue: Math.round(avgOrderValue),
      deliveredOrders,
      uniqueCustomers,
    }
  }, [filteredOrders])

  const topItems = useMemo(() => {
    const itemMap = new Map<string, { name: string; image: string; count: number; revenue: number }>()
    filteredOrders.forEach((order) => {
      (order.items || []).forEach((item: any) => {
        const key = item.name
        const existing = itemMap.get(key) || {
          name: item.name,
          image: item.image || '🍽️',
          count: 0,
          revenue: 0,
        }
        existing.count += item.quantity || 1
        existing.revenue += (item.price || 0) * (item.quantity || 1)
        itemMap.set(key, existing)
      })
    })
    return Array.from(itemMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [filteredOrders])

  // 🚨 KHATARNAK LOADING SCREEN
  if (contextLoading || !mounted) {
    return <AdminLoading message="Analyzing Reports" />
  }

  const periods = [
    { id: 'today' as const, label: 'Today' },
    { id: 'week' as const, label: 'Last 7 Days' },
    { id: 'month' as const, label: 'Last 30 Days' },
    { id: 'all' as const, label: 'All Time' },
  ]

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-gold animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
              Reports & Analytics
            </h1>
          </div>
          <p className="text-white/50 text-sm">
            {restaurant?.name || 'Restaurant'} ka business overview
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex flex-wrap gap-2 mb-6 bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-full p-1.5 max-w-2xl">
          {periods.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`flex-1 py-2.5 px-4 rounded-full text-sm font-bold transition ${
                period === p.id
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-night'
                  : 'text-white/60 hover:text-gold'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6">
          <div className="bg-night-card border border-white/5 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mb-3">
              <IndianRupee size={18} className="text-night" />
            </div>
            <p className="text-3xl font-bold text-fresh mb-1">
              ₹{stats.totalRevenue}
            </p>
            <p className="text-xs text-white/50">Total Revenue</p>
          </div>

          <div className="bg-night-card border border-white/5 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-yellow-600 flex items-center justify-center mb-3">
              <ShoppingBag size={18} className="text-night" />
            </div>
            <p className="text-3xl font-bold text-gold mb-1">
              {stats.totalOrders}
            </p>
            <p className="text-xs text-white/50">Total Orders</p>
          </div>

          <div className="bg-night-card border border-white/5 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-600 flex items-center justify-center mb-3">
              <TrendingUp size={18} className="text-night" />
            </div>
            <p className="text-3xl font-bold text-blue-400 mb-1">
              ₹{stats.avgOrderValue}
            </p>
            <p className="text-xs text-white/50">Avg Order Value</p>
          </div>

          <div className="bg-night-card border border-white/5 rounded-2xl p-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center mb-3">
              <Users size={18} className="text-night" />
            </div>
            <p className="text-3xl font-bold text-purple-400 mb-1">
              {stats.uniqueCustomers}
            </p>
            <p className="text-xs text-white/50">Unique Customers</p>
          </div>
        </div>

        {/* Top Items */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <ChefHat size={18} className="text-gold" />
              Top Selling Items
            </h2>
            <span className="text-xs text-white/40 bg-white/5 px-3 py-1 rounded-full">
              Top 5
            </span>
          </div>

          {topItems.length === 0 ? (
            <div className="text-center py-12">
              <Package size={48} className="text-gold/30 mx-auto mb-3" />
              <p className="text-white/60 text-sm">No sales data yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topItems.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-xl bg-night border border-white/5"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold text-sm flex-shrink-0">
                    #{i + 1}
                  </div>
                  <div className="text-3xl flex-shrink-0">{item.image}</div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-white/40">
                      {item.count} orders
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-bold text-gold text-sm">
                      ₹{item.revenue}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-fresh">
                      <ArrowUpRight size={10} />
                      <span>{Math.round((item.count / stats.totalOrders) * 100)}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          <div className="bg-night-card border border-white/5 rounded-2xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
              Delivered Orders
            </p>
            <p className="text-2xl font-bold text-fresh">
              {stats.deliveredOrders}
            </p>
          </div>

          <div className="bg-night-card border border-white/5 rounded-2xl p-5">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
              Success Rate
            </p>
            <p className="text-2xl font-bold text-gold">
              {stats.totalOrders > 0
                ? Math.round((stats.deliveredOrders / stats.totalOrders) * 100)
                : 0}
              %
            </p>
          </div>

          <div className="bg-night-card border border-white/5 rounded-2xl p-5 col-span-2 md:col-span-1">
            <p className="text-xs text-white/40 uppercase tracking-wider mb-2">
              Period
            </p>
            <p className="text-2xl font-bold text-white capitalize">
              {period}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}