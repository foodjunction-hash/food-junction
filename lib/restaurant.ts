import { supabase } from '@/lib/supabase'

export type Restaurant = {
  id: string
  slug: string
  name: string
  tagline: string
  short_description: string
  about: string
  category: string
  established_year: string
  logo_url: string
  mobile_logo_url: string
  favicon_url: string
  primary_color: string
  secondary_color: string
  accent_color: string
  button_color: string
  text_color: string
  background_color: string
  phone: string
  whatsapp: string
  email: string
  alternate_phone: string
  address: string
  city: string
  state: string
  pincode: string
  google_maps_url: string
  facebook_url: string
  instagram_url: string
  youtube_url: string
  twitter_url: string
  google_business_url: string
  is_active: boolean
  monthly_fee: number
}

const DEFAULT_SLUG = 'food-junction'

// ============================================
// GET RESTAURANT BY SLUG
// ============================================
export async function getRestaurant(
  slug: string = DEFAULT_SLUG
): Promise<Restaurant | null> {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Failed to fetch restaurant:', err)
    return null
  }
}

// ============================================
// UPDATE RESTAURANT
// ============================================
export async function updateRestaurant(
  id: string,
  updates: Partial<Restaurant>
) {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('Failed to update restaurant:', err)
    return { success: false, error: err.message }
  }
}

// ============================================
// GET DEFAULT RESTAURANT (Food Junction)
// ============================================
export async function getDefaultRestaurant(): Promise<Restaurant | null> {
  return getRestaurant(DEFAULT_SLUG)
}