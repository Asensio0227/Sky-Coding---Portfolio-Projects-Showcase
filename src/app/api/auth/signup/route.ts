import { hashPassword, setAuthToken, signJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, confirmPassword } = await req.json();

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 },
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 },
      );
    }

    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email address' },
        { status: 400 },
      );
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 },
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user (first user is admin)
    const userCount = await User.countDocuments();
    const isFirstUser = userCount === 0;

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: isFirstUser ? 'admin' : 'user',
      bio: `Hello from ${name}`,
    });

    await newUser.save();

    // Sign JWT
    const token = signJWT({
      id: newUser._id,
      email: newUser.email,
      role: newUser.role,
    });

    // Set cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Account created successfully',
        data: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          redirectUrl: isFirstUser ? '/admin' : '/',
        },
      },
      { status: 201 },
    );

    // Set secure httpOnly cookie
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
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
