'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useParams } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  BarChart3,
  QrCode,
  Briefcase,
  Sparkles,
  Gift,
  Store,
  Megaphone,
  Clock,
  Camera,
  MessageSquare,
  Layout,
  ExternalLink,
} from 'lucide-react'
import {
  isRestaurantAdminLoggedIn,
  logoutRestaurantAdmin,
  getRestaurantAdminSession,
  type RestaurantAdminSession,
} from '@/lib/auth'

export default function RestaurantAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const slug = (params?.slug as string) || ''

  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [session, setSession] = useState<RestaurantAdminSession | null>(null)

  useEffect(() => {
    const isLoginPage = pathname === `/${slug}/admin/login`
    if (isLoginPage) {
      setChecked(true)
      return
    }

    const s = getRestaurantAdminSession()
    if (!s || s.restaurantSlug !== slug) {
      router.push(`/${slug}/admin/login`)
    } else {
      setSession(s)
      setChecked(true)
    }
  }, [pathname, router, slug])

  if (pathname === `/${slug}/admin/login`) {
    return <>{children}</>
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <div className="flex items-center gap-3 text-white/60 text-sm">
          <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  const basePath = `/${slug}`

  const links = [
    { href: `${basePath}/admin/dashboard`, label: 'Dashboard', icon: LayoutDashboard },
    { href: `${basePath}/admin/orders`, label: 'Orders', icon: ClipboardList },
    { href: `${basePath}/admin/menu`, label: 'Menu', icon: UtensilsCrossed },
    { href: `${basePath}/admin/offers`, label: 'Offers', icon: Gift },
    { href: `${basePath}/admin/announcement`, label: 'Announcement', icon: Megaphone },
    { href: `${basePath}/admin/welcome-popup`, label: 'Welcome Popup', icon: Layout },
    { href: `${basePath}/admin/hours`, label: 'Opening Hours', icon: Clock },
    { href: `${basePath}/admin/gallery`, label: 'Gallery', icon: Camera },
    { href: `${basePath}/admin/testimonials`, label: 'Testimonials', icon: MessageSquare },
    { href: `${basePath}/admin/tables`, label: 'Table QR', icon: QrCode },
    { href: `${basePath}/admin/services`, label: 'Services', icon: Briefcase },
    { href: `${basePath}/admin/reports`, label: 'Reports', icon: BarChart3 },
    { href: `${basePath}/admin/branding`, label: 'Branding', icon: Store },
    { href: `${basePath}/admin/settings`, label: 'Settings', icon: Settings },
  ]

  const handleLogout = () => {
    logoutRestaurantAdmin()
    router.push(`/${slug}/admin/login`)
  }

  const restaurantName = session?.restaurantName || 'Restaurant'

  return (
    <div className="min-h-screen bg-gradient-to-br from-night via-night to-night-soft flex">
      {/* ============================================
          DESKTOP SIDEBAR
          ============================================ */}
      <aside className="hidden lg:flex flex-col w-64 bg-night-soft/80 backdrop-blur-xl border-r border-white/5 fixed h-full z-20">
        <div className="p-5 border-b border-white/5">
          <Link href={`${basePath}/admin/dashboard`} className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-gold/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center ring-2 ring-gold/30 group-hover:ring-gold transition-all">
                <Store size={20} className="text-night" />
              </div>
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-gold font-bold flex items-center gap-1 truncate">
                Admin Panel
                <Sparkles size={12} className="text-gold/60 flex-shrink-0" />
              </p>
              <p className="text-[10px] text-white/40 tracking-widest truncate">
                {restaurantName.toUpperCase()}
              </p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm group ${
                  active
                    ? 'bg-gradient-to-r from-gold to-gold-dark text-night shadow-lg shadow-gold/20'
                    : 'text-white/70 hover:bg-night-card hover:text-gold hover:translate-x-1'
                }`}
              >
                <l.icon size={18} className={active ? '' : 'group-hover:scale-110 transition-transform'} />
                {l.label}
                {active && <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-night animate-pulse" />}
              </Link>
            )
          })}
        </nav>

        {/* Only "View Live Site" in sidebar footer — Logout moved to top */}
        <div className="p-3 border-t border-white/5">
          <Link
            href={`/${slug}`}
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-night-card hover:text-gold transition text-sm group"
          >
            <ExternalLink size={18} className="group-hover:scale-110 transition-transform" />
            View Live Site
          </Link>
        </div>
      </aside>

      {/* ============================================
          MOBILE + DESKTOP HEADER (TOP BAR)
          ============================================ */}
      <div className="fixed top-0 left-0 right-0 lg:left-64 z-40 bg-night-soft/95 backdrop-blur-xl border-b border-white/5 px-4 h-16 flex items-center justify-between">
        {/* Left: Logo + Name (mobile) / Empty (desktop) */}
        <div className="flex items-center gap-2 lg:hidden">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center ring-2 ring-gold/30">
            <Store size={18} className="text-night" />
          </div>
          <div className="leading-tight">
            <span className="text-gold font-bold text-sm block truncate max-w-[130px]">
              {restaurantName}
            </span>
            <span className="text-[9px] text-white/40 tracking-widest">ADMIN</span>
          </div>
        </div>

        {/* Right: Logout + Menu toggle */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Logout button - visible on ALL sizes */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 md:px-4 py-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 transition-all text-xs md:text-sm font-semibold"
            aria-label="Logout"
          >
            <LogOut size={14} />
            <span className="hidden md:inline">Logout</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 hover:bg-white/5 rounded-xl transition"
            aria-label="Menu"
          >
            {open ? <X size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* ============================================
          MOBILE NAV DRAWER
          ============================================ */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-night/95 backdrop-blur-xl pt-16 animate-fade-in overflow-y-auto">
          <nav className="p-4 space-y-1">
            {links.map((l) => {
              const active = pathname === l.href || pathname.startsWith(l.href + '/')
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                    active
                      ? 'bg-gradient-to-r from-gold to-gold-dark text-night'
                      : 'text-white/70 hover:bg-night-card hover:text-gold'
                  }`}
                >
                  <l.icon size={20} />
                  {l.label}
                </Link>
              )
            })}

            {/* View Live Site - mobile drawer */}
            <Link
              href={`/${slug}`}
              target="_blank"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-night-card hover:text-gold transition border-t border-white/5 mt-2 pt-4"
            >
              <ExternalLink size={20} />
              View Live Site
            </Link>
          </nav>
        </div>
      )}

      {/* ============================================
          MAIN CONTENT
          ============================================ */}
      <div className="flex-1 lg:ml-64">
        <div className="pt-16">{children}</div>
      </div>
    </div>
  )
}