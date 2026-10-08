'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Store,
  PlusCircle,
  Search,
  Loader2,
  Shield,
  Sparkles,
  Eye,
  EyeOff,
  Copy,
  Check,
  RotateCw,
  Trash2,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  KeyRound,
  X,
} from 'lucide-react'
import {
  getAllRestaurants,
  toggleRestaurantActive,
  resetRestaurantAdminPassword,
  deleteRestaurant,
  updateSubscription,
  type RestaurantAdmin,
} from '@/lib/restaurantSupabase'
import { useToast } from '@/components/Toast'

export default function SuperAdminRestaurants() {
  const toast = useToast()
  const [restaurants, setRestaurants] = useState<RestaurantAdmin[]>([])
  const [filtered, setFiltered] = useState<RestaurantAdmin[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [credentialsModal, setCredentialsModal] = useState<{ username: string; password: string; url: string } | null>(null)

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!search.trim()) {
      setFiltered(restaurants)
    } else {
      const q = search.toLowerCase()
      setFiltered(
        restaurants.filter(
          (r) =>
            r.name.toLowerCase().includes(q) ||
            r.slug.toLowerCase().includes(q) ||
            (r.city || '').toLowerCase().includes(q) ||
            (r.admin_username || '').toLowerCase().includes(q)
        )
      )
    }
  }, [search, restaurants])

  const load = async () => {
    setLoading(true)
    const data = await getAllRestaurants()
    setRestaurants(data)
    setFiltered(data)
    setLoading(false)
  }

  const handleToggle = async (r: RestaurantAdmin) => {
    const result = await toggleRestaurantActive(r.id, !r.is_active)
    if (result.success) {
      toast.success(r.is_active ? 'Deactivated' : 'Activated')
      load()
    } else {
      toast.error('Failed to update')
    }
  }

  const handleResetPassword = async (r: RestaurantAdmin) => {
    if (!confirm(`Reset password for ${r.name}?`)) return
    const result = await resetRestaurantAdminPassword(r.id)
    if (result.success && result.password) {
      setCredentialsModal({
        username: r.admin_username || '',
        password: result.password,
        url: `/${r.slug}/admin/login`,
      })
      load()
    } else {
      toast.error('Failed to reset')
    }
  }

  const handleDelete = async (r: RestaurantAdmin) => {
    if (!confirm(`DELETE ${r.name}? This cannot be undone!`)) return
    if (!confirm(`Are you REALLY sure? All data will be lost.`)) return
    const result = await deleteRestaurant(r.id)
    if (result.success) {
      toast.success('Restaurant deleted')
      load()
    } else {
      toast.error('Failed to delete')
    }
  }

  const handleSubscriptionChange = async (
    r: RestaurantAdmin,
    status: 'trial' | 'active' | 'expired' | 'suspended'
  ) => {
    const expiresAt =
      status === 'active' || status === 'trial'
        ? new Date(Date.now() + (status === 'trial' ? 14 : 365) * 24 * 60 * 60 * 1000).toISOString()
        : undefined
    const result = await updateSubscription(r.id, status, expiresAt)
    if (result.success) {
      toast.success(`Status: ${status}`)
      load()
    } else {
      toast.error('Failed')
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    toast.success('Copied!')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const togglePassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-purple-400 animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
                All Restaurants
              </h1>
            </div>
            <p className="text-white/50 text-sm">
              {filtered.length} restaurants • Manage admin credentials, subscriptions
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

        {/* Search */}
        <div className="mb-6 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, slug, city, or admin username..."
            className="w-full bg-night-card border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
          />
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="animate-spin text-purple-400 mx-auto mb-3" size={32} />
            <p className="text-white/60 text-sm">Loading restaurants...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-night-card border border-white/5 rounded-2xl">
            <Store size={48} className="text-purple-400/30 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-4">
              {search ? 'No restaurants match your search' : 'No restaurants yet'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((r) => (
              <div
                key={r.id}
                className={`bg-night-card border rounded-2xl p-5 transition ${
                  r.is_active ? 'border-white/5 hover:border-purple-500/40' : 'border-red-500/20 opacity-70'
                }`}
              >
                {/* Top Row */}
                <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center flex-shrink-0">
                      <Store size={22} className="text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-lg truncate">{r.name}</h3>
                      <p className="text-xs text-white/40 truncate font-mono">/{r.slug}</p>
                      {r.city && <p className="text-xs text-white/40 mt-0.5">{r.city}, {r.state}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Subscription Badge */}
                    <select
                      value={r.subscription_status}
                      onChange={(e) => handleSubscriptionChange(r, e.target.value as any)}
                      className={`text-[10px] font-bold uppercase px-2 py-1.5 rounded-full border-0 cursor-pointer ${
                        r.subscription_status === 'active'
                          ? 'bg-fresh/20 text-fresh'
                          : r.subscription_status === 'trial'
                          ? 'bg-blue-500/20 text-blue-400'
                          : r.subscription_status === 'expired'
                          ? 'bg-gold/20 text-gold'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      <option value="trial">Trial</option>
                      <option value="active">Active</option>
                      <option value="expired">Expired</option>
                      <option value="suspended">Suspended</option>
                    </select>

                    {/* Active Toggle */}
                    <button
                      onClick={() => handleToggle(r)}
                      className={`flex items-center gap-1 px-2 py-1.5 rounded-full text-[10px] font-bold ${
                        r.is_active
                          ? 'bg-fresh/20 text-fresh border border-fresh/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {r.is_active ? <ToggleRight size={12} /> : <ToggleLeft size={12} />}
                      {r.is_active ? 'LIVE' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* Credentials */}
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="bg-night rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-white/40 tracking-widest mb-1">ADMIN USERNAME</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm flex-1 truncate">
                        {r.admin_username || <span className="text-white/30 italic">Not generated</span>}
                      </p>
                      {r.admin_username && (
                        <button
                          onClick={() => copyToClipboard(r.admin_username!, `${r.id}-user`)}
                          className="p-1 text-white/40 hover:text-purple-400 transition"
                        >
                          {copiedId === `${r.id}-user` ? <Check size={14} className="text-fresh" /> : <Copy size={14} />}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="bg-night rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] text-white/40 tracking-widest mb-1">ADMIN PASSWORD</p>
                    <div className="flex items-center gap-2">
                      <p className="font-mono text-sm flex-1 truncate">
                        {r.admin_password ? (
                          showPasswords[r.id] ? r.admin_password : '••••••••••••'
                        ) : (
                          <span className="text-white/30 italic">Not generated</span>
                        )}
                      </p>
                      {r.admin_password && (
                        <>
                          <button
                            onClick={() => togglePassword(r.id)}
                            className="p-1 text-white/40 hover:text-purple-400 transition"
                          >
                            {showPasswords[r.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button
                            onClick={() => copyToClipboard(r.admin_password!, `${r.id}-pass`)}
                            className="p-1 text-white/40 hover:text-purple-400 transition"
                          >
                            {copiedId === `${r.id}-pass` ? <Check size={14} className="text-fresh" /> : <Copy size={14} />}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-white/5">
                  <a
                    href={`/${r.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white px-3 py-2 rounded-full text-xs font-semibold transition"
                  >
                    <ExternalLink size={12} />
                    Visit Site
                  </a>
                  <a
                    href={`/${r.slug}/admin/login`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-2 rounded-full text-xs font-semibold transition"
                  >
                    <Shield size={12} />
                    Admin Login
                  </a>
                  <button
                    onClick={() => handleResetPassword(r)}
                    className="flex items-center gap-1.5 bg-gold/10 hover:bg-gold/20 text-gold px-3 py-2 rounded-full text-xs font-semibold transition"
                  >
                    <RotateCw size={12} />
                    Reset Password
                  </button>
                  <button
                    onClick={() => handleDelete(r)}
                    className="ml-auto flex items-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-3 py-2 rounded-full text-xs font-semibold transition"
                  >
                    <Trash2 size={12} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Credentials Modal */}
      {credentialsModal && (
        <div className="fixed inset-0 z-50 bg-night/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => setCredentialsModal(null)}>
          <div
            className="bg-night-card border border-gold/40 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <KeyRound size={18} className="text-gold" />
                New Credentials
              </h2>
              <button onClick={() => setCredentialsModal(null)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={18} />
              </button>
            </div>

            <div className="bg-gold/10 border border-gold/30 rounded-xl p-3 mb-4">
              <p className="text-xs text-gold">⚠️ Save these credentials — password will not be shown again!</p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-white/40 tracking-widest mb-1">USERNAME</p>
                <div className="bg-night rounded-lg p-3 border border-white/10 flex items-center justify-between">
                  <p className="font-mono text-sm">{credentialsModal.username}</p>
                  <button
                    onClick={() => copyToClipboard(credentialsModal.username, 'modal-user')}
                    className="text-white/40 hover:text-gold"
                  >
                    {copiedId === 'modal-user' ? <Check size={14} className="text-fresh" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-white/40 tracking-widest mb-1">PASSWORD</p>
                <div className="bg-night rounded-lg p-3 border border-white/10 flex items-center justify-between">
                  <p className="font-mono text-sm">{credentialsModal.password}</p>
                  <button
                    onClick={() => copyToClipboard(credentialsModal.password, 'modal-pass')}
                    className="text-white/40 hover:text-gold"
                  >
                    {copiedId === 'modal-pass' ? <Check size={14} className="text-fresh" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-white/40 tracking-widest mb-1">ADMIN URL</p>
                <div className="bg-night rounded-lg p-3 border border-white/10 flex items-center justify-between">
                  <p className="font-mono text-xs truncate">{credentialsModal.url}</p>
                  <button
                    onClick={() => copyToClipboard(credentialsModal.url, 'modal-url')}
                    className="text-white/40 hover:text-gold ml-2"
                  >
                    {copiedId === 'modal-url' ? <Check size={14} className="text-fresh" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}