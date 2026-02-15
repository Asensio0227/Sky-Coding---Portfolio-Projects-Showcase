// app/api/admin/users/[id]/activate/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/users/[id]/activate
 * Activate a user account (admin only)
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    // Get token from cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    // Verify token
    const decoded = await verifyJWT(token);

    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 },
      );
    }

    await connectDB();

    // Check if user is admin
    const adminUser = await User.findById(decoded.userId);

    if (!adminUser || adminUser.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized - Admin access required' },
        { status: 403 },
      );
    }

    // Find and update user
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    // Activate user
    user.isActive = true;
    await user.save();

    console.log(`✅ Activated user: ${user.email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'User activated successfully',
        data: {
          id: user._id.toString(),
          email: user.email,
          isActive: user.isActive,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Activate user error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to activate user',
      },
      { status: 500 },
    );
  }
}
