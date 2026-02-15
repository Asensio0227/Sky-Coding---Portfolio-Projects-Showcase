// app/api/settings/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/settings
 * Get current user's chatbot settings
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

    // Get client by ID from token
    const client = await Client.findById(decoded.clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          clientId: client._id.toString(),
          chatbotConfig: client.chatbotConfig,
          businessInfo: {
            name: client.name,
            domain: client.domain,
            businessType: client.businessType,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Get settings error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to get settings',
      },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/settings
 * Update chatbot configuration
 */
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { chatbotConfig } = body;

    console.log('📝 Updating settings for client:', decoded.clientId);
    console.log('New config:', chatbotConfig);

    // Validate chatbot config
    if (!chatbotConfig) {
      return NextResponse.json(
        { success: false, message: 'Chatbot config is required' },
        { status: 400 },
      );
    }

    // Validate welcome message length
    if (
      chatbotConfig.welcomeMessage &&
      chatbotConfig.welcomeMessage.length > 200
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Welcome message cannot exceed 200 characters',
        },
        { status: 400 },
      );
    }

    // Validate tone
    const validTones = ['professional', 'friendly', 'casual'];
    if (chatbotConfig.tone && !validTones.includes(chatbotConfig.tone)) {
      return NextResponse.json(
        { success: false, message: 'Invalid tone value' },
        { status: 400 },
      );
    }

    // Validate position
    const validPositions = ['bottom-right', 'bottom-left'];
    if (
      chatbotConfig.position &&
      !validPositions.includes(chatbotConfig.position)
    ) {
      return NextResponse.json(
        { success: false, message: 'Invalid position value' },
        { status: 400 },
      );
    }

    // Validate color (basic hex color check)
    if (chatbotConfig.primaryColor) {
      const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;
      if (!hexColorRegex.test(chatbotConfig.primaryColor)) {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid color format. Use hex format (e.g., #3B82F6)',
          },
          { status: 400 },
        );
      }
    }

    await connectDB();

    // Find and update client
    const client = await Client.findById(decoded.clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 },
      );
    }

    // Update chatbot config
    client.chatbotConfig = {
      welcomeMessage:
        chatbotConfig.welcomeMessage || client.chatbotConfig.welcomeMessage,
      tone: chatbotConfig.tone || client.chatbotConfig.tone,
      enabled:
        chatbotConfig.enabled !== undefined
          ? chatbotConfig.enabled
          : client.chatbotConfig.enabled,
      primaryColor:
        chatbotConfig.primaryColor || client.chatbotConfig.primaryColor,
      position: chatbotConfig.position || client.chatbotConfig.position,
    };

    await client.save();

    console.log('✅ Settings updated successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Settings updated successfully',
        data: {
          chatbotConfig: client.chatbotConfig,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Update settings error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update settings',
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/settings
 * Partially update specific settings
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

    const body = await request.json();

    await connectDB();

    const client = await Client.findById(decoded.clientId);

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 },
      );
    }

    // Update only provided fields
    if (body.businessName !== undefined) {
      client.name = body.businessName;
    }

    if (body.domain !== undefined) {
      client.domain = body.domain
        .toLowerCase()
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '');
    }

    if (body.businessType !== undefined) {
      client.businessType = body.businessType;
    }

    if (body.description !== undefined) {
      client.description = body.description;
    }

    await client.save();

    console.log('✅ Business info updated successfully');

    return NextResponse.json(
      {
        success: true,
        message: 'Business information updated successfully',
        data: {
          name: client.name,
          domain: client.domain,
          businessType: client.businessType,
          description: client.description,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Update business info error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : 'Failed to update business info',
      },
      { status: 500 },
    );
  }
}
