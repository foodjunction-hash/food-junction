'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingBag, ArrowRight } from 'lucide-react'
import { useCart } from '@/lib/store'

export default function StickyCart() {
  const pathname = usePathname()
  const items = useCart((s) => s.items)
  const getCount = useCart((s) => s.getCount)
  const getSubtotal = useCart((s) => s.getSubtotal)

  const count = getCount()
  const subtotal = getSubtotal()

  // Hide on cart & checkout pages, and when cart empty
  if (items.length === 0) return null
  if (pathname === '/cart' || pathname === '/checkout') return null

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-night/95 backdrop-blur-md border-t border-gold/30">
      <Link
        href="/cart"
        className="flex items-center justify-between bg-gold text-night rounded-full px-5 py-3.5 font-bold shadow-gold"
      >
        <div className="flex items-center gap-2">
          <ShoppingBag size={20} />
          <span className="text-sm">
            {count} {count === 1 ? 'item' : 'items'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-base">₹{subtotal}</span>
          <ArrowRight size={18} />
        </div>
      </Link>
    </div>
  )
}