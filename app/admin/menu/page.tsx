'use client'

import { useEffect, useState, useMemo } from 'react'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  Flame,
  X,
  Save,
  Loader2,
  Package,
  CheckCircle2,
  XCircle,
  Sparkles,
  Layers,
  Image as ImageIcon,
  Upload,
} from 'lucide-react'
import { CATEGORIES, type FoodItem } from '@/lib/data'
import { useToast } from '@/components/Toast'
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleMenuItemAvailability,
} from '@/lib/menuSupabase'
import AdminLoading from '@/components/AdminLoading'

const EMPTY_FORM: FoodItem = {
  id: '',
  name: '',
  description: '',
  price: 0,
  discountPrice: undefined,
  emoji: '🍽️',
  category: 'maincourse',
  isVeg: true,
  isBestseller: false,
  isSpicy: false,
  isAvailable: true,
  halfPrice: undefined,
  halfAvailable: false,
}

// ============================================
// Available menu images (from public/menu-images/)
// ============================================
const MENU_IMAGES = [
  { file: 'biryani.jpg', label: 'Biryani' },
  { file: 'pizza.jpg', label: 'Pizza' },
  { file: 'burger.jpg', label: 'Burger' },
  { file: 'chicken.jpg', label: 'Chicken' },
  { file: 'paneer.jpg', label: 'Paneer' },
  { file: 'noodles.jpg', label: 'Noodles' },
  { file: 'dosa.jpg', label: 'Dosa' },
  { file: 'samosa.jpg', label: 'Samosa' },
  { file: 'chai.jpg', label: 'Chai' },
  { file: 'coffee.jpg', label: 'Coffee' },
  { file: 'cake.jpg', label: 'Cake' },
  { file: 'icecream.jpg', label: 'Ice Cream' },
  { file: 'sandwich.jpg', label: 'Sandwich' },
  { file: 'pasta.jpg', label: 'Pasta' },
  { file: 'momos.jpg', label: 'Momos' },
  { file: 'tandoori.jpg', label: 'Tandoori' },
  { file: 'roll.jpg', label: 'Roll' },
  { file: 'soup.jpg', label: 'Soup' },
  { file: 'salad.jpg', label: 'Salad' },
  { file: 'thali.jpg', label: 'Thali' },
  { file: 'shakes.jpg', label: 'Shakes' },
  { file: 'kebab.jpg', label: 'Kebab' },
  { file: 'fries.jpg', label: 'Fries' },
  { file: 'pavbhaji.jpg', label: 'Pav Bhaji' },
]

export default function AdminMenuPage() {
  const toast = useToast()
  const [items, setItems] = useState<FoodItem[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editing, setEditing] = useState<FoodItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [showImagePicker, setShowImagePicker] = useState(false)

  const loadItems = async () => {
    setLoading(true)
    const data = await getMenuItems()
    setItems(data)
    setLoading(false)
  }

  useEffect(() => {
    loadItems()
  }, [])

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter)
        return false
      if (
        search &&
        !item.name.toLowerCase().includes(search.toLowerCase())
      )
        return false
      return true
    })
  }, [items, search, categoryFilter])

  const handleCreate = () => {
    setEditing({ ...EMPTY_FORM })
    setIsCreating(true)
  }

  const handleEdit = (item: FoodItem) => {
    setEditing({ ...item })
    setIsCreating(false)
  }

  const handleSave = async () => {
    if (!editing) return
    if (!editing.name.trim()) {
      toast.error('Name required')
      return
    }
    if (editing.price <= 0) {
      toast.error('Valid price required')
      return
    }

    setSaving(true)
    try {
      if (isCreating) {
        const result = await createMenuItem(editing)
        if (!result.success) throw new Error(result.error)
        toast.success('Item created successfully!')
      } else {
        const result = await updateMenuItem(editing.id, editing)
        if (!result.success) throw new Error(result.error)
        toast.success('Item updated!')
      }
      await loadItems()
      setEditing(null)
      setIsCreating(false)
    } catch (err: any) {
      console.error(err)
      toast.error('Failed to save: ' + err.message)
    }
    setSaving(false)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this item?')) return
    const result = await deleteMenuItem(id)
    if (result.success) {
      await loadItems()
      toast.success('Item deleted')
    } else {
      toast.error('Failed to delete item')
    }
  }

  const handleToggleAvailable = async (item: FoodItem) => {
    const result = await toggleMenuItemAvailability(item.id, !item.isAvailable)
    if (result.success) {
      await loadItems()
      toast.success(
        item.isAvailable ? 'Marked out of stock' : 'Marked available'
      )
    } else {
      toast.error('Failed to update availability')
    }
  }

  const handleUploadImage = async (file: File) => {
    if (!editing) return
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large (max 5MB)')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setEditing({ ...editing, emoji: reader.result as string })
      toast.success('Image uploaded!')
    }
    reader.readAsDataURL(file)
  }

  if (loading) {
    return <AdminLoading message="Loading Menu" />
  }

  const isImageUrl = (str: string) => {
    return str.startsWith('http') || str.startsWith('/') || str.startsWith('data:')
  }

  const statsData = [
    {
      label: 'Total Items',
      value: items.length,
      icon: Package,
      gradient: 'from-amber-500/20 via-yellow-500/5 to-transparent',
      border: 'border-amber-500/30',
      iconBg: 'bg-gradient-to-br from-amber-400 to-yellow-600',
      color: 'text-gold',
      trend: `${CATEGORIES.filter((c) => c.id !== 'all' && items.some((i) => i.category === c.id)).length} categories`,
    },
    {
      label: 'Available',
      value: items.filter((i) => i.isAvailable).length,
      icon: CheckCircle2,
      gradient: 'from-emerald-500/20 via-green-500/5 to-transparent',
      border: 'border-emerald-500/30',
      iconBg: 'bg-gradient-to-br from-emerald-400 to-green-600',
      color: 'text-fresh',
      trend: 'in stock',
    },
    {
      label: 'Out of Stock',
      value: items.filter((i) => !i.isAvailable).length,
      icon: XCircle,
      gradient: 'from-red-500/20 via-pink-500/5 to-transparent',
      border: 'border-red-500/30',
      iconBg: 'bg-gradient-to-br from-red-400 to-pink-600',
      color: 'text-red-400',
      trend: 'unavailable',
    },
    {
      label: 'Bestsellers',
      value: items.filter((i) => i.isBestseller).length,
      icon: Star,
      gradient: 'from-purple-500/20 via-pink-500/5 to-transparent',
      border: 'border-purple-500/30',
      iconBg: 'bg-gradient-to-br from-purple-400 to-pink-600',
      color: 'text-purple-400',
      trend: 'top rated',
    },
  ]

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gradient-to-br from-night via-night to-night-soft relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-emerald-500/5 rounded-full blur-[100px] animate-pulse" />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={20} className="text-gold animate-pulse" />
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent">
                Menu Management
              </h1>
            </div>
            <p className="text-white/50 text-sm flex items-center gap-2 flex-wrap">
              <span>{items.length} items</span>
              <span>•</span>
              <span>Live from database</span>
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="group bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-5 py-2.5 rounded-full transition flex items-center gap-2 text-sm shadow-lg shadow-gold/30 hover:scale-105"
          >
            <Plus size={16} className="group-hover:rotate-90 transition-transform" />
            Add Item
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {statsData.map((s, i) => (
            <div
              key={s.label}
              className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card/80 backdrop-blur-xl border ${s.border} rounded-2xl p-4 transition-all duration-500 hover:scale-[1.05] overflow-hidden`}
              style={{ animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both` }}
            >
              <div className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg mb-3`}>
                <s.icon size={18} className="text-night" strokeWidth={2.5} />
              </div>
              <p className={`text-3xl font-bold ${s.color} mb-0.5`}>{s.value}</p>
              <p className="text-xs text-white/50 font-medium">{s.label}</p>
              <p className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">{s.trend}</p>
            </div>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="mb-6 space-y-3">
          <div className="relative max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-night-card/80 border border-white/10 rounded-full pl-11 pr-11 py-3 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full"
              >
                <X size={14} className="text-white/40" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-lg shadow-gold/20 scale-105'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              All ({items.length})
            </button>
            {CATEGORIES.filter((c) => c.id !== 'all').map((c) => {
              const count = items.filter((i) => i.category === c.id).length
              if (count === 0) return null
              return (
                <button
                  key={c.id}
                  onClick={() => setCategoryFilter(c.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    categoryFilter === c.id
                      ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-lg shadow-gold/20 scale-105'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <span>{c.emoji}</span>
                  {c.name} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Items Grid */}
        {filtered.length === 0 ? (
          <div className="bg-night-card/80 border border-white/5 rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4 animate-bounce">🍽️</div>
            <p className="text-white/60 mb-2 text-lg">No items found</p>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full text-sm hover:scale-105 transition"
            >
              + Add First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`relative group bg-night-card/80 backdrop-blur-xl border rounded-2xl p-4 transition-all duration-300 overflow-hidden ${
                  item.isAvailable
                    ? 'border-white/5 hover:border-gold/50'
                    : 'border-red-500/30 opacity-70'
                }`}
                style={{ animation: `fadeInUp 0.4s ease-out ${i * 0.04}s both` }}
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 overflow-hidden ${
                    item.isAvailable
                      ? 'bg-gradient-to-br from-gold/20 via-gold/10 to-transparent'
                      : 'bg-gradient-to-br from-gray-500/20 to-transparent'
                  }`}>
                    {isImageUrl(item.emoji) ? (
                      <img
                        src={item.emoji}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>{item.emoji}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                      <p className="font-bold text-sm truncate">{item.name}</p>
                      {item.isBestseller && (
                        <Star size={12} className="text-gold animate-pulse" fill="currentColor" />
                      )}
                      {item.isSpicy && <Flame size={12} className="text-red-500" />}
                    </div>
                    <p className="text-xs text-white/50 line-clamp-2 mb-2">{item.description}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-gold font-bold text-base">₹{item.discountPrice || item.price}</span>
                      {item.discountPrice && (
                        <span className="text-white/40 text-xs line-through">₹{item.price}</span>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        item.isVeg ? 'bg-fresh/20 text-fresh' : 'bg-red-500/20 text-red-400'
                      }`}>
                        {item.isVeg ? 'VEG' : 'NON-VEG'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {!item.isAvailable && (
                    <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold flex items-center gap-1">
                      <XCircle size={9} /> OUT OF STOCK
                    </span>
                  )}
                  <span className="text-[10px] bg-white/5 text-white/60 px-2 py-1 rounded-full capitalize flex items-center gap-1">
                    <Layers size={9} />
                    {CATEGORIES.find((c) => c.id === item.category)?.emoji} {item.category}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleEdit(item)}
                    className="flex-1 text-xs bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 font-semibold px-3 py-2 rounded-full flex items-center justify-center gap-1.5 border border-blue-400/20 hover:scale-105 transition"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button
                    onClick={() => handleToggleAvailable(item)}
                    className={`flex-1 text-xs font-semibold px-3 py-2 rounded-full border flex items-center justify-center gap-1.5 hover:scale-105 transition ${
                      item.isAvailable
                        ? 'bg-gold/10 hover:bg-gold/20 text-gold border-gold/30'
                        : 'bg-fresh/10 hover:bg-fresh/20 text-fresh border-fresh/30'
                    }`}
                  >
                    {item.isAvailable ? (
                      <><XCircle size={12} /> Mark Out</>
                    ) : (
                      <><CheckCircle2 size={12} /> Available</>
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition hover:scale-110"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* EDIT MODAL */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-night/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => { setEditing(null); setIsCreating(false) }}
        >
          <div
            className="bg-night-card border border-gold/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-night-card/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-gold" />
                {isCreating ? 'Add New Item' : 'Edit Item'}
              </h2>
              <button onClick={() => { setEditing(null); setIsCreating(false) }} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Image Preview */}
              <div>
                <label className="block text-xs text-white/60 mb-2 font-medium">Image</label>
                <div className="flex items-center gap-3">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-gold/30 flex items-center justify-center bg-night text-4xl flex-shrink-0">
                    {isImageUrl(editing.emoji) ? (
                      <img src={editing.emoji} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <span>{editing.emoji || '🍽️'}</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(true)}
                      className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-2.5 rounded-full text-xs hover:scale-105 transition"
                    >
                      <ImageIcon size={14} /> Pick Image
                    </button>
                    <label className="w-full flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white/70 font-semibold py-2 rounded-full text-xs cursor-pointer">
                      <Upload size={12} /> Upload Custom
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleUploadImage(file)
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Name *</label>
                <input
                  type="text"
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                  placeholder="e.g. Chicken Biryani"
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-gold/50 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    value={editing.price || ''}
                    onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })}
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Discount (₹)</label>
                  <input
                    type="number"
                    value={editing.discountPrice || ''}
                    onChange={(e) => {
                      const val = e.target.value ? Number(e.target.value) : undefined;
                      // Validate: discount must be less than price
                      if (val && editing.price && val >= editing.price) {
                        toast.error('Discount price se kam hona chahiye');
                        return;
                      }
                      setEditing({ ...editing, discountPrice: val });
                    }}
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Full/Half Portion */}
              <div className="bg-night/60 border border-white/5 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold flex items-center gap-1.5">
                      🍽️ Full/Half Portion
                    </p>
                    <p className="text-[10px] text-white/40">
                      Half portion allow karo is item ke liye
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...editing, halfAvailable: !editing.halfAvailable })}
                    className={`w-11 h-6 rounded-full transition-all relative ${
                      editing.halfAvailable ? 'bg-gradient-to-r from-gold to-gold-dark' : 'bg-white/10'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                      editing.halfAvailable ? 'left-5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                {editing.halfAvailable && (
                  <div className="pt-2 border-t border-white/5">
                    <label className="block text-xs text-white/60 mb-1.5">Half Price (₹)</label>
                    <input
                      type="number"
                      value={editing.halfPrice || ''}
                      onChange={(e) => {
                        const val = e.target.value ? Number(e.target.value) : undefined;
                        // Validate: half price must be less than full price
                        const fullPrice = editing.discountPrice || editing.price;
                        if (val && fullPrice && val >= fullPrice) {
                          toast.error('Half price full price se kam hona chahiye');
                          return;
                        }
                        setEditing({ ...editing, halfPrice: val });
                      }}
                      placeholder="e.g. 150"
                      className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                    />
                    <p className="text-[10px] text-white/40 mt-1.5">
                      💡 Full price: ₹{editing.discountPrice || editing.price || 0}
                    </p>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                {[
                  { key: 'isVeg' as const, label: 'Vegetarian', emoji: '🟢' },
                  { key: 'isBestseller' as const, label: 'Bestseller', emoji: '⭐' },
                  { key: 'isSpicy' as const, label: 'Spicy', emoji: '🌶️' },
                  { key: 'isAvailable' as const, label: 'Available', emoji: '✅' },
                ].map((t) => (
                  <label key={t.key} className="flex items-center justify-between bg-night rounded-xl px-4 py-3 cursor-pointer border border-white/5">
                    <span className="text-sm font-medium">{t.emoji} {t.label}</span>
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, [t.key]: !editing[t.key] })}
                      className={`w-11 h-6 rounded-full transition-all relative ${
                        editing[t.key] ? 'bg-gradient-to-r from-gold to-gold-dark' : 'bg-white/10'
                      }`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                        editing[t.key] ? 'left-5' : 'left-0.5'
                      }`} />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            <div className="sticky bottom-0 bg-night-card/95 backdrop-blur-xl border-t border-white/10 p-5 flex gap-3">
              <button
                onClick={() => { setEditing(null); setIsCreating(false) }}
                className="flex-1 border border-white/10 text-white/70 hover:bg-white/5 py-3 rounded-full text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3 rounded-full hover:scale-[1.02] transition flex items-center justify-center gap-2 text-sm disabled:opacity-60"
              >
                {saving ? (
                  <><Loader2 size={16} className="animate-spin" /> Saving...</>
                ) : (
                  <><Save size={16} /> {isCreating ? 'Create' : 'Save'}</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMAGE PICKER MODAL */}
      {showImagePicker && editing && (
        <div
          className="fixed inset-0 z-[60] bg-night/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowImagePicker(false)}
        >
          <div
            className="bg-night-card border border-gold/20 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 bg-night-card/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <ImageIcon size={18} className="text-gold" />
                Pick Image ({MENU_IMAGES.length} available)
              </h2>
              <button onClick={() => setShowImagePicker(false)} className="p-2 hover:bg-white/10 rounded-full">
                <X size={20} />
              </button>
            </div>

            <div className="p-5">
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {MENU_IMAGES.map((img) => (
                  <button
                    key={img.file}
                    onClick={() => {
                      setEditing({ ...editing, emoji: `/menu-images/${img.file}` })
                      setShowImagePicker(false)
                      toast.success(`✅ ${img.label} selected!`)
                    }}
                    className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 ${
                      editing.emoji === `/menu-images/${img.file}`
                        ? 'border-gold ring-2 ring-gold/50'
                        : 'border-white/10 hover:border-gold/50'
                    }`}
                  >
                    <img
                      src={`/menu-images/${img.file}`}
                      alt={img.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-xs font-bold text-white text-center">{img.label}</p>
                    </div>
                    {editing.emoji === `/menu-images/${img.file}` && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gold text-night flex items-center justify-center">
                        <CheckCircle2 size={14} strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
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
