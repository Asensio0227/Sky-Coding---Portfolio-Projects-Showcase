import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import User from '@/models/User';
import { jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

/**
 * GET /api/auth/me
 * Returns current authenticated user with their client data
 */
export async function GET(request: NextRequest) {
  try {
    // =====================
    // GET TOKEN FROM COOKIE
    // =====================
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated', user: null },
        { status: 401 },
      );
    }

    // =====================
    // VERIFY JWT
    // =====================
    const { payload } = await jwtVerify(token, secret);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { success: false, message: 'Invalid token', user: null },
        { status: 401 },
      );
    }

    await connectDB();

    // =====================
    // FETCH USER
    // =====================
    const user = await User.findById(payload.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found', user: null },
        { status: 404 },
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Account deactivated', user: null },
        { status: 403 },
      );
    }

    // =====================
    // PREPARE RESPONSE DATA
    // =====================
    interface MeResponseData {
      id: string;
      email: string;
      role: 'client' | 'admin';
      clientId?: string;
      client?: {
        id: string;
        name: string;
        domain: string;
        clientId: string;
        plan: string;
        isActive: boolean;
        chatbotConfig: {
          enabled: boolean;
          welcomeMessage: string;
          tone: string;
          primaryColor?: string;
          position?: string;
        };
        totalConversations?: number;
        totalMessages?: number;
      };
    }

    const responseData: MeResponseData = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    // =====================
    // FETCH RESTAURANT (for clients)
    // =====================
    if (user.role === 'client' && user.clientId) {
      const client = await Client.findById(user.clientId);

      if (client) {
        responseData.clientId = client._id.toString();
        responseData.client = {
          id: client._id.toString(),
          name: client.name,
          domain: client.domain,
          clientId: client._id.toString(), // For chatbot integration
          plan: client.plan,
          isActive: client.isActive,
          chatbotConfig: {
            enabled: client.chatbotConfig.enabled,
            welcomeMessage: client.chatbotConfig.welcomeMessage,
            tone: client.chatbotConfig.tone,
            primaryColor: client.chatbotConfig.primaryColor,
            position: client.chatbotConfig.position,
          },
          totalConversations: client.totalConversations,
          totalMessages: client.totalMessages,
        };
      }
    }

    return NextResponse.json<{
      success: boolean;
      user: MeResponseData;
    }>(
      {
        success: true,
        user: responseData,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ /api/auth/me - Error:', error);
    return NextResponse.json(
      { success: false, message: 'Verification failed', user: null },
      { status: 500 },
    );
  }
}
