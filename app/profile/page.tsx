'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Phone,
  Mail,
  Package,
  LogOut,
  ShoppingBag,
  ArrowRight,
  Clock,
  Loader2,
  Sparkles,
  Activity,
  CheckCircle2,
  IndianRupee,
  TrendingUp,
} from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { type Order } from '@/lib/orders'

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

const statusColors: Record<string, string> = {
  placed: 'bg-gold/20 text-gold border border-gold/30',
  accepted: 'bg-blue-400/20 text-blue-400 border border-blue-400/30',
  preparing: 'bg-purple-400/20 text-purple-400 border border-purple-400/30',
  ready: 'bg-fresh/20 text-fresh border border-fresh/30',
  delivered: 'bg-white/10 text-white/60 border border-white/20',
}

type ProfileUser = {
  name: string
  email: string
  mobile: string
  avatarUrl?: string
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

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<ProfileUser | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const load = async () => {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser()

      if (error || !authUser) {
        router.push('/login')
        return
      }

      const meta = authUser.user_metadata || {}
      const profileData: ProfileUser = {
        name: meta.full_name || meta.name || 'Customer',
        email: authUser.email || '',
        mobile: meta.phone || '',
        avatarUrl: meta.avatar_url || meta.picture,
      }

      const { data: customerRow } = await supabase
        .from('customers')
        .select('name, mobile, email')
        .eq('auth_user_id', authUser.id)
        .maybeSingle()

      if (customerRow) {
        profileData.name = customerRow.name || profileData.name
        profileData.mobile = customerRow.mobile || profileData.mobile
        profileData.email = customerRow.email || profileData.email
      }

      setUser(profileData)

      try {
        const res = await fetch('/api/orders?mine=true', { cache: 'no-store' })
        const data = await res.json()
        const myOrders: Order[] = (data.orders || []).map(mapDbOrder)
        setOrders(myOrders)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      }

      setMounted(true)
    }

    load()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        router.push('/login')
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (!mounted || !user) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="animate-spin text-gold" size={32} />
        </main>
        <Footer />
      </>
    )
  }

  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status !== 'delivered').length

  const statsData = [
    {
      label: 'Total Orders',
      value: totalOrders,
      icon: Package,
      gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
      border: 'border-amber-500/30',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
      color: 'text-gold',
      trend: 'all time',
    },
    {
      label: 'Total Spent',
      value: `₹${totalSpent}`,
      icon: IndianRupee,
      gradient: 'from-emerald-500/20 via-green-500/5 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
      color: 'text-fresh',
      trend: 'lifetime value',
    },
    {
      label: 'Active Orders',
      value: pendingOrders,
      icon: Activity,
      gradient: 'from-blue-500/20 via-cyan-500/5 to-transparent',
      border: 'border-blue-500/30',
      iconBg: 'bg-gradient-to-br from-blue-400 to-cyan-600',
      color: 'text-blue-400',
      trend: 'in progress',
    },
  ]

  return (
    <>
      <Header />

      <main className="min-h-screen py-8 md:py-12 bg-gradient-to-br from-night via-night to-night-soft relative">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-[100px] animate-pulse" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gold/30 blur-lg" />
                  <img
                    src={user.avatarUrl}
                    alt={user.name}
                    className="relative w-16 h-16 rounded-full border-2 border-gold/50 object-cover shadow-lg shadow-gold/20"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg shadow-gold/20">
                  <span className="text-night font-bold text-2xl">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles size={18} className="text-gold animate-pulse" />
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                  Welcome back,{' '}
                  <p className="text-white/50 text-sm">
                  <span className="text-white font-semibold">{user.name}</span>!
                </p>
                  </h1>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 px-4 py-2.5 rounded-full transition-all duration-300 border border-red-500/20 hover:border-red-500 hover:scale-105 text-sm font-semibold shadow-lg shadow-red-500/0 hover:shadow-red-500/30"
            >
              <LogOut
                size={16}
                className="group-hover:rotate-12 transition-transform"
              />
              Logout
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-6">
            {statsData.map((s, i) => (
              <div
                key={s.label}
                className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card/80 backdrop-blur-xl border ${s.border} rounded-2xl p-5 transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl hover:shadow-gold/10 overflow-hidden`}
                style={{
                  animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both`,
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-11 h-11 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                    >
                      <s.icon
                        size={20}
                        className="text-night"
                        strokeWidth={2.5}
                      />
                    </div>
                  </div>

                  <p
                    className={`text-2xl md:text-3xl font-bold ${s.color} mb-0.5 tracking-tight`}
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

          {/* Account Info Card */}
          <div
            className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-6 hover:border-gold/30 transition-all duration-300 overflow-hidden"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.3s both' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10">
              <h2 className="font-bold mb-5 flex items-center gap-2">
                <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                  <User size={16} className="text-gold" />
                </span>
                Account Info
              </h2>

              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-night/40 rounded-xl p-4 border border-white/5">
                  <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider font-bold">
                    Name
                  </p>
                  <p className="font-semibold text-base">{user.name}</p>
                </div>

                {user.mobile && (
                  <div className="bg-night/40 rounded-xl p-4 border border-white/5">
                    <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider font-bold">
                      Mobile
                    </p>
                    <p className="font-semibold text-base flex items-center gap-2">
                      <Phone size={14} className="text-gold" />
                      {user.mobile}
                    </p>
                  </div>
                )}

                {user.email && (
                  <div className="bg-night/40 rounded-xl p-4 border border-white/5">
                    <p className="text-[10px] text-white/40 mb-2 uppercase tracking-wider font-bold">
                      Email
                    </p>
                    <p className="font-semibold text-base flex items-center gap-2 truncate">
                      <Mail size={14} className="text-gold" />
                      <span className="truncate">{user.email}</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* My Orders Card */}
          <div
            className="relative group bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 hover:border-gold/30 transition-all duration-300 overflow-hidden"
            style={{ animation: 'fadeInUp 0.5s ease-out 0.4s both' }}
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
                <h2 className="font-bold flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                    <Package size={16} className="text-gold" />
                  </span>
                  My Orders
                  {orders.length > 0 && (
                    <span className="text-xs bg-gold/20 text-gold px-2.5 py-0.5 rounded-full font-bold border border-gold/30">
                      {orders.length}
                    </span>
                  )}
                </h2>
                <Link
                  href="/menu"
                  className="text-sm text-gold hover:text-gold-light flex items-center gap-1 group/link font-semibold"
                >
                  Order More
                  <ArrowRight
                    size={14}
                    className="group-hover/link:translate-x-1 transition-transform"
                  />
                </Link>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 animate-bounce">🍽️</div>
                  <p className="text-white/60 text-base mb-2 font-medium">
                    No orders yet
                  </p>
                  <p className="text-white/40 text-sm mb-6">
                    Start ordering your favorite food
                  </p>
                  <Link
                    href="/menu"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/20 text-sm"
                  >
                    <ShoppingBag size={16} /> Browse Menu
                  </Link>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {orders.map((o, i) => (
                    <Link
                      key={o.id}
                      href={`/track-order?id=${o.id}`}
                      className="relative group/order flex items-center justify-between p-4 rounded-xl bg-night border border-white/5 hover:border-gold/50 hover:bg-night-soft transition-all duration-300 overflow-hidden"
                      style={{
                        animation: `fadeInUp 0.4s ease-out ${
                          0.5 + i * 0.05
                        }s both`,
                      }}
                    >
                      {/* Hover accent */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold to-gold-dark scale-y-0 group-hover/order:scale-y-100 transition-transform origin-top" />

                      <div className="flex-1 min-w-0 pl-2">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <p className="font-bold text-gold text-sm group-hover/order:text-gold-light transition-colors">
                            #{o.orderNumber}
                          </p>
                          <span
                            className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                              statusColors[o.status] ||
                              'bg-white/10 text-white/60'
                            }`}
                          >
                            {o.status}
                          </span>
                        </div>
                        <p className="text-xs text-white/50 flex items-center gap-1.5">
                          <Clock size={11} />
                          {timeAgo(o.createdAt)} •{' '}
                          {new Date(o.createdAt).toLocaleString('en-IN', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </p>
                        <p className="text-xs text-white/40 mt-1.5">
                          {o.items.length} item
                          {o.items.length > 1 ? 's' : ''} •{' '}
                          {o.items
                            .slice(0, 2)
                            .map((i) => i.name)
                            .join(', ')}
                          {o.items.length > 2
                            ? ` +${o.items.length - 2} more`
                            : ''}
                        </p>
                      </div>
                      <div className="text-right ml-3 flex items-center gap-3">
                        <div>
                          <p className="font-bold text-base bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
                            ₹{o.total}
                          </p>
                          <p className="text-[10px] text-white/40 capitalize uppercase tracking-wide">
                            {o.paymentMethod}
                          </p>
                        </div>
                        <ArrowRight
                          size={16}
                          className="text-white/30 group-hover/order:text-gold group-hover/order:translate-x-1 transition-all"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

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
    </>
  )
}