'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { User, Phone, Mail, Package, LogOut, ShoppingBag, ArrowRight } from 'lucide-react'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import {
  getCurrentCustomer,
  logoutCustomer,
  type Customer,
} from '@/lib/customerAuth'
import { getOrders, type Order } from '@/lib/orders'

export default function ProfilePage() {
  const router = useRouter()
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const c = getCurrentCustomer()
    if (!c) {
      router.push('/login')
      return
    }
    setCustomer(c)

    // filter this customer's orders by mobile
    const all = getOrders()
    setOrders(all.filter((o) => o.customer.mobile === c.mobile))
    setMounted(true)
  }, [router])

  const handleLogout = () => {
    logoutCustomer()
    router.push('/')
  }

  if (!mounted || !customer) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex items-center justify-center">
          <p className="text-white/60 text-sm">Loading...</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />

      <main className="min-h-screen py-8 md:py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">
                My <span className="text-gradient-gold">Profile</span>
              </h1>
              <p className="text-white/50 text-sm">
                Welcome back, {customer.name}!
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2.5 rounded-full transition text-sm"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Info Card */}
          <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6">
            <h2 className="font-bold mb-4 flex items-center gap-2">
              <User size={18} className="text-gold" /> Account Info
            </h2>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-white/40 text-xs mb-1">NAME</p>
                <p className="font-semibold">{customer.name}</p>
              </div>
              <div>
                <p className="text-white/40 text-xs mb-1">MOBILE</p>
                <p className="font-semibold flex items-center gap-1.5">
                  <Phone size={13} className="text-gold" /> {customer.mobile}
                </p>
              </div>
              {customer.email && (
                <div>
                  <p className="text-white/40 text-xs mb-1">EMAIL</p>
                  <p className="font-semibold flex items-center gap-1.5 truncate">
                    <Mail size={13} className="text-gold" /> {customer.email}
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
                  You haven't placed any orders yet
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
                    className="flex items-center justify-between p-3 rounded-xl bg-night border border-white/5 hover:border-gold/40 transition"
                  >
                    <div>
                      <p className="font-bold text-gold text-sm">
                        #{o.orderNumber}
                      </p>
                      <p className="text-xs text-white/40 mt-0.5">
                        {new Date(o.createdAt).toLocaleString('en-IN', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm">₹{o.total}</p>
                      <p className="text-xs text-white/40 capitalize">
                        {o.status}
                      </p>
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