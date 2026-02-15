import { verifyJWT } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/auth/verify
 * Quick token verification without database lookup
 * Use this for middleware/route guards
 */
export async function GET(request: NextRequest) {
  try {
    // =====================
    // GET TOKEN FROM COOKIE
    // =====================
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    // =====================
    // VERIFY JWT
    // =====================
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 },
      );
    }

    // =====================
    // RETURN DECODED DATA
    // =====================
    return NextResponse.json(
      {
        success: true,
        userId: decoded.userId,
        clientId: decoded.clientId,
        email: decoded.email,
        role: decoded.role,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 },
    );
  }
}
