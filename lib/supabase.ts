import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Check .env.local file.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// TYPE DEFINITIONS (match database schema)
// ============================================

export type DBOrder = {
  id: string
  order_number: string
  created_at: string
  items: any
  subtotal: number
  delivery_charge: number
  tax: number
  total: number
  order_type: string
  payment_method: string
  payment_status: string
  status: string
  transaction_id?: string | null
  customer_name: string
  customer_mobile: string
  customer_email?: string
  customer_address?: string
  customer_landmark?: string
  customer_pincode?: string
  customer_instructions?: string
  customer_table_number?: string
  updated_at: string
}

export type DBMenuItem = {
  id: string
  name: string
  description?: string
  price: number
  discount_price?: number
  emoji: string
  category: string
  is_veg: boolean
  is_bestseller: boolean
  is_spicy: boolean
  is_available: boolean
  created_at: string
  updated_at: string
}

export type DBCustomer = {
  id: string
  name: string
  mobile: string
  email?: string
  password: string
  created_at: string
}

export type DBSettings = {
  id: string
  name: string
  address: string
  phone: string
  whatsapp: string
  email: string
  upi_id: string
  opening_time: string
  closing_time: string
  is_open: boolean
  delivery_charge: number
  free_above: number
  tax_percent: number
  updated_at: string
}

// ============================================
// SERVICES TABLE (for Coming Soon feature)
// ============================================

export type DBService = {
  id: string
  name: string
  description: string
  emoji: string
  is_enabled: boolean
  coming_soon_message: string
  updated_at: string
}