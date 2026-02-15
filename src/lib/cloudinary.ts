import { v2 as cloudinary } from 'cloudinary';

// don't throw during build; only configure at runtime when env vars exist
const { CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET, NODE_ENV } = process.env;
if (CLOUD_NAME && CLOUD_API_KEY && CLOUD_API_SECRET) {
  cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: CLOUD_API_KEY,
    api_secret: CLOUD_API_SECRET,
  });
} else {
  // no credentials provided; library loads but operations will fail at runtime
  console.warn('Cloudinary not configured; uploads functionality disabled');
}

export interface UploadResponse {
  url: string;
  publicId: string;
  type: 'image' | 'video';
}

export async function uploadToCloudinary(
  file: Buffer,
  fileName: string,
  mediaType: 'image' | 'video' = 'image',
): Promise<UploadResponse> {
  try {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'skycoding/projects',
          resource_type: mediaType === 'video' ? 'video' : 'image',
          public_id: fileName.split('.')[0],
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Cloudinary upload failed: ${error.message}`));
          } else if (result) {
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              type: mediaType,
            });
          }
        },
      );

      uploadStream.end(file);
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to upload to Cloudinary: ${errorMessage}`);
  }
}

export async function deleteFromCloudinary(
  publicId: string,
  resourceType: string = 'image',
): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType as 'image' | 'video' | 'raw',
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error occurred';
    console.error(`Failed to delete from Cloudinary: ${errorMessage}`);
    throw new Error(`Failed to delete from Cloudinary: ${errorMessage}`);
  }
}

export default cloudinary;
