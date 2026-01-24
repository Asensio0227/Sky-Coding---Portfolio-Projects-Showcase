'use client';

import { ProjectCard } from '@/components';
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

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');

        if (!response.ok) {
          throw new Error('Failed to fetch projects');
        }

        const data = await response.json();
        setProjects(data.data || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to load projects';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className='footer section bg-gradient-to-b from-white via-gray-50 to-white min-h-screen'>
      {/* Page Header */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40'>
        <div className='text-center'>
          <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 mb-6'>
            Our Projects
          </h1>
          <p className='text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed'>
            Explore our portfolio of innovative projects and solutions we've
            delivered for various clients and industries.
          </p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32'>
        {loading ? (
          <div className='flex justify-center items-center py-32'>
            <div className='text-center'>
              <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6'></div>
              <p className='text-lg text-gray-600'>Loading projects...</p>
            </div>
          </div>
        ) : error ? (
          <div className='bg-gradient-to-br from-red-50 to-red-100 border border-red-300 rounded-2xl p-12 text-center backdrop-blur-sm'>
            <div className='inline-block bg-red-200 rounded-full p-4 mb-6'>
              <svg
                className='w-8 h-8 text-red-600'
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
            <h3 className='text-2xl font-semibold text-red-900 mb-3'>
              Error Loading Projects
            </h3>
            <p className='text-red-700 text-lg'>{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className='bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 border border-gray-300 rounded-2xl p-16 text-center backdrop-blur-sm'>
            <div className='inline-block bg-blue-100 rounded-full p-4 mb-6'>
              <svg
                className='w-12 h-12 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01'
                />
              </svg>
            </div>
            <h3 className='text-3xl font-bold text-gray-900 mb-4'>
              No Projects Yet
            </h3>
            <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed'>
              We're currently working on some exciting projects. Check back soon
              to see what we've built!
            </p>
            <div className='inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-4 px-8 rounded-xl hover:shadow-2xl transition-shadow duration-300'>
              Coming Soon
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                id={project._id}
                title={project.title}
                description={project.description}
                media={project.media}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
