// ============================================================
// MULTI-ROLE AUTHENTICATION
// ============================================================
// Roles:
// 1. Super Admin — platform owner (tumhare liye)
// 2. Restaurant Admin — har restaurant ka owner
//
// Security Notes:
// - For production, replace with bcrypt + JWT + httpOnly cookies
// - Current implementation uses plain text (demo/MVP)
// ============================================================

import { supabase } from '@/lib/supabase'

// ============================================================
// Constants
// ============================================================
const SUPER_ADMIN_SESSION_KEY = 'fj-super-admin-session'
const RESTAURANT_ADMIN_SESSION_KEY = 'fj-restaurant-admin-session'
const LEGACY_SESSION_KEY = 'fj-admin-session'
const SESSION_DURATION = 1000 * 60 * 60 * 8 // 8 hours
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 1000 * 60 * 15 // 15 minutes

// ============================================================
// Types
// ============================================================
export type SuperAdminSession = {
  username: string
  fullName: string
  loginAt: number
  expiresAt: number
  role: 'super_admin'
}

export type RestaurantAdminSession = {
  username: string
  restaurantId: string
  restaurantSlug: string
  restaurantName: string
  loginAt: number
  expiresAt: number
  role: 'restaurant_admin'
}

export type LoginResult = {
  success: boolean
  error?: string
  lockedUntil?: number
  session?: SuperAdminSession | RestaurantAdminSession
}

// ============================================================
// Helper — Lockout
// ============================================================
function getAttemptsKey(identifier: string) {
  return `fj-attempts-${identifier}`
}
function getLockoutKey(identifier: string) {
  return `fj-lockout-${identifier}`
}

function getAttempts(identifier: string): { count: number; timestamp: number } {
  if (typeof window === 'undefined') return { count: 0, timestamp: 0 }
  try {
    const data = localStorage.getItem(getAttemptsKey(identifier))
    return data ? JSON.parse(data) : { count: 0, timestamp: 0 }
  } catch {
    return { count: 0, timestamp: 0 }
  }
}

function incrementAttempts(identifier: string): number {
  if (typeof window === 'undefined') return 0
  const attempts = getAttempts(identifier)
  const newCount = attempts.count + 1
  localStorage.setItem(
    getAttemptsKey(identifier),
    JSON.stringify({ count: newCount, timestamp: Date.now() })
  )
  return newCount
}

function resetAttempts(identifier: string) {
  if (typeof window === 'undefined') return
  localStorage.removeItem(getAttemptsKey(identifier))
}

function isLockedOut(identifier: string): { locked: boolean; remainingMs: number } {
  if (typeof window === 'undefined') return { locked: false, remainingMs: 0 }
  const lockoutData = localStorage.getItem(getLockoutKey(identifier))
  if (!lockoutData) return { locked: false, remainingMs: 0 }
  try {
    const { until } = JSON.parse(lockoutData)
    if (until > Date.now()) {
      return { locked: true, remainingMs: until - Date.now() }
    }
    localStorage.removeItem(getLockoutKey(identifier))
    resetAttempts(identifier)
    return { locked: false, remainingMs: 0 }
  } catch {
    return { locked: false, remainingMs: 0 }
  }
}

function setLockout(identifier: string) {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    getLockoutKey(identifier),
    JSON.stringify({ until: Date.now() + LOCKOUT_DURATION })
  )
}

// ============================================================
// SUPER ADMIN LOGIN
// ============================================================
export async function loginSuperAdmin(
  username: string,
  password: string
): Promise<LoginResult> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Server error' }
  }

  const identifier = `super-${username.trim()}`
  const lockout = isLockedOut(identifier)
  if (lockout.locked) {
    const mins = Math.ceil(lockout.remainingMs / 60000)
    return {
      success: false,
      error: `Too many failed attempts. Try again in ${mins} minute${
        mins > 1 ? 's' : ''
      }.`,
    }
  }

  try {
    const { data, error } = await supabase
      .from('super_admins')
      .select('*')
      .eq('username', username.trim())
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error

    if (!data || data.password_hash !== password) {
      const attempts = incrementAttempts(identifier)
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        setLockout(identifier)
        return {
          success: false,
          error: 'Too many failed attempts. Account locked for 15 minutes.',
        }
      }
      return {
        success: false,
        error: `Invalid credentials. ${
          MAX_LOGIN_ATTEMPTS - attempts
        } attempt${MAX_LOGIN_ATTEMPTS - attempts > 1 ? 's' : ''} remaining.`,
      }
    }

    const now = Date.now()
    const session: SuperAdminSession = {
      username: data.username,
      fullName: data.full_name || 'Super Admin',
      loginAt: now,
      expiresAt: now + SESSION_DURATION,
      role: 'super_admin',
    }

    localStorage.setItem(SUPER_ADMIN_SESSION_KEY, JSON.stringify(session))
    resetAttempts(identifier)
    localStorage.removeItem(getLockoutKey(identifier))

    await supabase
      .from('super_admins')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id)

    return { success: true, session }
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' }
  }
}

export function getSuperAdminSession(): SuperAdminSession | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(SUPER_ADMIN_SESSION_KEY)
    if (!data) return null
    const session: SuperAdminSession = JSON.parse(data)
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SUPER_ADMIN_SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function logoutSuperAdmin() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SUPER_ADMIN_SESSION_KEY)
}

export function isSuperAdminLoggedIn(): boolean {
  return getSuperAdminSession() !== null
}

// ============================================================
// RESTAURANT ADMIN LOGIN
// ============================================================
export async function loginRestaurantAdmin(
  slug: string,
  username: string,
  password: string
): Promise<LoginResult> {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Server error' }
  }

  const identifier = `restaurant-${slug}-${username.trim()}`
  const lockout = isLockedOut(identifier)
  if (lockout.locked) {
    const mins = Math.ceil(lockout.remainingMs / 60000)
    return {
      success: false,
      error: `Too many failed attempts. Try again in ${mins} minute${
        mins > 1 ? 's' : ''
      }.`,
    }
  }

  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error

    if (
      !data ||
      data.admin_username !== username.trim() ||
      data.admin_password !== password
    ) {
      const attempts = incrementAttempts(identifier)
      if (attempts >= MAX_LOGIN_ATTEMPTS) {
        setLockout(identifier)
        return {
          success: false,
          error: 'Too many failed attempts. Account locked for 15 minutes.',
        }
      }
      return {
        success: false,
        error: `Invalid credentials. ${
          MAX_LOGIN_ATTEMPTS - attempts
        } attempt${MAX_LOGIN_ATTEMPTS - attempts > 1 ? 's' : ''} remaining.`,
      }
    }

    if (
      data.subscription_status === 'expired' ||
      data.subscription_status === 'suspended'
    ) {
      return {
        success: false,
        error: `Subscription ${data.subscription_status}. Contact platform admin.`,
      }
    }

    const now = Date.now()
    const session: RestaurantAdminSession = {
      username: data.admin_username,
      restaurantId: data.id,
      restaurantSlug: data.slug,
      restaurantName: data.name,
      loginAt: now,
      expiresAt: now + SESSION_DURATION,
      role: 'restaurant_admin',
    }

    localStorage.setItem(RESTAURANT_ADMIN_SESSION_KEY, JSON.stringify(session))
    resetAttempts(identifier)
    localStorage.removeItem(getLockoutKey(identifier))

    await supabase
      .from('restaurants')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.id)

    return { success: true, session }
  } catch (err: any) {
    return { success: false, error: err.message || 'Login failed' }
  }
}

export function getRestaurantAdminSession(): RestaurantAdminSession | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(RESTAURANT_ADMIN_SESSION_KEY)
    if (!data) return null
    const session: RestaurantAdminSession = JSON.parse(data)
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(RESTAURANT_ADMIN_SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function logoutRestaurantAdmin() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(RESTAURANT_ADMIN_SESSION_KEY)
}

export function isRestaurantAdminLoggedIn(): boolean {
  return getRestaurantAdminSession() !== null
}

// ============================================================
// LEGACY SUPPORT — Puraana `/admin` (Food Junction)
// ============================================================
export function isAdminLoggedIn(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const data = localStorage.getItem(LEGACY_SESSION_KEY)
    if (data) {
      const session = JSON.parse(data)
      if (session.expiresAt > Date.now()) return true
      localStorage.removeItem(LEGACY_SESSION_KEY)
    }
  } catch {}
  const restaurantSession = getRestaurantAdminSession()
  if (restaurantSession && restaurantSession.restaurantSlug === 'food-junction') {
    return true
  }
  return false
}

export function logoutAdmin() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(LEGACY_SESSION_KEY)
  logoutRestaurantAdmin()
}