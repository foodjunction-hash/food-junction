'use client'

import { useEffect, useState } from 'react'
import {
  Plus,
  Upload,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Loader2,
  X,
  Save,
  Image as ImageIcon,
  Calendar,
  CheckCircle2,
  Sparkles,
  Gift,
  Layout,
  Percent,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'
import {
  getHomepageOffers,
  createHomepageOffer,
  updateHomepageOffer,
  deleteHomepageOffer,
  type HomepageOffer,
} from '@/lib/offersSupabase'

type Offer = {
  id: string
  restaurant_id: string | null
  title: string
  description: string
  image_url: string | null
  is_active: boolean
  start_date: string | null
  end_date: string | null
  priority: number
}

const EMPTY: Omit<Offer, 'id'> = {
  restaurant_id: null,
  title: '',
  description: '',
  image_url: null,
  is_active: true,
  start_date: null,
  end_date: null,
  priority: 0,
}

const EMPTY_HOMEPAGE: Omit<HomepageOffer, 'id'> = {
  restaurant_id: null,
  title: '',
  description: '',
  badge: '',
  badge_label: 'DISCOUNT',
  emoji: '🎉',
  color: '#F5B301',
  min_order: 0,
  max_discount: 0,
  validity: 'Limited Time',
  coupon_code: '',
  is_hot: false,
  is_active: true,
  display_order: 0,
}

export default function AdminOffersPage() {
  const toast = useToast()
  const { restaurant } = useRestaurant()
  const [activeTab, setActiveTab] = useState<'banner' | 'homepage'>('homepage')

  // Banner popup state
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Offer | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)

  // Homepage offers state
  const [homepageOffers, setHomepageOffers] = useState<HomepageOffer[]>([])
  const [homepageLoading, setHomepageLoading] = useState(true)
  const [editingHp, setEditingHp] = useState<HomepageOffer | null>(null)
  const [isCreatingHp, setIsCreatingHp] = useState(false)
  const [savingHp, setSavingHp] = useState(false)

  useEffect(() => {
    if (restaurant) {
      loadOffers()
      loadHomepageOffers()
    }
  }, [restaurant])

  // ============================================
  // LOAD BANNER OFFERS (restaurant-filtered)
  // ============================================
  const loadOffers = async () => {
    if (!restaurant) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('restaurant_id', restaurant.id)
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setOffers(data || [])
    } catch (err: any) {
      
      toast.error('Failed to load offers')
    }
    setLoading(false)
  }

  // ============================================
  // LOAD HOMEPAGE OFFERS (restaurant-filtered)
  // ============================================
  const loadHomepageOffers = async () => {
    if (!restaurant) return
    setHomepageLoading(true)
    const data = await getHomepageOffers(restaurant.id)
    setHomepageOffers(data)
    setHomepageLoading(false)
  }

  // ============================================
  // BANNER POPUP
  // ============================================
  const handleImageUpload = async (file: File) => {
    setUploading(true)
    setUploadSuccess(false)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `offer-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('offer-banners')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('offer-banners')
        .getPublicUrl(fileName)

      if (editing) {
        setEditing({ ...editing, image_url: urlData.publicUrl })
      }

      setUploadSuccess(true)
      toast.success('Image uploaded successfully!')
      setTimeout(() => setUploadSuccess(false), 3500)
    } catch (err: any) {
      toast.error('Image upload failed: ' + err.message)
    }
    setUploading(false)
  }

  const handleRemoveImage = () => {
    if (editing) {
      setEditing({ ...editing, image_url: null })
      setUploadSuccess(false)
      toast.info('Image removed')
    }
  }

  const handleSave = async () => {
    if (!editing || !restaurant) return
    if (!editing.title.trim()) {
      toast.error('Title required')
      return
    }

    setSaving(true)
    try {
      if (isCreating) {
        const { id, ...newOffer } = editing
        const { error } = await supabase.from('offers').insert([{
          ...newOffer,
          restaurant_id: restaurant.id,
        }])
        if (error) throw error
        toast.success('Offer created!')
      } else {
        const { error } = await supabase
          .from('offers')
          .update({ ...editing, updated_at: new Date().toISOString() })
          .eq('id', editing.id)
        if (error) throw error
        toast.success('Offer updated!')
      }
      await loadOffers()
      setEditing(null)
      setIsCreating(false)
    } catch (err: any) {
      toast.error('Failed to save: ' + err.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return
    const { error } = await supabase.from('offers').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete')
      return
    }
    await loadOffers()
    toast.success('Offer deleted')
  }

  const handleToggle = async (offer: Offer) => {
    const { error } = await supabase
      .from('offers')
      .update({ is_active: !offer.is_active })
      .eq('id', offer.id)
    if (error) {
      toast.error('Failed to update')
      return
    }
    await loadOffers()
    toast.success(offer.is_active ? 'Deactivated' : 'Activated')
  }

  // ============================================
  // HOMEPAGE OFFERS
  // ============================================
  const handleSaveHp = async () => {
    if (!editingHp || !restaurant) return
    if (!editingHp.title.trim()) {
      toast.error('Title required')
      return
    }

    setSavingHp(true)
    try {
      if (isCreatingHp) {
        const { id, ...newOffer } = editingHp
        const result = await createHomepageOffer({
          ...newOffer,
          restaurant_id: restaurant.id,
        })
        if (!result.success) throw new Error(result.error)
        toast.success('Homepage offer created!')
      } else {
        const result = await updateHomepageOffer(editingHp.id, editingHp)
        if (!result.success) throw new Error(result.error)
        toast.success('Homepage offer updated!')
      }
      await loadHomepageOffers()
      setEditingHp(null)
      setIsCreatingHp(false)
    } catch (err: any) {
      toast.error('Failed: ' + err.message)
    }
    setSavingHp(false)
  }

  const handleDeleteHp = async (id: string) => {
    if (!confirm('Delete this offer?')) return
    const result = await deleteHomepageOffer(id)
    if (result.success) {
      await loadHomepageOffers()
      toast.success('Offer deleted')
    } else {
      toast.error('Failed to delete')
    }
  }

  const handleToggleHp = async (offer: HomepageOffer) => {
    const result = await updateHomepageOffer(offer.id, {
      is_active: !offer.is_active,
    })
    if (result.success) {
      await loadHomepageOffers()
      toast.success(offer.is_active ? 'Deactivated' : 'Activated')
    }
  }

  const updateHp = (key: keyof HomepageOffer, value: any) => {
    if (!editingHp) return
    setEditingHp({ ...editingHp, [key]: value })
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles size={20} className="text-gold animate-pulse" />
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
              Offers Management
            </h1>
          </div>
          <p className="text-white/50 text-sm">
            {restaurant?.name || 'Restaurant'} ke homepage offers aur banner popups manage karo
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-full p-1.5 max-w-md">
          <button
            onClick={() => setActiveTab('homepage')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition ${
              activeTab === 'homepage'
                ? 'bg-gradient-to-r from-gold to-gold-dark text-night'
                : 'text-white/60 hover:text-gold'
            }`}
          >
            <Percent size={16} /> Homepage Offers
          </button>
          <button
            onClick={() => setActiveTab('banner')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-bold transition ${
              activeTab === 'banner'
                ? 'bg-gradient-to-r from-gold to-gold-dark text-night'
                : 'text-white/60 hover:text-gold'
            }`}
          >
            <Layout size={16} /> Banner Popup
          </button>
        </div>

        {/* ============================================
            TAB 1: HOMEPAGE OFFERS
            ============================================ */}
        {activeTab === 'homepage' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-white/50 text-sm">
                {homepageOffers.length} offers • {homepageOffers.filter((o) => o.is_active).length} active
              </p>
              <button
                onClick={() => {
                  setEditingHp({ ...EMPTY_HOMEPAGE, id: '' } as HomepageOffer)
                  setIsCreatingHp(true)
                }}
                className="group bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold/30 flex items-center gap-2 text-sm"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                Add Offer
              </button>
            </div>

            {homepageLoading ? (
              <div className="p-6 text-white/60 text-sm flex items-center gap-2">
                <Loader2 className="animate-spin text-gold" size={16} />
                Loading...
              </div>
            ) : homepageOffers.length === 0 ? (
              <div className="text-center py-20 bg-night-card/80 border border-white/5 rounded-2xl">
                <Percent size={48} className="text-gold/40 mx-auto mb-3" />
                <p className="text-white/60 text-sm mb-4">No homepage offers yet</p>
                <button
                  onClick={() => {
                    setEditingHp({ ...EMPTY_HOMEPAGE, id: '' } as HomepageOffer)
                    setIsCreatingHp(true)
                  }}
                  className="bg-gold text-night font-bold px-6 py-3 rounded-full text-sm"
                >
                  Add First Offer
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {homepageOffers.map((offer, i) => (
                  <div
                    key={offer.id}
                    className={`relative group bg-night-card/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${
                      offer.is_active
                        ? 'border-gold/30 hover:border-gold/60'
                        : 'border-white/5 opacity-60'
                    }`}
                    style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}
                  >
                    <div
                      className="p-5 text-center"
                      style={{
                        background: `linear-gradient(135deg, ${offer.color} 0%, ${offer.color}dd 100%)`,
                      }}
                    >
                      <div className="text-4xl mb-1">{offer.emoji}</div>
                      <p className="text-2xl font-bold text-white">{offer.badge}</p>
                      <p className="text-white/90 text-[10px] tracking-wider">
                        {offer.badge_label}
                      </p>
                    </div>

                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 line-clamp-1">{offer.title}</h3>
                      <p className="text-xs text-white/50 line-clamp-2 mb-2">
                        {offer.description}
                      </p>
                      <p className="text-xs font-mono text-gold mb-3">
                        {offer.coupon_code}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingHp(offer)
                            setIsCreatingHp(false)
                          }}
                          className="flex-1 text-xs bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 font-semibold px-3 py-2 rounded-full border border-blue-400/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleHp(offer)}
                          className={`flex-1 text-xs font-semibold px-3 py-2 rounded-full border flex items-center justify-center gap-1 ${
                            offer.is_active
                              ? 'bg-gold/10 text-gold border-gold/30'
                              : 'bg-fresh/10 text-fresh border-fresh/30'
                          }`}
                        >
                          {offer.is_active ? (
                            <><ToggleRight size={12} /> On</>
                          ) : (
                            <><ToggleLeft size={12} /> Off</>
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteHp(offer.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ============================================
            TAB 2: BANNER POPUP
            ============================================ */}
        {activeTab === 'banner' && (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
              <p className="text-white/50 text-sm">
                {offers.length} banners • {offers.filter((o) => o.is_active).length} active
              </p>
              <button
                onClick={() => {
                  setEditing({ ...EMPTY, id: '' } as Offer)
                  setIsCreating(true)
                  setUploadSuccess(false)
                }}
                className="group bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold/30 flex items-center gap-2 text-sm"
              >
                <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                Add Banner
              </button>
            </div>

            {loading ? (
              <div className="p-6 text-white/60 text-sm flex items-center gap-2">
                <Loader2 className="animate-spin text-gold" size={16} />
                Loading...
              </div>
            ) : offers.length === 0 ? (
              <div className="text-center py-20 bg-night-card/80 border border-white/5 rounded-2xl">
                <ImageIcon size={48} className="text-gold/40 mx-auto mb-3" />
                <p className="text-white/60 text-sm mb-4">No banner popups yet</p>
                <button
                  onClick={() => {
                    setEditing({ ...EMPTY, id: '' } as Offer)
                    setIsCreating(true)
                    setUploadSuccess(false)
                  }}
                  className="bg-gold text-night font-bold px-6 py-3 rounded-full text-sm"
                >
                  Add First Banner
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {offers.map((offer, i) => (
                  <div
                    key={offer.id}
                    className={`relative group bg-night-card/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all ${
                      offer.is_active ? 'border-gold/30' : 'border-white/5 opacity-60'
                    }`}
                    style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}
                  >
                    {offer.image_url ? (
                      <div className="relative w-full h-40 bg-night overflow-hidden">
                        <img
                          src={offer.image_url}
                          alt={offer.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                      </div>
                    ) : (
                      <div className="w-full h-40 bg-gradient-to-br from-gold/20 to-gold-dark/10 flex items-center justify-center">
                        <ImageIcon size={40} className="text-gold/40" />
                      </div>
                    )}

                    <div className="p-4">
                      <h3 className="font-bold text-sm mb-1 line-clamp-1">{offer.title}</h3>
                      <p className="text-xs text-white/50 line-clamp-2 mb-3">
                        {offer.description}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditing(offer)
                            setIsCreating(false)
                            setUploadSuccess(false)
                          }}
                          className="flex-1 text-xs bg-blue-400/10 text-blue-400 font-semibold px-3 py-2 rounded-full border border-blue-400/20"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggle(offer)}
                          className={`flex-1 text-xs font-semibold px-3 py-2 rounded-full border flex items-center justify-center gap-1 ${
                            offer.is_active
                              ? 'bg-gold/10 text-gold border-gold/30'
                              : 'bg-fresh/10 text-fresh border-fresh/30'
                          }`}
                        >
                          {offer.is_active ? (
                            <><ToggleRight size={12} /> On</>
                          ) : (
                            <><ToggleLeft size={12} /> Off</>
                          )}
                        </button>
                        <button
                          onClick={() => handleDelete(offer.id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-full"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* ============================================
          BANNER POPUP EDIT MODAL
          ============================================ */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-night/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            setEditing(null)
            setIsCreating(false)
            setUploadSuccess(false)
          }}
        >
          <div
            className="bg-night-card border border-gold/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-night-card/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Gift size={18} className="text-gold" />
                {isCreating ? 'Add Banner' : 'Edit Banner'}
              </h2>
              <button
                onClick={() => {
                  setEditing(null)
                  setIsCreating(false)
                }}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-2 font-medium">Banner Image</label>
                {editing.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-fresh/40">
                    <img src={editing.image_url} alt="Banner" className="w-full h-40 object-cover" />
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/90 rounded-full"
                    >
                      <X size={14} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                    />
                    <div className="border-2 border-dashed border-white/10 hover:border-gold/50 rounded-xl p-6 text-center">
                      {uploading ? (
                        <Loader2 size={24} className="animate-spin text-gold mx-auto" />
                      ) : (
                        <>
                          <Upload size={24} className="text-gold mx-auto mb-2" />
                          <p className="text-xs text-white/60">Click to upload</p>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Title *</label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) => setEditing({ ...editing, title: e.target.value })}
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Start Date</label>
                  <input
                    type="date"
                    value={editing.start_date ? editing.start_date.split('T')[0] : ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        start_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">End Date</label>
                  <input
                    type="date"
                    value={editing.end_date ? editing.end_date.split('T')[0] : ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        end_date: e.target.value ? new Date(e.target.value).toISOString() : null,
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Priority</label>
                  <input
                    type="number"
                    value={editing.priority}
                    onChange={(e) => setEditing({ ...editing, priority: Number(e.target.value) })}
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Status</label>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, is_active: !editing.is_active })}
                    className={`w-full flex items-center justify-between bg-night border border-white/10 rounded-xl px-3 py-2.5 ${
                      editing.is_active ? 'border-fresh/40 text-fresh' : 'text-white/50'
                    }`}
                  >
                    <span className="text-sm">{editing.is_active ? 'Active' : 'Inactive'}</span>
                    {editing.is_active ? <ToggleRight size={22} /> : <ToggleLeft size={22} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-night-card/95 backdrop-blur-xl border-t border-white/10 p-5 flex gap-3">
              <button
                onClick={() => {
                  setEditing(null)
                  setIsCreating(false)
                }}
                className="flex-1 border border-white/10 text-white/70 py-3 rounded-full text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3 rounded-full text-sm disabled:opacity-60"
              >
                {saving ? 'Saving...' : isCreating ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          HOMEPAGE OFFER EDIT MODAL
          ============================================ */}
      {editingHp && (
        <div
          className="fixed inset-0 z-50 bg-night/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => {
            setEditingHp(null)
            setIsCreatingHp(false)
          }}
        >
          <div
            className="bg-night-card border border-gold/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-night-card/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Percent size={18} className="text-gold" />
                {isCreatingHp ? 'Add Homepage Offer' : 'Edit Homepage Offer'}
              </h2>
              <button
                onClick={() => {
                  setEditingHp(null)
                  setIsCreatingHp(false)
                }}
                className="p-2 hover:bg-white/10 rounded-full"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs text-white/60 mb-1.5">Emoji</label>
                  <input
                    type="text"
                    value={editingHp.emoji}
                    onChange={(e) => updateHp('emoji', e.target.value.slice(0, 4))}
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-2xl text-center"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-white/60 mb-1.5">Badge (e.g. 20%, ₹50 OFF)</label>
                  <input
                    type="text"
                    value={editingHp.badge}
                    onChange={(e) => updateHp('badge', e.target.value)}
                    placeholder="20%"
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Badge Label</label>
                <input
                  type="text"
                  value={editingHp.badge_label}
                  onChange={(e) => updateHp('badge_label', e.target.value)}
                  placeholder="DISCOUNT"
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Title *</label>
                <input
                  type="text"
                  value={editingHp.title}
                  onChange={(e) => updateHp('title', e.target.value)}
                  placeholder="20% OFF on First Order"
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Description</label>
                <textarea
                  value={editingHp.description}
                  onChange={(e) => updateHp('description', e.target.value)}
                  rows={2}
                  placeholder="Short description"
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Min Order (₹)</label>
                  <input
                    type="number"
                    value={editingHp.min_order}
                    onChange={(e) => updateHp('min_order', Number(e.target.value))}
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={editingHp.max_discount}
                    onChange={(e) => updateHp('max_discount', Number(e.target.value))}
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Validity</label>
                  <input
                    type="text"
                    value={editingHp.validity}
                    onChange={(e) => updateHp('validity', e.target.value)}
                    placeholder="Limited Time"
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Coupon Code</label>
                  <input
                    type="text"
                    value={editingHp.coupon_code}
                    onChange={(e) => updateHp('coupon_code', e.target.value.toUpperCase())}
                    placeholder="WELCOME20"
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={editingHp.color}
                    onChange={(e) => updateHp('color', e.target.value)}
                    className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border border-white/10"
                  />
                  <input
                    type="text"
                    value={editingHp.color}
                    onChange={(e) => updateHp('color', e.target.value)}
                    className="flex-1 bg-night border border-white/10 rounded-xl px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Order</label>
                  <input
                    type="number"
                    value={editingHp.display_order}
                    onChange={(e) => updateHp('display_order', Number(e.target.value))}
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Hot</label>
                  <button
                    type="button"
                    onClick={() => updateHp('is_hot', !editingHp.is_hot)}
                    className={`w-full flex items-center justify-between bg-night border border-white/10 rounded-xl px-3 py-2.5 ${
                      editingHp.is_hot ? 'border-gold/40 text-gold' : 'text-white/50'
                    }`}
                  >
                    <span className="text-sm">{editingHp.is_hot ? 'Yes' : 'No'}</span>
                    {editingHp.is_hot ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Active</label>
                  <button
                    type="button"
                    onClick={() => updateHp('is_active', !editingHp.is_active)}
                    className={`w-full flex items-center justify-between bg-night border border-white/10 rounded-xl px-3 py-2.5 ${
                      editingHp.is_active ? 'border-fresh/40 text-fresh' : 'text-white/50'
                    }`}
                  >
                    <span className="text-sm">{editingHp.is_active ? 'On' : 'Off'}</span>
                    {editingHp.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-night-card/95 backdrop-blur-xl border-t border-white/10 p-5 flex gap-3">
              <button
                onClick={() => {
                  setEditingHp(null)
                  setIsCreatingHp(false)
                }}
                className="flex-1 border border-white/10 text-white/70 py-3 rounded-full text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveHp}
                disabled={savingHp}
                className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3 rounded-full text-sm disabled:opacity-60"
              >
                {savingHp ? 'Saving...' : isCreatingHp ? 'Create' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}