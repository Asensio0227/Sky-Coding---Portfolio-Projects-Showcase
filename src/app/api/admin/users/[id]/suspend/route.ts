// app/api/admin/users/[id]/suspend/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/users/[id]/suspend
 * Suspend/deactivate a user account and their client (admin only)
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

    // Prevent admin from suspending themselves
    if (decoded.userId === id) {
      return NextResponse.json(
        { success: false, message: 'Cannot suspend your own account' },
        { status: 400 },
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

    // Suspend user
    user.isActive = false;
    await user.save();

    // Also deactivate their client if exists
    if (user.clientId) {
      await Client.findByIdAndUpdate(user.clientId, {
        isActive: false,
      });
      console.log(`✅ Deactivated client for user: ${user.email}`);
    }

    console.log(`✅ Suspended user: ${user.email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'User suspended successfully',
        data: {
          id: user._id.toString(),
          email: user.email,
          isActive: user.isActive,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Suspend user error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to suspend user',
      },
      { status: 500 },
    );
  }
}
