// Customer authentication (localStorage based — production me backend use karein)

const CUSTOMERS_KEY = 'fj-customers'
const SESSION_KEY = 'fj-customer-session'
const SESSION_DURATION = 1000 * 60 * 60 * 24 * 30 // 30 days

export type Customer = {
  id: string
  name: string
  mobile: string
  email?: string
  password: string // ⚠️ demo only — production me hashed
  createdAt: string
  addresses?: string[]
}

export type CustomerSession = {
  customerId: string
  mobile: string
  name: string
  loginAt: number
  expiresAt: number
}

// ---------- Internal helpers ----------
function getAllCustomers(): Customer[] {
  if (typeof window === 'undefined') return []
  try {
    const data = localStorage.getItem(CUSTOMERS_KEY)
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveAllCustomers(customers: Customer[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CUSTOMERS_KEY, JSON.stringify(customers))
}

// ---------- Public API ----------
export function registerCustomer(data: {
  name: string
  mobile: string
  email?: string
  password: string
}): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Server error' }

  const name = data.name.trim()
  const mobile = data.mobile.trim()
  const email = data.email?.trim().toLowerCase()
  const password = data.password

  // Validation
  if (!name) return { success: false, error: 'Name is required' }
  if (!/^\d{10}$/.test(mobile))
    return { success: false, error: 'Enter a valid 10-digit mobile number' }
  if (password.length < 6)
    return { success: false, error: 'Password must be at least 6 characters' }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { success: false, error: 'Enter a valid email' }

  const customers = getAllCustomers()

  // Duplicate check
  if (customers.find((c) => c.mobile === mobile))
    return { success: false, error: 'Mobile number already registered' }
  if (email && customers.find((c) => c.email === email))
    return { success: false, error: 'Email already registered' }

  const newCustomer: Customer = {
    id: `cus_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    name,
    mobile,
    email,
    password,
    createdAt: new Date().toISOString(),
    addresses: [],
  }

  saveAllCustomers([newCustomer, ...customers])
  return { success: true }
}

export function loginCustomer(
  identifier: string,
  password: string
): { success: boolean; error?: string } {
  if (typeof window === 'undefined') return { success: false, error: 'Server error' }

  const id = identifier.trim()
  const customers = getAllCustomers()

  // Find by mobile OR email
  const customer = customers.find(
    (c) =>
      c.mobile === id ||
      (c.email && c.email.toLowerCase() === id.toLowerCase())
  )

  if (!customer) return { success: false, error: 'Account not found' }
  if (customer.password !== password)
    return { success: false, error: 'Incorrect password' }

  const now = Date.now()
  const session: CustomerSession = {
    customerId: customer.id,
    mobile: customer.mobile,
    name: customer.name,
    loginAt: now,
    expiresAt: now + SESSION_DURATION,
  }
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  return { success: true }
}

export function getCustomerSession(): CustomerSession | null {
  if (typeof window === 'undefined') return null
  try {
    const data = localStorage.getItem(SESSION_KEY)
    if (!data) return null
    const session: CustomerSession = JSON.parse(data)
    if (session.expiresAt < Date.now()) {
      localStorage.removeItem(SESSION_KEY)
      return null
    }
    return session
  } catch {
    return null
  }
}

export function getCurrentCustomer(): Customer | null {
  const session = getCustomerSession()
  if (!session) return null
  const customers = getAllCustomers()
  return customers.find((c) => c.id === session.customerId) || null
}

export function logoutCustomer() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(SESSION_KEY)
}

export function isCustomerLoggedIn(): boolean {
  return getCustomerSession() !== null
}