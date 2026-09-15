'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ShoppingCart, Menu as MenuIcon, X, User, MapPin, Phone, LogOut } from 'lucide-react'
import { useCart } from '@/lib/store'
import { getCustomerSession, logoutCustomer, type CustomerSession } from '@/lib/customerAuth'

export default function Header() {
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [session, setSession] = useState<CustomerSession | null>(null)
  const [mounted, setMounted] = useState(false)

  const cartCount = useCart((s) => s.items.reduce((sum, i) => sum + i.quantity, 0))

  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/offers', label: 'Offers' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
    { href: '/track-order', label: 'Track Order' },
  ]

  useEffect(() => {
    setSession(getCustomerSession())
    setMounted(true)
  }, [])

  const handleLogout = () => {
    logoutCustomer()
    setSession(null)
    setUserMenu(false)
    window.location.href = '/'
  }

  return (
    <>
      {/* Top Strip */}
      <div className="bg-gold text-night text-xs md:text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin size={14} />
            <span className="font-semibold">Amarpur</span>
          </div>
          <a href="tel:+919973318421" className="flex items-center gap-2 font-semibold">
            <Phone size={14} />
            <span>+91 99733 18421</span>
          </a>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 bg-night/95 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 md:gap-3">
            <img
              src="/food-junction-logo.png"
              alt="Food Junction Logo"
              className="w-11 h-11 md:w-14 md:h-14 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-lg md:text-xl text-gold font-bold">Food Junction</p>
              <p className="text-[10px] md:text-xs text-white/60 tracking-widest">THE FAMILY RESTAURANT</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium hover:text-gold transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            <Link href="/cart" className="relative p-2 hover:text-gold transition">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-gold text-night text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {mounted && session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenu(!userMenu)}
                  className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-full transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold text-sm">
                    {session.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-semibold max-w-[100px] truncate">
                    {session.name.split(' ')[0]}
                  </span>
                </button>

                {userMenu && (
                  <>
                    {/* Backdrop */}
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenu(false)}
                    />
                    {/* Dropdown */}
                    <div className="absolute right-0 top-full mt-2 w-52 bg-night-card border border-white/10 rounded-xl shadow-card z-50 overflow-hidden">
                      <div className="p-3 border-b border-white/10">
                        <p className="text-sm font-bold truncate">{session.name}</p>
                        <p className="text-xs text-white/50 truncate">{session.mobile}</p>
                      </div>
                      <Link
                        href="/profile"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 transition"
                      >
                        <User size={16} /> My Profile
                      </Link>
                      <Link
                        href="/track-order"
                        onClick={() => setUserMenu(false)}
                        className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-white/5 transition"
                      >
                        📍 My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition border-t border-white/10"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="p-2 hover:text-gold transition"
                aria-label="Login"
              >
                <User size={22} />
              </Link>
            )}

            <Link
              href="/menu"
              className="hidden md:inline-flex bg-gold text-night font-bold text-sm px-5 py-2.5 rounded-full hover:bg-gold-light transition"
            >
              Order Now
            </Link>

            <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
              {open ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="lg:hidden bg-night-soft border-t border-white/5">
            <nav className="px-4 py-4 space-y-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-lg hover:bg-night-card hover:text-gold transition font-medium"
                >
                  {l.label}
                </Link>
              ))}
              {session && (
                <Link
                  href="/profile"
                  onClick={() => setOpen(false)}
                  className="block py-3 px-4 rounded-lg hover:bg-night-card hover:text-gold transition font-medium"
                >
                  My Profile
                </Link>
              )}
              <Link
                href="/menu"
                onClick={() => setOpen(false)}
                className="block mt-3 text-center bg-gold text-night font-bold py-3 rounded-full"
              >
                ORDER NOW
              </Link>
            </nav>
          </div>
        )}
      </header>
    </>
  )
}