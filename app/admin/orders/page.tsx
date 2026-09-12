'use client'

import { useEffect, useState, useMemo } from 'react'
import { Phone, MapPin, Clock, Search, X, CheckCircle2, XCircle } from 'lucide-react'
import { getOrders, updateOrderStatus, type Order, type OrderStatus } from '@/lib/orders'

type FilterType = 'all' | OrderStatus

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  const loadOrders = () => {
    setOrders(getOrders())
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

  const handleStatusChange = (id: string, status: OrderStatus) => {
    const updated = updateOrderStatus(id, status)
    if (updated) {
      loadOrders()
      setSelectedOrder(updated)
    }
  }

  if (!mounted) {
    return <div className="p-6 text-white/60 text-sm">Loading orders...</div>
  }

  const statusColors: Record<string, string> = {
    placed: 'bg-gold/20 text-gold',
    accepted: 'bg-blue-400/20 text-blue-400',
    preparing: 'bg-purple-400/20 text-purple-400',
    ready: 'bg-fresh/20 text-fresh',
    delivered: 'bg-white/10 text-white/60',
  }

  const statusLabel: Record<string, string> = {
    placed: 'PLACED',
    accepted: 'ACCEPTED',
    preparing: 'PREPARING',
    ready: 'READY',
    delivered: 'DELIVERED',
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-1">Orders</h1>
        <p className="text-white/50 text-sm">
          Manage all customer orders • Auto-refresh every 5s
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {[
          { label: 'All', value: orders.length, status: 'all' as const, color: 'text-white' },
          { label: 'Placed', value: orders.filter((o) => o.status === 'placed').length, status: 'placed' as const, color: 'text-gold' },
          { label: 'Preparing', value: orders.filter((o) => o.status === 'preparing').length, status: 'preparing' as const, color: 'text-purple-400' },
          { label: 'Ready', value: orders.filter((o) => o.status === 'ready').length, status: 'ready' as const, color: 'text-fresh' },
          { label: 'Delivered', value: orders.filter((o) => o.status === 'delivered').length, status: 'delivered' as const, color: 'text-white/60' },
        ].map((s) => (
          <button
            key={s.label}
            onClick={() => setFilter(s.status)}
            className={`bg-night-card border rounded-2xl p-3 md:p-4 text-left transition ${
              filter === s.status ? 'border-gold' : 'border-white/5 hover:border-gold/40'
            }`}
          >
            <p className={`text-2xl md:text-3xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-white/50 mt-1">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search by order ID, name or mobile..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-night-card border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
          />
        </div>
      </div>

      {/* Orders List */}
      {filtered.length === 0 ? (
        <div className="bg-night-card border border-white/5 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-3">📭</div>
          <p className="text-white/60 mb-2">No orders found</p>
          <p className="text-white/40 text-xs">
            {search || filter !== 'all'
              ? 'Try changing filter or search'
              : 'Orders will appear here when customers place them'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div
              key={order.id}
              className="bg-night-card border border-white/5 rounded-2xl p-4 md:p-5 hover:border-gold/40 transition"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-bold text-gold">#{order.orderNumber}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        statusColors[order.status] || 'bg-white/10 text-white/60'
                      }`}
                    >
                      {statusLabel[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-xs text-white/40">
                    {new Date(order.createdAt).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl">₹{order.total}</p>
                  <p className="text-xs text-white/40 capitalize">
                    {order.paymentMethod}
                  </p>
                </div>
              </div>

              {/* Customer + Items summary */}
              <div className="grid md:grid-cols-2 gap-3 mb-3">
                <div className="bg-night rounded-xl p-3">
                  <p className="text-xs text-white/40 mb-1">CUSTOMER</p>
                  <p className="text-sm font-semibold">{order.customer.name}</p>
                  <p className="text-xs text-white/60 flex items-center gap-1 mt-0.5">
                    <Phone size={11} /> {order.customer.mobile}
                  </p>
                  {order.customer.address && (
                    <p className="text-xs text-white/60 flex items-start gap-1 mt-0.5">
                      <MapPin size={11} className="mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{order.customer.address}</span>
                    </p>
                  )}
                </div>
                <div className="bg-night rounded-xl p-3">
                  <p className="text-xs text-white/40 mb-1">
                    ITEMS ({order.items.length})
                  </p>
                  <div className="space-y-0.5">
                    {order.items.slice(0, 3).map((it) => (
                      <p key={it.id} className="text-xs text-white/70">
                        {it.image} {it.name} × {it.quantity}
                      </p>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-xs text-white/40">
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
                  className="text-xs bg-white/5 hover:bg-white/10 text-white/80 px-3 py-2 rounded-full transition"
                >
                  View Details
                </button>

                {order.status === 'placed' && (
                  <>
                    <button
                      onClick={() => handleStatusChange(order.id, 'accepted')}
                      className="text-xs bg-fresh text-night font-bold px-4 py-2 rounded-full hover:bg-fresh-dark transition flex items-center gap-1"
                    >
                      <CheckCircle2 size={14} /> ACCEPT
                    </button>
                    <button
                      onClick={() => handleStatusChange(order.id, 'delivered')}
                      className="text-xs bg-red-500/20 text-red-400 font-bold px-4 py-2 rounded-full hover:bg-red-500/30 transition flex items-center gap-1"
                    >
                      <XCircle size={14} /> REJECT
                    </button>
                  </>
                )}

                {order.status === 'accepted' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'preparing')}
                    className="text-xs bg-purple-400 text-night font-bold px-4 py-2 rounded-full hover:opacity-90 transition"
                  >
                    Start Preparing
                  </button>
                )}

                {order.status === 'preparing' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'ready')}
                    className="text-xs bg-gold text-night font-bold px-4 py-2 rounded-full hover:bg-gold-light transition"
                  >
                    Mark Ready
                  </button>
                )}

                {order.status === 'ready' && (
                  <button
                    onClick={() => handleStatusChange(order.id, 'delivered')}
                    className="text-xs bg-fresh text-night font-bold px-4 py-2 rounded-full hover:bg-fresh-dark transition"
                  >
                    Mark Delivered
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-night/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-night-card border border-white/10 rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-night-card border-b border-white/10 p-5 flex items-center justify-between">
              <div>
                <p className="font-bold text-gold">#{selectedOrder.orderNumber}</p>
                <p className="text-xs text-white/40 mt-0.5">
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
              <div>
                <p className="text-xs text-white/40 mb-1">STATUS</p>
                <span
                  className={`text-xs px-3 py-1 rounded-full font-bold ${
                    statusColors[selectedOrder.status]
                  }`}
                >
                  {statusLabel[selectedOrder.status]}
                </span>
              </div>

              {/* Customer */}
              <div className="bg-night rounded-xl p-4">
                <p className="text-xs text-white/40 mb-2">CUSTOMER DETAILS</p>
                <p className="font-bold mb-1">{selectedOrder.customer.name}</p>
                <p className="text-sm text-white/60 flex items-center gap-2 mb-1">
                  <Phone size={13} /> {selectedOrder.customer.mobile}
                </p>
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
                  <p className="text-sm text-gold mt-2">
                    📝 {selectedOrder.customer.instructions}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="bg-night rounded-xl p-4">
                <p className="text-xs text-white/40 mb-2">ORDER ITEMS</p>
                <div className="space-y-2">
                  {selectedOrder.items.map((it) => (
                    <div key={it.id} className="flex items-center justify-between text-sm">
                      <span>
                        {it.image} {it.name} × {it.quantity}
                      </span>
                      <span className="font-semibold">₹{it.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 mt-3 pt-3 space-y-1 text-sm">
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
                  <div className="flex justify-between font-bold text-lg pt-1">
                    <span>Total</span>
                    <span className="text-gold">₹{selectedOrder.total}</span>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="bg-night rounded-xl p-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-white/40">Order Type</p>
                  <p className="font-semibold capitalize">
                    {selectedOrder.orderType}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-white/40">Payment</p>
                  <p className="font-semibold capitalize">
                    {selectedOrder.paymentMethod} • {selectedOrder.paymentStatus}
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-2">
                {(['placed', 'accepted', 'preparing', 'ready', 'delivered'] as OrderStatus[]).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(selectedOrder.id, s)}
                      className={`text-xs px-3 py-1.5 rounded-full font-semibold transition ${
                        selectedOrder.status === s
                          ? 'bg-gold text-night'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {statusLabel[s]}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}