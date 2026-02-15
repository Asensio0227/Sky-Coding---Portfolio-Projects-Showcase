// app/api/projects/[id]/route.ts
import { verifyJWT } from '@/lib/auth';
import { deleteFromCloudinary } from '@/lib/cloudinary';
import { connectDB } from '@/lib/db';
import { Project } from '@/models';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse } from '@/utils/validation';
import { NextRequest } from 'next/server';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return { valid: false, error: 'Unauthorized: No token provided' };
  }

  const decoded = await verifyJWT(token);
  if (!decoded) {
    return { valid: false, error: 'Unauthorized: Invalid token' };
  }

  if (decoded.role !== 'admin') {
    return { valid: false, error: 'Forbidden: Admin access required' };
  }

  return { valid: true, user: decoded };
}

// GET single project
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;

    await connectDB();
    const project = await Project.findById(id);

    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    return createSuccessResponse({
      success: true,
      data: project,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch project';
    console.error('Fetch project error:', error);
    return createErrorResponse(errorMessage, 500);
  }
}

// DELETE project (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Await params in Next.js 15+
    const { id } = await params;

    const auth = await verifyAdmin(request);
    if (!auth.valid || !auth.user) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    await connectDB();

    const project = await Project.findById(id);
    if (!project) {
      return createErrorResponse('Project not found', 404);
    }

    // Delete media from Cloudinary
    for (const media of project.media) {
      try {
        await deleteFromCloudinary(
          media.publicId,
          media.type === 'video' ? 'video' : 'image',
        );
      } catch (error) {
        console.error('Failed to delete media from Cloudinary:', error);
      }
    }

    // Remove project reference from user
    await User.updateOne(
      { _id: auth.user.id },
      { $pull: { projects: project._id } },
    );

    // Delete project
    await Project.findByIdAndDelete(id);

    return createSuccessResponse({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to delete project';
    console.error('Delete project error:', error);
    return createErrorResponse(errorMessage, 500);
  }
}
