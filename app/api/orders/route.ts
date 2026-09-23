import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

async function getSupabase() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}

// ============================================
// POST /api/orders — Create new order
// ============================================
export async function POST(req: NextRequest) {
  try {
    const supabase = await getSupabase()
    const body = await req.json()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    const dbOrder = {
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
      transaction_id: body.transactionId || null,
      customer_name: body.customer.name,
      customer_mobile: body.customer.mobile,
      customer_email: body.customer.email || null,
      customer_address: body.customer.address || null,
      customer_landmark: body.customer.landmark || null,
      customer_pincode: body.customer.pincode || null,
      customer_instructions: body.customer.instructions || null,
      customer_table_number: body.customer.tableNumber || null,
      auth_user_id: user?.id || null,
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
// GET /api/orders — Fetch orders
// Query params: ?status=placed  ?mobile=9876543210  ?email=x  ?mine=true
// ============================================
export async function GET(req: NextRequest) {
  try {
    const supabase = await getSupabase()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const mobile = searchParams.get('mobile')
    const email = searchParams.get('email')
    const mine = searchParams.get('mine')

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)
    if (mobile) query = query.eq('customer_mobile', mobile)
    if (email) query = query.eq('customer_email', email)

    if (mine === 'true') {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        return NextResponse.json({ orders: [] }, { status: 200 })
      }
      query = query.eq('auth_user_id', user.id)
    }

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
// ============================================
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await getSupabase()
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