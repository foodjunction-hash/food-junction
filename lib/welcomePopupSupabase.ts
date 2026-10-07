import { supabase } from '@/lib/supabase'

export type WelcomePopup = {
  id: string
  restaurant_id: string | null
  is_active: boolean
  badge_text: string
  badge_visible: boolean
  title: string
  subtitle: string
  footer_text: string
  primary_button_text: string
  primary_button_link: string
  primary_button_visible: boolean
  secondary_button_text: string
  secondary_button_link: string
  secondary_button_visible: boolean
  show_open_now: boolean
  show_opening_hours: boolean
  show_on_load: boolean
  delay_ms: number
}

export async function getWelcomePopup(
  restaurantId?: string
): Promise<WelcomePopup | null> {
  try {
    let query = supabase.from('welcome_popup').select('*').limit(1)
    if (restaurantId) query = query.eq('restaurant_id', restaurantId)
    const { data, error } = await query.maybeSingle()
    if (error) throw error
    return data
  } catch (err) {
    console.error('Failed to fetch welcome popup:', err)
    return null
  }
}

export async function saveWelcomePopup(popup: Partial<WelcomePopup>) {
  try {
    if (popup.id) {
      const { data, error } = await supabase
        .from('welcome_popup')
        .update({ ...popup, updated_at: new Date().toISOString() })
        .eq('id', popup.id)
        .select()
        .single()
      if (error) throw error
      return { success: true, data }
    } else {
      const { data, error } = await supabase
        .from('welcome_popup')
        .insert([popup])
        .select()
        .single()
      if (error) throw error
      return { success: true, data }
    }
  } catch (err: any) {
    console.error('Failed to save welcome popup:', err)
    return { success: false, error: err.message }
  }
}