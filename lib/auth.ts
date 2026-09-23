// ============================================================
// ADMIN AUTHENTICATION
// ============================================================
// Security Notes:
// - Credentials are loaded from environment variables
// - Session is stored in localStorage (client-side)
// - In production, replace this with proper backend auth
//   (bcrypt + JWT + httpOnly cookies)
// ============================================================

const SESSION_KEY = 'fj-admin-session'
const SESSION_DURATION = 1000 * 60 * 60 * 8 // 8 hours
const MAX_LOGIN_ATTEMPTS = 5
const LOCKOUT_DURATION = 1000 * 60 * 15 // 15 minutes
const ATTEMPTS_KEY = 'fj-admin-attempts'
const LOCKOUT_KEY = 'fj-admin-lockout'

// ============================================================
// Admin Credentials
// ============================================================
// ⚠️ IMPORTANT: These come from .env.local
// ⚠️ If .env.local is missing, defaults are used (for local dev only)
// ============================================================

const ADMIN_USERNAME =
  process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD =
  process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'fj@Admin#2025!'

// ============================================================
// Types
// ============================================================

export type AdminSession = {
  username: string
  loginAt: number
  expiresAt: number
}

// ============================================================
// Brute-force protection helpers
// ============================================================

function getAttempts(): { count: number; timestamp: number } {
  if (typeof window === 'undefined') return { count: 0, timestamp: 0 }
  try {
    const data = localStorage.getItem(ATTEMPTS_KEY)
    return data ? JSON.parse(data) : { count: 0, timestamp: 0 }
  } catch {
    return { count: 0, timestamp: 0 }
  }
}

function incrementAttempts(): number {
  if (typeof window === 'undefined') return 0
  const attempts = getAttempts()
  const newCount = attempts.count + 1
  localStorage.setItem(
    ATTEMPTS_KEY,
    JSON.stringify({ count: newCount, timestamp: Date.now() })
  )
  return newCount
}

function resetAttempts() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(ATTEMPTS_KEY)
}

function isLockedOut(): { locked: boolean; remainingMs: number } {
  if (typeof window === 'undefined') return { locked: false, remainingMs: 0 }

  const lockoutData = localStorage.getItem(LOCKOUT_KEY)
  if (!lockoutData) return { locked: false, remainingMs: 0 }

  try {
    const { until } = JSON.parse(lockoutData)
    if (until > Date.now()) {
      return { locked: true, remainingMs: until - Date.now() }
    }
    // Lockout expired
    localStorage.removeItem(LOCKOUT_KEY)
    resetAttempts()
    return { locked: false, remainingMs: 0 }
  } catch {
    return { locked: false, remainingMs: 0 }
  }
}

function setLockout() {
  if (typeof window === 'undefined') return
  localStorage.setItem(
    LOCKOUT_KEY,
    JSON.stringify({ until: Date.now() + LOCKOUT_DURATION })
  )
}

// ============================================================
// Login
// ============================================================

export type LoginResult = {
  success: boolean
  error?: string
  lockedUntil?: number
}

export function loginAdmin(
  username: string,
  password: string
): LoginResult {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Server error' }
  }

  // Check lockout
  const lockout = isLockedOut()
  if (lockout.locked) {
    const mins = Math.ceil(lockout.remainingMs / 60000)
    return {
      success: false,
      error: `Too many failed attempts. Try again in ${mins} minute${
        mins > 1 ? 's' : ''
      }.`,
      lockedUntil: Date.now() + lockout.remainingMs,
    }
  }

  // Validate credentials
  const trimmedUsername = username.trim()

  if (trimmedUsername !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    const attempts = incrementAttempts()

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      setLockout()
      return {
        success: false,
        error: `Too many failed attempts. Account locked for 15 minutes.`,
        lockedUntil: Date.now() + LOCKOUT_DURATION,
      }
    }

    return {
      success: false,
      error: `Invalid credentials. ${MAX_LOGIN_ATTEMPTS - attempts} attempt${
        MAX_LOGIN_ATTEMPTS - attempts > 1 ? 's' : ''
      } remaining.`,
    }
  }

  // Success — create session
  const now = Date.now()
  const session: AdminSession = {
    username: trimmedUsername,
    loginAt: now,
    expiresAt: now + SESSION_DURATION,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  resetAttempts()
  localStorage.removeItem(LOCKOUT_KEY)

  return { success: true }
}

// ============================================================
// Session management
// ============================================================

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(SESSION_KEY)
    if (!data) return null

    const session: AdminSession = JSON.parse(data)

    // Check expiry
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }

    return session
  } catch {
    return null
  }
}

export function logoutAdmin() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

export function isAdminLoggedIn(): boolean {
  return getAdminSession() !== null
}

// ============================================================
// Session extension (optional — extends on activity)
// ============================================================

export function extendAdminSession(): boolean {
  if (typeof window === 'undefined') return false

  const session = getAdminSession()
  if (!session) return false

  const extendedSession: AdminSession = {
    ...session,
    expiresAt: Date.now() + SESSION_DURATION,
  }

  localStorage.setItem(SESSION_KEY, JSON.stringify(extendedSession))
  return true
}

// ============================================================
// Get remaining session time
// ============================================================

export function getSessionRemainingMs(): number {
  const session = getAdminSession()
  if (!session) return 0
  return Math.max(0, session.expiresAt - Date.now())
}