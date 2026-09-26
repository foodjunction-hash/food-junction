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
  Activity,
  Layers,
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
      items.map((i) =>
        i.id === id ? { ...i, isAvailable: !i.isAvailable } : i
      )
    )
  }

  const handleReset = () => {
    if (
      !confirm(
        'Reset all menu items to default? This will delete all your changes.'
      )
    )
      return
    localStorage.removeItem(STORAGE_KEY)
    setItems(FOOD_ITEMS)
  }

  if (!mounted) {
    return (
      <div className="p-6 text-white/60 text-sm flex items-center gap-2">
        <Loader2 className="animate-spin text-gold" size={16} />
        Loading menu...
      </div>
    )
  }

  // Stats
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
      {/* Animated Background */}
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
              <span>Add, edit, delete food items</span>
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="text-xs text-white/50 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-2.5 rounded-full transition border border-white/5 hover:border-white/20"
            >
              Reset
            </button>
            <button
              onClick={handleCreate}
              className="relative group bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-5 py-2.5 rounded-full transition flex items-center gap-2 text-sm shadow-lg shadow-gold/30 hover:shadow-xl hover:shadow-gold/40 hover:scale-105"
            >
              <Plus
                size={16}
                className="group-hover:rotate-90 transition-transform duration-300"
              />
              Add Item
            </button>
          </div>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
          {statsData.map((s, i) => (
            <div
              key={s.label}
              className={`relative group bg-gradient-to-br ${s.gradient} bg-night-card/80 backdrop-blur-xl border ${s.border} rounded-2xl p-4 transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:shadow-gold/10 overflow-hidden cursor-pointer`}
              style={{
                animation: `fadeInUp 0.5s ease-out ${i * 0.08}s both`,
              }}
            >
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-white/5 to-transparent" />

              <div className="relative z-10">
                <div
                  className={`w-10 h-10 rounded-xl ${s.iconBg} flex items-center justify-center shadow-lg mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}
                >
                  <s.icon size={18} className="text-night" strokeWidth={2.5} />
                </div>

                <p className={`text-3xl font-bold ${s.color} mb-0.5 tracking-tight`}>
                  {s.value}
                </p>
                <p className="text-xs text-white/50 font-medium">{s.label}</p>
                <p className="text-[10px] text-white/30 mt-1 uppercase tracking-wider">
                  {s.trend}
                </p>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Search + Category Filter Pills */}
        <div className="mb-6 space-y-3">
          <div className="relative max-w-md group">
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 group-focus-within:text-gold transition-colors"
            />
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-night-card/80 backdrop-blur-xl border border-white/10 rounded-full pl-11 pr-11 py-3 text-sm focus:border-gold/50 focus:outline-none focus:ring-2 focus:ring-gold/20 transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full transition"
              >
                <X size={14} className="text-white/40" />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                categoryFilter === 'all'
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-lg shadow-gold/20 scale-105'
                  : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
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
                      : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
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
          <div
            className="bg-night-card/80 backdrop-blur-xl border border-white/5 rounded-2xl p-12 text-center"
            style={{ animation: 'fadeInUp 0.5s ease-out' }}
          >
            <div className="text-6xl mb-4 animate-bounce">🍽️</div>
            <p className="text-white/60 mb-2 text-lg">No items found</p>
            <p className="text-white/40 text-sm mb-5">
              Try changing filter or add a new item
            </p>
            <button
              onClick={handleCreate}
              className="bg-gradient-to-r from-gold to-gold-dark text-night font-bold px-6 py-3 rounded-full text-sm hover:scale-105 transition shadow-lg shadow-gold/20"
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
                    ? 'border-white/5 hover:border-gold/50 hover:shadow-xl hover:shadow-gold/5'
                    : 'border-red-500/30 opacity-70 hover:opacity-90'
                }`}
                style={{
                  animation: `fadeInUp 0.4s ease-out ${i * 0.04}s both`,
                }}
              >
                {/* Hover glow */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-gold/[0.03] to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Emoji container */}
                    <div
                      className={`relative w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 transition-transform duration-300 group-hover:scale-110 overflow-hidden ${
                        item.isAvailable
                          ? 'bg-gradient-to-br from-gold/20 via-gold/10 to-transparent'
                          : 'bg-gradient-to-br from-gray-500/20 to-transparent'
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/5 rounded-2xl" />
                      <span className="relative">{item.emoji}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                        <p className="font-bold text-sm truncate">
                          {item.name}
                        </p>
                        {item.isBestseller && (
                          <Star
                            size={12}
                            className="text-gold flex-shrink-0 animate-pulse"
                            fill="currentColor"
                          />
                        )}
                        {item.isSpicy && (
                          <Flame
                            size={12}
                            className="text-red-500 flex-shrink-0"
                          />
                        )}
                      </div>
                      <p className="text-xs text-white/50 line-clamp-2 leading-relaxed mb-2">
                        {item.description}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-gold font-bold text-base">
                          ₹{item.discountPrice || item.price}
                        </span>
                        {item.discountPrice && (
                          <span className="text-white/40 text-xs line-through">
                            ₹{item.price}
                          </span>
                        )}
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded font-bold tracking-wide ${
                            item.isVeg
                              ? 'bg-fresh/20 text-fresh border border-fresh/30'
                              : 'bg-red-500/20 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {item.isVeg ? 'VEG' : 'NON-VEG'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {!item.isAvailable && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded-full font-bold border border-red-500/30 flex items-center gap-1">
                        <XCircle size={9} /> OUT OF STOCK
                      </span>
                    )}
                    <span className="text-[10px] bg-white/5 text-white/60 px-2 py-1 rounded-full capitalize border border-white/10 flex items-center gap-1">
                      <Layers size={9} />
                      {CATEGORIES.find((c) => c.id === item.category)?.emoji}{' '}
                      {item.category}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex-1 text-xs bg-blue-400/10 hover:bg-blue-400/20 text-blue-400 font-semibold px-3 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 border border-blue-400/20 hover:border-blue-400/40 hover:scale-105"
                    >
                      <Edit2 size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleToggleAvailable(item.id)}
                      className={`flex-1 text-xs font-semibold px-3 py-2 rounded-full transition-all border flex items-center justify-center gap-1.5 hover:scale-105 ${
                        item.isAvailable
                          ? 'bg-gold/10 hover:bg-gold/20 text-gold border-gold/30'
                          : 'bg-fresh/10 hover:bg-fresh/20 text-fresh border-fresh/30'
                      }`}
                    >
                      {item.isAvailable ? (
                        <>
                          <XCircle size={12} /> Mark Out
                        </>
                      ) : (
                        <>
                          <CheckCircle2 size={12} /> Available
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-full transition-all hover:scale-110 border border-transparent hover:border-red-500/30"
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
          className="fixed inset-0 z-50 bg-night/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => {
            setEditing(null)
            setIsCreating(false)
          }}
        >
          <div
            className="bg-night-card border border-gold/20 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl shadow-gold/10 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-night-card/95 backdrop-blur-xl border-b border-white/10 p-5 flex items-center justify-between">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Sparkles size={18} className="text-gold" />
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

            {/* Body */}
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-4 gap-3">
                <div className="col-span-1">
                  <label className="block text-xs text-white/60 mb-1.5">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={editing.emoji}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        emoji: e.target.value.slice(0, 4),
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-2xl text-center focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                  />
                </div>
                <div className="col-span-3">
                  <label className="block text-xs text-white/60 mb-1.5">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={editing.name}
                    onChange={(e) =>
                      setEditing({ ...editing, name: e.target.value })
                    }
                    placeholder="e.g. Chicken Biryani"
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-3 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">
                  Description
                </label>
                <textarea
                  value={editing.description}
                  onChange={(e) =>
                    setEditing({ ...editing, description: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none resize-none transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-white/60 mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={editing.price || ''}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        price: Number(e.target.value),
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
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
                        discountPrice: e.target.value
                          ? Number(e.target.value)
                          : undefined,
                      })
                    }
                    className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-white/60 mb-1.5">
                  Category
                </label>
                <select
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                  className="w-full bg-night border border-white/10 rounded-xl px-3 py-2.5 text-sm focus:border-gold/50 focus:ring-2 focus:ring-gold/20 focus:outline-none transition"
                >
                  {CATEGORIES.filter((c) => c.id !== 'all').map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                {[
                  {
                    key: 'isVeg' as const,
                    label: 'Vegetarian',
                    emoji: '🟢',
                  },
                  {
                    key: 'isBestseller' as const,
                    label: 'Bestseller',
                    emoji: '⭐',
                  },
                  { key: 'isSpicy' as const, label: 'Spicy', emoji: '🌶️' },
                  {
                    key: 'isAvailable' as const,
                    label: 'Available',
                    emoji: '✅',
                  },
                ].map((t) => (
                  <label
                    key={t.key}
                    className="flex items-center justify-between bg-night rounded-xl px-4 py-3 cursor-pointer hover:bg-night-soft transition border border-white/5"
                  >
                    <span className="text-sm font-medium">
                      {t.emoji} {t.label}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setEditing({
                          ...editing,
                          [t.key]: !editing[t.key],
                        })
                      }
                      className={`w-11 h-6 rounded-full transition-all relative ${
                        editing[t.key]
                          ? 'bg-gradient-to-r from-gold to-gold-dark'
                          : 'bg-white/10'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all shadow-md ${
                          editing[t.key] ? 'left-5' : 'left-0.5'
                        }`}
                      />
                    </button>
                  </label>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-night-card/95 backdrop-blur-xl border-t border-white/10 p-5 flex gap-3">
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
                className="flex-1 bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3 rounded-full hover:scale-[1.02] transition flex items-center justify-center gap-2 text-sm shadow-lg shadow-gold/20"
              >
                <Save size={16} /> {isCreating ? 'Create Item' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  )
}