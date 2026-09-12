// Admin authentication (basic — production me backend use karein)

const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'foodjunction@2025'
const SESSION_KEY = 'fj-admin-session'
const SESSION_DURATION = 1000 * 60 * 60 * 8 // 8 hours

export type AdminSession = {
  username: string
  loginAt: number
  expiresAt: number
}

export function loginAdmin(username: string, password: string): boolean {
  if (typeof window === 'undefined') return false
  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) return false

  const now = Date.now()
  const session: AdminSession = {
    username,
    loginAt: now,
    expiresAt: now + SESSION_DURATION,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return true
}

export function getAdminSession(): AdminSession | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(SESSION_KEY)
    if (!data) return null
    const session: AdminSession = JSON.parse(data)
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