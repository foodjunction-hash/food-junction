'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  Home,
  ShoppingBag,
  UtensilsCrossed,
  CreditCard,
  Banknote,
  Smartphone,
  Loader2,
  Check,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import UPIQRCode from '@/components/UPIQRCode'
import { useCart } from '@/lib/store'
import {
  saveOrder,
  generateOrderId,
  generateOrderNumber,
  type Order,
  type OrderType,
  type PaymentMethod,
} from '@/lib/orders'

// ⚠️ APNA ACTUAL UPI ID YAHAN DAALO
const UPI_ID = '99733184212@ibl' // ← Apna UPI ID yahan daalo
const UPI_NAME = 'Food Junction'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCart((s) => s.items)
  const getSubtotal = useCart((s) => s.getSubtotal)
  const clearCart = useCart((s) => s.clear)

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    landmark: '',
    pincode: '',
    instructions: '',
    tableNumber: '',
    transactionId: '',
  })
  const [orderType, setOrderType] = useState<OrderType>('delivery')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const subtotal = getSubtotal()
  const deliveryCharge = orderType === 'delivery' && subtotal < 500 ? 30 : 0
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryCharge + tax

  const updateField = (key: string, value: string) => {
    setForm((s) => ({ ...s, [key]: value }))
    if (errors[key]) setErrors((e) => ({ ...e, [key]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name required'
    if (!/^\d{10}$/.test(form.mobile.trim()))
      e.mobile = 'Enter valid 10-digit mobile number'

    if (orderType === 'delivery') {
      if (!form.address.trim()) e.address = 'Address required'
      if (!/^\d{6}$/.test(form.pincode.trim()))
        e.pincode = 'Enter valid 6-digit pincode'
    }
    if (orderType === 'dinein' && !form.tableNumber.trim())
      e.tableNumber = 'Table number required'

    // UPI ke liye transaction ID required
    if (paymentMethod === 'upi') {
      if (!form.transactionId.trim())
        e.transactionId = 'Transaction ID required'
      else if (!/^\d{12}$/.test(form.transactionId.trim()))
        e.transactionId = '12-digit UTR number daalo'
    }

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handlePlaceOrder = async () => {
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)

    const orderId = generateOrderId()
    const orderNumber = generateOrderNumber()

    // Payment status: 'paid' if online, else 'pending'
    const paymentStatus =
      paymentMethod === 'cash' || paymentMethod === 'upi' ? 'pending' : 'paid'

    const orderPayload: Order = {
      id: orderId,
      orderNumber,
      createdAt: new Date().toISOString(),
      items: items.map((i) => ({
        id: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        image: i.image,
      })),
      subtotal,
      deliveryCharge,
      tax,
      total,
      orderType,
      paymentMethod,
      paymentStatus,
      status: 'placed',
      transactionId: form.transactionId.trim() || undefined,
      customer: {
        name: form.name.trim(),
        mobile: form.mobile.trim(),
        email: form.email.trim() || undefined,
        address: form.address.trim() || undefined,
        landmark: form.landmark.trim() || undefined,
        pincode: form.pincode.trim() || undefined,
        instructions: form.instructions.trim() || undefined,
        tableNumber: form.tableNumber.trim() || undefined,
      },
    }

    // Save to Supabase via API
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      })
      if (!res.ok) {
        console.error('Failed to save order to DB:', await res.text())
      }
    } catch (err) {
      console.error('API error:', err)
    }

    // Save to localStorage (backup)
    saveOrder(orderPayload)

    // Small delay for UX
    await new Promise((r) => setTimeout(r, 800))

    clearCart()
    router.push(`/order-success?id=${orderId}`)
  }

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-7xl mb-4">🛒</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              Cart is Empty
            </h1>
            <p className="text-white/60 mb-6">Add items before checkout</p>
            <Link
              href="/menu"
              className="inline-flex bg-gold text-night font-bold px-6 py-3 rounded-full hover:bg-gold-light transition"
            >
              Browse Menu
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-4">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <Link
              href="/cart"
              className="inline-flex items-center gap-1 text-sm text-white/60 hover:text-gold mb-2 transition"
            >
              <ArrowLeft size={16} /> Back to Cart
            </Link>
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-gradient-gold">Checkout</span>
            </h1>
            <p className="text-white/50 text-sm mt-1">
              Fill your details to place the order
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* LEFT – Form */}
            <div className="lg:col-span-2 space-y-5">
              {/* Order Type */}
              <div className="bg-night-card rounded-2xl border border-white/5 p-5">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <Home size={18} className="text-gold" /> Order Type
                </h2>
                <div className="grid grid-cols-3 gap-2 md:gap-3">
                  {[
                    { id: 'delivery', label: 'Home Delivery', icon: Home },
                    { id: 'takeaway', label: 'Takeaway', icon: ShoppingBag },
                    { id: 'dinein', label: 'Dine-in', icon: UtensilsCrossed },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setOrderType(opt.id as OrderType)}
                      className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl border-2 transition ${
                        orderType === opt.id
                          ? 'border-gold bg-gold/10 text-gold'
                          : 'border-white/10 text-white/70 hover:border-gold/40'
                      }`}
                    >
                      <opt.icon size={22} />
                      <span className="text-xs md:text-sm font-semibold text-center">
                        {opt.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Customer Details */}
              <div className="bg-night-card rounded-2xl border border-white/5 p-5">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <User size={18} className="text-gold" /> Customer Details
                </h2>

                <div className="space-y-4">
                  {/* Name */}
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User
                        size={16}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                      />
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="Enter your name"
                        className={`w-full bg-night border rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none transition ${
                          errors.name
                            ? 'border-red-500'
                            : 'border-white/10 focus:border-gold/50'
                        }`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Mobile + Email */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                        />
                        <input
                          type="tel"
                          value={form.mobile}
                          onChange={(e) =>
                            updateField(
                              'mobile',
                              e.target.value.replace(/\D/g, '').slice(0, 10)
                            )
                          }
                          placeholder="10-digit mobile"
                          className={`w-full bg-night border rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none transition ${
                            errors.mobile
                              ? 'border-red-500'
                              : 'border-white/10 focus:border-gold/50'
                          }`}
                        />
                      </div>
                      {errors.mobile && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.mobile}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm text-white/70 mb-1.5">
                        Email (optional)
                      </label>
                      <div className="relative">
                        <Mail
                          size={16}
                          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40"
                        />
                        <input
                          type="email"
                          value={form.email}
                          onChange={(e) => updateField('email', e.target.value)}
                          placeholder="you@example.com"
                          className="w-full bg-night border border-white/10 rounded-xl pl-10 pr-3 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery fields */}
                  {orderType === 'delivery' && (
                    <>
                      <div>
                        <label className="block text-sm text-white/70 mb-1.5">
                          Delivery Address *
                        </label>
                        <div className="relative">
                          <MapPin
                            size={16}
                            className="absolute left-3.5 top-3 text-white/40"
                          />
                          <textarea
                            value={form.address}
                            onChange={(e) =>
                              updateField('address', e.target.value)
                            }
                            placeholder="House / Street / Area"
                            rows={2}
                            className={`w-full bg-night border rounded-xl pl-10 pr-3 py-3 text-sm focus:outline-none transition resize-none ${
                              errors.address
                                ? 'border-red-500'
                                : 'border-white/10 focus:border-gold/50'
                            }`}
                          />
                        </div>
                        {errors.address && (
                          <p className="text-red-400 text-xs mt-1">
                            {errors.address}
                          </p>
                        )}
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-white/70 mb-1.5">
                            Landmark
                          </label>
                          <input
                            type="text"
                            value={form.landmark}
                            onChange={(e) =>
                              updateField('landmark', e.target.value)
                            }
                            placeholder="Near..."
                            className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="block text-sm text-white/70 mb-1.5">
                            Pincode *
                          </label>
                          <input
                            type="text"
                            value={form.pincode}
                            onChange={(e) =>
                              updateField(
                                'pincode',
                                e.target.value.replace(/\D/g, '').slice(0, 6)
                              )
                            }
                            placeholder="6-digit pincode"
                            className={`w-full bg-night border rounded-xl px-4 py-3 text-sm focus:outline-none transition ${
                              errors.pincode
                                ? 'border-red-500'
                                : 'border-white/10 focus:border-gold/50'
                            }`}
                          />
                          {errors.pincode && (
                            <p className="text-red-400 text-xs mt-1">
                              {errors.pincode}
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  )}

                  {/* Table Number (Dine-in) */}
                  {orderType === 'dinein' && (
                    <div>
                      <label className="block text-sm text-white/70 mb-1.5">
                        Table Number *
                      </label>
                      <input
                        type="text"
                        value={form.tableNumber}
                        onChange={(e) =>
                          updateField('tableNumber', e.target.value)
                        }
                        placeholder="e.g. 5"
                        className={`w-full bg-night border rounded-xl px-4 py-3 text-sm focus:outline-none transition ${
                          errors.tableNumber
                            ? 'border-red-500'
                            : 'border-white/10 focus:border-gold/50'
                        }`}
                      />
                      {errors.tableNumber && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.tableNumber}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Instructions */}
                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">
                      Special Instructions
                    </label>
                    <textarea
                      value={form.instructions}
                      onChange={(e) =>
                        updateField('instructions', e.target.value)
                      }
                      placeholder="Any special requests? (e.g., less spicy, no onion)"
                      rows={2}
                      className="w-full bg-night border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-night-card rounded-2xl border border-white/5 p-5">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <CreditCard size={18} className="text-gold" /> Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      id: 'cash',
                      label: 'Cash on Delivery',
                      desc: 'Pay when you receive the order',
                      icon: Banknote,
                    },
                    {
                      id: 'upi',
                      label: 'UPI',
                      desc: 'Google Pay, PhonePe, Paytm',
                      icon: Smartphone,
                    },
                    {
                      id: 'online',
                      label: 'Online Payment',
                      desc: 'Card / Net Banking (Coming soon)',
                      icon: CreditCard,
                    },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => setPaymentMethod(opt.id as PaymentMethod)}
                      disabled={opt.id === 'online'}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition ${
                        paymentMethod === opt.id
                          ? 'border-gold bg-gold/10'
                          : 'border-white/10 hover:border-gold/40'
                      } ${opt.id === 'online' ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          paymentMethod === opt.id
                            ? 'bg-gold text-night'
                            : 'bg-white/5 text-gold'
                        }`}
                      >
                        <opt.icon size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-sm">{opt.label}</p>
                        <p className="text-xs text-white/50">{opt.desc}</p>
                      </div>
                      {paymentMethod === opt.id && (
                        <div className="w-6 h-6 rounded-full bg-gold text-night flex items-center justify-center">
                          <Check size={14} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* UPI QR Code Section */}
              {paymentMethod === 'upi' && (
                <UPIQRCode
                  upiId={UPI_ID}
                  name={UPI_NAME}
                  amount={total}
                  note={`Order from Food Junction`}
                />
              )}

              {/* Transaction ID Input (for UPI) */}
              {paymentMethod === 'upi' && (
                <div className="bg-night-card rounded-2xl border border-white/5 p-5">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Check size={18} className="text-gold" /> Payment Confirmation
                  </h2>

                  <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-xs text-gold mb-4">
                    ⚠️ Payment karne ke baad UPI app me{' '}
                    <strong>Transaction ID (UTR)</strong> milega. Usko yahan daalo
                    — admin verify karega.
                  </div>

                  <label className="block text-sm text-white/70 mb-1.5">
                    Transaction ID / UTR Number *
                  </label>
                  <input
                    type="text"
                    value={form.transactionId}
                    onChange={(e) =>
                      updateField(
                        'transactionId',
                        e.target.value.replace(/\D/g, '').slice(0, 12)
                      )
                    }
                    placeholder="12-digit UTR (e.g. 412345678901)"
                    className={`w-full bg-night border rounded-xl px-4 py-3 text-sm focus:outline-none transition font-mono ${
                      errors.transactionId
                        ? 'border-red-500'
                        : 'border-white/10 focus:border-gold/50'
                    }`}
                  />
                  {errors.transactionId && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.transactionId}
                    </p>
                  )}

                  <div className="bg-night rounded-xl p-3 mt-3 text-xs text-white/50 space-y-1">
                    <p>
                      📱 <span className="text-white/70">PhonePe:</span> Payment
                      history → Tap transaction
                    </p>
                    <p>
                      📱 <span className="text-white/70">GPay:</span> Transaction
                      → UTR number
                    </p>
                    <p>
                      📱 <span className="text-white/70">Paytm:</span> Passbook →
                      Order details
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT – Summary */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 bg-night-card rounded-2xl border border-white/5 p-5">
                <h2 className="font-bold mb-4">Order Summary</h2>

                <div className="space-y-2 max-h-52 overflow-y-auto mb-4 pr-1">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="text-2xl">{item.image}</span>
                      <span className="flex-1 truncate">{item.name}</span>
                      <span className="text-white/60">×{item.quantity}</span>
                      <span className="font-semibold">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 text-sm py-4 border-t border-white/10">
                  <div className="flex justify-between">
                    <span className="text-white/60">Subtotal</span>
                    <span className="font-semibold">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Delivery</span>
                    <span
                      className={
                        deliveryCharge === 0
                          ? 'text-fresh font-semibold'
                          : 'font-semibold'
                      }
                    >
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Tax (5%)</span>
                    <span className="font-semibold">₹{tax}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-white/10">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-2xl text-gold">₹{total}</span>
                </div>

                {/* UPI selected warning */}
                {paymentMethod === 'upi' && (
                  <div className="bg-gold/10 border border-gold/30 rounded-xl px-3 py-2 text-xs text-gold mb-3">
                    💡 UPI se pay karne ke baad order place karo. Admin manually
                    verify karega.
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="w-full bg-gold text-night font-bold py-4 rounded-full hover:bg-gold-light transition shadow-gold flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Placing
                      Order...
                    </>
                  ) : (
                    <>
                      {paymentMethod === 'upi'
                        ? `I've Paid • Place Order`
                        : `Place Order • ₹${total}`}
                    </>
                  )}
                </button>

                <p className="text-center text-xs text-white/40 mt-3">
                  🔒 Your details are safe with us
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}