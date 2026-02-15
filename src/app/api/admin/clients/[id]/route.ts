// src/app/api/admin/clients/[id]/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { defaultMessageLimit } from '@/utils/plan';
import { NextRequest, NextResponse } from 'next/server';

interface PopulatedUser {
  _id: unknown;
  email: string;
  isActive: boolean;
  createdAt: Date;
}

/**
 * GET /api/admin/clients/[id]
 * Get detailed client information
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Await params in Next.js 15+
    const { id } = await context.params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    const user = await verifyJWT(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    console.log('📋 Fetching client details for ID:', id);

    await connectDB();

    const client = await Client.findById(id).populate<{
      userId: PopulatedUser;
    }>('userId', 'email isActive createdAt');
    if (!client) {
      console.error('❌ Client not found with ID:', id);
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 },
      );
    }

    console.log('✅ Client found:', client.name);

    // Get detailed stats
    const [
      totalConversations,
      totalMessages,
      activeConversations,
      resolvedConversations,
      recentConversations,
    ] = await Promise.all([
      Conversation.countDocuments({ clientId: client._id }),
      Message.countDocuments({ clientId: client._id }),
      Conversation.countDocuments({
        clientId: client._id,
        status: 'active',
      }),
      Conversation.countDocuments({
        clientId: client._id,
        status: 'resolved',
      }),
      Conversation.find({ clientId: client._id })
        .sort({ lastMessageAt: -1 })
        .limit(5)
        .select('visitorId status messageCount createdAt lastMessageAt'),
    ]);

    console.log('✅ Stats fetched:', {
      totalConversations,
      totalMessages,
      activeConversations,
    });

    return NextResponse.json({
      success: true,
      data: {
        id: client._id.toString(),
        name: client.name,
        domain: client.domain,
        allowedDomains: client.allowedDomains,
        businessType: client.businessType,
        description: client.description,
        owner: client.userId
          ? {
              id: String(client.userId._id),
              email: client.userId.email,
              isActive: client.userId.isActive,
              createdAt: client.userId.createdAt,
            }
          : null,
        chatbotConfig: client.chatbotConfig,
        plan: client.plan,
        isActive: client.isActive,
        stats: {
          totalConversations,
          totalMessages,
          activeConversations,
          resolvedConversations,
          averageMessagesPerConversation:
            totalConversations > 0
              ? Math.round(totalMessages / totalConversations)
              : 0,
        },
        recentConversations,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
      },
    });
  } catch (error) {
    console.error('❌ Get client error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch client',
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/clients/[id]
 * Update client details
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Await params in Next.js 15+
    const { id } = await context.params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    const user = await verifyJWT(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    await connectDB();

    const body = await request.json();
    const {
      name,
      domain,
      businessType,
      description,
      plan,
      isActive,
      allowedDomains,
      chatbotConfig,
    } = body;

    const client = await Client.findById(id);

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
    if (plan) {
      client.plan = plan;
      client.messageLimit = defaultMessageLimit(plan as any);
      // optionally reset usage when plan increases
      if (client.usageCount > client.messageLimit && client.plan !== 'pro') {
        client.usageCount = 0;
      }
    }
    if (isActive !== undefined) client.isActive = isActive;
    if (allowedDomains) client.allowedDomains = allowedDomains;
    if (chatbotConfig) {
      client.chatbotConfig = {
        ...client.chatbotConfig,
        ...chatbotConfig,
      };
    }

    await client.save();

    console.log('✅ Client updated:', client.name);

    return NextResponse.json({
      success: true,
      message: 'Client updated successfully',
      data: {
        id: client._id.toString(),
        name: client.name,
        domain: client.domain,
        isActive: client.isActive,
      },
    });
  } catch (error: unknown) {
    console.error('❌ Update client error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update client',
      },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/clients/[id]
 * Delete client and all associated data
 */
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    // Await params in Next.js 15+
    const { id } = await context.params;

    // Authenticate user
    const token = request.cookies.get('auth_token')?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      );
    }

    const user = await verifyJWT(token);
    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    await connectDB();

    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 },
      );
    }

    console.log('🗑️ Deleting client:', client.name);

    // Delete all associated data
    const [conversationsDeleted, messagesDeleted] = await Promise.all([
      Conversation.deleteMany({ clientId: client._id }),
      Message.deleteMany({ clientId: client._id }),
    ]);

    // Delete client
    await client.deleteOne();

    console.log('✅ Client deleted successfully');

    return NextResponse.json({
      success: true,
      message: 'Client and all associated data deleted successfully',
      data: {
        clientId: id,
        conversationsDeleted: conversationsDeleted.deletedCount,
        messagesDeleted: messagesDeleted.deletedCount,
      },
    });
  } catch (error) {
    console.error('❌ Delete client error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to delete client',
      },
      { status: 500 },
    );
  }
}
