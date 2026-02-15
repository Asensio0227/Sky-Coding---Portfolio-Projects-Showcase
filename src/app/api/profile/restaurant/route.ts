// src/app/api/profile/client/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/profile/client
 * Get current user's client
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 },
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId).populate('clientId');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: user.clientId || null,
    });
  } catch (error) {
    console.error('Get client error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch client' },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/profile/client
 * Update current user's client
 */
export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    const decoded = await verifyJWT(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 },
      );
    }

    await connectDB();

    const user = await User.findById(decoded.userId);

    if (!user || !user.clientId) {
      return NextResponse.json(
        { success: false, message: 'No client found for this user' },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { name, domain, businessType, description } = body;

    const client = await Client.findById(user.clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 },
      );
    }

    // Update fields
    if (name) client.name = name;
    if (domain) {
      const normalizedDomain = domain
        .toLowerCase()
        .replace(/^(https?:\/\/)?(www\.)?/, '')
        .split('/')[0];
      client.domain = normalizedDomain;
    }
    if (businessType) client.businessType = businessType;
    if (description !== undefined) client.description = description;

    await client.save();

    console.log('✅ Client updated by user:', user.email);

    return NextResponse.json({
      success: true,
      message: 'Client updated successfully',
      data: {
        id: client._id.toString(),
        name: client.name,
        domain: client.domain,
      },
    });
  } catch (error) {
    console.error('Update client error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update client',
      },
      { status: 500 },
    );
  }
}
