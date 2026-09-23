import { NextRequest, NextResponse } from 'next/server'
import { supabase, type DBOrder } from '@/lib/supabase'

// ============================================
// POST /api/orders — Create new order
// ============================================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Map frontend order → DB columns
    const dbOrder: Omit<DBOrder, 'created_at' | 'updated_at'> = {
      id: body.id,
      order_number: body.orderNumber,
      items: body.items,
      subtotal: body.subtotal,
      delivery_charge: body.deliveryCharge,
      tax: body.tax,
      total: body.total,
      order_type: body.orderType,
      payment_method: body.paymentMethod,
      payment_status: body.paymentStatus,
      status: body.status,
      customer_name: body.customer.name,
      customer_mobile: body.customer.mobile,
      customer_email: body.customer.email || null as any,
      customer_address: body.customer.address || null as any,
      customer_landmark: body.customer.landmark || null as any,
      customer_pincode: body.customer.pincode || null as any,
      customer_instructions: body.customer.instructions || null as any,
      customer_table_number: body.customer.tableNumber || null as any,
    }

    const { data, error } = await supabase
      .from('orders')
      .insert([dbOrder])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order: data }, { status: 201 })
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================
// GET /api/orders — Fetch all orders
// Optional query: ?status=placed  ?mobile=9876543210
// ============================================
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const mobile = searchParams.get('mobile')

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (mobile) query = query.eq('customer_mobile', mobile)

    const { data, error } = await query

    if (error) {
      console.error('Supabase fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ orders: data }, { status: 200 })
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

// ============================================
// PATCH /api/orders?id=xxx — Update order status
// Body: { status: 'accepted' } etc.
// ============================================
export async function PATCH(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Order ID required' }, { status: 400 })
    }

    const body = await req.json()

    const { data, error } = await supabase
      .from('orders')
      .update({
        ...body,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ order: data }, { status: 200 })
  } catch (err: any) {
    console.error('API error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    )
  }
}