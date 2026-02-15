// app/api/admin/users/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

interface UserQuery {
  email?: { $regex: string; $options: string };
  role?: string;
  isActive?: boolean;
}

/**
 * GET /api/admin/users
 * Get all users (admin only)
 * Query params: page, limit, search, role, isActive
 */
export async function GET(request: NextRequest) {
  try {
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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const isActive = searchParams.get('isActive');

    // Build query
    const query: UserQuery = {};

    if (search) {
      query.email = { $regex: search, $options: 'i' };
    }

    if (role) {
      query.role = role;
    }

    if (isActive !== null && isActive !== '') {
      query.isActive = isActive === 'true';
    }

    // Get total count
    const total = await User.countDocuments(query);

    // Get users with pagination
    const users = await User.find(query)
      .select('-password')
      .populate('clientId', 'name domain plan')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        data: {
          users: users.map((user: any) => ({
            id: user._id.toString(),
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
            client: user.clientId
              ? {
                  id: user.clientId._id?.toString(),
                  name: user.clientId.name,
                  domain: user.clientId.domain,
                  plan: user.clientId.plan,
                }
              : null,
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Get all users error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to get users',
      },
      { status: 500 },
    );
  }
}
