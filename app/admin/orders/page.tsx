'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Phone,
  MapPin,
  Clock,
  Search,
  X,
  CheckCircle2,
  XCircle,
  IndianRupee,
} from 'lucide-react'
import { getOrders, type Order, type OrderStatus } from '@/lib/orders'

type FilterType = 'all' | OrderStatus

// Payment status colors
const paymentColors: Record<string, string> = {
  pending: 'bg-gold/20 text-gold',
  paid: 'bg-fresh/20 text-fresh',
  failed: 'bg-red-500/20 text-red-400',
  refunded: 'bg-purple-400/20 text-purple-400',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')
  const [search, setSearch] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Map DB format → frontend Order format
  const mapDbOrder = (o: any): Order => ({
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
  })

  const loadOrders = async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' })
      const data = await res.json()
      const dbOrders: Order[] = (data.orders || []).map(mapDbOrder)
      setOrders(dbOrders)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      setOrders(getOrders())
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
        }
      } else {
        console.error('Status update failed:', await res.text())
      }
    } catch (err) {
      console.error('Failed to update status:', err)
    }
  }

  const handleMarkAsPaid = async (order: Order) => {
    if (
      !confirm(
        `Confirm UPI payment received for #${order.orderNumber}?\n\nAmount: ₹${order.total}`
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
        if (data.order) {
          setSelectedOrder(mapDbOrder(data.order))
        }
      } else {
        console.error('Mark as paid failed:', await res.text())
      }
    } catch (err) {
      console.error('Failed to mark as paid:', err)
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
          Manage all customer orders • Auto-refresh every 5s • Live from database
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
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <p className="font-bold text-gold">#{order.orderNumber}</p>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        statusColors[order.status] || 'bg-white/10 text-white/60'
                      }`}
                    >
                      {statusLabel[order.status] || order.status}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        paymentColors[order.paymentStatus] || 'bg-white/10 text-white/60'
                      }`}
                    >
                      💰 {order.paymentStatus}
                    </span>
                    {order.transactionId && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-blue-500/20 text-blue-400 font-bold">
                        UTR: {order.transactionId}
                      </span>
                    )}
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

                {/* Mark as Paid button (only for pending UPI/Cash payments) */}
                {order.paymentStatus === 'pending' &&
                  (order.paymentMethod === 'upi' || order.paymentMethod === 'cash') && (
                    <button
                      onClick={() => handleMarkAsPaid(order)}
                      className="text-xs bg-blue-500 text-white font-bold px-4 py-2 rounded-full hover:bg-blue-600 transition flex items-center gap-1"
                    >
                      <IndianRupee size={14} /> Mark as Paid
                    </button>
                  )}

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
              {/* Status + Payment */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-white/40 mb-1">ORDER STATUS</p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold ${
                      statusColors[selectedOrder.status]
                    }`}
                  >
                    {statusLabel[selectedOrder.status]}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-white/40 mb-1">PAYMENT STATUS</p>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-bold uppercase ${
                      paymentColors[selectedOrder.paymentStatus]
                    }`}
                  >
                    💰 {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>

              {/* UTR / Transaction ID — PRIMARY CARD */}
              {selectedOrder.transactionId && (
                <div className="bg-gradient-to-br from-gold/10 to-gold/5 border border-gold/30 rounded-xl p-4">
                  <p className="text-xs text-gold font-bold mb-2">
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

              {/* If UPI but no transaction ID yet */}
              {!selectedOrder.transactionId &&
                selectedOrder.paymentMethod === 'upi' &&
                selectedOrder.paymentStatus === 'pending' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <p className="text-xs text-red-400 font-bold mb-1">
                      ⚠️ UTR NUMBER MISSING
                    </p>
                    <p className="text-xs text-white/60">
                      Customer ne transaction ID nahi daala. Contact karo:
                    </p>
                    <p className="text-sm text-white font-semibold mt-2">
                      📞 {selectedOrder.customer.mobile}
                    </p>
                  </div>
                )}

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
                    <div
                      key={it.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span>
                        {it.image} {it.name} × {it.quantity}
                      </span>
                      <span className="font-semibold">
                        ₹{it.price * it.quantity}
                      </span>
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

              {/* Mark as Paid in Modal */}
              {selectedOrder.paymentStatus === 'pending' &&
                (selectedOrder.paymentMethod === 'upi' ||
                  selectedOrder.paymentMethod === 'cash') && (
                  <button
                    onClick={() => handleMarkAsPaid(selectedOrder)}
                    className="w-full bg-blue-500 text-white font-bold py-3 rounded-full hover:bg-blue-600 transition flex items-center justify-center gap-2"
                  >
                    <IndianRupee size={18} /> Mark Payment as Received (₹
                    {selectedOrder.total})
                  </button>
                )}

              {/* Quick Actions */}
              <div>
                <p className="text-xs text-white/40 mb-2">CHANGE ORDER STATUS</p>
                <div className="flex flex-wrap gap-2">
                  {(
                    ['placed', 'accepted', 'preparing', 'ready', 'delivered'] as OrderStatus[]
                  ).map((s) => (
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}