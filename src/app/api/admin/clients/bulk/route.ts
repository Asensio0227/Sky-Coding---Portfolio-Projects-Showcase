// src/app/api/admin/clients/bulk/route.ts
import { authenticateRequest, requireAdmin } from '@/lib/auth-middleware';
import { connectDB } from '@/lib/db';
import Client from '@/models/Client';
import { DeleteResult, UpdateResult } from 'mongodb';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/admin/clients/bulk
 * Perform bulk operations on clients
 */
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await authenticateRequest(request);
    if (error) return error;

    const adminError = requireAdmin(user);
    if (adminError) return adminError;

    await connectDB();

    const body = await request.json();
    const { action, clientIds } = body;

    if (!action || !clientIds || !Array.isArray(clientIds)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request. Provide action and clientIds array',
        },
        { status: 400 },
      );
    }

    let result: UpdateResult | DeleteResult;
    let count = 0;

    switch (action) {
      case 'activate':
        result = await Client.updateMany(
          { _id: { $in: clientIds } },
          { $set: { isActive: true } },
        );
        count = 'modifiedCount' in result ? result.modifiedCount : 0;
        break;

      case 'deactivate':
        result = await Client.updateMany(
          { _id: { $in: clientIds } },
          { $set: { isActive: false } },
        );
        count = 'modifiedCount' in result ? result.modifiedCount : 0;
        break;

      case 'changePlan':
        const { plan } = body;
        if (!plan) {
          return NextResponse.json(
            {
              success: false,
              message: 'Plan is required for changePlan action',
            },
            { status: 400 },
          );
        }
        result = await Client.updateMany(
          { _id: { $in: clientIds } },
          { $set: { plan } },
        );
        count = 'modifiedCount' in result ? result.modifiedCount : 0;
        break;

      case 'delete':
        result = await Client.deleteMany({ _id: { $in: clientIds } });
        count = 'deletedCount' in result ? result.deletedCount : 0;
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            message:
              'Invalid action. Use: activate, deactivate, changePlan, or delete',
          },
          { status: 400 },
        );
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${action} completed successfully`,
      data: {
        modifiedCount: count,
        action,
        clientIds,
      },
    });
  } catch (error) {
    console.error('Bulk operation error:', error);
    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : 'Bulk operation failed',
      },
      { status: 500 },
    );
  }
}
