'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';

interface Media {
  url: string;
  type: 'image' | 'video';
  publicId: string;
}

interface MediaUploadProps {
  onMediaAdded: (media: Media) => void;
  isLoading?: boolean;
}

export default function MediaUpload({
  onMediaAdded,
  isLoading = false,
}: MediaUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<{
    url: string;
    type: 'image' | 'video';
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0]) {
      await uploadFile(files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && files[0]) {
      await uploadFile(files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setUploading(true);
      setError('');

      // Create preview
      const previewUrl = URL.createObjectURL(file);
      const fileType = file.type.startsWith('video/') ? 'video' : 'image';
      setPreview({ url: previewUrl, type: fileType });

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const data = await response.json();
      onMediaAdded(data.data);

      // Clear preview after successful upload
      setTimeout(() => {
        setPreview(null);
        URL.revokeObjectURL(previewUrl);
      }, 1000);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to upload file';
      setError(errorMessage);
      setPreview(null);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className='w-full space-y-4'>
      <div
        onDragEnter={handleDragEnter}
        onDragOver={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-200 ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50'
        } ${isLoading || uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          ref={fileInputRef}
          type='file'
          onChange={handleFileSelect}
          disabled={uploading || isLoading}
          accept='image/*,video/*'
          className='hidden'
        />

        <div
          onClick={() =>
            !uploading && !isLoading && fileInputRef.current?.click()
          }
          className='space-y-2'
        >
          <svg
            className='mx-auto h-12 w-12 text-gray-400'
            stroke='currentColor'
            fill='none'
            viewBox='0 0 48 48'
          >
            <path
              d='M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M4 20h40'
              strokeWidth={2}
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>

          {uploading ? (
            <div>
              <p className='text-sm font-medium text-gray-700'>Uploading...</p>
              <div className='mt-2 w-full bg-gray-300 rounded-full h-2'>
                <div className='bg-blue-600 h-2 rounded-full animate-pulse w-full' />
              </div>
            </div>
          ) : (
            <div>
              <p className='text-sm font-medium text-gray-700'>
                Drag and drop your image or video here
              </p>
              <p className='text-xs text-gray-500 mt-1'>
                or click to select files
              </p>
              <p className='text-xs text-gray-400 mt-2'>
                Supported formats: PNG, JPG, GIF, MP4, WebM
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Section */}
      {preview && (
        <div className='bg-white rounded-lg border-2 border-gray-200 p-4'>
          <div className='flex items-center justify-between mb-3'>
            <h4 className='text-sm font-semibold text-gray-700'>
              Uploading Preview
            </h4>
            <div className='flex items-center gap-2'>
              <div className='w-2 h-2 bg-blue-600 rounded-full animate-pulse'></div>
              <span className='text-xs text-gray-600'>Processing...</span>
            </div>
          </div>
          <div className='relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden'>
            {preview.type === 'image' ? (
              <Image
                src={preview.url}
                alt='Preview'
                fill
                className='object-cover'
              />
            ) : (
              <video
                src={preview.url}
                autoPlay
                muted
                loop
                playsInline
                className='w-full h-full object-cover'
              />
            )}
          </div>
        </div>
      )}

      {error && (
        <div className='p-4 bg-red-50 border border-red-200 rounded-lg'>
          <p className='text-sm text-red-600'>{error}</p>
        </div>
      )}
    </div>
  );
}
