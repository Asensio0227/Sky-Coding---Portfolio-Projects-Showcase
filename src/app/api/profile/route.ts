// app/api/profile/route.ts
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { createErrorResponse, createSuccessResponse } from '@/utils/validation';
import { NextRequest } from 'next/server';

// GET user profile with projects
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    let user = await User.findOne({}).populate('projects');

    if (!user) {
      // Create default user if none exists
      user = await User.create({
        name: process.env.OWNER_NAME || 'Sky Coding',
        email: process.env.OWNER_EMAIL || 'contact@skycoding.com',
        bio:
          process.env.OWNER_BIO ||
          'Innovative software solutions and web development',
        socialLinks: {
          whatsapp: 'https://wa.me/263786974895',
          facebook: 'https://www.facebook.com/profile.php?id=61584322210511',
          instagram: 'https://www.instagram.com/skycodingjr/',
          twitter: 'https://x.com/skycodingjr',
        },
        projects: [],
      });
    }

    return createSuccessResponse({
      success: true,
      data: user,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to fetch user profile';
    console.error('Fetch user error:', error);
    return createErrorResponse(errorMessage, 500);
  }
}

// PUT update user profile
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const user = await User.findOne({});

    if (!user) {
      return createErrorResponse('User not found', 404);
    }

    // Update user fields
    if (body.name) user.name = body.name;
    if (body.bio) user.bio = body.bio;
    if (body.email) user.email = body.email;
    if (body.avatar) user.avatar = body.avatar;
    if (body.socialLinks) {
      user.socialLinks = {
        ...user.socialLinks,
        ...body.socialLinks,
      };
    }

    await user.save();

    return createSuccessResponse({
      success: true,
      message: 'Profile updated successfully',
      data: user,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to update user profile';
    console.error('Update user error:', error);
    return createErrorResponse(errorMessage, 500);
  }
}
