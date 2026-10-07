import { supabase } from '@/lib/supabase'

export type Announcement = {
  id: string
  restaurant_id: string | null
  text: string
  button_text: string
  button_link: string
  background_color: string
  text_color: string
  is_active: boolean
}

// Get announcement
export async function getAnnouncement(
  restaurantId?: string
): Promise<Announcement | null> {
  try {
    let query = supabase.from('announcements').select('*').limit(1)
    if (restaurantId) query = query.eq('restaurant_id', restaurantId)
    const { data, error } = await query.maybeSingle()
    if (error) throw error
    return data
  } catch (err) {
    console.error('Failed to fetch announcement:', err)
    return null
  }
}

// Save announcement (upsert)
export async function saveAnnouncement(announcement: Partial<Announcement>) {
  try {
    if (announcement.id) {
      const { data, error } = await supabase
        .from('announcements')
        .update({ ...announcement, updated_at: new Date().toISOString() })
        .eq('id', announcement.id)
        .select()
        .single()
      if (error) throw error
      return { success: true, data }
    } else {
      const { data, error } = await supabase
        .from('announcements')
        .insert([announcement])
        .select()
        .single()
      if (error) throw error
      return { success: true, data }
    }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}