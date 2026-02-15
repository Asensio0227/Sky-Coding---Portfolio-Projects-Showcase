// src/app/api/admin/clients/route.ts
import { authenticateRequest, requireAdmin } from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import Conversation from '@/models/Conversation';
import Message from '@/models/Message';
import { defaultMessageLimit } from '@/utils/plan';
import { NextRequest, NextResponse } from 'next/server';

interface ClientFilter {
  isActive?: boolean;
  plan?: string;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    domain?: { $regex: string; $options: string };
  }>;
}

interface PopulatedUser {
  _id: unknown;
  email: string;
  isActive: boolean;
}

/**
 * GET /api/admin/clients
 * Returns all clients with detailed stats (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error) return error;

    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    await connectDB();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const plan = searchParams.get('plan');
    const search = searchParams.get('search');

    // Build filter
    const filter: ClientFilter = {};
    if (status) {
      filter.isActive = status === 'active';
    }
    if (plan) {
      filter.plan = plan;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { domain: { $regex: search, $options: 'i' } },
      ];
    }

    const clients = await Client.find(filter)
      .populate<{ userId: PopulatedUser }>('userId', 'email isActive createdAt')
      .sort({ createdAt: -1 });

    // Enrich with real-time stats
    const enrichedClients = await Promise.all(
      clients.map(async (client: any) => {
        const [conversationCount, messageCount, activeConversations] =
          await Promise.all([
            Conversation.countDocuments({ clientId: client._id }),
            Message.countDocuments({ clientId: client._id }),
            Conversation.countDocuments({
              clientId: client._id,
              status: 'active',
            }),
          ]);

        return {
          id: client._id.toString(),
          name: client.name,
          domain: client.domain,
          businessType: client.businessType,
          owner: client.userId
            ? {
                id: String(client.userId._id),
                email: client.userId.email,
                isActive: client.userId.isActive,
              }
            : null,
          plan: client.plan,
          isActive: client.isActive,
          chatbotEnabled: client.chatbotConfig.enabled,
          stats: {
            totalConversations: conversationCount,
            totalMessages: messageCount,
            activeConversations,
          },
          createdAt: client.createdAt,
          updatedAt: client.updatedAt,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      data: {
        total: enrichedClients.length,
        clients: enrichedClients,
      },
    });
  } catch (error) {
    console.error('Admin clients error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch clients' },
      { status: 500 },
    );
  }
}

/**
 * POST /api/admin/clients
 * Create a new client (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error) return error;

    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    await connectDB();

    const body = await request.json();
    const { userId, name, domain, businessType, plan } = body;
    const normalizedPlan = plan || 'starter';

    // Validate required fields
    if (!userId || !name || !domain) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: userId, name, domain',
        },
        { status: 400 },
      );
    }

    // Normalize domain
    const normalizedDomain = domain
      .toLowerCase()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .split('/')[0];

    // Check if client already exists for this user or domain
    const existing = await Client.findOne({
      $or: [{ userId }, { domain: normalizedDomain }],
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          message: 'Client already exists for this user or domain',
        },
        { status: 409 },
      );
    }

    // Create client (assign default messageLimit based on plan)
    const client = await Client.create({
      userId,
      name,
      domain: normalizedDomain,
      businessType: businessType || 'other',
      plan: normalizedPlan,
      messageLimit: defaultMessageLimit(normalizedPlan),
      usageCount: 0,
      subscriptionStatus: 'active',
      isActive: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Client created successfully',
        data: {
          id: client._id.toString(),
          name: client.name,
          domain: client.domain,
          clientId: client._id.toString(),
        },
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    console.error('Create client error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Failed to create client',
      },
      { status: 500 },
    );
  }
}
