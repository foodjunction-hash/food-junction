'use client'

import { Plus, Star, Flame } from 'lucide-react'
import { useCart } from '@/lib/store'
import type { FoodItem } from '@/lib/data'

export default function FoodCard({ item }: { item: FoodItem }) {
  const addItem = useCart((s) => s.addItem)
  const updateQty = useCart((s) => s.updateQty)
  const cartItem = useCart((s) => s.items.find((i) => i.id === item.id))
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.discountPrice || item.price,
      image: item.emoji,
      quantity: 1,
    })
  }

  return (
    <div className="group bg-night-card rounded-2xl overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-300 flex flex-col">
      {/* Image/Emoji area */}
      <div className="relative aspect-square flex items-center justify-center text-7xl md:text-8xl bg-gradient-to-br from-gold/5 to-fresh/5 group-hover:scale-105 transition-transform duration-500">
        {item.emoji}

        {/* Bestseller badge */}
        {item.isBestseller && (
          <span className="absolute top-3 left-3 bg-gold text-night text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Star size={10} fill="currentColor" /> BESTSELLER
          </span>
        )}

        {/* Spicy badge */}
        {item.isSpicy && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Flame size={10} /> SPICY
          </span>
        )}

        {/* Veg/Non-veg indicator */}
        <span
          className={`absolute bottom-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center bg-night ${
            item.isVeg ? 'border-fresh' : 'border-red-500'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-fresh' : 'bg-red-500'}`} />
        </span>
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-sm md:text-base mb-1 group-hover:text-gold transition line-clamp-1">
          {item.name}
        </h3>
        <p className="text-xs text-white/50 line-clamp-2 mb-3 flex-1">
          {item.description}
        </p>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-gold font-bold text-base md:text-lg">
              ₹{item.discountPrice || item.price}
            </span>
            {item.discountPrice && (
              <span className="text-white/40 text-xs line-through">₹{item.price}</span>
            )}
          </div>

          {quantity > 0 ? (
            <div className="flex items-center gap-1 bg-night rounded-full border border-gold/40 p-0.5">
              <button
                onClick={() => updateQty(item.id, quantity - 1)}
                className="w-7 h-7 rounded-full text-gold font-bold hover:bg-gold/10 transition"
              >
                −
              </button>
              <span className="text-gold font-bold text-sm w-5 text-center">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="w-7 h-7 rounded-full bg-gold text-night font-bold hover:bg-gold-light transition"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="flex items-center gap-1 bg-gold/10 text-gold border border-gold/40 px-3 py-1.5 rounded-full text-xs font-bold hover:bg-gold hover:text-night transition"
            >
              <Plus size={12} /> ADD
            </button>
          )}
        </div>
      </div>
    </div>
  )
}