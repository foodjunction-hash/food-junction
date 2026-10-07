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
  copyright_text: string
  footer_description: string
  // Owner & Developer
  owner_name: string
  owner_role: string
  owner_photo_url: string
  developer_name: string
  developer_role: string
  developer_photo_url: string
  // Status
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

// ============================================
// UPLOAD IMAGE TO SUPABASE STORAGE
// ============================================
export async function uploadRestaurantImage(
  file: File,
  folder: string = 'general'
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('restaurant-assets')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase.storage
      .from('restaurant-assets')
      .getPublicUrl(fileName)

    return { success: true, url: urlData.publicUrl }
  } catch (err: any) {
    console.error('Upload failed:', err)
    return { success: false, error: err.message }
  }
}