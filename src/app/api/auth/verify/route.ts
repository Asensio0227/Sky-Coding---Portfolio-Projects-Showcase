import { verifyJWT } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    // IMPORTANT: await the verifyJWT call since it's async
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Verification failed' },
      { status: 500 },
    );
  }
}
