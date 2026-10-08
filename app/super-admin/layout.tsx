'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  PlusCircle,
  LogOut,
  Menu as MenuIcon,
  X,
  Home,
  Shield,
  Sparkles,
  IndianRupee,
  Users,
} from 'lucide-react'
import { isSuperAdminLoggedIn, logoutSuperAdmin, getSuperAdminSession, type SuperAdminSession } from '@/lib/auth'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [checked, setChecked] = useState(false)
  const [session, setSession] = useState<SuperAdminSession | null>(null)

  useEffect(() => {
    if (pathname === '/super-admin/login') {
      setChecked(true)
      return
    }
    if (!isSuperAdminLoggedIn()) {
      router.push('/super-admin/login')
    } else {
      setSession(getSuperAdminSession())
      setChecked(true)
    }
  }, [pathname, router])

  if (pathname === '/super-admin/login') {
    return <>{children}</>
  }

  if (!checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-night">
        <div className="flex items-center gap-3 text-white/60 text-sm">
          <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          Loading...
        </div>
      </div>
    )
  }

  const links = [
    { href: '/super-admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/super-admin/restaurants', label: 'Restaurants', icon: Store },
    { href: '/super-admin/restaurants/new', label: 'Add Restaurant', icon: PlusCircle },
    { href: '/super-admin/revenue', label: 'Revenue', icon: IndianRupee },
    { href: '/super-admin/users', label: 'Users', icon: Users },
  ]

  const handleLogout = () => {
    logoutSuperAdmin()
    router.push('/super-admin/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-night via-night to-night-soft flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-night-soft/80 backdrop-blur-xl border-r border-purple-500/20 fixed h-full z-20">
        <div className="p-5 border-b border-purple-500/20">
          <Link href="/super-admin/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-purple-500/30 blur-lg opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-purple-500/30 group-hover:ring-purple-500 transition-all">
                <Shield size={20} className="text-white" />
              </div>
            </div>
            <div className="leading-tight">
              <p className="text-purple-400 font-bold flex items-center gap-1">
                Super Admin
                <Sparkles size={12} className="text-purple-400/60" />
              </p>
              <p className="text-[10px] text-white/40 tracking-widest">PLATFORM OWNER</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {links.map((l) => {
            const active = pathname === l.href
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-sm group ${
                  active
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/20'
                    : 'text-white/70 hover:bg-night-card hover:text-purple-400 hover:translate-x-1'
                }`}
              >
                <l.icon size={18} />
                {l.label}
                {active && <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-purple-500/20 space-y-1">
          {session && (
            <div className="px-4 py-3 mb-2 rounded-xl bg-purple-500/10 border border-purple-500/20">
              <p className="text-[10px] text-white/40 tracking-widest">LOGGED IN AS</p>
              <p className="text-sm font-bold text-purple-400 truncate">{session.fullName}</p>
              <p className="text-[10px] text-white/40 truncate">@{session.username}</p>
            </div>
          )}
          <Link href="/" target="_blank" className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-night-card hover:text-purple-400 transition text-sm">
            <Home size={18} />
            View Website
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-night-soft/95 backdrop-blur-xl border-b border-purple-500/20 px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center ring-2 ring-purple-500/30">
            <Shield size={18} className="text-white" />
          </div>
          <span className="text-purple-400 font-bold text-sm">Super Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 hover:bg-white/5 rounded-xl transition">
          {open ? <X size={22} /> : <MenuIcon size={22} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-night/95 backdrop-blur-xl pt-16 animate-fade-in">
          <nav className="p-4 space-y-1">
            {links.map((l) => {
              const active = pathname === l.href
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition font-medium ${
                    active ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'text-white/70 hover:bg-night-card hover:text-purple-400'
                  }`}
                >
                  <l.icon size={20} />
                  {l.label}
                </Link>
              )
            })}
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition mt-2 border-t border-white/5 pt-4">
              <LogOut size={20} /> Logout
            </button>
          </nav>
        </div>
      )}

      <div className="flex-1 lg:ml-64">
        <div className="pt-16 lg:pt-0">{children}</div>
      </div>
    </div>
  )
}