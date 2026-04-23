import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('access')?.value
    const { pathname } = request.nextUrl

    // 1. Agar token nahi hai aur user dashboard par jana chahta hai -> Login bhejo
    if (!token && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 2. Agar token hai aur user login/register par hai -> Dashboard bhejo
    if (token && (pathname === '/login' || pathname === '/register')) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/dashboard/:path*', '/login', '/register'],
}