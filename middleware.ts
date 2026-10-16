import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const session = request.cookies.get('fj-admin-session')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminPage && !isLoginPage && session?.value !== 'true') {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  if (isLoginPage && session?.value === 'true') {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
