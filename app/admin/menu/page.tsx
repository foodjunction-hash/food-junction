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
} from 'lucide-react'
import { FOOD_ITEMS, CATEGORIES, type FoodItem } from '@/lib/data'

const STORAGE_KEY = 'fj-menu'

function loadMenu(): FoodItem[] {
  if (typeof window === 'undefined') return FOOD_ITEMS
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return FOOD_ITEMS
    return JSON.parse(data)
  } catch {
    return FOOD_ITEMS
  }
}

function saveMenu(items: FoodItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

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
}

export default function AdminMenuPage() {
  const [items, setItems] = useState<FoodItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [editing, setEditing] = useState<FoodItem | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    setItems(loadMenu())
    setMounted(true)
  }, [])

  const updateItems = (newItems: FoodItem[]) => {
    setItems(newItems)
    saveMenu(newItems)
  }

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (categoryFilter !== 'all' && item.category !== categoryFilter) return false
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
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

  const handleSave = () => {
    if (!editing) return
    if (!editing.name.trim()) {
      alert('Name required')
      return
    }
    if (editing.price <= 0) {
      alert('Valid price required')
      return
    }

    if (isCreating) {
      const newItem: FoodItem = {
        ...editing,
        id: `p_${Date.now()}`,
        name: editing.name.trim(),
      }
      updateItems([newItem, ...items])
    } else {
      updateItems(items.map((i) => (i.id === editing.id ? editing : i)))
    }
    setEditing(null)
    setIsCreating(false)
  }

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    updateItems(items.filter((i) => i.id !== id))
  }

  const handleToggleAvailable = (id: string) => {
    updateItems(
      items.map((i) => (i.id === id ? { ...i, isAvailable: !i.isAvailable } : i))
    )
  }

  const handleReset = () => {
    if (!confirm('Reset all menu items to default? This will delete all your changes.')) return
    localStorage.removeItem(STORAGE_KEY)
    setItems(FOOD_ITEMS)
  }

  if (!mounted) {
    return <div className="p-6 text-white/60 text-sm">Loading menu...</div>
  }

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Menu Management</h1>
          <p className="text-white/50 text-sm">
            {items.length} items • Add, edit, delete food items
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2 rounded-full transition"
          >
            Reset to Default
          </button>
          <button
            onClick={handleCreate}
            className="bg-gold text-night font-bold px-4 py-2.5 rounded-full hover:bg-gold-light transition flex items-center gap-2 text-sm"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      {/* Search + Category filter */}
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
          />
          <input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-night-card border border-white/10 rounded-full pl-11 pr-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-night-card border border-white/10 rounded-full px-4 py-3 text-sm focus:border-gold/50 focus:outline-none"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
            <option key={c.id} value={c.id}>
              {c.emoji} {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Items grid */}
      {filtered.length === 0 ? (
        <div className="bg-night-card border border-white/5 rounded-2xl p-10 text-center">
          <div className="text-5xl mb-3">🍽️</div>
          <p className="text-white/60 mb-2">No items found</p>
          <p className="text-white/40 text-xs mb-4">Try changing filter or add a new item</p>
          <button
            onClick={handleCreate}
            className="bg-gold text-night font-bold px-5 py-2.5 rounded-full text-sm"
          >
            + Add First Item
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className={`bg-night-card border rounded-2xl p-4 transition ${
                item.isAvailable
                  ? 'border-white/5 hover:border-gold/40'
                  : 'border-red-500/30 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-gold/10 to-fresh/10 flex items-center justify-center text-3xl flex-shrink-0">
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm truncate">{item.name}</p>
                    {item.isBestseller && (
                      <Star size={12} className="text-gold flex-shrink-0" fill="currentColor" />
                    )}
                    {item.isSpicy && (
                      <Flame size={12} className="text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-white/50 line-clamp-1">
                    {item.description}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-gold font-bold text-sm">
                      ₹{item.discountPrice || item.price}
                    </span>
                    {item.discountPrice && (
                      <span className="text-white/40 text-xs line-through">
                        ₹{item.price}
                      </span>
                    )}
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded ${
                        item.isVeg
                          ? 'bg-fresh/20 text-fresh'
                          : 'bg-red-500/20 text-red-400'
                      }`}
                    >
                      {item.isVeg ? 'VEG' : 'NON-VEG'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-1 mb-3">
                {!item.isAvailable && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-bold">
                    UNAVAILABLE
                  </span>
                )}
                <span className="text-[10px] bg-white/5 text-white/60 px-2 py-0.5 rounded-full capitalize">
                  {item.category}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 text-xs bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 font-semibold px-3 py-2 rounded-full transition flex items-center justify-center gap-1"
                >
                  <Edit2 size={12} /> Edit
                </button>
                <button
                  onClick={() => handleToggleAvailable(item.id)}
                  className={`flex-1 text-xs font-semibold px-3 py-2 rounded-full transition ${
                    item.isAvailable
                      ? 'bg-gold/10 hover:bg-gold/20 text-gold'
                      : 'bg-fresh/10 hover:bg-fresh/20 text-fresh'
                  }`}
                >
                  {item.isAvailable ? 'Mark Out' : 'Mark Available'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {editing && (
        <div
          className="fixed inset-0 z-50 bg-night/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => {
            setEditing(null)
            setIsCreating(false)
          }}
        >
          <div
            className="bg-night-card border border-white/10 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-night-card border-b border-white/10 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg">
                {isCreating ? 'Add New Item' : 'Edit Item'}
              </h2>
              <button
                onClick={() => {
                  setEditing(null)
                  setIsCreating(false)
                }}
                className="p-2 hover:bg-white/10 rounded-full transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4">
              {/* Emoji + Name */}
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs text-white/60 mb-1.5">Emoji</label>
                  <input
                    type="text"
                    value={editing.emoji}
                    onChange={(e) =>
                      setEditing({ ...editing, emoji: e.target.value.slice(0, 4) })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-2xl text-center focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-white/60 mb-1.5">Name *</label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    placeholder="e.g. Chicken Biryani"
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-white/60 mb-1.5">Description</label>
                <textarea
                  value={editing.description}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  rows={2}
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none resize-none"
                />
              </div>

              {/* Price + Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">Price (₹) *</label>
                  <input
                    type="number"
                    value={editing.price || ''}
                    onChange={(e) =>
                      setEditing({ ...editing, price: Number(e.target.value) })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">
                    Discount Price (₹)
                  </label>
                  <input
                    type="number"
                    value={editing.discountPrice || ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        discountPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs text-white/60 mb-1.5">Category</label>
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:outline-none"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Toggles */}
              <div className="space-y-2">
                {[
                  { key: 'isVeg' as const, label: 'Vegetarian', emoji: '🟢' },
                  { key: 'isBestseller' as const, label: 'Bestseller', emoji: '⭐' },
                  { key: 'isSpicy' as const, label: 'Spicy', emoji: '🌶️' },
                  { key: 'isAvailable' as const, label: 'Available', emoji: '✅' },
                ].map((t) => (
                  <label
                    key={t.key}
                    className="flex items-center justify-between bg-night rounded-xl px-4 py-3 cursor-pointer"
                  >
                    <span className="text-sm">
                      {t.emoji} {t.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditing({ ...editing, [t.key]: !editing[t.key] })}
                      className={`w-11 h-6 rounded-full transition relative ${
                        editing[t.key] ? 'bg-gold' : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${
                          editing[t.key] ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-night-card border-t border-white/10 p-5 flex gap-3">
              <button
                onClick={() => {
                  setEditing(null)
                  setIsCreating(false)
                }}
                className="flex-1 border border-white/10 text-white/70 hover:bg-white/5 py-3 rounded-full transition text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 bg-gold text-night font-bold py-3 rounded-full hover:bg-gold-light transition flex items-center justify-center gap-2 text-sm"
              >
                <Save size={16} /> {isCreating ? 'Create Item' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}