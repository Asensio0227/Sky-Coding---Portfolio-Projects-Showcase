// app/api/admin/messages/[id]/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { HttpError } from '@/lib/errors';
import { logger } from '@/lib/logger';
import { getRateLimiter } from '@/lib/rateLimiter';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { NextRequest, NextResponse } from 'next/server';

const rateLimiter = getRateLimiter({ windowMs: 60000, max: 60 }); // 60 requests per minute

function clientKey(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';
  return ip;
}

interface MessageQuery {
  conversationId: string;
  createdAt?: { $lt: Date };
}

/**
 * Verify user is authenticated
 */
async function verifyAuth(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return { authorized: false, error: 'Not authenticated', status: 401 };
  }

  const decoded = await verifyJWT(token);
  if (!decoded) {
    return { authorized: false, error: 'Invalid token', status: 401 };
  }

  return {
    authorized: true,
    user: {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role,
      clientId: decoded.clientId,
    },
  };
}

/**
 * GET /api/admin/messages/[id]
 * Get all messages for a specific conversation
 *
 * Params:
 * - id: conversation ID
 *
 * Query params:
 * - limit: Number of messages to return (default: 100)
 * - before: Get messages before this message ID (for pagination)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // rate limiting per client/IP
    const key = clientKey(request);
    if (!rateLimiter.check(key)) {
      throw new HttpError('Too many requests', 429);
    }

    const auth = await verifyAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status || 401 },
      );
    }

    // Await params in Next.js 15+
    const { id: conversationId } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const before = searchParams.get('before'); // Message ID for pagination

    logger.info('Fetching messages', { conversationId });

    await connectDB();

    // Verify conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'Conversation not found' },
        { status: 404 },
      );
    }

    // Authorization check (client can only view their own conversations)
    if (
      auth.user?.role === 'client' &&
      conversation.clientId.toString() !== auth.user?.clientId
    ) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    // Build query
    const query: MessageQuery = { conversationId };
    if (before) {
      const beforeMessage = await Message.findById(before);
      if (beforeMessage) {
        query.createdAt = { $lt: beforeMessage.createdAt };
      }
    }

    // Get messages
    const messages = await Message.find(query)
      .sort({ createdAt: -1 }) // Newest first for pagination
      .limit(limit)
      .lean();

    // Reverse to get chronological order
    const orderedMessages = messages.reverse();

    // Mark unread messages as read
    await Message.updateMany(
      { conversationId, isRead: false },
      { $set: { isRead: true } },
    );

    // Get total count
    const totalMessages = await Message.countDocuments({ conversationId });

    logger.info('Fetched messages', {
      returned: orderedMessages.length,
      total: totalMessages,
      conversationId,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          conversation: {
            id: conversation._id,
            visitorId: conversation.visitorId,
            source: conversation.source,
            status: conversation.status,
            messageCount: conversation.messageCount,
            createdAt: conversation.createdAt,
            lastMessageAt: conversation.lastMessageAt,
          },
          messages: orderedMessages,
          pagination: {
            total: totalMessages,
            returned: orderedMessages.length,
            hasMore: totalMessages > limit,
          },
        },
      },
      { status: 200 },
    );
  } catch (error) {
    // if it's an HttpError we can use the status code
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }

    logger.error('Get messages error', { error });
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch messages',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/messages/[id]
 * Send a manual message in a conversation (admin reply)
 *
 * Body:
 * - content: string (message content)
 * - role: 'assistant' | 'system' (default: 'assistant')
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const key = clientKey(request);
    if (!rateLimiter.check(key)) {
      throw new HttpError('Too many requests', 429);
    }

    const auth = await verifyAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status || 401 },
      );
    }

    // Await params
    const { id: conversationId } = await params;
    const body = await request.json();
    const { content, role = 'assistant' } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, message: 'Message content is required' },
        { status: 400 },
      );
    }

    if (content.length > 5000) {
      return NextResponse.json(
        { success: false, message: 'Message too long (max 5000 characters)' },
        { status: 400 },
      );
    }

    await connectDB();

    // Verify conversation exists
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return NextResponse.json(
        { success: false, message: 'Conversation not found' },
        { status: 404 },
      );
    }

    // Authorization check
    if (
      auth.user?.role === 'client' &&
      conversation.clientId.toString() !== auth.user?.clientId
    ) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 403 },
      );
    }

    // Create message
    const message = await Message.create({
      clientId: conversation.clientId,
      conversationId: conversation._id,
      role: role === 'system' ? 'system' : 'assistant',
      content,
      isRead: false,
      isFlagged: false,
      aiMetadata: {
        model: 'manual-reply',
        responseTime: 0,
      },
    });

    // Update conversation
    conversation.messageCount += 1;
    conversation.lastMessageAt = new Date();
    conversation.status = 'active'; // Reactivate if needed
    await conversation.save();

    logger.info('Manual message sent', {
      conversationId,
      messageId: message._id,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Message sent successfully',
        data: message,
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }
    logger.error('Send message error', { error });
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to send message',
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/admin/messages/[id]
 * Flag/unflag a message
 *
 * Body:
 * - messageId: string
 * - isFlagged: boolean
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status || 401 },
      );
    }

    const body = await request.json();
    const { messageId, isFlagged } = body;

    if (!messageId || typeof isFlagged !== 'boolean') {
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 },
      );
    }

    await connectDB();

    const message = await Message.findById(messageId);
    if (!message) {
      return NextResponse.json(
        { success: false, message: 'Message not found' },
        { status: 404 },
      );
    }

    // Authorization check
    if (auth.user?.role === 'client') {
      const conversation = await Conversation.findById(message.conversationId);
      if (
        !conversation ||
        conversation.clientId.toString() !== auth.user?.clientId
      ) {
        return NextResponse.json(
          { success: false, message: 'Unauthorized' },
          { status: 403 },
        );
      }
    }

    message.isFlagged = isFlagged;
    await message.save();

    console.log(
      `✅ Message ${messageId} ${isFlagged ? 'flagged' : 'unflagged'}`,
    );

    return NextResponse.json(
      {
        success: true,
        message: `Message ${isFlagged ? 'flagged' : 'unflagged'} successfully`,
        data: message,
      },
      { status: 200 },
    );
  } catch (error) {
    if (error instanceof HttpError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.status },
      );
    }
    logger.error('Flag message error', { error });
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to update message',
      },
      { status: 500 },
    );
  }
}
