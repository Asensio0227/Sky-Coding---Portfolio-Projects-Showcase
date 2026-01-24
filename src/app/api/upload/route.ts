import { uploadToCloudinary } from '@/lib/cloudinary';
import {
  createErrorResponse,
  createSuccessResponse,
  getMediaTypeFromContentType,
  validateFileType,
} from '@/utils/validation';
import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/ogg',
  'video/quicktime',
];
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return createErrorResponse('No file provided', 400);
    }

    const contentType = file.type;
    const isImage = validateFileType(contentType, ALLOWED_IMAGE_TYPES);
    const isVideo = validateFileType(contentType, ALLOWED_VIDEO_TYPES);

    if (!isImage && !isVideo) {
      return createErrorResponse(
        `Invalid file type. Allowed types: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(', ')}`,
        400,
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return createErrorResponse(
        `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        400,
      );
    }

    const buffer = await file.arrayBuffer();
    const mediaType = getMediaTypeFromContentType(contentType) || 'image';

    const response = await uploadToCloudinary(
      Buffer.from(buffer),
      file.name.replace(/\s+/g, '_'),
      mediaType,
    );

    return createSuccessResponse(
      {
        success: true,
        message: 'File uploaded successfully',
        data: response,
      },
      201,
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Failed to upload file';
    console.error('Upload error:', error);
    return createErrorResponse(errorMessage, 500);
  }
}
