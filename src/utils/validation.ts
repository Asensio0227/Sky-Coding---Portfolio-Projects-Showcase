import { NextRequest, NextResponse } from 'next/server';

export interface ApiError {
  message: string;
  statusCode: number;
}

export function createErrorResponse(
  message: string,
  statusCode: number = 400,
): NextResponse {
  return NextResponse.json({ error: message }, { status: statusCode });
}

export function createSuccessResponse(
  data: any,
  statusCode: number = 200,
): NextResponse {
  return NextResponse.json(data, { status: statusCode });
}

export function validateFileType(
  contentType: string | null | undefined,
  allowedTypes: string[],
): boolean {
  if (!contentType) return false;
  return allowedTypes.some((type) => contentType.includes(type));
}

export function getMediaTypeFromContentType(
  contentType: string,
): 'image' | 'video' | null {
  if (contentType.startsWith('image/')) {
    return 'image';
  }
  if (contentType.startsWith('video/')) {
    return 'video';
  }
  return null;
}

export function validateProjectData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !data.title ||
    typeof data.title !== 'string' ||
    data.title.trim().length === 0
  ) {
    errors.push('Title is required and must be a non-empty string');
  }

  if (
    !data.description ||
    typeof data.description !== 'string' ||
    data.description.trim().length === 0
  ) {
    errors.push('Description is required and must be a non-empty string');
  }

  if (!Array.isArray(data.media) || data.media.length === 0) {
    errors.push('At least one media item is required');
  }

  if (data.title && data.title.length > 100) {
    errors.push('Title cannot be more than 100 characters');
  }

  if (data.description && data.description.length > 2000) {
    errors.push('Description cannot be more than 2000 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateUserData(data: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (
    !data.name ||
    typeof data.name !== 'string' ||
    data.name.trim().length === 0
  ) {
    errors.push('Name is required and must be a non-empty string');
  }

  if (!data.email || !isValidEmail(data.email)) {
    errors.push('Valid email is required');
  }

  if (
    !data.bio ||
    typeof data.bio !== 'string' ||
    data.bio.trim().length === 0
  ) {
    errors.push('Bio is required and must be a non-empty string');
  }

  if (data.name && data.name.length > 100) {
    errors.push('Name cannot be more than 100 characters');
  }

  if (data.bio && data.bio.length > 500) {
    errors.push('Bio cannot be more than 500 characters');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email);
}
