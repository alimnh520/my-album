import { NextResponse } from 'next/server'

export function middleware(request) {
    const cookie = request.cookies;
    const pathname = request.nextUrl?.pathname;
    const otpToken = cookie.get('otp')?.value;
    const forgetPass = cookie.get('forget-pass')?.value;
    const accessToken = cookie.get('user-access')?.value;

    if (!otpToken && pathname.startsWith("/components/verify")) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!otpToken && pathname.startsWith("/components/pass-verify")) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!forgetPass && pathname.startsWith("/components/forget-pass")) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (!accessToken && pathname.startsWith("/components/dashboard")) {
        return NextResponse.redirect(new URL('/', request.url))
    }
    if (accessToken && pathname.startsWith("/components/login")) {
        return NextResponse.redirect(new URL('/components/dashboard', request.url))
    }
    if (accessToken && pathname.startsWith("/components/signup")) {
        return NextResponse.redirect(new URL('/components/dashboard', request.url))
    }
}

export const config = {
    matcher: [
        '/',
        '/components/dashboard',
        '/components/verify',
        '/components/forget-pass',
        '/components/pass-verify',
        '/components/login',
        '/components/signup',
    ],
}
  