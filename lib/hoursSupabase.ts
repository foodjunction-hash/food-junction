import { supabase } from '@/lib/supabase'

export type OpeningHour = {
  id: string
  restaurant_id: string | null
  day_of_week: string
  is_open: boolean
  opening_time: string
  closing_time: string
  display_order: number
}

export const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Monday', short: 'Mon' },
  { key: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { key: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { key: 'thursday', label: 'Thursday', short: 'Thu' },
  { key: 'friday', label: 'Friday', short: 'Fri' },
  { key: 'saturday', label: 'Saturday', short: 'Sat' },
  { key: 'sunday', label: 'Sunday', short: 'Sun' },
]

// Get all hours
export async function getOpeningHours(
  restaurantId?: string
): Promise<OpeningHour[]> {
  try {
    let query = supabase
      .from('opening_hours')
      .select('*')
      .order('display_order', { ascending: true })
    if (restaurantId) query = query.eq('restaurant_id', restaurantId)
    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Failed to fetch opening hours:', err)
    return []
  }
}

// Update single day
export async function updateOpeningHour(
  id: string,
  updates: Partial<OpeningHour>
) {
  try {
    const { data, error } = await supabase
      .from('opening_hours')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    return { success: false, error: err.message }
  }
}

// Get "currently open" status
export function getCurrentOpenStatus(hours: OpeningHour[]): {
  isOpen: boolean
  todayHours: OpeningHour | null
} {
  const today = new Date()
  const dayKey = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ][today.getDay()]

  const todayHours = hours.find((h) => h.day_of_week === dayKey) || null

  if (!todayHours || !todayHours.is_open) {
    return { isOpen: false, todayHours }
  }

  const now = today.getHours() * 60 + today.getMinutes()
  const [openH, openM] = todayHours.opening_time.split(':').map(Number)
  const [closeH, closeM] = todayHours.closing_time.split(':').map(Number)
  const openMinutes = openH * 60 + openM
  const closeMinutes = closeH * 60 + closeM

  const isOpen = now >= openMinutes && now <= closeMinutes
  return { isOpen, todayHours }
}