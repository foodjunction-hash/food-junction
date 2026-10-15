'use client'

import { useState } from 'react'
import { Plus, Star, Flame, Minus } from 'lucide-react'
import { useCart } from '@/lib/store'
import { type FoodItem } from '@/lib/data'

export default function FoodCard({ item }: { item: FoodItem }) {
  const addItem = useCart((s) => s.addItem)
  const updateQty = useCart((s) => s.updateQty)
  const cartItem = useCart((s) => s.items.find((i) => i.id === item.id))
  const quantity = cartItem?.quantity || 0

  const [portion, setPortion] = useState<'full' | 'half'>('full')

  const hasHalf = item.halfAvailable && item.halfPrice && item.halfPrice > 0
  const selectedPrice = hasHalf && portion === 'half'
    ? item.halfPrice!
    : (item.discountPrice || item.price)

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: hasHalf ? `${item.name} (${portion === 'half' ? 'Half' : 'Full'})` : item.name,
      price: selectedPrice,
      image: item.emoji,
      quantity: 1,
      portion: hasHalf ? portion : undefined,
    })
  }

  return (
    <div className="group relative bg-night-card rounded-2xl overflow-hidden border border-white/5 hover:border-gold/40 transition-all duration-500 card-premium flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-gold/0 via-gold/0 to-gold/0 group-hover:from-gold/5 group-hover:to-fresh/5 transition-all duration-500 pointer-events-none z-0" />

      {/* Image Area */}
      <div className="relative aspect-square flex items-center justify-center bg-gradient-to-br from-gold/5 to-fresh/5 overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gold/20 blur-2xl" />
        </div>

        <span className="relative text-7xl md:text-8xl group-hover:scale-110 transition-transform duration-500 select-none">
          {item.emoji}
        </span>

        {item.isBestseller && (
          <span className="absolute top-3 left-3 glass-gold border border-gold/40 text-gold text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-gold">
            <Star size={10} fill="currentColor" className="animate-pulse" />
            BESTSELLER
          </span>
        )}

        {item.isSpicy && (
          <span className="absolute top-3 right-3 bg-red-500/20 backdrop-blur border border-red-500/40 text-red-400 text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Flame size={10} className="animate-pulse" />
            SPICY
          </span>
        )}

        <span
          className={`absolute bottom-3 left-3 w-5 h-5 rounded border-2 flex items-center justify-center bg-night/80 backdrop-blur ${
            item.isVeg ? 'border-fresh' : 'border-red-500'
          }`}
          aria-label={item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              item.isVeg ? 'bg-fresh' : 'bg-red-500'
            }`}
          />
        </span>

        {item.discountPrice && (
          <span className="absolute bottom-3 right-3 bg-fresh text-night text-[10px] font-bold px-2 py-0.5 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]">
            {Math.round(
              ((item.price - item.discountPrice) / item.price) * 100
            )}
            % OFF
          </span>
        )}
      </div>

      {/* Details */}
      <div className="relative p-4 flex flex-col flex-1 z-10">
        <h3 className="font-bold text-sm md:text-base mb-1.5 group-hover:text-gold transition-colors line-clamp-1">
          {item.name}
        </h3>

        <p className="text-xs text-white/50 line-clamp-2 mb-3 flex-1 leading-relaxed">
          {item.description}
        </p>

        {/* Full/Half Selector */}
        {hasHalf && (
          <div className="flex gap-1.5 mb-3 p-1 rounded-full bg-night border border-white/10">
            <button
              onClick={() => setPortion('full')}
              className={`flex-1 text-xs font-bold py-1.5 px-3 rounded-full transition-all ${
                portion === 'full'
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-gold'
                  : 'text-white/60 hover:text-gold'
              }`}
            >
              Full ₹{item.discountPrice || item.price}
            </button>
            <button
              onClick={() => setPortion('half')}
              className={`flex-1 text-xs font-bold py-1.5 px-3 rounded-full transition-all ${
                portion === 'half'
                  ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-gold'
                  : 'text-white/60 hover:text-gold'
              }`}
            >
              Half ₹{item.halfPrice}
            </button>
          </div>
        )}

        {/* Price + Add */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-gold font-bold text-base md:text-lg">
              ₹{selectedPrice}
            </span>
            {portion === 'full' && item.discountPrice && (
              <span className="text-white/30 text-xs line-through">
                ₹{item.price}
              </span>
            )}
          </div>

          {quantity > 0 && !hasHalf ? (
            <div className="flex items-center gap-0.5 bg-gradient-to-br from-night to-night-soft rounded-full border border-gold/50 p-0.5">
              <button
                onClick={() => updateQty(item.id, quantity - 1)}
                className="w-7 h-7 rounded-full text-gold font-bold hover:bg-gold/10 active:scale-95 transition-all flex items-center justify-center"
              >
                <Minus size={12} strokeWidth={3} />
              </button>
              <span className="text-gold font-bold text-sm w-6 text-center">
                {quantity}
              </span>
              <button
                onClick={handleAdd}
                className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-dark text-night font-bold hover:brightness-110 active:scale-95 transition-all flex items-center justify-center shadow-gold"
              >
                <Plus size={12} strokeWidth={3} />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="group/btn flex items-center gap-1 bg-gold/10 text-gold border border-gold/40 px-3.5 py-1.5 rounded-full text-xs font-bold hover:bg-gradient-to-br hover:from-gold hover:to-gold-dark hover:text-night hover:border-gold transition-all duration-300 hover:scale-105 active:scale-95"
              aria-label={`Add ${item.name} to cart`}
            >
              <Plus size={12} className="group-hover/btn:rotate-90 transition-transform duration-300" />
              <span>ADD</span>
            </button>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
  )
}
