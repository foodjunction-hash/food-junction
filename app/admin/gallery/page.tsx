'use client'

import { useEffect, useState } from 'react'
import {
  Plus, Upload, Trash2, Loader2, X, Save, Image as ImageIcon,
  Sparkles, CheckCircle2, Eye, EyeOff, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { useToast } from '@/components/Toast'
import { useRestaurant } from '@/lib/restaurantContext'
import {
  getGallery, createGalleryItem, updateGalleryItem, deleteGalleryItem,
  uploadGalleryImage, type GalleryItem,
} from '@/lib/gallerySupabase'

const CATEGORIES = ['general', 'food', 'interior', 'team', 'events']

export default function AdminGalleryPage() {
  const toast = useToast()
  const { restaurant } = useRestaurant()
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<GalleryItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [restaurant])

  const load = async () => {
    if (!restaurant) return
    setLoading(true)
    const data = await getGallery(restaurant.id)
    setItems(data)
    setLoading(false)
  }

  const handleUpload = async (file: File) => {
    setUploading(true)
    const result = await uploadGalleryImage(file)
    if (result.success && result.url && editing) {
      setEditing({ ...editing, image_url: result.url })
      toast.success('Image uploaded!')
    } else {
      toast.error('Upload failed')
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!editing || !restaurant) return
    if (!editing.image_url) { toast.error('Image required'); return }
    setSaving(true)
    if (isCreating) {
      const { id, ...newItem } = editing
      const result = await createGalleryItem({ ...newItem, restaurant_id: restaurant.id })
      if (result.success) { toast.success('Added!'); await load(); setEditing(null); setIsCreating(false) }
      else toast.error('Failed')
    } else {
      const result = await updateGalleryItem(editing.id, editing)
      if (result.success) { toast.success('Updated!'); await load(); setEditing(null) }
      else toast.error('Failed')
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this image?')) return
    const result = await deleteGalleryItem(id)
    if (result.success) { await load(); toast.success('Deleted') }
    else toast.error('Failed')
  }

  const handleToggle = async (item: GalleryItem) => {
    const result = await updateGalleryItem(item.id, { is_active: !item.is_active })
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
                Gallery Management
              </h1>
            </div>
            <p className="text-white/50 text-sm">Photos upload karo, caption do, reorder karo</p>
          </div>
          <button
            onClick={() => {
              setEditing({
                id: '', restaurant_id: restaurant?.id || null, image_url: '',
                caption: '', category: 'general', display_order: 0, is_active: true,
              })
              setIsCreating(true)
            }}
            className="bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-5 py-2.5 rounded-full hover:scale-105 transition-all shadow-lg shadow-gold/30 flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Photo
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 bg-night-card/80 border border-white/5 rounded-2xl">
            <ImageIcon size={48} className="text-gold/40 mx-auto mb-3" />
            <p className="text-white/60 text-sm mb-4">No photos yet</p>
            <button
              onClick={() => {
                setEditing({
                  id: '', restaurant_id: restaurant?.id || null, image_url: '',
                  caption: '', category: 'general', display_order: 0, is_active: true,
                })
                setIsCreating(true)
              }}
              className="bg-gold text-night font-bold px-6 py-3 rounded-full text-sm"
            >
              Add First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map((item, i) => (
              <div
                key={item.id}
                className={`relative group bg-night-card/80 border rounded-2xl overflow-hidden transition ${
                  item.is_active ? 'border-gold/30' : 'border-white/5 opacity-50'
                }`}
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both` }}
              >
                <div className="relative aspect-square bg-night overflow-hidden">
                  <img src={item.image_url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-105 transition" />
                  {!item.is_active && (
                    <div className="absolute inset-0 bg-night/70 flex items-center justify-center">
                      <EyeOff size={24} className="text-white/70" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold line-clamp-1 mb-1">
                    {item.caption || 'No caption'}
                  </p>
                  <p className="text-[10px] text-gold/70 mb-2 uppercase tracking-wider">
                    {item.category}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setEditing(item); setIsCreating(false) }}
                      className="flex-1 text-xs bg-blue-400/10 text-blue-400 font-semibold px-2 py-1.5 rounded-full border border-blue-400/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggle(item)}
                      className="p-1.5 text-gold hover:bg-gold/10 rounded-full"
                    >
                      {item.is_active ? <Eye size={12} /> : <EyeOff size={12} />}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-full"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
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
                <ImageIcon size={18} className="text-gold" />
                {isCreating ? 'Add Photo' : 'Edit Photo'}
              </h2>
              <button onClick={() => { setEditing(null); setIsCreating(false) }} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs text-white/60 mb-2 font-medium">Photo *</label>
                {editing.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-fresh/40">
                    <img src={editing.image_url} alt="Preview" className="w-full h-48 object-cover" />
                    <button onClick={() => setEditing({ ...editing, image_url: '' })} className="absolute top-2 right-2 p-1.5 bg-red-500/90 rounded-full">
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="block cursor-pointer">
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleUpload(f) }} />
                    <div className="border-2 border-dashed border-white/10 hover:border-gold/50 rounded-xl p-8 text-center">
                      {uploading ? <Loader2 size={24} className="animate-spin text-gold mx-auto" /> : (
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
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Caption</label>
                <input type="text" value={editing.caption} onChange={(e) => setEditing({ ...editing, caption: e.target.value })} placeholder="e.g. Our special biryani" className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm" />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">Category</label>
                <select value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
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