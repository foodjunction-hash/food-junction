import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const session = req.cookies.get('fj-admin-session')
  return NextResponse.json({ authenticated: session?.value === 'true' })
}
