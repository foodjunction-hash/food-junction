'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Package,
  Calendar,
  Sparkles,
  Activity,
  Loader2,
  BarChart3,
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { type Order, type OrderStatus } from '@/lib/orders'

type TimeFilter = 'today' | 'week' | 'month' | 'all'

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

const COLORS = {
  gold: '#F5B301',
  green: '#22C55E',
  blue: '#3B82F6',
  purple: '#A855F7',
  red: '#EF4444',
  pink: '#EC4899',
}

const PIE_COLORS = [
  COLORS.gold,
  COLORS.green,
  COLORS.blue,
  COLORS.purple,
  COLORS.red,
]

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('week')

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        const data = await res.json()
        setOrders((data.orders || []).map(mapDbOrder))
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      }
      setMounted(true)
    }

    loadOrders()
    const t = setInterval(loadOrders, 10000)
    return () => clearInterval(t)
  }, [])

  const filteredOrders = useMemo(() => {
    if (timeFilter === 'all') return orders

    const now = new Date()
    const cutoff = new Date()

    if (timeFilter === 'today') {
      cutoff.setHours(0, 0, 0, 0)
    } else if (timeFilter === 'week') {
      cutoff.setDate(now.getDate() - 7)
    } else if (timeFilter === 'month') {
      cutoff.setDate(now.getDate() - 30)
    }

    return orders.filter((o) => new Date(o.createdAt) >= cutoff)
  }, [orders, timeFilter])

  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue =
    totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const paidOrders = filteredOrders.filter(
    (o) => o.paymentStatus === 'paid'
  ).length

  const salesTrend = useMemo(() => {
    const days: {
      date: string
      label: string
      revenue: number
      orders: number
    }[] = []
    const today = new Date()

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      date.setHours(0, 0, 0, 0)

      const nextDay = new Date(date)
      nextDay.setDate(date.getDate() + 1)

      const dayOrders = orders.filter((o) => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= date && orderDate < nextDay
      })

      days.push({
        date: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        revenue: dayOrders.reduce((sum, o) => sum + o.total, 0),
        orders: dayOrders.length,
      })
    }

    return days
  }, [orders])

  const topItems = useMemo(() => {
    const itemCounts: Record<
      string,
      { name: string; count: number; revenue: number; emoji: string }
    > = {}

    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemCounts[item.id]) {
          itemCounts[item.id] = {
            name: item.name,
            emoji: item.image,
            count: 0,
            revenue: 0,
          }
        }
        itemCounts[item.id].count += item.quantity
        itemCounts[item.id].revenue += item.price * item.quantity
      })
    })

    return Object.values(itemCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => ({
        name:
          item.name.length > 18 ? item.name.slice(0, 18) + '...' : item.name,
        fullName: item.name,
        count: item.count,
        revenue: item.revenue,
        emoji: item.emoji,
      }))
  }, [filteredOrders])

  const paymentBreakdown = useMemo(() => {
    const upi = filteredOrders.filter((o) => o.paymentMethod === 'upi')
    const cash = filteredOrders.filter((o) => o.paymentMethod === 'cash')
    const online = filteredOrders.filter((o) => o.paymentMethod === 'online')

    return [
      {
        name: 'UPI',
        value: upi.length,
        amount: upi.reduce((s, o) => s + o.total, 0),
      },
      {
        name: 'Cash',
        value: cash.length,
        amount: cash.reduce((s, o) => s + o.total, 0),
      },
      {
        name: 'Online',
        value: online.length,
        amount: online.reduce((s, o) => s + o.total, 0),
      },
    ].filter((x) => x.value > 0)
  }, [filteredOrders])

  const statusBreakdown = useMemo(() => {
    const statuses: OrderStatus[] = [
      'placed',
      'accepted',
      'preparing',
      'ready',
      'delivered',
    ]
    const labels: Record<OrderStatus, string> = {
      placed: 'Placed',
      accepted: 'Accepted',
      preparing: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
    }

    return statuses
      .map((s) => ({
        name: labels[s],
        value: filteredOrders.filter((o) => o.status === s).length,
      }))
      .filter((x) => x.value > 0)
  }, [filteredOrders])

  if (!mounted) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} />
        Loading reports...
      </div>
    )
  }

  const timeFilters: { id: TimeFilter; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
    { id: 'all', label: 'All Time' },
  ]

  const statsData = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: ShoppingBag,
      gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
      border: 'border-amber-500/30',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
      color: 'text-gold',
      trend: 'in period',
    },
    {
      label: 'Total Revenue',
      value: `₹${totalRevenue}`,
      icon: IndianRupee,
      gradient: 'from-emerald-500/20 via-green-500/5 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
      color: 'text-fresh',
      trend: 'gross revenue',
    },
    {
      label: 'Avg Order Value',
      value: `₹${avgOrderValue}`,
      icon: TrendingUp,
      gradient: 'from-blue-500/20 via-cyan-500/5 to-transparent',
      border: 'border-blue-500/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-600',
      color: 'text-blue-400',
      trend: 'per order',
    },
    {
      label: 'Paid Orders',
      value: `${paidOrders}/${totalOrders}`,
      icon: Package,
      gradient: 'from-purple-500/20 via-pink-500/5 to-transparent',
      border: 'border-purple-500/30',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-600',
      color: 'text-purple-400',
      trend: `${totalOrders > 0 ? Math.round((paidOrders / totalOrders) * 100) : 0}% paid`,
    },
  ]

  const tooltipStyle = {
    backgroundColor: '#1C1C24',
    border: '1px solid #F5B301',
    borderRadius: '12px',
    padding: '10px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Reports
              </h1>
            </div>
            <p className="text-white/50 text-sm flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fresh animate-pulse" />
                Live updating
              </span>
              <span>•</span>
              <span>Sales analytics & business insights</span>
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/40 bg-white/5 px-3 py-2 rounded-full border border-white/5">
            <Calendar size={12} />
            <span>
              Last updated:{' '}
              {new Date().toLocaleTimeString('en-IN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        </div>

        {/* Time Filter Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {timeFilters.map((f, i) => (
            <button
              key={f.id}
              onClick={() => setTimeFilter(f.id)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 ${
                timeFilter === f.id
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-lg shadow-gold/30'
                  : 'bg-night-card/80 backdrop-blur-xl border border-white/5 text-white/60 hover:border-gold/40 hover:text-gold'
              }`}
              style={{
                animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
          {statsData.map((s, i) => (
            <div
              key={s.label}
              className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card/80 backdrop-blur-xl border ${s.border} rounded-2xl p-4 md:p-5 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-gold/10 overflow-hidden`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${0.15 + i * 0.08}s both`,
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

              <div className="relative z-10">
                <div
                  className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <s.icon size={20} className="text-night" strokeWidth={2.5} />
                </div>

                <p
                  className={`text-2xl md:text-3xl font-bold ${s.color} mb-1 tracking-tight`}
                >
                  {s.value}
                </p>
                <p className="text-xs md:text-sm text-white/60 font-medium">
                  {s.label}
                </p>
                <p className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">
                  {s.trend}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-5 mb-6">
          {/* Sales Trend */}
          <div
            className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-gold/30 transition-all duration-300 overflow-hidden"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.5s both' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/[0.02] to-transparent pointer-events-none" />

            <h2 className="font-bold mb-4 flex items-center gap-2 relative z-10">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                📈
              </span>
              Sales Trend (Last 7 Days)
            </h2>
            <div style={{ width: '100%', height: 280 }} className="relative z-10">
              <ResponsiveContainer>
                <LineChart data={salesTrend}>
                  <defs>
                    <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={COLORS.gold} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis
                    dataKey="label"
                    stroke="#888"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis stroke="#888" fontSize={12} tickLine={false} />
                  <Tooltip
                    contentStyle={tooltipStyle}
                    labelStyle={{ color: '#F5B301', fontWeight: 'bold' }}
                    formatter={(value: any) => [`₹${value}`, 'Revenue']}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke={COLORS.gold}
                    strokeWidth={3}
                    dot={{ fill: COLORS.gold, r: 5, strokeWidth: 2, stroke: '#1C1C24' }}
                    activeDot={{ r: 8, fill: COLORS.gold, stroke: '#1C1C24', strokeWidth: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top 5 Items */}
          <div
            className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-gold/30 transition-all duration-300 overflow-hidden"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.55s both' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/[0.02] to-transparent pointer-events-none" />

            <h2 className="font-bold mb-4 flex items-center gap-2 relative z-10">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                🍕
              </span>
              Top 5 Items (by Quantity)
            </h2>
            {topItems.length === 0 ? (
              <div className="text-center py-20 text-white/40 text-sm relative z-10">
                No data yet
              </div>
            ) : (
              <div
                style={{ width: '100%', height: 280 }}
                className="relative z-10"
              >
                <ResponsiveContainer>
                  <BarChart data={topItems} layout="vertical">
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor={COLORS.gold} stopOpacity={0.7} />
                        <stop offset="100%" stopColor={COLORS.gold} stopOpacity={1} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                    <XAxis type="number" stroke="#888" fontSize={12} tickLine={false} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      stroke="#888"
                      fontSize={11}
                      width={100}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={tooltipStyle}
                      labelStyle={{ color: '#F5B301', fontWeight: 'bold' }}
                      formatter={(value: any, name: any, props: any) => [
                        `${value} orders (₹${props.payload.revenue})`,
                        props.payload.fullName,
                      ]}
                    />
                    <Bar
                      dataKey="count"
                      fill="url(#barGradient)"
                      radius={[0, 8, 8, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Payment Methods */}
          <div
            className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-gold/30 transition-all duration-300 overflow-hidden"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.6s both' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/[0.02] to-transparent pointer-events-none" />

            <h2 className="font-bold mb-4 flex items-center gap-2 relative z-10">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                💰
              </span>
              Payment Methods
            </h2>
            {paymentBreakdown.length === 0 ? (
              <div className="text-center py-20 text-white/40 text-sm relative z-10">
                No payment data yet
              </div>
            ) : (
              <div
                style={{ width: '100%', height: 280 }}
                className="relative z-10"
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={paymentBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) =>
                        `${entry.name}: ${entry.value} (₹${entry.amount})`
                      }
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {paymentBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Order Status */}
          <div
            className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 hover:border-gold/30 transition-all duration-300 overflow-hidden"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.65s both' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/[0.02] to-transparent pointer-events-none" />

            <h2 className="font-bold mb-4 flex items-center gap-2 relative z-10">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                📊
              </span>
              Order Status Distribution
            </h2>
            {statusBreakdown.length === 0 ? (
              <div className="text-center py-20 text-white/40 text-sm relative z-10">
                No status data yet
              </div>
            ) : (
              <div
                style={{ width: '100%', height: 280 }}
                className="relative z-10"
              >
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry: any) => `${entry.name}: ${entry.value}`}
                      innerRadius={50}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusBreakdown.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="relative overflow-hidden bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-2xl p-5 text-center"
          style={{ animation: 'fadeInUp 0.5s ease-out 0.7s both' }}
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
          <p className="relative z-10 text-sm text-white/70 flex items-center justify-center gap-2 flex-wrap">
            <Activity size={14} className="text-gold" />
            <span className="text-gold font-semibold">Live data</span>
            <span>•</span>
            <span>Auto-refresh every 10 seconds</span>
            <span>•</span>
            <span>{orders.length} total orders in database</span>
          </p>
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