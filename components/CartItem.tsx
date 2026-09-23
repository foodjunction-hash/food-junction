'use client'

import { Trash2 } from 'lucide-react'
import { useCart, type CartItem as CartItemType } from '@/lib/store'

export default function CartItem({ item }: { item: CartItemType }) {
  const updateQty = useCart((s) => s.updateQty)
  const removeItem = useCart((s) => s.removeItem)

  const itemTotal = item.price * item.quantity

  return (
    <div className="bg-night-card rounded-2xl border border-white/5 hover:border-gold/30 transition p-4 flex gap-4 items-start">
      {/* Image / Emoji */}
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br from-gold/10 to-fresh/10 flex items-center justify-center text-3xl md:text-4xl flex-shrink-0">
        {item.image}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm md:text-base mb-1 truncate">{item.name}</h3>
        <p className="text-gold font-semibold text-sm mb-2">
          ₹{item.price} <span className="text-white/40 text-xs font-normal">each</span>
        </p>

        {/* Quantity controls + Total */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-night rounded-full border border-gold/40 p-0.5">
            <button
              onClick={() => updateQty(item.id, item.quantity - 1)}
              className="w-7 h-7 rounded-full text-gold font-bold hover:bg-gold/10 transition"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="text-gold font-bold text-sm w-6 text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQty(item.id, item.quantity + 1)}
              className="w-7 h-7 rounded-full bg-gold text-night font-bold hover:bg-gold-light transition"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-white font-bold text-base">
              ₹{itemTotal}
            </span>
            <button
              onClick={() => removeItem(item.id)}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 rounded-full transition"
              aria-label="Remove item"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}