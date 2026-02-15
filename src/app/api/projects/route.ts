import { verifyJWT } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Project } from '@/models';
import User from '@/models/User';
import {
  createErrorResponse,
  createSuccessResponse,
  validateProjectData,
} from '@/utils/validation';
import { NextRequest } from 'next/server';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return { valid: false, error: 'Unauthorized: No token provided' };
  }

  // IMPORTANT: await the verifyJWT call since it's now async (using jose)
  const decoded = await verifyJWT(token);
  if (!decoded) {
    return { valid: false, error: 'Unauthorized: Invalid token' };
  }

  if (decoded.role !== 'admin') {
    return { valid: false, error: 'Forbidden: Admin access required' };
  }

  return { valid: true, user: decoded };
}

// GET all projects (public)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const projects = await Project.find().sort({ createdAt: -1 });

    return createSuccessResponse({
      success: true,
      data: projects,
      count: projects.length,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch projects';
    console.error('Fetch projects error:', error);
    return createErrorResponse(errorMessage, 500);
  }
}

// POST create new project (admin only)
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdmin(request);
    if (!auth.valid) {
      return createErrorResponse(auth.error || 'Unauthorized', 401);
    }

    await connectDB();

    const body = await request.json();

    const validation = validateProjectData(body);
    if (!validation.valid) {
      return createErrorResponse(validation.errors.join(', '), 400);
    }

    if (!auth.user) {
      return createErrorResponse('Unauthorized', 401);
    }
    const admin = await User.findById(auth.user.id);
    if (!admin) {
      return createErrorResponse('Admin user not found', 404);
    }

    const project = await Project.create({
      title: body.title.trim(),
      description: body.description.trim(),
      media: body.media,
    });

    admin.projects.push(project._id);
    await admin.save();

    return createSuccessResponse(
      {
        success: true,
        message: 'Project created successfully',
        data: project,
      },
      201,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to create project';
    console.error('Create project error:', error);
    return createErrorResponse(errorMessage, 500);
  }
}
