'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Store,
  Users,
  IndianRupee,
  TrendingUp,
  PlusCircle,
  ArrowRight,
  Loader2,
  Sparkles,
  Shield,
  Activity,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import { getSuperAdminStats, getAllRestaurants, type RestaurantAdmin } from '@/lib/restaurantSupabase'
import { getSuperAdminSession } from '@/lib/auth'

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState<any>(null)
  const [recentRestaurants, setRecentRestaurants] = useState<RestaurantAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    setSession(getSuperAdminSession())
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const [statsData, restaurants] = await Promise.all([
      getSuperAdminStats(),
      getAllRestaurants(),
    ])
    setStats(statsData)
    setRecentRestaurants(restaurants.slice(0, 5))
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-purple-400" size={16} />
        Loading dashboard...
      </div>
    )
  }

  const statCards = [
    {
      label: 'Total Restaurants',
      value: stats.total,
      icon: Store,
      gradient: 'from-purple-500/20 via-purple-500/5 to-transparent',
      border: 'border-purple-500/30',
      iconBg: 'bg-gradient-to-br from-purple-400 to-purple-600',
    },
    {
      label: 'Active',
      value: stats.active,
      icon: CheckCircle2,
      gradient: 'from-fresh/20 via-fresh/5 to-transparent',
      border: 'border-fresh/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
    },
    {
      label: 'Inactive',
      value: stats.inactive,
      icon: XCircle,
      gradient: 'from-red-500/20 via-red-500/5 to-transparent',
      border: 'border-red-500/30',
      iconBg: 'bg-gradient-to-br from-red-400 to-rose-600',
    },
    {
      label: 'Monthly Revenue',
      value: `₹${stats.monthlyRevenue}`,
      icon: IndianRupee,
      gradient: 'from-gold/20 via-gold/5 to-transparent',
      border: 'border-gold/30',
      iconBg: 'bg-gradient-to-br from-gold to-gold-dark',
    },
  ]

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Shield size={20} className="text-purple-400 animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
                Super Admin Dashboard
              </h1>
            </div>
            <p className="text-white/50 text-sm flex items-center gap-2">
              <Activity size={14} className="text-fresh" />
              Welcome back, {session?.fullName || 'Admin'}! Manage your platform.
            </p>
          </div>
          <Link
            href="/super-admin/restaurants/new"
            className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-5 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-purple-500/30 text-sm"
          >
            <PlusCircle size={16} />
            Add Restaurant
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 mb-6 md:mb-8">
          {statCards.map((s, i) => (
            <div
              key={i}
              className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card border ${s.border} rounded-2xl p-5 overflow-hidden transition-all duration-500 hover:scale-[1.03]`}
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.1}s both` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg group-hover:scale-110 transition-all`}
                >
                  <s.icon size={22} className="text-white" strokeWidth={2.5} />
                </div>
              </div>
              <p className="text-3xl md:text-4xl font-bold mb-1 tracking-tight">{s.value}</p>
              <p className="text-xs md:text-sm text-white/60 font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Subscription Breakdown */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6 md:mb-8">
          <h2 className="font-bold flex items-center gap-2 text-lg mb-5">
            <TrendingUp size={18} className="text-purple-400" />
            Subscription Breakdown
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Trial', value: stats.trial, color: 'text-blue-400', bg: 'bg-blue-500/10' },
              { label: 'Active (Paid)', value: stats.paid, color: 'text-fresh', bg: 'bg-fresh/10' },
              { label: 'Expired', value: stats.expired, color: 'text-gold', bg: 'bg-gold/10' },
              { label: 'Suspended', value: stats.suspended, color: 'text-red-400', bg: 'bg-red-500/10' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} rounded-xl p-4 text-center`}>
                <p className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</p>
                <p className="text-xs text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Restaurants */}
        <div className="bg-night-card border border-white/5 rounded-2xl p-5 md:p-6 mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <Store size={18} className="text-purple-400" />
              Recent Restaurants
            </h2>
            <Link
              href="/super-admin/restaurants"
              className="text-sm text-purple-400 hover:text-purple-300 transition flex items-center gap-1 group"
            >
              View All
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {recentRestaurants.length === 0 ? (
            <div className="text-center py-12">
              <Store size={48} className="text-purple-400/30 mx-auto mb-3" />
              <p className="text-white/60 text-sm mb-4">No restaurants yet</p>
              <Link
                href="/super-admin/restaurants/new"
                className="inline-flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold px-5 py-2.5 rounded-full text-sm"
              >
                <PlusCircle size={14} />
                Add First Restaurant
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {recentRestaurants.map((r) => (
                <div
                  key={r.id}
                  className="flex items-center justify-between p-3.5 rounded-xl bg-night border border-white/5 hover:border-purple-500/50 transition group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                      <Store size={18} className="text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-sm truncate">{r.name}</p>
                      <p className="text-xs text-white/40 truncate font-mono">/{r.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 md:gap-4 ml-3">
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${
                        r.subscription_status === 'active'
                          ? 'bg-fresh/20 text-fresh'
                          : r.subscription_status === 'trial'
                          ? 'bg-blue-500/20 text-blue-400'
                          : r.subscription_status === 'expired'
                          ? 'bg-gold/20 text-gold'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {r.subscription_status}
                    </span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        r.is_active ? 'bg-fresh animate-pulse' : 'bg-red-400'
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-3 md:gap-5">
          <Link
            href="/super-admin/restaurants/new"
            className="relative group bg-night-card border border-purple-500/30 rounded-2xl p-5 hover:border-purple-500 transition flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle size={24} className="text-purple-400" />
            </div>
            <div className="flex-1 relative">
              <p className="font-bold mb-0.5 text-lg">Add New Restaurant</p>
              <p className="text-xs text-white/50">Onboard a new client</p>
            </div>
            <ArrowRight size={18} className="relative text-white/40 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
          </Link>

          <Link
            href="/super-admin/restaurants"
            className="relative group bg-night-card border border-white/5 rounded-2xl p-5 hover:border-fresh/50 transition flex items-center gap-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-fresh/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-fresh/30 to-fresh/10 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Store size={24} className="text-fresh" />
            </div>
            <div className="flex-1 relative">
              <p className="font-bold mb-0.5 text-lg">Manage Restaurants</p>
              <p className="text-xs text-white/50">View, edit, toggle status</p>
            </div>
            <ArrowRight size={18} className="relative text-white/40 group-hover:text-fresh group-hover:translate-x-1 transition-all" />
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}