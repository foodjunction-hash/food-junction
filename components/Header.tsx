'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart,
  Menu as MenuIcon,
  X,
  User,
  LogOut,
} from 'lucide-react'
import { useCart } from '@/lib/store'
import { supabase } from '@/lib/supabase'

type HeaderUser = {
  name: string
  email: string
  mobile: string
  avatarUrl?: string
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [userMenu, setUserMenu] = useState(false)
  const [user, setUser] = useState<HeaderUser | null>(null)
  const [mounted, setMounted] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const cartCount = useCart((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  )

  const links = [
    { href: '/', label: 'Home' },
    { href: '/menu', label: 'Menu' },
    { href: '/offers', label: 'Offers' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
    { href: '/track-order', label: 'Track Order' },
  ]

  // Auth user ko load karo
  const loadUser = async () => {
    const { data: { user: authUser } } = await supabase.auth.getUser()

    if (!authUser) {
      setUser(null)
      return
    }

    const meta = authUser.user_metadata || {}
    const profileData: HeaderUser = {
      name: meta.full_name || meta.name || 'Customer',
      email: authUser.email || '',
      mobile: meta.phone || '',
      avatarUrl: meta.avatar_url || meta.picture,
    }

    // customers table se mobile/name try karo
    const { data: customerRow } = await supabase
      .from('customers')
      .select('name, mobile, email')
      .eq('auth_user_id', authUser.id)
      .single()

    if (customerRow) {
      profileData.name = customerRow.name || profileData.name
      profileData.mobile = customerRow.mobile || profileData.mobile
      profileData.email = customerRow.email || profileData.email
    }

    setUser(profileData)
  }

  useEffect(() => {
    loadUser()
    setMounted(true)

    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    // Auth state change sun lo
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          loadUser()
        }
      }
    )

    return () => {
      window.removeEventListener('scroll', handleScroll)
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setUserMenu(false)
    router.push('/')
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'glass-dark shadow-2xl shadow-gold/5 border-b border-gold/20'
          : 'bg-night/80 backdrop-blur-md border-b border-white/5'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto px-4 flex items-center justify-between transition-all duration-300 ${
          scrolled ? 'h-16 md:h-18' : 'h-16 md:h-20'
        }`}
      >
        {/* ===== Logo ===== */}
        <Link
          href="/"
          className="flex items-center gap-2 md:gap-3 group"
          aria-label="Food Junction Home"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gold/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <img
              src="/food-junction-logo.png"
              alt="Food Junction Logo"
              className={`relative rounded-full object-cover transition-all duration-500 group-hover:scale-110 ${
                scrolled
                  ? 'w-10 h-10 md:w-12 md:h-12'
                  : 'w-11 h-11 md:w-14 md:h-14'
              }`}
            />
          </div>
          <div className="leading-tight">
            <p className="text-lg md:text-xl text-gold font-bold group-hover:text-shimmer transition-all">
              Food Junction
            </p>
            <p className="text-[10px] md:text-xs text-white/50 tracking-[0.2em] group-hover:text-gold/70 transition-colors">
              THE FAMILY RESTAURANT
            </p>
          </div>
        </Link>

        {/* ===== Desktop Nav ===== */}
        <nav className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const isActive = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 group ${
                  isActive ? 'text-gold' : 'text-white/80 hover:text-gold'
                }`}
              >
                {l.label}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
                {isActive && (
                  <span className="absolute inset-0 rounded-lg bg-gold/5 -z-10" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* ===== Right Actions ===== */}
        <div className="flex items-center gap-1 md:gap-2">
          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 hover:text-gold transition-all duration-300 hover:scale-110"
            aria-label="Cart"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-gradient-to-br from-gold to-gold-dark text-night text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce-soft shadow-gold">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User Menu */}
          {mounted && user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenu(!userMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-full transition-all duration-300 group"
                aria-label="User menu"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-gold/40 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      className="relative w-8 h-8 rounded-full object-cover ring-2 ring-gold/30 group-hover:ring-gold transition-all"
                    />
                  ) : (
                    <div className="relative w-8 h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-night font-bold text-sm ring-2 ring-gold/30 group-hover:ring-gold transition-all">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <span className="hidden md:block text-sm font-semibold max-w-[100px] truncate">
                  {user.name.split(' ')[0]}
                </span>
              </button>

              {userMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserMenu(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 glass-dark rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in border border-gold/20">
                    <div className="p-3 border-b border-white/10 bg-gradient-to-br from-gold/5 to-transparent">
                      <p className="text-sm font-bold truncate text-gold">
                        {user.name}
                      </p>
                      <p className="text-xs text-white/50 truncate">
                        {user.mobile || user.email}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gold/10 hover:text-gold transition-all duration-200 group"
                    >
                      <User
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/track-order"
                      onClick={() => setUserMenu(false)}
                      className="flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-gold/10 hover:text-gold transition-all duration-200 group"
                    >
                      <span className="group-hover:scale-110 transition-transform">
                        📍
                      </span>
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all duration-200 border-t border-white/10 group"
                    >
                      <LogOut
                        size={16}
                        className="group-hover:scale-110 transition-transform"
                      />
                      <span>Logout</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="p-2 hover:text-gold transition-all duration-300 hover:scale-110"
              aria-label="Login"
            >
              <User size={22} />
            </Link>
          )}

          {/* Order Now Button */}
          <Link
            href="/menu"
            className="hidden md:inline-flex relative overflow-hidden bg-gradient-to-r from-gold to-gold-dark text-night font-bold text-sm px-5 py-2.5 rounded-full btn-premium group"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              Order Now
              <span className="group-hover:translate-x-1 transition-transform">
                →
              </span>
            </span>
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 hover:text-gold transition-all duration-300 hover:scale-110"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <MenuIcon size={24} />}
          </button>
        </div>
      </div>

      {/* ===== Mobile Menu ===== */}
      {open && (
        <div className="lg:hidden glass-dark border-t border-gold/10 animate-slide-down">
          <nav className="px-4 py-4 space-y-1">
            {links.map((l, i) => {
              const isActive = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 px-4 rounded-xl font-medium transition-all duration-200 animate-fade-up ${
                    isActive
                      ? 'bg-gold/10 text-gold border-l-2 border-gold'
                      : 'hover:bg-night-card hover:text-gold hover:translate-x-1'
                  }`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {l.label}
                </Link>
              )
            })}
            {user && (
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="block py-3 px-4 rounded-xl hover:bg-night-card hover:text-gold transition-all duration-200 animate-fade-up"
                style={{ animationDelay: '350ms' }}
              >
                My Profile
              </Link>
            )}
            <Link
              href="/menu"
              onClick={() => setOpen(false)}
              className="block mt-3 text-center bg-gradient-to-r from-gold to-gold-dark text-night font-bold py-3 rounded-full btn-premium animate-fade-up"
              style={{ animationDelay: '400ms' }}
            >
              <span className="relative z-10">ORDER NOW</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}