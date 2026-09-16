'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Home,
  BarChart3,
  QrCode,
} from 'lucide-react'
import { isAdminLoggedIn, logoutAdmin } from '@/lib/auth'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') {
      setChecked(true)
      return
    }
    if (!isAdminLoggedIn()) {
      router.push('/admin/login')
    } else {
      setChecked(true)
    }
  }, [pathname, router])

  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <div className="text-white/60 text-sm">Loading...</div>
      </div>
    )
  }

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ClipboardList },
    { href: '/admin/menu', label: 'Menu', icon: UtensilsCrossed },
    { href: '/admin/tables', label: 'Table QR', icon: QrCode },
    { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = () => {
    logoutAdmin()
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen bg-night flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-night-soft border-r border-white/5 fixed h-full">
        <div className="p-5 border-b border-white/5">
          <Link href="/admin/dashboard" className="flex items-center gap-3">
            <img
              src="/food-junction-logo.png"
              alt="Food Junction"
              className="w-11 h-11 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-gold font-bold">Admin Panel</p>
              <p className="text-[10px] text-white/50 tracking-widest">FOOD JUNCTION</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {links.map((l) => {
            const active = pathname === l.href || pathname.startsWith(l.href + '/')
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium text-sm ${
                  active
                    ? 'bg-gold text-night'
                    : 'text-white/70 hover:bg-night-card hover:text-gold'
                }`}
              >
                <l.icon size={18} />
                {l.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-white/5 space-y-1">
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-night-card hover:text-gold transition text-sm"
          >
            <Home size={18} /> View Website
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-night-soft border-b border-white/5 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img
            src="/food-junction-logo.png"
            alt="Food Junction"
            className="w-10 h-10 rounded-full object-cover"
          />
          <span className="text-gold font-bold text-sm">Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2">
          {open ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-night/95 backdrop-blur pt-16">
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
                      ? 'bg-gold text-night'
                      : 'text-white/70 hover:bg-night-card hover:text-gold'
                  }`}
                >
                  <l.icon size={20} />
                  {l.label}
                </Link>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition"
            >
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0">{children}</div>
      </div>
    </div>
  )
}