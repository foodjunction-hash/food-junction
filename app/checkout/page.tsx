'use client'

import { useState, useEffect } from 'react'
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
  AlertCircle,
  Power,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import UPIQRCode from '@/components/UPIQRCode'
import { useCart } from '@/lib/store'
import { supabase } from '@/lib/supabase'
import {
  generateOrderId,
  generateOrderNumber,
  type Order,
  type OrderType,
  type PaymentMethod,
} from '@/lib/orders'

const UPI_ID = '9973318421@ibl'
const UPI_NAME = 'Food Junction'

export default function CheckoutPage() {
  const router = useRouter()
  const items = useCart((s) => s.items)
  const getSubtotal = useCart((s) => s.getSubtotal)
  const clearCart = useCart((s) => s.clear)

  const [checkingAuth, setCheckingAuth] = useState(true)
  const [restaurantOpen, setRestaurantOpen] = useState<boolean | null>(null)
  const [serviceStatus, setServiceStatus] = useState<
    Record<string, { enabled: boolean; message: string }>
  >({
    delivery: { enabled: true, message: '' },
    takeaway: { enabled: true, message: '' },
    dinein: { enabled: true, message: '' },
  })
  const [servicesLoading, setServicesLoading] = useState(true)
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

  // ============================================
  // LOGIN GUARD
  // ============================================
  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login?redirect=/checkout')
        return
      }

      const meta = user.user_metadata || {}
      const name = meta.full_name || meta.name || ''
      const mobile = meta.phone || ''

      setForm((prev) => ({
        ...prev,
        name: prev.name || name,
        mobile: prev.mobile || mobile,
        email: prev.email || user.email || '',
      }))

      setCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  // ============================================
  // LOAD RESTAURANT STATUS
  // ============================================
  useEffect(() => {
    const loadRestaurantStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('settings')
          .select('is_open')
          .eq('id', 'main')
          .maybeSingle()

        if (error) throw error
        setRestaurantOpen(data?.is_open ?? true)
      } catch (err) {
        console.error('Failed to load restaurant status:', err)
        setRestaurantOpen(true) // fallback assume open
      }
    }

    loadRestaurantStatus()

    // Poll every 30 seconds
    const interval = setInterval(loadRestaurantStatus, 30000)

    // Realtime subscription
    const channel = supabase
      .channel('checkout-settings')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'settings' },
        (payload: any) => {
          if (payload.new?.is_open !== undefined) {
            setRestaurantOpen(payload.new.is_open)
          }
        }
      )
      .subscribe()

    return () => {
      clearInterval(interval)
      supabase.removeChannel(channel)
    }
  }, [])

  // ============================================
  // LOAD SERVICES STATUS
  // ============================================
  useEffect(() => {
    const loadServices = async () => {
      try {
        const { data, error } = await supabase
          .from('services')
          .select('id, is_enabled, coming_soon_message')

        if (error) throw error

        const status: Record<string, { enabled: boolean; message: string }> = {
          delivery: { enabled: true, message: '' },
          takeaway: { enabled: true, message: '' },
          dinein: { enabled: true, message: '' },
        }

        data?.forEach((s: any) => {
          status[s.id] = {
            enabled: s.is_enabled,
            message: s.coming_soon_message || 'Coming soon!',
          }
        })

        setServiceStatus(status)
      } catch (err) {
        console.error('Failed to load services:', err)
      }
      setServicesLoading(false)
    }
    loadServices()
  }, [])

  // ============================================
  // AUTO-SET ORDER TYPE
  // ============================================
  useEffect(() => {
    if (servicesLoading) return
    if (!serviceStatus[orderType]?.enabled) {
      const firstEnabled = (
        ['delivery', 'takeaway', 'dinein'] as OrderType[]
      ).find((t) => serviceStatus[t]?.enabled)
      if (firstEnabled) {
        setOrderType(firstEnabled)
      }
    }
  }, [servicesLoading, serviceStatus])

  const subtotal = getSubtotal()
  const deliveryCharge = orderType === 'delivery' && subtotal < 500 ? 30 : 0
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + deliveryCharge + tax

  const currentServiceDisabled = !serviceStatus[orderType]?.enabled
  const isRestaurantClosed = restaurantOpen === false

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
    // ✅ Check restaurant status before placing order
    if (isRestaurantClosed) {
      alert(
        '🔴 Restaurant is currently CLOSED.\n\nOrders are not being accepted right now. Please try again later.'
      )
      return
    }

    if (currentServiceDisabled) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setLoading(true)

    const orderId = generateOrderId()
    const orderNumber = generateOrderNumber()

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

    await new Promise((r) => setTimeout(r, 800))

    try {
      await fetch('/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: '9973318421',
          contentType: 'template',
          contentSid: process.env.NEXT_PUBLIC_TWILIO_TEMPLATE_ORDER_PLACED,
          contentVariables: {
            1: orderNumber,
            2: form.name.trim(),
            3: form.mobile.trim(),
            4: String(total),
            5: items.map((i) => `${i.name} x${i.quantity}`).join(', '),
          },
        }),
      })
    } catch (err) {
      console.error('Admin WhatsApp notification failed:', err)
    }

    if (typeof window !== 'undefined') {
      sessionStorage.setItem('fj-last-order-id', orderId)
      sessionStorage.setItem('fj-last-order-number', orderNumber)
    }

    clearCart()
    router.push(`/order-success?id=${orderNumber}`)
  }

  if (checkingAuth || servicesLoading || restaurantOpen === null) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="animate-spin text-gold mx-auto mb-3" size={32} />
            <p className="text-white/60 text-sm">Loading checkout...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // ✅ Restaurant CLOSED - show blocking screen
  if (isRestaurantClosed) {
    return (
      <>
        <Header />
        <main className="min-h-[70vh] flex items-center justify-center py-20 relative">
          {/* Background glow */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-red-500/5 rounded-full blur-[100px] animate-pulse" />
          </div>

          <div className="relative z-10 text-center max-w-lg mx-auto px-4">
            {/* Icon */}
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-red-500/40 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-2xl shadow-red-500/40 border-4 border-red-400/30">
                <Power size={44} className="text-white" strokeWidth={2.5} />
              </div>
            </div>

            {/* Title */}
            <div className="mb-4">
              <span className="inline-block text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-3">
                ● Currently Closed
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Restaurant is <span className="text-red-400">Closed</span>
              </h1>
              <p className="text-white/60 text-sm md:text-base">
                We&apos;re not accepting orders right now. Please come back
                later or call us for more info.
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <a
                href="tel:+919973318421"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-fresh to-emerald-600 text-night font-bold px-6 py-3.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-fresh/20"
              >
                <Phone size={18} /> Call Restaurant
              </a>
              <Link
                href="/"
                className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 font-semibold px-6 py-3.5 rounded-full transition-all border border-white/10 hover:border-white/20"
              >
                <ArrowLeft size={18} /> Back to Home
              </Link>
            </div>

            {/* Info */}
            <div className="mt-8 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 text-left">
              <p className="text-xs text-white/50 uppercase tracking-wider font-bold mb-2">
                💡 What can you do?
              </p>
              <ul className="text-sm text-white/70 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Call us to check when we&apos;re opening
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Save items in cart and order later
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gold">•</span>
                  Follow us for updates
                </li>
              </ul>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center py-20">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="text-7xl mb-4">🛒</div>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">Cart is Empty</h1>
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
                  ].map((opt) => {
                    const status = serviceStatus[opt.id]
                    const isDisabled = !status?.enabled
                    return (
                      <button
                        key={opt.id}
                        onClick={() =>
                          !isDisabled && setOrderType(opt.id as OrderType)
                        }
                        disabled={isDisabled}
                        className={`flex flex-col items-center gap-2 p-3 md:p-4 rounded-xl border-2 transition relative ${
                          isDisabled
                            ? 'border-white/5 text-white/30 cursor-not-allowed bg-white/5'
                            : orderType === opt.id
                            ? 'border-gold bg-gold/10 text-gold'
                            : 'border-white/10 text-white/70 hover:border-gold/40'
                        }`}
                      >
                        <opt.icon size={22} />
                        <span className="text-xs md:text-sm font-semibold text-center">
                          {opt.label}
                        </span>
                        {isDisabled && (
                          <span className="absolute top-1 right-1 text-[8px] bg-red-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                            SOON
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>

                {currentServiceDisabled && (
                  <div className="mt-4 flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                    <AlertCircle
                      size={18}
                      className="text-red-400 flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="font-bold text-red-400 text-sm mb-1">
                        Service Unavailable
                      </p>
                      <p className="text-xs text-white/70">
                        {serviceStatus[orderType]?.message ||
                          'This service is currently unavailable. Please choose another option.'}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Customer Details */}
              <div className="bg-night-card rounded-2xl border border-white/5 p-5">
                <h2 className="font-bold mb-4 flex items-center gap-2">
                  <User size={18} className="text-gold" /> Customer Details
                </h2>

                <div className="space-y-4">
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

                  <div>
                    <label className="block text-sm text-white/70 mb-1.5">
                      Special Instructions
                    </label>
                    <textarea
                      value={form.instructions}
                      onChange={(e) =>
                        updateField('instructions', e.target.value)
                      }
                      placeholder="Any special requests?"
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
                      } ${
                        opt.id === 'online'
                          ? 'opacity-50 cursor-not-allowed'
                          : ''
                      }`}
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

              {paymentMethod === 'upi' && (
                <UPIQRCode
                  upiId={UPI_ID}
                  name={UPI_NAME}
                  amount={total}
                  note={`Order from Food Junction`}
                />
              )}

              {paymentMethod === 'upi' && (
                <div className="bg-night-card rounded-2xl border border-white/5 p-5">
                  <h2 className="font-bold mb-4 flex items-center gap-2">
                    <Check size={18} className="text-gold" /> Payment Confirmation
                  </h2>

                  <div className="bg-gold/10 border border-gold/30 rounded-xl px-4 py-3 text-xs text-gold mb-4">
                    ⚠️ Payment karne ke baad UPI app me{' '}
                    <strong>Transaction ID (UTR)</strong> milega. Usko yahan
                    daalo.
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
                    placeholder="12-digit UTR"
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

                {paymentMethod === 'upi' && (
                  <div className="bg-gold/10 border border-gold/30 rounded-xl px-3 py-2 text-xs text-gold mb-3">
                    💡 UPI se pay karne ke baad order place karo.
                  </div>
                )}

                {currentServiceDisabled && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-3 py-2 text-xs text-red-300 mb-3">
                    ⚠️ Selected service is unavailable.
                  </div>
                )}

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || currentServiceDisabled}
                  className="w-full bg-gold text-night font-bold py-4 rounded-full hover:bg-gold-light transition shadow-gold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" /> Placing
                      Order...
                    </>
                  ) : currentServiceDisabled ? (
                    <>Service Unavailable</>
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