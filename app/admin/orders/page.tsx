'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Phone,
  MapPin,
  Search,
  X,
  CheckCircle2,
  XCircle,
  IndianRupee,
  Loader2,
  Clock,
  Users,
  Activity,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { type Order, type OrderStatus } from '@/lib/orders'

type FilterType = 'all' | OrderStatus

const paymentColors: Record<string, string> = {
  pending: 'bg-gold/20 text-gold border border-gold/30',
  paid: 'bg-fresh/20 text-fresh border border-fresh/30',
  failed: 'bg-red-500/20 text-red-400 border border-red-500/30',
  refunded: 'bg-purple-400/20 text-purple-400 border border-purple-400/30',
}

const statusColors: Record<string, string> = {
  placed: 'bg-gold/20 text-gold border border-gold/30',
  accepted: 'bg-blue-400/20 text-blue-400 border border-blue-400/30',
  preparing: 'bg-purple-400/20 text-purple-400 border border-purple-400/30',
  ready: 'bg-fresh/20 text-fresh border border-fresh/30',
  delivered: 'bg-white/10 text-white/60 border border-white/20',
}

const statusLabel: Record<string, string> = {
  placed: 'PLACED',
  accepted: 'ACCEPTED',
  preparing: 'PREPARING',
  ready: 'READY',
  delivered: 'DELIVERED',
}

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      const dbOrders: Order[] = (data.orders || []).map(mapDbOrder)
      setOrders(dbOrders)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  useEffect(() => {
    loadOrders()
    setMounted(true)
    const t = setInterval(loadOrders, 5000)
    return () => clearInterval(t)
  }, [])

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (filter !== 'all' && o.status !== filter) return false
      if (search) {
        const s = search.toLowerCase()
        return (
          o.orderNumber.toLowerCase().includes(s) ||
          o.customer.name.toLowerCase().includes(s) ||
          o.customer.mobile.includes(s)
        )
      }
      return true
    })
  }, [orders, filter, search])

  const handleStatusChange = async (id: string, status: OrderStatus) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        const data = await res.json()
        await loadOrders()
        if (data.order) {
          setSelectedOrder(mapDbOrder(data.order))

          if (status === 'accepted' || status === 'delivered') {
            const order = mapDbOrder(data.order)
            const template =
              status === 'accepted'
                ? process.env.NEXT_PUBLIC_TWILIO_TEMPLATE_ORDER_ACCEPTED
                : process.env.NEXT_PUBLIC_TWILIO_TEMPLATE_ORDER_DELIVERED

            try {
              await fetch('/api/whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  to: order.customer.mobile,
                  contentType: 'template',
                  contentSid: template,
                  contentVariables: {
                    1: order.customer.name,
                    2: order.orderNumber,
                    3: String(order.total),
                  },
                }),
              })
            } catch (err) {
              console.error('Customer WhatsApp notification failed:', err)
            }
          }
        }
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleMarkAsPaid = async (order: Order) => {
    if (
      !confirm(
        `Confirm payment received for #${order.orderNumber}?\n\nAmount: ₹${order.total}`
      )
    )
      return

    try {
      const res = await fetch(`/api/orders?id=${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: 'paid' }),
      })

      if (res.ok) {
        const data = await res.json()
        await loadOrders()
        if (data.order) setSelectedOrder(mapDbOrder(data.order))
      }
    } catch (err) {
      console.error('Failed to mark as paid:', err)
    }
  }

  if (!mounted) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} />
        Loading orders...
      </div>
    )
  }

  const statsData = [
    {
      label: 'All Orders',
      value: orders.length,
      status: 'all' as const,
      icon: Activity,
      gradient: 'from-white/10 via-white/5 to-transparent',
      border: 'border-white/20',
      iconBg: 'bg-gradient-to-br from-gray-400 to-gray-600',
      color: 'text-white',
      trend: orders.length > 0 ? `+${orders.filter((o) => new Date(o.createdAt).toDateString() === new Date().toDateString()).length} today` : 'no orders',
    },
    {
      label: 'Placed',
      value: orders.filter((o) => o.status === 'placed').length,
      status: 'placed' as const,
      icon: Clock,
      gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
      border: 'border-amber-500/30',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
      color: 'text-gold',
      trend: 'needs action',
    },
    {
      label: 'Preparing',
      value: orders.filter((o) => o.status === 'preparing').length,
      status: 'preparing' as const,
      icon: Activity,
      gradient: 'from-purple-500/20 via-pink-500/5 to-transparent',
      border: 'border-purple-500/30',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-600',
      color: 'text-purple-400',
      trend: 'in kitchen',
    },
    {
      label: 'Ready',
      value: orders.filter((o) => o.status === 'ready').length,
      status: 'ready' as const,
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 via-green-500/5 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
      color: 'text-fresh',
      trend: 'to deliver',
    },
    {
      label: 'Delivered',
      value: orders.filter((o) => o.status === 'delivered').length,
      status: 'delivered' as const,
      icon: Users,
      gradient: 'from-blue-500/20 via-cyan-500/5 to-transparent',
      border: 'border-blue-500/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-600',
      color: 'text-blue-400',
      trend: 'completed',
    },
  ]

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      {/* Animated Background Effects */}
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
              Orders
            </h1>
          </div>
          <p className="text-white/50 text-sm flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-fresh animate-pulse" />
              Live updating
            </span>
            <span>•</span>
            <span>Auto-refresh every 5s</span>
            <span>•</span>
            <span>{orders.length} total orders</span>
          </p>
        </div>

        {/* Animated Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mb-6">
          {statsData.map((s, i) => (
            <button
              key={s.label}
              onClick={() => setFilter(s.status)}
              className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card border ${s.border} rounded-2xl p-3 md:p-4 text-left transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-gold/10 overflow-hidden ${
                filter === s.status
                  ? 'ring-2 ring-gold ring-offset-2 ring-offset-night scale-[1.02]'
                  : ''
              }`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both`,
              }}
            >
              {/* Glow on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-lg ${s.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                  >
                    <s.icon size={16} className="text-night" strokeWidth={2.5} />
                  </div>
                </div>

                <p className={`text-2xl md:text-3xl font-bold ${s.color} mb-0.5 tracking-tight`}>
                  {s.value}
                </p>
                <p className="text-[10px] md:text-xs text-white/50 font-medium">
                  {s.label}
                </p>
                <p className="text-[9px] text-white/30 mt-0.5 uppercase tracking-wider">
                  {s.trend}
                </p>
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold transition-colors"
            />
            <input
              type="text"
              placeholder="Search by order ID, name or mobile..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-night-card/80 backdrop-blur-xl border border-white/10 rounded-full pl-11 pr-11 py-3 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition"
              >
                <X size={14} className="text-white/40" />
              </button>
            )}
          </div>
        </div>

        {/* Orders List */}
        {filtered.length === 0 ? (
          <div
            className="bg-night-card border border-white/5 rounded-2xl p-12 text-center"
            style={{ animation: 'fadeInUp 0.5s ease-out' }}
          >
            <div className="text-6xl mb-4 animate-bounce">📭</div>
            <p className="text-white/60 mb-2 text-lg">No orders found</p>
            <p className="text-white/40 text-sm">
              {search || filter !== 'all'
                ? 'Try changing filter or search'
                : 'Orders will appear here when customers place them'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((order, i) => (
              <div
                key={order.id}
                className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 md:p-5 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/5 transition-all duration-300 overflow-hidden"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both`,
                }}
              >
                {/* Hover gradient overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/[0.03] to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <p className="font-bold text-gold group-hover:text-gold-light transition-colors">
                          #{order.orderNumber}
                        </p>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide ${
                            statusColors[order.status] ||
                            'bg-white/10 text-white/60'
                          }`}
                        >
                          {statusLabel[order.status] || order.status}
                        </span>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                            paymentColors[order.paymentStatus] ||
                            'bg-white/10 text-white/60'
                          }`}
                        >
                          💰 {order.paymentStatus}
                        </span>
                        {order.transactionId && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold">
                            UTR: {order.transactionId}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/40 flex items-center gap-1.5">
                        <Clock size={11} />
                        {timeAgo(order.createdAt)} •{' '}
                        {new Date(order.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-2xl bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                        ₹{order.total}
                      </p>
                      <p className="text-[10px] text-white/40 capitalize uppercase tracking-wide">
                        {order.paymentMethod}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 mb-3">
                    {/* Customer */}
                    <div className="bg-night/60 backdrop-blur rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-white/40 mb-1.5 uppercase tracking-wider font-bold flex items-center gap-1">
                        <Users size={10} /> Customer
                      </p>
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold text-xs flex-shrink-0">
                          {order.customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold truncate">
                            {order.customer.name}
                          </p>
                          <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                            <Phone size={10} /> {order.customer.mobile}
                          </p>
                        </div>
                      </div>
                      {order.customer.address && (
                        <p className="text-xs text-white/50 flex items-start gap-1 mt-2">
                          <MapPin size={10} className="mt-0.5 flex-shrink-0" />
                          <span className="line-clamp-1">
                            {order.customer.address}
                          </span>
                        </p>
                      )}
                    </div>

                    {/* Items */}
                    <div className="bg-night/60 backdrop-blur rounded-xl p-3 border border-white/5">
                      <p className="text-[10px] text-white/40 mb-1.5 uppercase tracking-wider font-bold">
                        📦 Items ({order.items.length})
                      </p>
                      <div className="space-y-1">
                        {order.items.slice(0, 3).map((it) => (
                          <p
                            key={it.id}
                            className="text-xs text-white/70 flex items-center justify-between"
                          >
                            <span className="truncate">
                              {it.image} {it.name}
                            </span>
                            <span className="text-white/50 ml-2 flex-shrink-0">
                              × {it.quantity}
                            </span>
                          </p>
                        ))}
                        {order.items.length > 3 && (
                          <p className="text-[10px] text-gold/60 italic">
                            + {order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="text-xs bg-white/5 hover:bg-white/10 text-white/80 px-3.5 py-2 rounded-full transition flex items-center gap-1.5 group/btn"
                    >
                      View Details
                      <ArrowRight
                        size={12}
                        className="group-hover/btn:translate-x-0.5 transition-transform"
                      />
                    </button>

                    {order.paymentStatus === 'pending' &&
                      (order.paymentMethod === 'upi' ||
                        order.paymentMethod === 'cash') && (
                        <button
                          onClick={() => handleMarkAsPaid(order)}
                          className="text-xs bg-blue-500/90 text-white font-bold px-3.5 py-2 rounded-full hover:bg-blue-500 transition flex items-center gap-1.5 shadow-lg shadow-blue-500/20 hover:scale-105"
                        >
                          <IndianRupee size={13} /> Mark Paid
                        </button>
                      )}

                    {order.status === 'placed' && (
                      <>
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, 'accepted')
                          }
                          className="text-xs bg-gradient-to-r from-fresh to-emerald-500 text-night font-bold px-4 py-2 rounded-full hover:opacity-90 transition flex items-center gap-1.5 shadow-lg shadow-fresh/20 hover:scale-105"
                        >
                          <CheckCircle2 size={13} /> ACCEPT
                        </button>
                        <button
                          onClick={() =>
                            handleStatusChange(order.id, 'delivered')
                          }
                          className="text-xs bg-red-500/20 text-red-400 font-bold px-3.5 py-2 rounded-full hover:bg-red-500/30 transition flex items-center gap-1.5 border border-red-500/30"
                        >
                          <XCircle size={13} /> REJECT
                        </button>
                      </>
                    )}

                    {order.status === 'accepted' && (
                      <button
                        onClick={() =>
                          handleStatusChange(order.id, 'preparing')
                        }
                        className="text-xs bg-gradient-to-r from-purple-400 to-pink-500 text-night font-bold px-4 py-2 rounded-full hover:opacity-90 transition shadow-lg shadow-purple-500/20 hover:scale-105"
                      >
                        👨‍🍳 Start Preparing
                      </button>
                    )}

                    {order.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'ready')}
                        className="text-xs bg-gradient-to-r from-gold to-yellow-500 text-night font-bold px-4 py-2 rounded-full hover:opacity-90 transition shadow-lg shadow-gold/20 hover:scale-105"
                      >
                        🍽️ Mark Ready
                      </button>
                    )}

                    {order.status === 'ready' && (
                      <button
                        onClick={() => handleStatusChange(order.id, 'delivered')}
                        className="text-xs bg-gradient-to-r from-fresh to-emerald-500 text-night font-bold px-4 py-2 rounded-full hover:opacity-90 transition shadow-lg shadow-fresh/20 hover:scale-105"
                      >
                        🎉 Mark Delivered
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-night/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-night-card border border-gold/20 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl shadow-gold/10 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-night-card/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-gold text-lg flex items-center gap-2">
                  <Sparkles size={16} />
                  #{selectedOrder.orderNumber}
                </p>
                <p className="text-xs text-white/40 mt-0.5 flex items-center gap-1.5">
                  <Clock size={11} />
                  {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-white/40 mb-1.5 uppercase tracking-wider">
                    Order Status
                  </p>
                  <span
                    className={`inline-block text-xs px-3 py-1.5 rounded-full font-bold tracking-wide ${
                      statusColors[selectedOrder.status]
                    }`}
                  >
                    {statusLabel[selectedOrder.status]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1.5 uppercase tracking-wider">
                    Payment Status
                  </p>
                  <span
                    className={`inline-block text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide ${
                      paymentColors[selectedOrder.paymentStatus]
                    }`}
                  >
                    💰 {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* UTR */}
              {selectedOrder.transactionId && (
                <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-4">
                  <p className="text-xs text-gold font-bold mb-2 flex items-center gap-1.5">
                    💳 UPI TRANSACTION ID / UTR
                  </p>
                  <p className="font-mono font-bold text-gold text-2xl break-all">
                    {selectedOrder.transactionId}
                  </p>
                  <p className="text-xs text-white/60 mt-2">
                    ✓ Customer ne ye UTR diya hai — UPI app me verify karo
                  </p>
                </div>
              )}

              {/* Customer */}
              <div className="bg-night/60 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-white/40 mb-3 uppercase tracking-wider font-bold flex items-center gap-1.5">
                  <Users size={11} /> Customer Details
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold text-lg flex-shrink-0">
                    {selectedOrder.customer.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold">{selectedOrder.customer.name}</p>
                    <p className="text-sm text-white/60 flex items-center gap-1.5">
                      <Phone size={12} /> {selectedOrder.customer.mobile}
                    </p>
                  </div>
                </div>
                {selectedOrder.customer.email && (
                  <p className="text-sm text-white/60 mb-1">
                    ✉️ {selectedOrder.customer.email}
                  </p>
                )}
                {selectedOrder.customer.address && (
                  <p className="text-sm text-white/60 flex items-start gap-2 mt-2">
                    <MapPin size={13} className="mt-0.5 flex-shrink-0" />
                    <span>
                      {selectedOrder.customer.address}
                      {selectedOrder.customer.landmark &&
                        `, ${selectedOrder.customer.landmark}`}
                      {selectedOrder.customer.pincode &&
                        ` - ${selectedOrder.customer.pincode}`}
                    </span>
                  </p>
                )}
                {selectedOrder.customer.tableNumber && (
                  <p className="text-sm text-white/60 mt-2">
                    🍽️ Table No: {selectedOrder.customer.tableNumber}
                  </p>
                )}
                {selectedOrder.customer.instructions && (
                  <p className="text-sm text-gold mt-2 bg-gold/10 border border-gold/20 rounded-lg px-3 py-2">
                    📝 {selectedOrder.customer.instructions}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="bg-night/60 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-white/40 mb-3 uppercase tracking-wider font-bold">
                  📦 Order Items
                </p>
                <div className="space-y-2">
                  {selectedOrder.items.map((it) => (
                    <div
                      key={it.id}
                      className="flex items-center justify-between text-sm py-1 border-b border-white/5 last:border-0"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg">{it.image}</span>
                        <span>{it.name}</span>
                        <span className="text-white/40">× {it.quantity}</span>
                      </span>
                      <span className="font-semibold">
                        ₹{it.price * it.quantity}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-3 pt-3 space-y-1.5 text-sm">
                  <div className="flex justify-between text-white/60">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Delivery</span>
                    <span>
                      {selectedOrder.deliveryCharge === 0
                        ? 'FREE'
                        : `₹${selectedOrder.deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-white/60">
                    <span>Tax</span>
                    <span>₹{selectedOrder.tax}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                    <span>Total</span>
                    <span className="text-gold">
                      ₹{selectedOrder.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mark Paid */}
              {selectedOrder.paymentStatus === 'pending' &&
                (selectedOrder.paymentMethod === 'upi' ||
                  selectedOrder.paymentMethod === 'cash') && (
                  <button
                    onClick={() => handleMarkAsPaid(selectedOrder)}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-3 rounded-full hover:opacity-90 transition flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:scale-[1.02]"
                  >
                    <IndianRupee size={18} /> Mark Payment as Received (₹
                    {selectedOrder.total})
                  </button>
                )}

              {/* Change Status */}
              <div>
                <p className="text-xs text-white/40 mb-2 uppercase tracking-wider font-bold">
                  Change Order Status
                </p>
                <div className="flex flex-wrap gap-2">
                  {(
                    [
                      'placed',
                      'accepted',
                      'preparing',
                      'ready',
                      'delivered',
                    ] as OrderStatus[]
                  ).map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedOrder.id, s)}
                      className={`text-xs px-3.5 py-2 rounded-full font-semibold transition-all ${
                        selectedOrder.status === s
                          ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-lg shadow-gold/20 scale-105'
                          : 'bg-white/5 text-white/70 hover:bg-white/10 hover:scale-105'
                      }`}
                    >
                      {statusLabel[s]}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}