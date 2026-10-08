import { supabase } from '@/lib/supabase'

export type RestaurantAdmin = {
  id: string
  slug: string
  name: string
  tagline: string
  city: string
  state: string
  phone: string
  email: string
  admin_username: string | null
  admin_password: string | null
  is_active: boolean
  subscription_status: 'trial' | 'active' | 'expired' | 'suspended'
  subscription_expires_at: string | null
  monthly_fee: number
  created_at: string
  last_login: string | null
}

// GET ALL RESTAURANTS
export async function getAllRestaurants(): Promise<RestaurantAdmin[]> {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch restaurants:', err)
    return []
  }
}

// CREATE RESTAURANT
export type CreateRestaurantInput = {
  name: string
  slug: string
  tagline?: string
  category?: string
  city?: string
  state?: string
  phone?: string
  email?: string
  monthly_fee?: number
}

export async function createRestaurant(input: CreateRestaurantInput) {
  try {
    const adminUsername = `${input.slug}-admin`
    const adminPassword = generatePassword()

    const { data, error } = await supabase
      .from('restaurants')
      .insert([{
        name: input.name,
        slug: input.slug,
        tagline: input.tagline || 'The Family Restaurant',
        category: input.category || 'Family Restaurant',
        city: input.city || '',
        state: input.state || '',
        phone: input.phone || '',
        email: input.email || '',
        admin_username: adminUsername,
        admin_password: adminPassword,
        is_active: true,
        subscription_status: 'trial',
        subscription_expires_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        monthly_fee: input.monthly_fee || 999,
      }])
      .select()
      .single()

    if (error) throw error

    return {
      success: true,
      data,
      credentials: {
        username: adminUsername,
        password: adminPassword,
        url: `/${input.slug}/admin/login`,
      },
    }
  } catch (err: any) {
    console.error('Failed to create restaurant:', err)
    return { success: false, error: err.message }
  }
}

// UPDATE RESTAURANT
export async function updateRestaurantAdmin(
  id: string,
  updates: Partial<RestaurantAdmin>
) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// TOGGLE ACTIVE
export async function toggleRestaurantActive(id: string, isActive: boolean) {
  return updateRestaurantAdmin(id, { is_active: isActive })
}

// UPDATE SUBSCRIPTION
export async function updateSubscription(
  id: string,
  status: 'trial' | 'active' | 'expired' | 'suspended',
  expiresAt?: string
) {
  return updateRestaurantAdmin(id, {
    subscription_status: status,
    subscription_expires_at: expiresAt || null,
  })
}

// RESET PASSWORD
export async function resetRestaurantAdminPassword(id: string) {
  const newPassword = generatePassword()
  const result = await updateRestaurantAdmin(id, { admin_password: newPassword })
  if (result.success) {
    return { success: true, password: newPassword }
  }
  return { success: false, error: result.error }
}

// DELETE RESTAURANT
export async function deleteRestaurant(id: string) {
  try {
    const { error } = await supabase.from('restaurants').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// PASSWORD GENERATOR
function generatePassword(length = 12): string {
  const chars = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return password
}

// STATS
export async function getSuperAdminStats() {
  try {
    const { data: restaurants } = await supabase.from('restaurants').select('*')
    const all = restaurants || []

    return {
      total: all.length,
      active: all.filter((r) => r.is_active).length,
      inactive: all.filter((r) => !r.is_active).length,
      trial: all.filter((r) => r.subscription_status === 'trial').length,
      paid: all.filter((r) => r.subscription_status === 'active').length,
      expired: all.filter((r) => r.subscription_status === 'expired').length,
      suspended: all.filter((r) => r.subscription_status === 'suspended').length,
      monthlyRevenue: all
        .filter((r) => r.subscription_status === 'active')
        .reduce((sum, r) => sum + (r.monthly_fee || 0), 0),
    }
  } catch (err) {
    console.error('Failed to fetch stats:', err)
    return {
      total: 0, active: 0, inactive: 0, trial: 0, paid: 0, expired: 0,
      suspended: 0, monthlyRevenue: 0,
    }
  }
}