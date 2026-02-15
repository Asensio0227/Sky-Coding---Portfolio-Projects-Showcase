// src/app/api/admin/clients/[id]/stats/route.ts
import { authenticateRequest, requireAdmin } from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import Client from '@/models/Client';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/admin/clients/[id]/stats
 * Get detailed statistics for a client
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { user, error } = await authenticateRequest(request);
    if (error) return error;

    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    await connectDB();

    const client = await Client.findById(id);

    if (!client) {
      return NextResponse.json(
        { success: false, message: 'Client not found' },
        { status: 404 },
      );
    }

    // Get time-based stats
    const now = new Date();
    const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const [
      totalConversations,
      totalMessages,
      activeConversations,
      resolvedConversations,
      conversationsLast7Days,
      conversationsLast30Days,
      messagesLast7Days,
      messagesLast30Days,
      averageResponseTime,
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
      Conversation.countDocuments({
        clientId: client._id,
        createdAt: { $gte: last7Days },
      }),
      Conversation.countDocuments({
        clientId: client._id,
        createdAt: { $gte: last30Days },
      }),
      Message.countDocuments({
        clientId: client._id,
        createdAt: { $gte: last7Days },
      }),
      Message.countDocuments({
        clientId: client._id,
        createdAt: { $gte: last30Days },
      }),
      // Calculate average response time (simplified)
      Message.aggregate([
        { $match: { clientId: client._id, role: 'assistant' } },
        { $limit: 100 },
        {
          $group: { _id: null, avgTime: { $avg: '$aiMetadata.responseTime' } },
        },
      ]),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalConversations,
          totalMessages,
          activeConversations,
          resolvedConversations,
          abandonedConversations:
            totalConversations - activeConversations - resolvedConversations,
        },
        recent: {
          conversationsLast7Days,
          conversationsLast30Days,
          messagesLast7Days,
          messagesLast30Days,
        },
        performance: {
          averageMessagesPerConversation:
            totalConversations > 0
              ? Math.round(totalMessages / totalConversations)
              : 0,
          averageResponseTime: averageResponseTime[0]?.avgTime
            ? Math.round(averageResponseTime[0].avgTime)
            : 0,
          resolutionRate:
            totalConversations > 0
              ? Math.round((resolvedConversations / totalConversations) * 100)
              : 0,
        },
      },
    });
  } catch (error) {
    console.error('Get client stats error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch statistics' },
      { status: 500 },
    );
  }
}
