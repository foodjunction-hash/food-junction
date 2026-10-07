import { supabase } from '@/lib/supabase'

export type GalleryItem = {
  id: string
  restaurant_id: string | null
  image_url: string
  caption: string
  category: string
  display_order: number
  is_active: boolean
}

export async function getGallery(restaurantId?: string): Promise<GalleryItem[]> {
  try {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (restaurantId) query = query.eq('restaurant_id', restaurantId)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch gallery:', err)
    return []
  }
}

export async function getActiveGallery(restaurantId?: string): Promise<GalleryItem[]> {
  try {
    let query = supabase
      .from('gallery')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    if (restaurantId) query = query.eq('restaurant_id', restaurantId)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch active gallery:', err)
    return []
  }
}

export async function createGalleryItem(item: Partial<GalleryItem>) {
  try {
    const { data, error } = await supabase.from('gallery').insert([item]).select().single()
    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateGalleryItem(id: string, updates: Partial<GalleryItem>) {
  try {
    const { data, error } = await supabase
      .from('gallery')
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

export async function deleteGalleryItem(id: string) {
  try {
    const { error } = await supabase.from('gallery').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function uploadGalleryImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const ext = file.name.split('.').pop()
    const fileName = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: uploadError } = await supabase.storage
      .from('restaurant-assets')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })
    if (uploadError) throw uploadError
    const { data: urlData } = supabase.storage.from('restaurant-assets').getPublicUrl(fileName)
    return { success: true, url: urlData.publicUrl }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}