'use client';

import { getDefaultMediaForProject } from '@/lib/defaults';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

interface Media {
  url: string;
  type: 'image' | 'video';
  publicId: string;
}

interface ProjectCardProps {
  id: string;
  title: string;
  description: string;
  media: Media[];
}

export default function ProjectCard({
  id,
  title,
  description,
  media,
}: ProjectCardProps) {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  // Use default media if project has none
  const displayMedia =
    media.length > 0
      ? media
      : [
          {
            url: getDefaultMediaForProject(title),
            type: 'image' as const,
            publicId: `default_${id}`,
          },
        ];

  const primaryMedia = displayMedia[currentMediaIndex];

  const goToNext = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % displayMedia.length);
  };

  const goToPrev = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + displayMedia.length) % displayMedia.length,
    );
  };

  return (
    <div className='footer bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col'>
      {/* Media Container */}
      <div className='relative bg-gray-200 h-48 overflow-hidden group'>
        {primaryMedia.type === 'image' ? (
          <Image
            src={primaryMedia.url}
            alt={title}
            fill
            className='object-cover group-hover:scale-110 transition-transform duration-300'
          />
        ) : (
          <video
            src={primaryMedia.url}
            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
            autoPlay
            loop
            muted
            playsInline
          />
        )}

        {/* Media Navigation */}
        {displayMedia.length > 1 && (
          <>
            <button
              onClick={goToPrev}
              className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 z-10'
              aria-label='Previous media'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M15 19l-7-7 7-7'
                />
              </svg>
            </button>
            <button
              onClick={goToNext}
              className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200 z-10'
              aria-label='Next media'
            >
              <svg
                className='w-4 h-4'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </button>

            {/* Media Indicators */}
            <div className='absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1 z-10'>
              {displayMedia.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMediaIndex(index)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    index === currentMediaIndex
                      ? 'bg-white w-6'
                      : 'bg-gray-400 w-2'
                  }`}
                  aria-label={`Go to media ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className='p-4 sm:p-6 flex-1 flex flex-col'>
        <h3 className='text-lg sm:text-xl font-bold text-gray-900 mb-2 line-clamp-2'>
          {title}
        </h3>
        <p className='text-sm sm:text-base text-gray-600 mb-4 line-clamp-3 flex-1'>
          {description}
        </p>

        <Link
          href={`/projects/${id}`}
          className='btninline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 mt-auto'
        >
          <h4 className='title'> View Project</h4>
        </Link>
      </div>
    </div>
  );
}
