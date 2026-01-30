'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Media {
  url: string;
  type: 'image' | 'video';
  publicId: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  media: Media[];
  createdAt: string;
}

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  useEffect(() => {
    if (!projectId) return;

    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/projects/${projectId}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError('Project not found');
          } else {
            throw new Error('Failed to fetch project details');
          }
          return;
        }

        const data = await response.json();
        setProject(data.data);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load project';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [projectId]);

  const goToNext = () => {
    if (project?.media) {
      setCurrentMediaIndex((prev) => (prev + 1) % project.media.length);
    }
  };

  const goToPrev = () => {
    if (project?.media) {
      setCurrentMediaIndex(
        (prev) => (prev - 1 + project.media.length) % project.media.length,
      );
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6'></div>
          <p className='text-lg text-gray-600'>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center'>
        <div className='text-center max-w-md'>
          <div className='inline-block bg-red-100 rounded-full p-4 mb-6'>
            <svg
              className='w-12 h-12 text-red-600'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </div>
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Oops!</h1>
          <p className='text-gray-600 mb-10 text-lg'>
            {error || 'Project not found'}
          </p>
          <Link
            href='/projects'
            className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-2xl'
          >
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  const currentMedia = project.media[currentMediaIndex];

  return (
    <div className='footer section bg-gradient-to-b from-white via-gray-50 to-white min-h-screen'>
      {/* Back Button */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <Link
          href='/projects'
          className='inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors duration-300 hover:translate-x-1'
        >
          <svg
            className='w-6 h-6 mr-3'
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
          Back to Projects
        </Link>
      </div>

      {/* Project Header */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28'>
        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600 mb-8'>
          {project.title}
        </h1>
        <p className='text-xl text-gray-600'>
          {new Date(project.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </section>

      {/* Main Media Display - Full video without cutting */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24'>
        <div className='relative bg-gray-900 rounded-2xl overflow-hidden group shadow-2xl'>
          {currentMedia.type === 'image' ? (
            <Image
              src={currentMedia.url}
              alt={`${project.title} - Image ${currentMediaIndex + 1}`}
              width={1200}
              height={600}
              className='w-full h-auto object-cover'
              priority
            />
          ) : (
            <video
              src={currentMedia.url}
              className='w-full max-h-[70vh] object-contain'
              autoPlay
              loop
              muted
              playsInline
              // controls
            />
          )}

          {/* Navigation Buttons */}
          {project.media.length > 1 && (
            <>
              <button
                onClick={goToPrev}
                className='absolute left-6 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all duration-300 z-10 shadow-xl hover:scale-110'
                aria-label='Previous media'
              >
                <svg
                  className='w-7 h-7'
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
                className='absolute right-6 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white p-4 rounded-full transition-all duration-300 z-10 shadow-xl hover:scale-110'
                aria-label='Next media'
              >
                <svg
                  className='w-7 h-7'
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
            </>
          )}
        </div>

        {/* Media Indicators */}
        {project.media.length > 1 && (
          <div className='flex justify-center space-x-3 mt-8'>
            {project.media.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                  index === currentMediaIndex
                    ? 'bg-blue-600 w-10 shadow-lg'
                    : 'bg-gray-300 w-3 hover:bg-gray-400'
                }`}
                aria-label={`Go to media ${index + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Media Gallery Thumbnails */}
      {project.media.length > 1 && (
        <section className='section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 sm:mb-24'>
          <h2 className='text-3xl font-bold text-gray-900 mb-10'>Gallery</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6'>
            {project.media.map((media, index) => (
              <button
                key={index}
                onClick={() => setCurrentMediaIndex(index)}
                className={`relative rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-110 ${
                  index === currentMediaIndex
                    ? 'ring-4 ring-blue-600 shadow-xl'
                    : 'shadow-lg hover:shadow-2xl'
                }`}
              >
                {media.type === 'image' ? (
                  <Image
                    src={media.url}
                    alt={`Thumbnail ${index + 1}`}
                    width={200}
                    height={200}
                    className='w-full h-40 object-cover'
                  />
                ) : (
                  <div className='w-full h-40 bg-gray-900 flex items-center justify-center group-hover:bg-gray-800'>
                    <svg
                      className='w-10 h-10 text-white'
                      fill='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path d='M8 5v14l11-7z' />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Project Description */}
      <section className='section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 border-t border-gray-200'>
        <h2 className='text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600 mb-10'>
          About This Project
        </h2>
        <div className='prose prose-lg max-w-none text-gray-700 mb-12 leading-relaxed'>
          <p className='whitespace-pre-wrap text-lg'>{project.description}</p>
        </div>

        {/* Key Details */}
        <div className='grid-columns grid grid-cols-1 md:grid-cols-2 gap-10 bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-2xl border border-gray-200 p-8 md:p-12'>
          <div className='border-b md:border-b-0 md:border-r border-gray-300 pb-8 md:pb-0 md:pr-8'>
            <h3 className='text-lg font-bold text-gray-900 mb-3 flex items-center'>
              <span className='inline-block w-3 h-3 bg-blue-600 rounded-full mr-3'></span>
              Media Files
            </h3>
            <p className='text-gray-600 text-lg font-medium'>
              {project.media.length} file{project.media.length !== 1 ? 's' : ''}
            </p>
          </div>
          <div>
            <h3 className='text-lg font-bold text-gray-900 mb-3 flex items-center'>
              <span className='inline-block w-3 h-3 bg-purple-600 rounded-full mr-3'></span>
              Completed
            </h3>
            <p className='text-gray-600 text-lg font-medium'>
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
              })}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className='section max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40'>
        <div className='bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 rounded-3xl p-12 sm:p-16 lg:p-20 text-center text-white shadow-2xl'>
          <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-tight'>
            Interested in Similar Work?
          </h2>
          <p className='text-xl opacity-95 mb-12 max-w-2xl mx-auto leading-relaxed'>
            Let's discuss how we can help bring your project ideas to life.
          </p>
          <Link
            href='/contact'
            className='btn inline-block bg-white text-blue-600 font-bold py-4 px-10 rounded-xl hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 text-lg'
          >
            Get In Touch
          </Link>
        </div>
      </section>
    </div>
  );
}
