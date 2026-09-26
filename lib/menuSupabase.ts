import { supabase } from '@/lib/supabase'
import type { FoodItem } from '@/lib/data'

// ============================================
// GET ALL MENU ITEMS
// ============================================
export async function getMenuItems(): Promise<FoodItem[]> {
  try {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('category', { ascending: true })
      .order('name', { ascending: true })

    if (error) throw error

    return (data || []).map((row) => ({
      id: row.id,
      name: row.name,
      description: row.description || '',
      price: Number(row.price),
      discountPrice: row.discount_price ? Number(row.discount_price) : undefined,
      emoji: row.emoji || '🍽️',
      category: row.category,
      isVeg: row.is_veg,
      isBestseller: row.is_bestseller,
      isSpicy: row.is_spicy,
      isAvailable: row.is_available,
    }))
  } catch (err) {
    console.error('Failed to fetch menu items:', err)
    return []
  }
}

// ============================================
// CREATE NEW MENU ITEM
// ============================================
export async function createMenuItem(item: FoodItem) {
  try {
    const newId = `p_${Date.now()}`
    const { data, error } = await supabase
      .from('menu_items')
      .insert([
        {
          id: newId,
          name: item.name,
          description: item.description,
          price: item.price,
          discount_price: item.discountPrice || null,
          emoji: item.emoji,
          category: item.category,
          is_veg: item.isVeg,
          is_bestseller: item.isBestseller || false,
          is_spicy: item.isSpicy || false,
          is_available: item.isAvailable,
        },
      ])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('Failed to create menu item:', err)
    return { success: false, error: err.message }
  }
}

// ============================================
// UPDATE MENU ITEM
// ============================================
export async function updateMenuItem(id: string, item: Partial<FoodItem>) {
  try {
    const updateData: any = {
      updated_at: new Date().toISOString(),
    }

    if (item.name !== undefined) updateData.name = item.name
    if (item.description !== undefined) updateData.description = item.description
    if (item.price !== undefined) updateData.price = item.price
    if (item.discountPrice !== undefined)
      updateData.discount_price = item.discountPrice || null
    if (item.emoji !== undefined) updateData.emoji = item.emoji
    if (item.category !== undefined) updateData.category = item.category
    if (item.isVeg !== undefined) updateData.is_veg = item.isVeg
    if (item.isBestseller !== undefined)
      updateData.is_bestseller = item.isBestseller
    if (item.isSpicy !== undefined) updateData.is_spicy = item.isSpicy
    if (item.isAvailable !== undefined) updateData.is_available = item.isAvailable

    const { data, error } = await supabase
      .from('menu_items')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (err: any) {
    console.error('Failed to update menu item:', err)
    return { success: false, error: err.message }
  }
}

// ============================================
// DELETE MENU ITEM
// ============================================
export async function deleteMenuItem(id: string) {
  try {
    const { error } = await supabase.from('menu_items').delete().eq('id', id)
    if (error) throw error
    return { success: true }
  } catch (err: any) {
    console.error('Failed to delete menu item:', err)
    return { success: false, error: err.message }
  }
}

// ============================================
// TOGGLE AVAILABILITY
// ============================================
export async function toggleMenuItemAvailability(
  id: string,
  isAvailable: boolean
) {
  return updateMenuItem(id, { isAvailable })
}