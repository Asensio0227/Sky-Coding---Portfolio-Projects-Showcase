import { connectDB } from '@/lib/db';
import Client, { IClient } from '@/models/Client';
import Message from '@/models/Message';
import { NextRequest, NextResponse } from 'next/server';

// business logic moved into services
import * as clientService from '@/services/clientService';
import * as conversationService from '@/services/conversationService';
import * as messageService from '@/services/messageService';
import { checkPermission } from '@/services/rbacService';

// the AI helper is still in this file for now; could be extracted later

/**
 * POST /api/chat/message
 * Handle incoming chatbot messages
 *
 * Body:
 * - clientId: string (client ID)
 * - message: string (user's message)
 * - conversationId?: string (optional, for continuing conversations)
 * - visitorId?: string (optional, for tracking unique visitors)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { clientId, message, conversationId, visitorId } = body;

    // ---------- input validation ----------
    if (!clientId || !message) {
      return NextResponse.json(
        { success: false, error: 'clientId and message are required' },
        { status: 400 },
      );
    }

    if (message.length > 5000) {
      return NextResponse.json(
        { success: false, error: 'Message too long (max 5000 characters)' },
        { status: 400 },
      );
    }

    await connectDB();

    // ---------- tenant & RBAC checks ----------
    const client = await clientService.verifyClient(clientId);
    // even though this endpoint is unauthenticated we still enforce the "send"
    // permission so the logic is explicit and can later include roles.
    checkPermission('client', 'SEND_MESSAGE');

    // ---------- conversation handling ----------
    const conversation = await conversationService.getOrCreateConversation(
      clientId,
      client._id.toString(),
      visitorId,
      'website',
    );

    const userMessage = await messageService.createMessage(
      clientId,
      client._id.toString(),
      conversation._id.toString(),
      'user',
      message,
    );

    await conversationService.bumpConversationActivity(
      conversation._id.toString(),
      clientId,
      1,
    );

    // TODO: move AI logic into its own service when it grows
    const aiResponse = await generateAIResponse(message, client);

    const assistantMessage = await messageService.createMessage(
      clientId,
      client._id.toString(),
      conversation._id.toString(),
      'assistant',
      aiResponse.content,
      {
        model: 'gpt-3.5-turbo',
        responseTime: aiResponse.responseTime,
        confidence: aiResponse.confidence,
      },
    );

    await conversationService.bumpConversationActivity(
      conversation._id.toString(),
      clientId,
      1,
    );

    // update stats via service
    await clientService.incrementStats(
      clientId,
      2,
      conversation.messageCount === 2 ? 1 : 0,
    );

    return NextResponse.json(
      {
        success: true,
        data: {
          conversationId: conversation._id,
          userMessage: {
            id: userMessage._id,
            content: userMessage.content,
            createdAt: userMessage.createdAt,
          },
          assistantMessage: {
            id: assistantMessage._id,
            content: assistantMessage.content,
            createdAt: assistantMessage.createdAt,
          },
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('❌ Chat message error:', error);
    const status = error.status || 500;
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to process message',
      },
      { status },
    );
  }
}

/**
 * Generate AI response (placeholder - integrate with OpenAI/Claude later)
 */
async function generateAIResponse(
  userMessage: string,
  client: IClient,
): Promise<{
  content: string;
  responseTime: number;
  confidence: number;
}> {
  const startTime = Date.now();

  // TODO: Replace with actual AI integration (OpenAI, Anthropic Claude, etc.)
  // For now, return a smart default response based on the client config

  const welcomeMessage =
    client.chatbotConfig?.welcomeMessage ||
    `Hello! Welcome to ${client.name}. How can I help you today?`;

  let responseContent = '';

  // Simple keyword matching (replace with AI)
  const lowerMessage = userMessage.toLowerCase();

  if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
    responseContent = welcomeMessage;
  } else if (lowerMessage.includes('hours') || lowerMessage.includes('open')) {
    responseContent = `Our hours vary by location. Please visit our website at ${client.domain} for specific hours, or let me know your location!`;
  } else if (lowerMessage.includes('menu') || lowerMessage.includes('food')) {
    responseContent = `You can view our full menu on our website: ${client.domain}/menu. Is there anything specific you'd like to know about?`;
  } else if (
    lowerMessage.includes('book') ||
    lowerMessage.includes('reservation')
  ) {
    responseContent = `I'd be happy to help you make a reservation! Please visit ${client.domain}/reservations or call us directly. What date were you thinking of?`;
  } else if (
    lowerMessage.includes('location') ||
    lowerMessage.includes('address')
  ) {
    responseContent = `You can find our location details on our website: ${client.domain}/contact. Would you like directions?`;
  } else {
    responseContent = `Thank you for your message! I'm here to help. For detailed information about ${client.name}, please visit our website at ${client.domain}, or feel free to ask me anything!`;
  }

  const responseTime = Date.now() - startTime;

  return {
    content: responseContent,
    responseTime,
    confidence: 0.85, // Placeholder confidence score
  };
}

/**
 * GET /api/chat/message
 * Get messages for a conversation
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');

    if (!conversationId) {
      return NextResponse.json(
        { success: false, message: 'Missing conversationId parameter' },
        { status: 400 },
      );
    }

    await connectDB();

    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .select('-__v');

    return NextResponse.json(
      {
        success: true,
        data: messages,
        count: messages.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Get messages error:', error);
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
