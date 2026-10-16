import { NextRequest, NextResponse } from 'next/server'

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

const TEMPLATE_MAP: Record<string, string> = {
  placed: 'jaspers_market_order_confirmation_v1',
  accepted: 'order_accepted',
  preparing: 'order_preparing',
  ready: 'order_ready',
  delivered: 'order_complete_notify',
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const order = body.record || body.new || body
    if (!order || !order.customer_mobile) {
      return NextResponse.json({ error: 'No phone' }, { status: 400 })
    }
    const phone = String(order.customer_mobile).replace(/\D/g, '').slice(-10)
    const fullPhone = `91${phone}`
    const status = String(order.status || 'placed').toLowerCase()
    const templateName = TEMPLATE_MAP[status]
    if (!templateName) {
      return NextResponse.json({ success: false, message: `No template for: ${status}` })
    }
    const response = await fetch(
      `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: fullPhone,
          type: 'template',
          template: {
            name: templateName,
            language: { code: 'en_US' },
            components: [{
              type: 'body',
              parameters: [
                { type: 'text', text: order.customer_name || 'Customer' },
                { type: 'text', text: order.order_number || 'N/A' },
              ],
            }],
          },
        }),
      }
    )
    const data = await response.json()
    return NextResponse.json({ success: true, data, template: templateName, status })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
