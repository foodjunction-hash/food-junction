import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

// Initialize Twilio client
const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const whatsappFrom = process.env.TWILIO_WHATSAPP_FROM

if (!accountSid || !authToken || !whatsappFrom) {
  console.warn('Twilio credentials missing in .env.local')
}

// Helper: Format Indian number to WhatsApp format
function formatWhatsAppNumber(mobile: string): string {
  // Remove all non-digits
  const digits = mobile.replace(/\D/g, '')

  // If starts with 91, use as is (with whatsapp: prefix)
  if (digits.length === 12 && digits.startsWith('91')) {
    return `whatsapp:+${digits}`
  }

  // If 10 digits, add +91
  if (digits.length === 10) {
    return `whatsapp:+91${digits}`
  }

  // Otherwise, assume it's already complete
  return `whatsapp:+${digits}`
}

// ============================================
// POST /api/whatsapp — Send WhatsApp message
// Body: { to: '9973318421', message: 'Hello!' }
// ============================================
export async function POST(req: NextRequest) {
  try {
    if (!accountSid || !authToken || !whatsappFrom) {
      return NextResponse.json(
        { error: 'Twilio credentials not configured' },
        { status: 500 }
      )
    }

    const body = await req.json()
    const { to, message } = body

    if (!to || !message) {
      return NextResponse.json(
        { error: 'Missing "to" or "message" in request body' },
        { status: 400 }
      )
    }

    const client = twilio(accountSid, authToken)
    const toNumber = formatWhatsAppNumber(to)

    const result = await client.messages.create({
      from: whatsappFrom,
      to: toNumber,
      body: message,
    })

    return NextResponse.json({
      success: true,
      sid: result.sid,
      status: result.status,
      to: toNumber,
    })
  } catch (err: any) {
    console.error('Twilio error:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to send WhatsApp message' },
      { status: 500 }
    )
  }
}

// ============================================
// GET /api/whatsapp — Test endpoint
// ============================================
export async function GET() {
  return NextResponse.json({
    status: 'WhatsApp API is running',
    configured: !!(accountSid && authToken && whatsappFrom),
  })
}