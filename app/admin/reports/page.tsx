'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  TrendingUp,
  IndianRupee,
  ShoppingBag,
  Package,
  Calendar,
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
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { type Order, type OrderStatus } from '@/lib/orders'

type TimeFilter = 'today' | 'week' | 'month' | 'all'

// Map DB → frontend Order format
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

// Color palette
const COLORS = {
  gold: '#F5B301',
  green: '#22C55E',
  blue: '#3B82F6',
  purple: '#A855F7',
  red: '#EF4444',
  pink: '#EC4899',
}

const PIE_COLORS = [COLORS.gold, COLORS.green, COLORS.blue, COLORS.purple, COLORS.red]

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

  // Filter orders by time
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

  // Stats
  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)
  const avgOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0
  const paidOrders = filteredOrders.filter((o) => o.paymentStatus === 'paid').length

  // Sales trend (last 7 days)
  const salesTrend = useMemo(() => {
    const days: { date: string; label: string; revenue: number; orders: number }[] = []
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

  // Top 5 items
  const topItems = useMemo(() => {
    const itemCounts: Record<string, { name: string; count: number; revenue: number; emoji: string }> = {}

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
        name: item.name.length > 18 ? item.name.slice(0, 18) + '...' : item.name,
        fullName: item.name,
        count: item.count,
        revenue: item.revenue,
        emoji: item.emoji,
      }))
  }, [filteredOrders])

  // Payment method breakdown
  const paymentBreakdown = useMemo(() => {
    const upi = filteredOrders.filter((o) => o.paymentMethod === 'upi')
    const cash = filteredOrders.filter((o) => o.paymentMethod === 'cash')
    const online = filteredOrders.filter((o) => o.paymentMethod === 'online')

    return [
      { name: 'UPI', value: upi.length, amount: upi.reduce((s, o) => s + o.total, 0) },
      { name: 'Cash', value: cash.length, amount: cash.reduce((s, o) => s + o.total, 0) },
      { name: 'Online', value: online.length, amount: online.reduce((s, o) => s + o.total, 0) },
    ].filter((x) => x.value > 0)
  }, [filteredOrders])

  // Order status distribution
  const statusBreakdown = useMemo(() => {
    const statuses: OrderStatus[] = ['placed', 'accepted', 'preparing', 'ready', 'delivered']
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
    return <div className="p-6 text-white/60 text-sm">Loading reports...</div>
  }

  const timeFilters: { id: TimeFilter; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'Last 7 Days' },
    { id: 'month', label: 'Last 30 Days' },
    { id: 'all', label: 'All Time' },
  ]

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Reports</h1>
          <p className="text-white/50 text-sm">
            Sales analytics & business insights • Live from database
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-white/40">
          <Calendar size={14} />
          <span>
            Last updated: {new Date().toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </span>
        </div>
      </div>

      {/* Time Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {timeFilters.map((f) => (
          <button
            key={f.id}
            onClick={() => setTimeFilter(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
              timeFilter === f.id
                ? 'bg-gold text-night'
                : 'bg-night-card border border-white/5 text-white/60 hover:border-gold/40 hover:text-gold'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6">
        <div className="bg-night-card border border-white/5 rounded-2xl p-4 md:p-5">
          <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center mb-3">
            <ShoppingBag size={20} className="text-gold" />
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-1">{totalOrders}</p>
          <p className="text-xs md:text-sm text-white/50">Total Orders</p>
        </div>

        <div className="bg-night-card border border-white/5 rounded-2xl p-4 md:p-5">
          <div className="w-10 h-10 rounded-full bg-fresh/10 flex items-center justify-center mb-3">
            <IndianRupee size={20} className="text-fresh" />
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-1">₹{totalRevenue}</p>
          <p className="text-xs md:text-sm text-white/50">Total Revenue</p>
        </div>

        <div className="bg-night-card border border-white/5 rounded-2xl p-4 md:p-5">
          <div className="w-10 h-10 rounded-full bg-blue-400/10 flex items-center justify-center mb-3">
            <TrendingUp size={20} className="text-blue-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-1">₹{avgOrderValue}</p>
          <p className="text-xs md:text-sm text-white/50">Avg Order Value</p>
        </div>

        <div className="bg-night-card border border-white/5 rounded-2xl p-4 md:p-5">
          <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center mb-3">
            <Package size={20} className="text-purple-400" />
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-1">
            {paidOrders}/{totalOrders}
          </p>
          <p className="text-xs md:text-sm text-white/50">Paid Orders</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-5 mb-6">
        {/* Sales Trend Line Chart */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            📈 Sales Trend (Last 7 Days)
          </h2>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <LineChart data={salesTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                <XAxis dataKey="label" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1C1C24',
                    border: '1px solid #F5B301',
                    borderRadius: '12px',
                    padding: '10px',
                  }}
                  labelStyle={{ color: '#F5B301', fontWeight: 'bold' }}
                  formatter={(value: any) => [`₹${value}`, 'Revenue']}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke={COLORS.gold}
                  strokeWidth={3}
                  dot={{ fill: COLORS.gold, r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Items Bar Chart */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            🍕 Top 5 Items (by Quantity)
          </h2>
          {topItems.length === 0 ? (
            <div className="text-center py-20 text-white/40 text-sm">
              No data yet
            </div>
          ) : (
            <div style={{ width: '100%', height: 280 }}>
              <ResponsiveContainer>
                <BarChart data={topItems} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a35" />
                  <XAxis type="number" stroke="#888" fontSize={12} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#888"
                    fontSize={11}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1C24',
                      border: '1px solid #F5B301',
                      borderRadius: '12px',
                      padding: '10px',
                    }}
                    labelStyle={{ color: '#F5B301', fontWeight: 'bold' }}
                    formatter={(value: any, name: any, props: any) => [
                      `${value} orders (₹${props.payload.revenue})`,
                      props.payload.fullName,
                    ]}
                  />
                  <Bar dataKey="count" fill={COLORS.gold} radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Payment Methods Pie Chart */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            💰 Payment Methods
          </h2>
          {paymentBreakdown.length === 0 ? (
            <div className="text-center py-20 text-white/40 text-sm">
              No payment data yet
            </div>
          ) : (
            <div style={{ width: '100%', height: 280 }}>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1C24',
                      border: '1px solid #F5B301',
                      borderRadius: '12px',
                      padding: '10px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Order Status Doughnut */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            📊 Order Status Distribution
          </h2>
          {statusBreakdown.length === 0 ? (
            <div className="text-center py-20 text-white/40 text-sm">
              No status data yet
            </div>
          ) : (
            <div style={{ width: '100%', height: 280 }}>
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
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1C1C24',
                      border: '1px solid #F5B301',
                      borderRadius: '12px',
                      padding: '10px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Footer note */}
      <div className="bg-night-card border border-white/5 rounded-2xl p-5 text-center text-xs text-white/40">
        💡 Data real-time hai — auto-refresh every 10 seconds
      </div>
    </div>
  )
}