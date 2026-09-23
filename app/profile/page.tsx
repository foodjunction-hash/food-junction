'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Phone, Mail, Package, LogOut, ShoppingBag, ArrowRight, Clock, Loader2 } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { supabase } from '@/lib/supabase'
import { getOrders as getLocalOrders, type Order } from '@/lib/orders'

// Map DB format → frontend Order format
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
  placed: 'bg-gold/20 text-gold',
  accepted: 'bg-blue-400/20 text-blue-400',
  preparing: 'bg-purple-400/20 text-purple-400',
  ready: 'bg-fresh/20 text-fresh',
  delivered: 'bg-white/10 text-white/60',
}

type ProfileUser = {
  name: string
  email: string
  mobile: string
  avatarUrl?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<ProfileUser | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const load = async () => {
      // 1. Supabase Auth se current user lo
      const { data: { user: authUser }, error } = await supabase.auth.getUser()

      if (error || !authUser) {
        router.push('/login')
        return
      }

      // 2. User ka profile data nikalo
      const meta = authUser.user_metadata || {}
      const profileData: ProfileUser = {
        name: meta.full_name || meta.name || 'Customer',
        email: authUser.email || '',
        mobile: meta.phone || '',
        avatarUrl: meta.avatar_url || meta.picture,
      }

      // 3. customers table se mobile number try karo
      const { data: customerRow } = await supabase
        .from('customers')
        .select('name, mobile, email')
        .eq('auth_user_id', authUser.id)
        .single()

      if (customerRow) {
        profileData.name = customerRow.name || profileData.name
        profileData.mobile = customerRow.mobile || profileData.mobile
        profileData.email = customerRow.email || profileData.email
      }

      setUser(profileData)

      // 4. Orders fetch karo (mobile ya email se match karke)
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' })
        const data = await res.json()
        const allDb: Order[] = (data.orders || []).map(mapDbOrder)
        const mine = allDb.filter(
          (o) =>
            (profileData.mobile && o.customer.mobile === profileData.mobile) ||
            (profileData.email && o.customer.email === profileData.email)
        )
        setOrders(mine)
      } catch (err) {
        console.error('Failed to fetch orders:', err)
        const local = getLocalOrders()
        setOrders(
          local.filter(
            (o) =>
              (profileData.mobile && o.customer.mobile === profileData.mobile) ||
              (profileData.email && o.customer.email === profileData.email)
          )
        )
      }

      setMounted(true)
    }

    load()

    // 5. Auth state change sun lo (logout hone par redirect)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push('/login')
        }
      }
    )

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

  // Calculate stats
  const totalOrders = orders.length
  const totalSpent = orders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = orders.filter((o) => o.status !== 'delivered').length

  return (
    <>
      <Header />

      <main className="min-h-screen py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="w-14 h-14 rounded-full border-2 border-gold/50 object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-gold/20 flex items-center justify-center">
                  <User size={24} className="text-gold" />
                </div>
              )}
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-1">
                  My <span className="text-gradient-gold">Profile</span>
                </h1>
                <p className="text-white/50 text-sm">
                  Welcome back, {user.name}!
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 rounded-full transition text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-6">
            <div className="bg-night-card border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-gold mb-1">
                {totalOrders}
              </p>
              <p className="text-xs text-white/50">Total Orders</p>
            </div>
            <div className="bg-night-card border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-fresh mb-1">
                ₹{totalSpent}
              </p>
              <p className="text-xs text-white/50">Total Spent</p>
            </div>
            <div className="bg-night-card border border-white/5 rounded-2xl p-4 text-center">
              <p className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">
                {pendingOrders}
              </p>
              <p className="text-xs text-white/50">Active</p>
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <User size={18} className="text-gold" /> Account Info
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white/40 text-xs mb-1">NAME</p>
                <p className="font-semibold">{user.name}</p>
              </div>
              {user.mobile && (
                <div>
                  <p className="text-white/40 text-xs mb-1">MOBILE</p>
                  <p className="font-semibold flex items-center gap-1.5">
                    <Phone size={13} className="text-gold" /> {user.mobile}
                  </p>
                </div>
              )}
              {user.email && (
                <div>
                  <p className="text-white/40 text-xs mb-1">EMAIL</p>
                  <p className="font-semibold flex items-center gap-1.5 truncate">
                    <Mail size={13} className="text-gold" /> {user.email}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Orders */}
          <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2">
                <Package size={18} className="text-gold" /> My Orders
              </h2>
              <Link
                href="/menu"
                className="text-sm text-gold hover:text-gold-light flex items-center gap-1"
              >
                Order More <ArrowRight size={14} />
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-3">🍽️</div>
                <p className="text-white/60 text-sm mb-3">
                  You haven&apos;t placed any orders yet
                </p>
                <Link
                  href="/menu"
                  className="inline-flex items-center gap-2 bg-gold text-night font-bold px-6 py-3 rounded-full hover:bg-gold-light transition text-sm"
                >
                  <ShoppingBag size={16} /> Browse Menu
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {orders.map((o) => (
                  <Link
                    key={o.id}
                    href={`/track-order?id=${o.id}`}
                    className="flex items-center justify-between p-3 md:p-4 rounded-xl bg-night border border-white/5 hover:border-gold/40 transition group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-bold text-gold text-sm group-hover:text-gold-light">
                          #{o.orderNumber}
                        </p>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                            statusColors[o.status] || 'bg-white/10 text-white/60'
                          }`}
                        >
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs text-white/50 flex items-center gap-1.5">
                        <Clock size={11} />
                        {new Date(o.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {o.items.length} item{o.items.length > 1 ? 's' : ''} • {o.items
                          .slice(0, 2)
                          .map((i) => i.name)
                          .join(', ')}
                        {o.items.length > 2 ? ` +${o.items.length - 2} more` : ''}
                      </p>
                    </div>
                    <div className="text-right ml-3 flex items-center gap-3">
                      <div>
                        <p className="font-bold text-sm">₹{o.total}</p>
                        <p className="text-[10px] text-white/40 capitalize">
                          {o.paymentMethod}
                        </p>
                      </div>
                      <ArrowRight
                        size={16}
                        className="text-white/40 group-hover:text-gold transition"
                      />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}