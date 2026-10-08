'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  PlusCircle,
  Loader2,
  ArrowLeft,
  Store,
  Check,
  Copy,
  KeyRound,
  ExternalLink,
  Sparkles,
  Building2,
  Phone,
  Mail,
  MapPin,
  IndianRupee,
} from 'lucide-react'
import { createRestaurant } from '@/lib/restaurantSupabase'
import { useToast } from '@/components/Toast'

export default function NewRestaurantPage() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [credentials, setCredentials] = useState<{
    username: string
    password: string
    url: string
  } | null>(null)
  const [copied, setCopied] = useState<string | null>(null)

  const [form, setForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    category: 'Family Restaurant',
    city: '',
    state: '',
    phone: '',
    email: '',
    monthly_fee: 999,
  })

  const update = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
  }

  const handleNameChange = (name: string) => {
    update('name', name)
    if (!form.slug || form.slug === generateSlug(form.name)) {
      update('slug', generateSlug(name))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name.trim() || !form.slug.trim()) {
      toast.error('Name and slug are required')
      return
    }
    setLoading(true)

    const result = await createRestaurant(form)

    if (result.success && result.credentials) {
      setCredentials(result.credentials)
      toast.success('Restaurant created successfully!')
    } else {
      toast.error(result.error || 'Failed to create restaurant')
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    toast.success('Copied!')
    setTimeout(() => setCopied(null), 2000)
  }

  // Success screen
  if (credentials) {
    return (
      <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft flex items-center justify-center">
        <div className="w-full max-w-2xl">
          <div className="bg-night-card border-2 border-fresh/40 rounded-3xl p-8 shadow-[0_0_60px_rgba(34,197,94,0.2)]">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-fresh to-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                <Check size={40} className="text-white" strokeWidth={3} />
              </div>
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-fresh to-emerald-400 bg-clip-text text-transparent">
                Restaurant Created! 🎉
              </h1>
              <p className="text-white/60 text-sm">
                Share these credentials with your client
              </p>
            </div>

            <div className="bg-gold/10 border border-gold/30 rounded-xl p-4 mb-6">
              <p className="text-xs text-gold text-center">
                ⚠️ <strong>IMPORTANT:</strong> Save these credentials now — password will not be shown again!
              </p>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <p className="text-[10px] text-white/40 tracking-widest mb-2">ADMIN USERNAME</p>
                <div className="bg-night rounded-xl p-4 border border-white/10 flex items-center justify-between">
                  <p className="font-mono text-sm">{credentials.username}</p>
                  <button
                    onClick={() => copyToClipboard(credentials.username, 'user')}
                    className="text-white/40 hover:text-gold transition"
                  >
                    {copied === 'user' ? <Check size={16} className="text-fresh" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-white/40 tracking-widest mb-2">ADMIN PASSWORD</p>
                <div className="bg-night rounded-xl p-4 border border-white/10 flex items-center justify-between">
                  <p className="font-mono text-sm">{credentials.password}</p>
                  <button
                    onClick={() => copyToClipboard(credentials.password, 'pass')}
                    className="text-white/40 hover:text-gold transition"
                  >
                    {copied === 'pass' ? <Check size={16} className="text-fresh" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-white/40 tracking-widest mb-2">ADMIN LOGIN URL</p>
                <div className="bg-night rounded-xl p-4 border border-white/10 flex items-center justify-between">
                  <p className="font-mono text-xs truncate flex-1">{credentials.url}</p>
                  <button
                    onClick={() => copyToClipboard(credentials.url, 'url')}
                    className="text-white/40 hover:text-gold ml-2"
                  >
                    {copied === 'url' ? <Check size={16} className="text-fresh" /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/super-admin/restaurants"
                className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold px-6 py-3 rounded-full hover:scale-105 transition shadow-lg shadow-purple-500/30 text-sm"
              >
                <Store size={16} />
                View All Restaurants
              </Link>
              <button
                onClick={() => {
                  setCredentials(null)
                  setForm({
                    name: '', slug: '', tagline: '', category: 'Family Restaurant',
                    city: '', state: '', phone: '', email: '', monthly_fee: 999,
                  })
                }}
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-6 py-3 rounded-full transition text-sm"
              >
                <PlusCircle size={16} />
                Add Another
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Form
  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-500/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-3xl">
        {/* Header */}
        <div className="mb-6">
          <Link
            href="/super-admin/restaurants"
            className="inline-flex items-center gap-2 text-white/50 hover:text-purple-400 text-sm mb-4 transition"
          >
            <ArrowLeft size={14} />
            Back to Restaurants
          </Link>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-purple-400 animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-white bg-clip-text text-transparent">
              Add New Restaurant
            </h1>
          </div>
          <p className="text-white/50 text-sm">
            Onboard a new client — admin credentials auto-generate honge
          </p>
        </div>

        {/* Info banner */}
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-4 mb-6 flex items-start gap-3">
          <KeyRound size={18} className="text-purple-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-white/80">
              <strong className="text-purple-400">Auto-Generated:</strong> Admin username aur password automatically ban jayenge. Restaurant live ho jayega aur uske apne URL pe accessible hoga.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-night-card border border-white/5 rounded-2xl p-6">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/5 flex items-center justify-center">
              <Store size={16} className="text-purple-400" />
            </span>
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="md:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Restaurant Name *
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Royal Spice Restaurant"
                required
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                URL Slug *
              </label>
              <div className="flex items-center gap-2">
                <span className="text-white/40 text-sm font-mono">/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => update('slug', generateSlug(e.target.value))}
                  placeholder="royal-spice"
                  required
                  className="flex-1 bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition font-mono"
                />
              </div>
              <p className="text-[10px] text-white/40 mt-1.5">
                💡 Ye URL hoga: <span className="text-purple-400">/{form.slug || 'your-slug'}</span>
              </p>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Tagline
              </label>
              <input
                type="text"
                value={form.tagline}
                onChange={(e) => update('tagline', e.target.value)}
                placeholder="The Family Restaurant"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1">
                <Building2 size={11} /> Category
              </label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
              >
                <option value="Family Restaurant">Family Restaurant</option>
                <option value="Cafe">Cafe</option>
                <option value="Fast Food">Fast Food</option>
                <option value="Dhaba">Dhaba</option>
                <option value="Bakery">Bakery</option>
                <option value="Fine Dining">Fine Dining</option>
                <option value="Hotel Restaurant">Hotel Restaurant</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1">
                <MapPin size={11} /> City
              </label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Amarpur"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                State
              </label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => update('state', e.target.value)}
                placeholder="Bihar"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1">
                <Phone size={11} /> Phone
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1">
                <Mail size={11} /> Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="contact@restaurant.com"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1">
                <IndianRupee size={11} /> Monthly Fee (₹)
              </label>
              <input
                type="number"
                value={form.monthly_fee}
                onChange={(e) => update('monthly_fee', Number(e.target.value))}
                min={0}
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-purple-500/50 focus:outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 rounded-full hover:scale-[1.02] transition shadow-lg shadow-purple-500/30 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Creating Restaurant...
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                Create Restaurant & Generate Credentials
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}