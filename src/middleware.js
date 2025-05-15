import { NextResponse } from 'next/server';

export function middleware(request) {
    const cookie = request.cookies;
    const pathname = request.nextUrl?.pathname;
    const otpToken = cookie.get('otp')?.value;
    const forgetPass = cookie.get('forget-pass')?.value;
    const accessToken = cookie.get('user-access')?.value;

    if (pathname?.startsWith("/components/verify") && !otpToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname?.startsWith("/components/pass-verify") && !otpToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname?.startsWith("/components/forget-pass") && !forgetPass) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname?.startsWith("/components/dashboard") && !accessToken) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    if (pathname?.startsWith("/components/login") && accessToken) {
        return NextResponse.redirect(new URL('/components/dashboard', request.url));
    }
    if (pathname?.startsWith("/components/signup") && accessToken) {
        return NextResponse.redirect(new URL('/components/dashboard', request.url));
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
};
