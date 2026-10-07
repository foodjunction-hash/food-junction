'use client'

import { useEffect, useState } from 'react'
import {
  Save,
  Store,
  Phone,
  MapPin,
  Mail,
  Loader2,
  Sparkles,
  Palette,
  Globe,
  Building2,
  Calendar,
  CheckCircle2,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/Toast'
import {
  type Restaurant,
  getDefaultRestaurant,
  updateRestaurant,
} from '@/lib/restaurant'

// ============================================
// SOCIAL MEDIA ICONS (Inline SVG)
// ============================================
const FacebookIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const InstagramIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
  </svg>
)

const YoutubeIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
)

const TwitterIcon = ({ size = 16, className = '' }: { size?: number; className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function AdminBrandingPage() {
  const toast = useToast()
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadRestaurant()
  }, [])

  const loadRestaurant = async () => {
    setLoading(true)
    const data = await getDefaultRestaurant()
    setRestaurant(data)
    setLoading(false)
  }

  const handleSave = async () => {
    if (!restaurant) return
    setSaving(true)
    const result = await updateRestaurant(restaurant.id, restaurant)
    if (result.success) {
      toast.success('Branding saved successfully!')
    } else {
      toast.error('Failed to save branding')
    }
    setSaving(false)
  }

  const update = (key: keyof Restaurant, value: any) => {
    if (!restaurant) return
    setRestaurant({ ...restaurant, [key]: value })
  }

  if (loading || !restaurant) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} />
        Loading branding...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10 max-w-5xl">
        {/* Header */}
        <div className="mb-6 md:mb-8 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Restaurant Branding
              </h1>
            </div>
            <p className="text-white/50 text-sm">
              Apne restaurant ka naam, logo, colors aur contact details yahan se manage karo
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/30 flex items-center gap-2 text-sm disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2 size={16} className="animate-spin" /> Saving...
              </>
            ) : (
              <>
                <Save size={16} /> Save Changes
              </>
            )}
          </button>
        </div>

        {/* Basic Information */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Store size={16} className="text-gold" />
            </span>
            Basic Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Restaurant Name *
              </label>
              <input
                type="text"
                value={restaurant.name}
                onChange={(e) => update('name', e.target.value)}
                placeholder="e.g. Royal Spice Restaurant"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Tagline
              </label>
              <input
                type="text"
                value={restaurant.tagline}
                onChange={(e) => update('tagline', e.target.value)}
                placeholder="e.g. The Family Restaurant"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1">
                <Building2 size={11} /> Category
              </label>
              <select
                value={restaurant.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
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
                <Calendar size={11} /> Established Year
              </label>
              <input
                type="text"
                value={restaurant.established_year}
                onChange={(e) => update('established_year', e.target.value)}
                placeholder="e.g. 2024"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Slug (URL)
              </label>
              <input
                type="text"
                value={restaurant.slug}
                onChange={(e) => update('slug', e.target.value)}
                placeholder="e.g. food-junction"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition font-mono"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Short Description
              </label>
              <input
                type="text"
                value={restaurant.short_description}
                onChange={(e) => update('short_description', e.target.value)}
                placeholder="e.g. Delicious food crafted with love"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                About Restaurant
              </label>
              <textarea
                value={restaurant.about}
                onChange={(e) => update('about', e.target.value)}
                rows={3}
                placeholder="Restaurant ke baare mein kuch likho..."
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Phone size={16} className="text-gold" />
            </span>
            Contact Information
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Phone Number
              </label>
              <input
                type="text"
                value={restaurant.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                WhatsApp Number
              </label>
              <input
                type="text"
                value={restaurant.whatsapp}
                onChange={(e) => update('whatsapp', e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Email
              </label>
              <input
                type="email"
                value={restaurant.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="contact@restaurant.com"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Alternate Phone
              </label>
              <input
                type="text"
                value={restaurant.alternate_phone}
                onChange={(e) => update('alternate_phone', e.target.value)}
                placeholder="Optional"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1">
                <MapPin size={11} /> Full Address
              </label>
              <textarea
                value={restaurant.address}
                onChange={(e) => update('address', e.target.value)}
                rows={2}
                placeholder="Shop No, Street, Area"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                City
              </label>
              <input
                type="text"
                value={restaurant.city}
                onChange={(e) => update('city', e.target.value)}
                placeholder="Amarpur"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                State
              </label>
              <input
                type="text"
                value={restaurant.state}
                onChange={(e) => update('state', e.target.value)}
                placeholder="Bihar"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                PIN Code
              </label>
              <input
                type="text"
                value={restaurant.pincode}
                onChange={(e) => update('pincode', e.target.value)}
                placeholder="813101"
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1">
                <Globe size={11} /> Google Maps URL
              </label>
              <input
                type="text"
                value={restaurant.google_maps_url}
                onChange={(e) => update('google_maps_url', e.target.value)}
                placeholder="https://maps.google.com/..."
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Social Media */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Globe size={16} className="text-gold" />
            </span>
            Social Media Links
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1.5">
                <span className="text-blue-400"><FacebookIcon size={14} /></span> Facebook
              </label>
              <input
                type="text"
                value={restaurant.facebook_url}
                onChange={(e) => update('facebook_url', e.target.value)}
                placeholder="https://facebook.com/..."
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1.5">
                <span className="text-pink-400"><InstagramIcon size={14} /></span> Instagram
              </label>
              <input
                type="text"
                value={restaurant.instagram_url}
                onChange={(e) => update('instagram_url', e.target.value)}
                placeholder="https://instagram.com/..."
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1.5">
                <span className="text-red-500"><YoutubeIcon size={14} /></span> YouTube
              </label>
              <input
                type="text"
                value={restaurant.youtube_url}
                onChange={(e) => update('youtube_url', e.target.value)}
                placeholder="https://youtube.com/..."
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium flex items-center gap-1.5">
                <span className="text-white"><TwitterIcon size={14} /></span> Twitter / X
              </label>
              <input
                type="text"
                value={restaurant.twitter_url}
                onChange={(e) => update('twitter_url', e.target.value)}
                placeholder="https://twitter.com/..."
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Brand Colors */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Palette size={16} className="text-gold" />
            </span>
            Brand Colors
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { key: 'primary_color' as const, label: 'Primary Color' },
              { key: 'secondary_color' as const, label: 'Secondary Color' },
              { key: 'accent_color' as const, label: 'Accent Color' },
              { key: 'button_color' as const, label: 'Button Color' },
              { key: 'text_color' as const, label: 'Text Color' },
              { key: 'background_color' as const, label: 'Background Color' },
            ].map((item) => (
              <div key={item.key}>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">
                  {item.label}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={restaurant[item.key]}
                    onChange={(e) => update(item.key, e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border border-white/10"
                  />
                  <input
                    type="text"
                    value={restaurant[item.key]}
                    onChange={(e) => update(item.key, e.target.value)}
                    className="flex-1 bg-night/60 border border-white/10 rounded-xl px-3 py-2 text-xs focus:border-gold/50 focus:outline-none transition font-mono"
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-white/40 mt-4">
            💡 Ye colors website ke buttons, headings aur accents mein use honge (Phase 2 mein implement hoga)
          </p>
        </div>

        {/* ✅ Footer Settings — NAYA SECTION */}
        <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-5 md:p-6 mb-5">
          <h2 className="font-bold mb-5 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
              <Globe size={16} className="text-gold" />
            </span>
            Footer Settings
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Footer Description
              </label>
              <textarea
                value={restaurant.footer_description}
                onChange={(e) => update('footer_description', e.target.value)}
                rows={2}
                placeholder="e.g. Serving delicious, hygienic food to families in Amarpur."
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition resize-none"
              />
              <p className="text-[10px] text-white/40 mt-1.5">
                💡 Ye text footer mein brand ke neeche show hoga
              </p>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1.5 font-medium">
                Copyright Text
              </label>
              <input
                type="text"
                value={restaurant.copyright_text}
                onChange={(e) => update('copyright_text', e.target.value)}
                placeholder={`© ${new Date().getFullYear()} ${restaurant.name}. All rights reserved.`}
                className="w-full bg-night/60 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-gold/50 focus:outline-none transition"
              />
              <p className="text-[10px] text-white/40 mt-1.5">
                💡 Empty chhod do → automatic "© [Year] [Restaurant Name]. All rights reserved." show hoga
              </p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/30 rounded-2xl p-4 flex items-start gap-3">
          <CheckCircle2 size={16} className="text-gold flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs text-white/70">
              <span className="font-semibold text-gold">Auto-save:</span> Ye
              settings save karte hi customer website par apply ho jayengi.
              Har change live hai.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}