import { signJWT, verifyPassword } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/login
 * Authenticates user and returns JWT with tenant context
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // =====================
    // VALIDATION
    // =====================
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      );
    }

    await connectDB();

    // =====================
    // FIND USER (with password)
    // =====================
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password',
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // =====================
    // CHECK ACCOUNT STATUS
    // =====================
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account is deactivated' },
        { status: 403 },
      );
    }

    // =====================
    // VERIFY PASSWORD
    // =====================
    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    // =====================
    // GET RESTAURANT (for clients)
    // =====================
    let client = null;
    if (user.role === 'client') {
      if (!user.clientId) {
        return NextResponse.json(
          {
            success: false,
            message: 'Account setup incomplete. Please contact support.',
          },
          { status: 400 },
        );
      }

      client = await Client.findById(user.clientId);

      if (!client) {
        return NextResponse.json(
          {
            success: false,
            message: 'Client not found. Please contact support.',
          },
          { status: 404 },
        );
      }

      if (!client.isActive) {
        return NextResponse.json(
          { success: false, message: 'Client is deactivated' },
          { status: 403 },
        );
      }
    }

    // =====================
    // UPDATE LAST LOGIN
    // =====================
    user.lastLogin = new Date();
    await user.save();

    // =====================
    // GENERATE JWT
    // =====================
    const token = await signJWT({
      userId: user._id.toString(),
      clientId: client?._id.toString() || '',
      role: user.role,
      email: user.email,
      isActive: client?.isActive,
      subscriptionStatus: client?.subscriptionStatus,
    });

    // =====================
    // DETERMINE REDIRECT
    // =====================
    const redirectUrl =
      user.role === 'admin' ? '/admin/dashboard' : '/dashboard';

    // =====================
    // PREPARE RESPONSE
    // =====================
    interface LoginResponseData {
      id: string;
      email: string;
      role: 'client' | 'admin';
      redirectUrl: string;
      clientId?: string;
      client?: {
        id: string;
        name: string;
        domain: string;
        clientId: string;
        plan: string;
      };
    }

    const responseData: LoginResponseData = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      redirectUrl,
    };

    if (client) {
      responseData.clientId = client._id.toString();
      responseData.client = {
        id: client._id.toString(),
        name: client.name,
        domain: client.domain,
        clientId: client._id.toString(),
        plan: client.plan,
      };
    }

    const response = NextResponse.json<{
      success: boolean;
      message: string;
      data: LoginResponseData;
    }>(
      {
        success: true,
        message: 'Logged in successfully',
        data: responseData,
      },
      { status: 200 },
    );

    // =====================
    // SET SECURE COOKIE
    // =====================
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: unknown) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
