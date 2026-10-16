import { NextRequest, NextResponse } from 'next/server'

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const order = body.record || body.new || body

    if (!order || !order.customer_mobile) {
      return NextResponse.json({ error: 'No phone' }, { status: 400 })
    }

    // Clean phone: last 10 digits
    const phone = String(order.customer_mobile).replace(/\D/g, '').slice(-10)
    const fullPhone = `91${phone}`

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
            name: 'jaspers_market_order_confirmation_v1',
            language: { code: 'en_US' },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: order.customer_name || 'Customer' },
                  { type: 'text', text: order.order_number || 'N/A' },
                  { type: 'text', text: String(order.total || 0) },
                ],
              },
            ],
          },
        }),
      }
    )

    const data = await response.json()
    console.log('WhatsApp response:', JSON.stringify(data))
    return NextResponse.json({ success: true, data })
  } catch (error: any) {
    console.error('WhatsApp error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
