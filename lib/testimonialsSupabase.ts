import { supabase } from '@/lib/supabase'

export type Testimonial = {
  id: string
  restaurant_id: string | null
  customer_name: string
  customer_photo_url: string
  rating: number
  review: string
  location: string
  is_active: boolean
  display_order: number
}

export async function getTestimonials(restaurantId?: string): Promise<Testimonial[]> {
  try {
    let query = supabase
      .from('testimonials')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
    if (restaurantId) query = query.eq('restaurant_id', restaurantId)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch testimonials:', err)
    return []
  }
}

export async function getActiveTestimonials(restaurantId?: string): Promise<Testimonial[]> {
  try {
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
    if (restaurantId) query = query.eq('restaurant_id', restaurantId)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch active testimonials:', err)
    return []
  }
}

export async function createTestimonial(item: Partial<Testimonial>) {
  try {
    const { data, error } = await supabase.from('testimonials').insert([item]).select().single()
    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function updateTestimonial(id: string, updates: Partial<Testimonial>) {
  try {
    const { data, error } = await supabase
      .from('testimonials')
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

export async function deleteTestimonial(id: string) {
  try {
    const { error } = await supabase.from('testimonials').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

export async function uploadCustomerPhoto(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const ext = file.name.split('.').pop()
    const fileName = `testimonials/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
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