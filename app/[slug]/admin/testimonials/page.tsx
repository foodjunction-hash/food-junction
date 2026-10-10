'use client'

import { useEffect, useState } from 'react'
import {
  Plus, Upload, Trash2, Loader2, X, Save, Star, Sparkles,
  Eye, EyeOff, ToggleLeft, ToggleRight, MessageSquare,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'
import {
  getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial,
  uploadCustomerPhoto, type Testimonial,
} from '@/lib/testimonialsSupabase'

export default function AdminTestimonialsPage() {
  const toast = useToast()
  const { restaurant } = useRestaurant()
  const [items, setItems] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [restaurant])

  const load = async () => {
    if (!restaurant) return
    setLoading(true)
    const data = await getTestimonials(restaurant.id)
    setItems(data)
    setLoading(false)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    const result = await uploadCustomerPhoto(file)
    if (result.success && result.url && editing) {
      setEditing({ ...editing, customer_photo_url: result.url })
      toast.success('Photo uploaded!')
    } else toast.error('Upload failed')
    setUploading(false)
  }

  const handleSave = async () => {
    if (!editing || !restaurant) return
    if (!editing.customer_name.trim() || !editing.review.trim()) {
      toast.error('Name and review required'); return
    }
    setSaving(true)
    if (isCreating) {
      const { id, ...newItem } = editing
      const result = await createTestimonial({ ...newItem, restaurant_id: restaurant.id })
      if (result.success) { toast.success('Added!'); await load(); setEditing(null); setIsCreating(false) }
      else toast.error('Failed')
    } else {
      const result = await updateTestimonial(editing.id, editing)
      if (result.success) { toast.success('Updated!'); await load(); setEditing(null) }
      else toast.error('Failed')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this testimonial?')) return
    const result = await deleteTestimonial(id)
    if (result.success) { await load(); toast.success('Deleted') }
  }

  const handleToggle = async (item: Testimonial) => {
    const result = await updateTestimonial(item.id, { is_active: !item.is_active })
    if (result.success) { await load(); toast.success(item.is_active ? 'Hidden' : 'Visible') }
  }

  if (loading) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} /> Loading...
      </div>
    )
  }

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
      </div>

      <div className="relative z-10">
        <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Testimonials
              </h1>
            </div>
            <p className="text-white/50 text-sm">Customer reviews manage karo</p>
          </div>
          <button
            onClick={() => {
              setEditing({
                id: '', restaurant_id: restaurant?.id || null, customer_name: '',
                customer_photo_url: '', rating: 5, review: '', location: '',
                is_active: true, display_order: 0,
              })
              setIsCreating(true)
            }}
            className="bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-5 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/30 flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Review
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-night-card/80 border border-white/5 rounded-2xl">
            <MessageSquare size={48} className="text-gold/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-4">No testimonials yet</p>
            <button
              onClick={() => {
                setEditing({
                  id: '', restaurant_id: restaurant?.id || null, customer_name: '',
                  customer_photo_url: '', rating: 5, review: '', location: '',
                  is_active: true, display_order: 0,
                })
                setIsCreating(true)
              }}
              className="bg-gold text-night font-bold px-6 py-3 rounded-full text-sm"
            >
              Add First Review
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`relative group bg-night-card/80 border rounded-2xl p-5 transition ${
                  item.is_active ? 'border-gold/30' : 'border-white/5 opacity-60'
                }`}
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gold/40 flex-shrink-0 bg-night">
                    {item.customer_photo_url ? (
                      <img src={item.customer_photo_url} alt={item.customer_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold">
                        {item.customer_name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{item.customer_name}</p>
                    {item.location && <p className="text-[10px] text-white/40">{item.location}</p>}
                    <div className="flex gap-0.5 mt-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} size={10} fill={idx < item.rating ? '#F5B301' : 'none'} className={idx < item.rating ? 'text-gold' : 'text-white/20'} />
                      ))}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-white/60 line-clamp-3 mb-4 min-h-[48px]">
                  "{item.review}"
                </p>

                <div className="flex items-center gap-1.5">
                  <button onClick={() => { setEditing(item); setIsCreating(false) }} className="flex-1 text-xs bg-blue-400/10 text-blue-400 font-semibold px-2 py-2 rounded-full border border-blue-400/20">
                    Edit
                  </button>
                  <button onClick={() => handleToggle(item)} className="p-2 text-gold hover:bg-gold/10 rounded-full">
                    {item.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-full">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-night/80 backdrop-blur-md flex items-center justify-center p-4" onClick={() => { setEditing(null); setIsCreating(false) }}>
          <div className="bg-night-card border border-gold/20 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-night-card/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <MessageSquare size={18} className="text-gold" />
                {isCreating ? 'Add Testimonial' : 'Edit Testimonial'}
              </h2>
              <button onClick={() => { setEditing(null); setIsCreating(false) }} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gold/40 flex-shrink-0 bg-night">
                  {editing.customer_photo_url ? (
                    <img src={editing.customer_photo_url} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold text-xl">
                      {editing.customer_name.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <label className="cursor-pointer inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/80 hover:text-gold border border-white/10 hover:border-gold/40 px-4 py-2.5 rounded-full text-sm font-semibold transition">
                  {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                  Upload Photo
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
                </label>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Customer Name *</label>
                <input type="text" value={editing.customer_name} onChange={(e) => setEditing({ ...editing, customer_name: e.target.value })} placeholder="e.g. Rahul Kumar" className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm" />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Location</label>
                <input type="text" value={editing.location} onChange={(e) => setEditing({ ...editing, location: e.target.value })} placeholder="e.g. Amarpur" className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm" />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((r) => (
                    <button key={r} type="button" onClick={() => setEditing({ ...editing, rating: r })} className="transition hover:scale-110">
                      <Star size={28} fill={r <= editing.rating ? '#F5B301' : 'none'} className={r <= editing.rating ? 'text-gold' : 'text-white/20'} />
                    </button>
                  ))}
                  <span className="text-sm text-white/60 ml-2">{editing.rating}/5</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Review *</label>
                <textarea value={editing.review} onChange={(e) => setEditing({ ...editing, review: e.target.value })} rows={3} placeholder="Customer ka review..." className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Order</label>
                  <input type="number" value={editing.display_order} onChange={(e) => setEditing({ ...editing, display_order: Number(e.target.value) })} className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">Status</label>
                  <button type="button" onClick={() => setEditing({ ...editing, is_active: !editing.is_active })} className={`w-full flex items-center justify-between bg-night border border-white/10 rounded-xl px-3 py-2.5 ${editing.is_active ? 'border-fresh/40 text-fresh' : 'text-white/50'}`}>
                    <span className="text-sm">{editing.is_active ? 'Visible' : 'Hidden'}</span>
                    {editing.is_active ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-night-card/95 backdrop-blur-xl border-t border-white/10 p-5 flex gap-3">
              <button onClick={() => { setEditing(null); setIsCreating(false) }} className="flex-1 border border-white/10 text-white/70 py-3 rounded-full text-sm">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading} className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3 rounded-full text-sm disabled:opacity-60">
                {saving ? 'Saving...' : isCreating ? 'Add' : 'Save'}
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