import { hashPassword, signJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import User from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/auth/signup
 * Creates a new client account with their client
 * Multi-tenant: Each client gets exactly ONE client
 */
export async function POST(req: NextRequest) {
  try {
    const {
      email,
      password,
      confirmPassword,
      businessName,
      domain,
      businessType,
    } = await req.json();

    // =====================
    // VALIDATION
    // =====================
    if (!email || !password || !confirmPassword || !businessName || !domain) {
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

    // =====================
    // NORMALIZE DOMAIN
    // =====================
    const normalizedDomain = domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '') // Remove protocol and www
      .split('/')[0] // Remove paths
      .trim();

    // Validate domain format
    const domainRegex = /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/;
    if (!domainRegex.test(normalizedDomain)) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Invalid domain format. Use format: example.com (no http, www, or paths)',
        },
        { status: 400 },
      );
    }

    await connectDB();

    // =====================
    // CHECK EXISTING USER
    // =====================
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 409 },
      );
    }

    // =====================
    // CHECK EXISTING DOMAIN
    // =====================
    const existingClient = await Client.findOne({
      domain: normalizedDomain,
    });
    if (existingClient) {
      return NextResponse.json(
        { success: false, message: 'Domain already registered' },
        { status: 409 },
      );
    }

    // =====================
    // CREATE USER (CLIENT)
    // =====================
    const hashedPassword = await hashPassword(password);

    const newUser = new User({
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'client', // Always client for signup
      isActive: true,
    });

    await newUser.save();

    // =====================
    // CREATE RESTAURANT
    // =====================
    const newPlan: 'starter' | 'business' | 'pro' = 'starter';
    const newClient = new Client({
      userId: newUser._id,
      name: businessName.trim(),
      domain: normalizedDomain,
      allowedDomains: [normalizedDomain],
      businessType: businessType || 'other',
      plan: newPlan,
      messageLimit: 1000,
      usageCount: 0,
      subscriptionStatus: 'active',
      isActive: true,
      chatbotConfig: {
        welcomeMessage: `Hello! Welcome to ${businessName}. How can I help you today?`,
        tone: 'friendly',
        enabled: true,
        primaryColor: '#3B82F6',
        position: 'bottom-right',
      },
    });

    await newClient.save();

    // =====================
    // LINK USER TO RESTAURANT
    // =====================
    newUser.clientId = newClient._id;
    await newUser.save();

    // =====================
    // GENERATE JWT
    // =====================
    const token = await signJWT({
      userId: newUser._id.toString(),
      clientId: newClient._id.toString(),
      role: newUser.role,
      email: newUser.email,
      isActive: newClient.isActive,
      subscriptionStatus: newClient.subscriptionStatus,
    });

    // =====================
    // PREPARE RESPONSE
    // =====================
    const response = NextResponse.json<{
      success: boolean;
      message: string;
      data: {
        id: string;
        email: string;
        role: 'client' | 'admin';
        clientId: string;
        client: {
          id: string;
          name: string;
          domain: string;
          clientId: string;
          plan: string;
        };
        redirectUrl: string;
      };
    }>(
      {
        success: true,
        message: 'Account created successfully',
        data: {
          id: newUser._id.toString(),
          email: newUser.email,
          role: newUser.role,
          clientId: newClient._id.toString(),
          client: {
            id: newClient._id.toString(),
            name: newClient.name,
            domain: newClient.domain,
            clientId: newClient._id.toString(), // For chatbot integration
            plan: newClient.plan,
          },
          redirectUrl: '/dashboard',
        },
      },
      { status: 201 },
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
    console.error('Signup error:', error);

    // Handle mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 },
    );
  }
}
