import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/users/[id]/block
 * Block a user account (same as suspend but with explicit block action)
 * This is typically used for policy violations or abuse
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

    // Prevent admin from blocking themselves
    if (decoded.userId === id) {
      return NextResponse.json(
        { success: false, message: 'Cannot block your own account' },
        { status: 400 },
      );
    }

    // Get optional reason from request body
    const body = await request.json().catch(() => ({}));
    const reason = body.reason || 'Policy violation';

    // Find and update user
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    // Block user (deactivate)
    user.isActive = false;
    await user.save();

    // Deactivate their client and disable chatbot
    if (user.clientId) {
      await Client.findByIdAndUpdate(user.clientId, {
        isActive: false,
        'chatbotConfig.enabled': false,
      });
      console.log(`✅ Blocked client for user: ${user.email}`);
    }

    console.log(`✅ Blocked user: ${user.email} - Reason: ${reason}`);

    return NextResponse.json(
      {
        success: true,
        message: `User blocked successfully. Reason: ${reason}`,
        data: {
          id: user._id.toString(),
          email: user.email,
          isActive: user.isActive,
          blockedReason: reason,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Block user error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to block user',
      },
      { status: 500 },
    );
  }
}
