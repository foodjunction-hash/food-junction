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
  const digits = mobile.replace(/\D/g, '')

  // If starts with 91, use as is
  if (digits.length === 12 && digits.startsWith('91')) {
    return `whatsapp:+${digits}`
  }

  // If 10 digits, add +91
  if (digits.length === 10) {
    return `whatsapp:+91${digits}`
  }

  // Otherwise, assume complete
  return `whatsapp:+${digits}`
}

// ============================================
// POST /api/whatsapp — Send WhatsApp message
//
// Plain text mode:
//   Body: { to: '9973318421', message: 'Hello!' }
//
// Template mode:
//   Body: { to: '9973318421', contentType: 'template',
//           contentSid: 'HX...', contentVariables: { 1: 'val1', 2: 'val2' } }
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
    const { to, message, contentType, contentSid, contentVariables } = body

    // Only 'to' is required in both modes
    if (!to) {
      return NextResponse.json(
        { error: 'Missing "to" in request body' },
        { status: 400 }
      )
    }

    const client = twilio(accountSid, authToken)
    const toNumber = formatWhatsAppNumber(to)

    let result

    // ---- Content Template mode ----
    if (contentType === 'template' && contentSid) {
      const templateParams = {
        from: whatsappFrom,
        to: toNumber,
        contentSid: contentSid,
        contentVariables: JSON.stringify(contentVariables || {}),
      }

      console.log('Sending template message:', {
        to: toNumber,
        contentSid,
        contentVariables,
      })

      result = await (client.messages.create as any)(templateParams)
    }
    // ---- Plain text mode ----
    else {
      if (!message) {
        return NextResponse.json(
          { error: 'Missing "message" for plain text mode' },
          { status: 400 }
        )
      }

      result = await client.messages.create({
        from: whatsappFrom,
        to: toNumber,
        body: message,
      })
    }

    return NextResponse.json({
      success: true,
      sid: result.sid,
      status: result.status,
      to: toNumber,
      mode: contentType === 'template' ? 'template' : 'plain',
    })
  } catch (err: any) {
    console.error('Twilio error:', err)

    // Extract useful error info from Twilio
    const errorMessage =
      err?.message ||
      err?.moreInfo ||
      'Failed to send WhatsApp message'

    const errorCode = err?.code || null

    return NextResponse.json(
      {
        error: errorMessage,
        code: errorCode,
        moreInfo: err?.moreInfo || null,
      },
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
    mode: 'supports both plain text and content templates',
  })
}