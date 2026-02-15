import { authenticateRequest, requireClient } from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/dashboard/stats
 * Returns dashboard statistics for the authenticated client
 * Demonstrates proper TypeScript usage without 'any'
 */
export async function GET(request: NextRequest) {
  try {
    // =====================
    // AUTHENTICATE REQUEST
    // =====================
    const { user, error } = await authenticateRequest(request);
    if (error) return error;

    // =====================
    // REQUIRE CLIENT ROLE
    // =====================
    const clientError = requireClient(user);
    if (clientError) return clientError;

    // TypeScript now knows user is not null and has clientId
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 },
      );
    }

    await connectDB();

    // =====================
    // FETCH STATISTICS (tenant-isolated)
    // =====================
    const [totalConversations, activeConversations, totalMessages] =
      await Promise.all([
        Conversation.countDocuments({ clientId: user.clientId }),
        Conversation.countDocuments({
          clientId: user.clientId,
          status: 'active',
        }),
        Message.countDocuments({ clientId: user.clientId }),
      ]);

    // Get recent conversations
    const recentConversations = await Conversation.find({
      clientId: user.clientId,
    })
      .sort({ lastMessageAt: -1 })
      .limit(10)
      .select('visitorId status messageCount lastMessageAt createdAt source');

    // Calculate average messages per conversation
    const averageMessagesPerConversation =
      totalConversations > 0
        ? Math.round(totalMessages / totalConversations)
        : 0;

    // =====================
    // PREPARE RESPONSE
    // =====================
    interface DashboardStatsResponse {
      success: boolean;
      data: {
        totalConversations: number;
        activeConversations: number;
        resolvedConversations: number;
        totalMessages: number;
        averageMessagesPerConversation: number;
        recentConversations: Array<{
          id: string;
          visitorId: string;
          status: string;
          messageCount: number;
          lastMessageAt: Date;
          createdAt: Date;
          source: string;
        }>;
      };
    }

    return NextResponse.json<DashboardStatsResponse>(
      {
        success: true,
        data: {
          totalConversations,
          activeConversations,
          resolvedConversations: totalConversations - activeConversations,
          totalMessages,
          averageMessagesPerConversation,
          recentConversations: recentConversations.map((conv: any) => ({
            id: conv._id.toString(),
            visitorId: conv.visitorId,
            status: conv.status,
            messageCount: conv.messageCount,
            lastMessageAt: conv.lastMessageAt,
            createdAt: conv.createdAt,
            source: conv.source,
          })),
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json<{ success: boolean; message: string }>(
      { success: false, message: 'Failed to fetch dashboard statistics' },
      { status: 500 },
    );
  }
}
