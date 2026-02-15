// src/app/api/admin/clients/[id]/activity/route.ts
import { authenticateRequest, requireAdmin } from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import Client from '@/models/Client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/clients/[id]/activity
 * Get recent activity for a client
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error) return error;

    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const { id } = await context.params;
    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 },
      );
    }

    // Get recent conversations with message counts
    const conversations = await Conversation.find({
      clientId: client._id,
    })
      .sort({ lastMessageAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    // Get total count
    const total = await Conversation.countDocuments({
      clientId: client._id,
    });

    // Enrich with latest message
    const enrichedConversations = await Promise.all(
      conversations.map(async (conv: any) => {
        const latestMessage = await Message.findOne({
          conversationId: conv._id,
        })
          .sort({ createdAt: -1 })
          .select('role content createdAt')
          .lean();

        return {
          ...conv,
          latestMessage,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: {
        total,
        limit,
        offset,
        conversations: enrichedConversations,
      },
    });
  } catch (error) {
    console.error('Get activity error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch activity' },
      { status: 500 },
    );
  }
}
