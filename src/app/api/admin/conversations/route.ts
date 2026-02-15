import {
  authenticateRequest,
  enforceTenantIsolation,
} from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/conversations
 * Returns conversations for the authenticated user
 * Admin sees all, clients see only their own
 */
export async function GET(request: NextRequest) {
  try {
    // =====================
    // AUTHENTICATE REQUEST
    // =====================
    const { user, error } = await authenticateRequest(request);
    if (error) return error;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 },
      );
    }

    await connectDB();

    // =====================
    // BUILD QUERY (with tenant isolation)
    // =====================
    interface ConversationFilter {
      clientId?: string;
      status?: 'active' | 'resolved' | 'abandoned';
    }

    const filter: ConversationFilter = {};

    // Clients can only see their own client's data
    if (user.role === 'client') {
      filter.clientId = user.clientId;
    }
    // Admins see all (no clientId filter)

    // Optional status filter from query params
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');
    if (
      statusParam &&
      ['active', 'resolved', 'abandoned'].includes(statusParam)
    ) {
      filter.status = statusParam as 'active' | 'resolved' | 'abandoned';
    }

    // =====================
    // FETCH CONVERSATIONS
    // =====================
    const conversations = await Conversation.find(filter)
      .sort({ lastMessageAt: -1 })
      .limit(50)
      .lean();

    // =====================
    // PREPARE RESPONSE
    // =====================
    interface ConversationItem {
      id: string;
      clientId: string;
      visitorId: string;
      status: 'active' | 'resolved' | 'abandoned';
      messageCount: number;
      lastMessageAt: Date;
      createdAt: Date;
      source: string;
    }

    interface ConversationsResponse {
      success: boolean;
      data: {
        total: number;
        conversations: ConversationItem[];
      };
    }

    const conversationList: ConversationItem[] = conversations.map(
      (conv: any): ConversationItem => ({
        id: conv._id.toString(),
        clientId: conv.clientId.toString(),
        visitorId: conv.visitorId,
        status: conv.status,
        messageCount: conv.messageCount,
        lastMessageAt: conv.lastMessageAt,
        createdAt: conv.createdAt,
        source: conv.source,
      }),
    );

    return NextResponse.json<ConversationsResponse>(
      {
        success: true,
        data: {
          total: conversationList.length,
          conversations: conversationList,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Conversations fetch error:', error);
    return NextResponse.json<{ success: boolean; message: string }>(
      { success: false, message: 'Failed to fetch conversations' },
      { status: 500 },
    );
  }
}

/**
 * GET /api/conversations/[id]
 * Returns a single conversation with messages
 * Enforces tenant isolation
 */
export async function GETById(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    // =====================
    // AUTHENTICATE REQUEST
    // =====================
    const { user, error } = await authenticateRequest(request);
    if (error) return error;

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 },
      );
    }

    await connectDB();

    // =====================
    // FETCH CONVERSATION
    // =====================
    const conversation = await Conversation.findById(params.id).lean();

    if (!conversation) {
      return NextResponse.json<{ success: boolean; message: string }>(
        { success: false, message: 'Conversation not found' },
        { status: 404 },
      );
    }

    // =====================
    // ENFORCE TENANT ISOLATION
    // =====================
    const tenantError = enforceTenantIsolation(
      user,
      conversation.clientId.toString(),
    );
    if (tenantError) return tenantError;

    // =====================
    // FETCH MESSAGES
    // =====================
    const messages = await Message.find({
      conversationId: conversation._id,
    })
      .sort({ createdAt: 1 })
      .select('-clientId')
      .lean(); // reduce mongoose overhead

    // =====================
    // PREPARE RESPONSE
    // =====================
    interface MessageItem {
      id: string;
      role: 'user' | 'assistant' | 'system';
      content: string;
      createdAt: Date;
      isRead: boolean;
    }

    interface ConversationDetailResponse {
      success: boolean;
      data: {
        conversation: {
          id: string;
          visitorId: string;
          status: string;
          messageCount: number;
          lastMessageAt: Date;
          createdAt: Date;
        };
        messages: MessageItem[];
      };
    }

    return NextResponse.json<ConversationDetailResponse>(
      {
        success: true,
        data: {
          conversation: {
            id: conversation._id.toString(),
            visitorId: conversation.visitorId,
            status: conversation.status,
            messageCount: conversation.messageCount,
            lastMessageAt: conversation.lastMessageAt,
            createdAt: conversation.createdAt,
          },
          messages: messages.map(
            (msg: any): MessageItem => ({
              id: msg._id.toString(),
              role: msg.role,
              content: msg.content,
              createdAt: msg.createdAt,
              isRead: msg.isRead,
            }),
          ),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Conversation detail fetch error:', error);
    return NextResponse.json<{ success: boolean; message: string }>(
      { success: false, message: 'Failed to fetch conversation details' },
      { status: 500 },
    );
  }
}
