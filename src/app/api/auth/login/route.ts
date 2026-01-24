import { signJWT, verifyPassword } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() }).select(
      '+password',
    );

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email or password' },
        { status: 401 },
      );
    }

    const token = signJWT({
      id: user._id,
      email: user.email,
      role: user.role,
    });

    const redirectUrl = user.role === 'admin' ? '/admin' : '/';

    const response = NextResponse.json(
      {
        success: true,
        message: 'Logged in successfully',
        data: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          redirectUrl: redirectUrl,
        },
      },
      { status: 200 },
    );

    // Set cookie with proper settings
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
