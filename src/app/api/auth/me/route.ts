// app/api/auth/me/route.ts
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    console.log('🔍 /api/auth/me - Token exists:', !!token);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated', user: null },
        { status: 401 },
      );
    }

    // Use jose for verification (edge-compatible)
    const { payload } = await jwtVerify(token, secret);
    console.log('🔑 /api/auth/me - Decoded token:', payload);

    if (!payload || !payload.id) {
      return NextResponse.json(
        { success: false, message: 'Invalid token', user: null },
        { status: 401 },
      );
    }

    await connectDB();

    // Fetch full user data from database
    const user = await User.findById(payload.id).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found', user: null },
        { status: 404 },
      );
    }

    console.log('✅ /api/auth/me - User authenticated:', {
      id: user._id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
          bio: user.bio,
          socialLinks: user.socialLinks,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ /api/auth/me - Error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed', user: null },
      { status: 500 },
    );
  }
}
