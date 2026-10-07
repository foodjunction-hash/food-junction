import { supabase } from '@/lib/supabase'

export type HomepageOffer = {
  id: string
  restaurant_id: string | null
  title: string
  description: string
  badge: string
  badge_label: string
  emoji: string
  color: string
  min_order: number
  max_discount: number
  validity: string
  coupon_code: string
  is_hot: boolean
  is_active: boolean
  display_order: number
}

// ============================================
// GET ALL HOMEPAGE OFFERS (Admin)
// ============================================
export async function getHomepageOffers(
  restaurantId?: string
): Promise<HomepageOffer[]> {
  try {
    let query = supabase
      .from('homepage_offers')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch homepage offers:', err)
    return []
  }
}

// ============================================
// GET ACTIVE OFFERS (Customer)
// ============================================
export async function getActiveOffers(
  restaurantId?: string
): Promise<HomepageOffer[]> {
  try {
    let query = supabase
      .from('homepage_offers')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })

    if (restaurantId) {
      query = query.eq('restaurant_id', restaurantId)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch active offers:', err)
    return []
  }
}

// ============================================
// CREATE HOMEPAGE OFFER
// ============================================
export async function createHomepageOffer(offer: Partial<HomepageOffer>) {
  try {
    const { data, error } = await supabase
      .from('homepage_offers')
      .insert([offer])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('Failed to create offer:', err)
    return { success: false, error: err.message }
  }
}

// ============================================
// UPDATE HOMEPAGE OFFER
// ============================================
export async function updateHomepageOffer(
  id: string,
  updates: Partial<HomepageOffer>
) {
  try {
    const { data, error } = await supabase
      .from('homepage_offers')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('Failed to update offer:', err)
    return { success: false, error: err.message }
  }
}

// ============================================
// DELETE HOMEPAGE OFFER
// ============================================
export async function deleteHomepageOffer(id: string) {
  try {
    const { error } = await supabase
      .from('homepage_offers')
      .delete()
      .eq('id', id)

    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('Failed to delete offer:', err)
    return { success: false, error: err.message }
  }
}