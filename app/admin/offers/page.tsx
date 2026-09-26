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
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Gift,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

type Offer = {
  id: string
  title: string
  description: string
  image_url: string | null
  is_active: boolean
  start_date: string | null
  end_date: string | null
  priority: number
}

const EMPTY: Omit<Offer, 'id'> = {
  title: '',
  description: '',
  image_url: null,
  is_active: true,
  start_date: null,
  end_date: null,
  priority: 0,
}

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<Offer | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState(false)

  useEffect(() => {
    loadOffers()
  }, [])

  const loadOffers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      setOffers(data || [])
    } catch (err: any) {
      console.error('Failed to load offers:', err)
      setError('Failed to load offers')
    }
    setLoading(false)
  }

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    setUploadSuccess(false)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `offer-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('offer-banners')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage
        .from('offer-banners')
        .getPublicUrl(fileName)

      if (editing) {
        setEditing({ ...editing, image_url: urlData.publicUrl })
      }

      // ✅ Success feedback
      setUploadSuccess(true)
      setSuccess('Image uploaded successfully!')
      setTimeout(() => {
        setSuccess('')
        setUploadSuccess(false)
      }, 3500)
    } catch (err: any) {
      console.error('Upload failed:', err)
      setError('Image upload failed: ' + err.message)
      setTimeout(() => setError(''), 4000)
    }
    setUploading(false)
  }

  const handleRemoveImage = () => {
    if (editing) {
      setEditing({ ...editing, image_url: null })
      setUploadSuccess(false)
      setSuccess('Image removed')
      setTimeout(() => setSuccess(''), 2000)
    }
  }

  const handleSave = async () => {
    if (!editing) return
    if (!editing.title.trim()) {
      alert('Title required')
      return
    }

    setSaving(true)
    try {
      if (isCreating) {
        const { error } = await supabase.from('offers').insert([editing])
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('offers')
          .update({ ...editing, updated_at: new Date().toISOString() })
          .eq('id', editing.id)
        if (error) throw error
      }
      await loadOffers()
      setEditing(null)
      setIsCreating(false)
      setSuccess(isCreating ? 'Offer created successfully!' : 'Offer updated!')
      setTimeout(() => setSuccess(''), 2500)
    } catch (err: any) {
      console.error('Save failed:', err)
      setError('Failed to save: ' + err.message)
      setTimeout(() => setError(''), 4000)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this offer?')) return
    try {
      const { error } = await supabase.from('offers').delete().eq('id', id)
      if (error) throw error
      await loadOffers()
      setSuccess('Offer deleted')
      setTimeout(() => setSuccess(''), 2000)
    } catch (err: any) {
      console.error('Delete failed:', err)
    }
  }

  const handleToggle = async (offer: Offer) => {
    try {
      const { error } = await supabase
        .from('offers')
        .update({ is_active: !offer.is_active })
        .eq('id', offer.id)
      if (error) throw error
      await loadOffers()
    } catch (err) {
      console.error('Toggle failed:', err)
    }
  }

  if (loading) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} />
        Loading offers...
      </div>
    )
  }

  const activeCount = offers.filter((o) => o.is_active).length

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-pink-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Offers & Banners
              </h1>
            </div>
            <p className="text-white/50 text-sm flex items-center gap-2 flex-wrap">
              <span>{offers.length} offers</span>
              <span>•</span>
              <span>{activeCount} active</span>
            </p>
          </div>
          <button
            onClick={() => {
              setEditing({ ...EMPTY, id: '' } as any)
              setIsCreating(true)
              setUploadSuccess(false)
            }}
            className="group bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-5 py-2.5 rounded-full transition-all hover:scale-105 shadow-lg shadow-gold/30 flex items-center gap-2 text-sm"
          >
            <Plus
              size={16}
              className="group-hover:rotate-90 transition-transform"
            />
            Add Offer
          </button>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 flex items-start gap-2 bg-fresh/10 border border-fresh/30 rounded-xl px-4 py-3 text-sm text-fresh animate-fadeIn">
            <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-300 animate-fadeIn">
            <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Offers Grid */}
        {offers.length === 0 ? (
          <div className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4 animate-bounce">🎁</div>
            <p className="text-white/60 mb-2 text-lg">No offers yet</p>
            <p className="text-white/40 text-sm mb-5">
              Create your first offer to show customers
            </p>
            <button
              onClick={() => {
                setEditing({ ...EMPTY, id: '' } as any)
                setIsCreating(true)
              }}
              className="bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full text-sm hover:scale-105 transition"
            >
              + Create Offer
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offers.map((offer, i) => (
              <div
                key={offer.id}
                className={`relative group bg-night-card/80 backdrop-blur-xl border rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-gold/5 ${
                  offer.is_active
                    ? 'border-gold/30 hover:border-gold/60'
                    : 'border-white/5 opacity-60 hover:opacity-90'
                }`}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${i * 0.05}s both`,
                }}
              >
                {/* Image */}
                {offer.image_url ? (
                  <div className="relative w-full h-40 bg-night overflow-hidden">
                    <img
                      src={offer.image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" />
                    {offer.is_active && (
                      <span className="absolute top-3 left-3 text-[10px] bg-fresh/90 text-night px-2.5 py-1 rounded-full font-bold uppercase tracking-wide flex items-center gap-1 shadow-lg">
                        <CheckCircle2 size={10} /> ACTIVE
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-gold/20 to-gold-dark/10 flex items-center justify-center">
                    <ImageIcon size={40} className="text-gold/40" />
                  </div>
                )}

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold mb-1 line-clamp-1">{offer.title}</h3>
                  <p className="text-xs text-white/50 line-clamp-2 mb-3">
                    {offer.description}
                  </p>

                  {(offer.start_date || offer.end_date) && (
                    <div className="flex items-center gap-1.5 text-[10px] text-white/40 mb-3">
                      <Calendar size={10} />
                      {offer.start_date
                        ? new Date(offer.start_date).toLocaleDateString('en-IN')
                        : 'Now'}{' '}
                      →{' '}
                      {offer.end_date
                        ? new Date(offer.end_date).toLocaleDateString('en-IN')
                        : 'Never'}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditing(offer)
                        setIsCreating(false)
                        setUploadSuccess(false)
                      }}
                      className="flex-1 text-xs bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 font-semibold px-3 py-2 rounded-full transition border border-blue-400/20"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggle(offer)}
                      className={`flex-1 text-xs font-semibold px-3 py-2 rounded-full transition border flex items-center justify-center gap-1 ${
                        offer.is_active
                          ? 'bg-gold/10 hover:bg-gold/20 text-gold border-gold/30'
                          : 'bg-fresh/10 hover:bg-fresh/20 text-fresh border-fresh/30'
                      }`}
                    >
                      {offer.is_active ? (
                        <>
                          <ToggleRight size={12} /> Active
                        </>
                      ) : (
                        <>
                          <ToggleLeft size={12} /> Inactive
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(offer.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit / Create Modal */}
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
            className="bg-night-card border border-gold/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-gold/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-night-card/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Gift size={18} className="text-gold" />
                {isCreating ? 'Add New Offer' : 'Edit Offer'}
              </h2>
              <button
                onClick={() => {
                  setEditing(null)
                  setIsCreating(false)
                  setUploadSuccess(false)
                }}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-xs text-white/60 mb-2 font-medium">
                  Banner Image
                </label>
                {editing.image_url ? (
                  <div className="relative rounded-xl overflow-hidden border border-fresh/40">
                    <img
                      src={editing.image_url}
                      alt="Banner"
                      className="w-full h-40 object-cover"
                    />
                    {/* Success Badge */}
                    <div className="absolute top-2 left-2 bg-fresh/90 backdrop-blur text-night text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider flex items-center gap-1 shadow-lg animate-fadeIn">
                      <CheckCircle2 size={10} /> Uploaded
                    </div>
                    <button
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-500 rounded-full transition hover:scale-110"
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
                    <div
                      className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
                        uploadSuccess
                          ? 'border-fresh/50 bg-fresh/5'
                          : 'border-white/10 hover:border-gold/50'
                      }`}
                    >
                      {uploading ? (
                        <div className="flex flex-col items-center gap-2">
                          <Loader2
                            size={24}
                            className="animate-spin text-gold"
                          />
                          <p className="text-xs text-white/60">Uploading...</p>
                        </div>
                      ) : uploadSuccess ? (
                        <div className="flex flex-col items-center gap-2 animate-fadeIn">
                          <CheckCircle2 size={24} className="text-fresh" />
                          <p className="text-xs text-fresh font-semibold">
                            Upload Successful!
                          </p>
                          <p className="text-[10px] text-white/40">
                            Click to upload another
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center gap-2">
                          <Upload size={24} className="text-gold" />
                          <p className="text-xs text-white/60">
                            Click to upload banner
                          </p>
                          <p className="text-[10px] text-white/30">
                            PNG, JPG • Max 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </label>
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">
                  Title *
                </label>
                <input
                  type="text"
                  value={editing.title}
                  onChange={(e) =>
                    setEditing({ ...editing, title: e.target.value })
                  }
                  placeholder="e.g. Diwali Special 30% OFF"
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-white/60 mb-1.5 font-medium">
                  Description
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={2}
                  placeholder="Short description for customers"
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition resize-none"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={
                      editing.start_date
                        ? editing.start_date.split('T')[0]
                        : ''
                    }
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        start_date: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={
                      editing.end_date ? editing.end_date.split('T')[0] : ''
                    }
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        end_date: e.target.value
                          ? new Date(e.target.value).toISOString()
                          : null,
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Priority + Active */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">
                    Priority (higher = show first)
                  </label>
                  <input
                    type="number"
                    value={editing.priority}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        priority: Number(e.target.value),
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5 font-medium">
                    Status
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setEditing({ ...editing, is_active: !editing.is_active })
                    }
                    className={`w-full flex items-center justify-between bg-night border border-white/10 rounded-xl px-3 py-2.5 transition ${
                      editing.is_active
                        ? 'border-fresh/40 text-fresh'
                        : 'text-white/50'
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {editing.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {editing.is_active ? (
                      <ToggleRight size={22} />
                    ) : (
                      <ToggleLeft size={22} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-night-card/95 backdrop-blur-xl border-t border-white/10 p-5 flex gap-3">
              <button
                onClick={() => {
                  setEditing(null)
                  setIsCreating(false)
                  setUploadSuccess(false)
                }}
                className="flex-1 border border-white/10 text-white/70 hover:bg-white/5 py-3 rounded-full transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || uploading}
                className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3 rounded-full hover:scale-[1.02] transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-gold/20 disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    <Save size={16} /> {isCreating ? 'Create' : 'Save'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}