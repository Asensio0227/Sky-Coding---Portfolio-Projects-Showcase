// app/api/admin/users/[id]/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/users/[id]
 * Get single user by ID (admin only)
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
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

    // Get user by ID
    const user = await User.findById(params.id)
      .select('-password')
      .populate('clientId');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          client: user.clientId
            ? {
                id: user.clientId._id.toString(),
                name: user.clientId.name,
                domain: user.clientId.domain,
                businessType: user.clientId.businessType,
                plan: user.clientId.plan,
                isActive: user.clientId.isActive,
                totalConversations: user.clientId.totalConversations,
                totalMessages: user.clientId.totalMessages,
              }
            : null,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Get user error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get user',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete user and associated client (admin only)
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const params = await context.params;
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

    // Prevent admin from deleting themselves
    if (decoded.userId === params.id) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete your own account' },
        { status: 400 },
      );
    }

    // Get user to delete
    const user = await User.findById(params.id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    // Delete associated client if exists
    if (user.clientId) {
      await Client.findByIdAndDelete(user.clientId);
      console.log(`✅ Deleted client: ${user.clientId}`);
    }

    // Delete user
    await User.findByIdAndDelete(params.id);

    console.log(`✅ Deleted user: ${user.email}`);

    return NextResponse.json(
      {
        success: true,
        message: 'User and associated data deleted successfully',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Delete user error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to delete user',
      },
      { status: 500 },
    );
  }
}
