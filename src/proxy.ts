// import { verifyJWTEdge } from '@/lib/edge-auth';
// import type { NextRequest } from 'next/server';
// import { NextResponse } from 'next/server';

// export async function proxy(request: NextRequest) {
//   const token = request.cookies.get('auth_token')?.value;
//   const pathname = request.nextUrl.pathname;

//   console.log('🔒 Proxy Check:', {
//     path: pathname,
//     hasToken: !!token,
//   });

//   // Protected admin routes - Match /admin and /admin/*
//   if (pathname === '/admin' || pathname.startsWith('/admin/')) {
//     if (!token) {
//       console.log('❌ No token found, redirecting to login');
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     const decoded = await verifyJWTEdge(token);
//     console.log('🔓 Decoded token:', decoded);

//     if (!decoded) {
//       console.log('❌ Invalid token, redirecting to login');
//       return NextResponse.redirect(new URL('/login', request.url));
//     }

//     if (decoded.role !== 'admin') {
//       console.log('❌ Not admin role, redirecting to home');
//       return NextResponse.redirect(new URL('/', request.url));
//     }

//     console.log('✅ Admin access granted');
//   }

//   // Redirect authenticated users away from auth pages
//   if (pathname === '/login' || pathname === '/signup') {
//     if (token) {
//       const decoded = await verifyJWTEdge(token);
//       if (decoded) {
//         const redirectUrl = decoded.role === 'admin' ? '/admin' : '/';
//         console.log('Already authenticated, redirecting to:', redirectUrl);
//         return NextResponse.redirect(new URL(redirectUrl, request.url));
//       }
//     }
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/admin/:path*', '/admin', '/login', '/signup'],
// };

import { requireAdmin, requireClient } from '@/lib/auth-middleware';
import { verifyJWTEdge } from '@/lib/edge-auth';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const pathname = request.nextUrl.pathname;

  const decoded = token ? await verifyJWTEdge(token) : null;

  // ==================== ADMIN ROUTES ====================
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    if (!decoded) return NextResponse.redirect(new URL('/login', request.url));

    const adminCheck = requireAdmin(decoded);
    if (adminCheck)
      return NextResponse.redirect(new URL('/login', request.url));

    console.log('✅ Admin access granted');
  }

  // ==================== DASHBOARD ROUTES ====================
  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    if (!decoded) return NextResponse.redirect(new URL('/login', request.url));

    // Both clients and admins allowed
    console.log('✅ Dashboard access granted for:', decoded.role);
  }

  // ==================== AUTH PAGES ====================
  if (pathname === '/login' || pathname === '/signup') {
    if (decoded) {
      const redirectUrl =
        decoded.role === 'admin'
          ? '/admin'
          : decoded.role === 'client'
            ? '/dashboard'
            : '/';
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/admin',
    '/dashboard/:path*',
    '/dashboard',
    '/login',
    '/signup',
  ],
};
