import { verifyJWTEdge } from '@/lib/edge-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  console.log('🔒 Proxy Check:', {
    path: pathname,
    hasToken: !!token,
  });

  // Protected admin routes - Match /admin and /admin/*
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!token) {
      console.log('❌ No token found, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const decoded = await verifyJWTEdge(token);
    console.log('🔓 Decoded token:', decoded);

    if (!decoded) {
      console.log('❌ Invalid token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }

    if (decoded.role !== 'admin') {
      console.log('❌ Not admin role, redirecting to home');
      return NextResponse.redirect(new URL('/', request.url));
    }

    console.log('✅ Admin access granted');
  }

  // Redirect authenticated users away from auth pages
  if (pathname === '/login' || pathname === '/signup') {
    if (token) {
      const decoded = await verifyJWTEdge(token);
      if (decoded) {
        const redirectUrl = decoded.role === 'admin' ? '/admin' : '/';
        console.log('Already authenticated, redirecting to:', redirectUrl);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/admin', '/login', '/signup'],
};
