// app/api/admin/stats/route.ts
import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import Client from '@/models/Client';
import { NextRequest, NextResponse } from 'next/server';

interface DateFilter {
  createdAt?: { $gte: Date };
}

interface StatsQuery {
  clientId?: string;
  createdAt?: { $gte: Date };
  status?: string;
  role?: string;
  isFlagged?: boolean;
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
 * GET /api/admin/stats
 * Get dashboard statistics
 *
 * Query params:
 * - clientId: Filter by client (optional for admin)
 * - period: Time period (7d, 30d, all) - default: 30d
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, message: auth.error },
        { status: auth.status || 401 },
      );
    }

    const { searchParams } = new URL(request.url);
    const clientId =
      searchParams.get('clientId') || auth.user?.clientId;
    const period = searchParams.get('period') || '30d';

    console.log('📊 Fetching stats:', {
      clientId,
      period,
      userRole: auth.user?.role,
    });

    await connectDB();

    // Calculate date range
    let dateFilter: DateFilter = {};
    if (period !== 'all') {
      const days = parseInt(period) || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      dateFilter = { createdAt: { $gte: startDate } };
    }

    // Build base query
    const baseQuery: StatsQuery = clientId ? { clientId } : {};
    const periodQuery: StatsQuery = { ...baseQuery, ...dateFilter };

    // Get stats in parallel
    const [
      totalConversations,
      activeConversations,
      resolvedConversations,
      totalMessages,
      userMessages,
      assistantMessages,
      flaggedMessages,
      averageMessagesPerConversation,
      recentConversations,
      topQuestions,
    ] = await Promise.all([
      // Total conversations
      Conversation.countDocuments(periodQuery),

      // Active conversations
      Conversation.countDocuments({ ...periodQuery, status: 'active' }),

      // Resolved conversations
      Conversation.countDocuments({ ...periodQuery, status: 'resolved' }),

      // Total messages
      Message.countDocuments(periodQuery),

      // User messages
      Message.countDocuments({ ...periodQuery, role: 'user' }),

      // Assistant messages
      Message.countDocuments({ ...periodQuery, role: 'assistant' }),

      // Flagged messages
      Message.countDocuments({ ...periodQuery, isFlagged: true }),

      // Average messages per conversation
      Conversation.aggregate([
        { $match: periodQuery },
        {
          $group: {
            _id: null,
            avgMessages: { $avg: '$messageCount' },
          },
        },
      ]),

      // Recent conversations (last 10)
      Conversation.find(periodQuery)
        .sort({ lastMessageAt: -1 })
        .limit(10)
        .select('visitorId status messageCount lastMessageAt')
        .lean(),

      // Top questions (most common user messages)
      Message.aggregate([
        { $match: { ...periodQuery, role: 'user' } },
        {
          $group: {
            _id: { $toLower: '$content' },
            count: { $sum: 1 },
          },
        },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $project: {
            question: '$_id',
            count: 1,
            _id: 0,
          },
        },
      ]),
    ]);

    // Calculate response time (placeholder - will need actual timing data)
    const averageResponseTime = 2.5; // seconds (placeholder)

    // Calculate response rate
    const responseRate =
      userMessages > 0
        ? ((assistantMessages / userMessages) * 100).toFixed(1)
        : '0';

    // Get client info if specific client
    let clientInfo = null;
    if (clientId) {
      clientInfo = await Client.findById(clientId)
        .select('name domain chatbotConfig totalConversations totalMessages')
        .lean();
    }

    const stats = {
      overview: {
        totalConversations,
        activeConversations,
        resolvedConversations,
        abandonedConversations:
          totalConversations - activeConversations - resolvedConversations,
        totalMessages,
        userMessages,
        assistantMessages,
        flaggedMessages,
      },
      metrics: {
        averageMessagesPerConversation:
          averageMessagesPerConversation[0]?.avgMessages?.toFixed(1) || '0',
        averageResponseTime: `${averageResponseTime}s`,
        responseRate: `${responseRate}%`,
        activeRate:
          totalConversations > 0
            ? `${((activeConversations / totalConversations) * 100).toFixed(1)}%`
            : '0%',
        resolutionRate:
          totalConversations > 0
            ? `${((resolvedConversations / totalConversations) * 100).toFixed(1)}%`
            : '0%',
      },
      trends: {
        period,
        periodLabel: period === 'all' ? 'All Time' : `Last ${period}`,
        recentConversations,
      },
      insights: {
        topQuestions: topQuestions.slice(0, 5),
        peakHours: [], // TODO: Implement peak hours analysis
        commonIssues: [], // TODO: Implement issue detection
      },
      client: clientInfo,
    };

    console.log('✅ Stats calculated:', {
      conversations: totalConversations,
      messages: totalMessages,
    });

    return NextResponse.json(
      {
        success: true,
        data: stats,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('❌ Get stats error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to fetch statistics',
      },
      { status: 500 },
    );
  }
}
