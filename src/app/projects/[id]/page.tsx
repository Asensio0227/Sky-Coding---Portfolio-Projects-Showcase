'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Code,
  ExternalLink,
  Github,
  Star,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Media {
  url: string;
  type: 'image' | 'video';
  publicId: string;
}

interface TechStack {
  frontend?: string[];
  backend?: string[];
  database?: string[];
  ai?: string[];
  auth?: string[];
  deployment?: string[];
  mobile?: string[];
  tools?: string[];
}

interface Challenge {
  challenge: string;
  solution: string;
}

interface Project {
  _id: string;
  title: string;
  description: string;
  longDescription?: string;
  category?: string[];
  featured?: boolean;
  status?: string;
  tagline?: string;
  media: Media[];
  features?: string[];
  techStack?: TechStack;
  challenges?: Challenge[];
  results?: string[];
  metrics?: Record<string, string>;
  year?: number;
  duration?: string;
  demoUrl?: string;
  githubUrl?: string;
  problem?: string;
  solution?: string;
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
      <div className='main min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6'></div>
          <p className='text-lg text-gray-600'>Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className='main min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center'>
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
          <Link href='/projects'>
            <Button size='lg'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // project.media is guaranteed to have at least one element; index access
  // using non-null assertion avoids undefined checks in JSX below.
  const currentMedia = project.media[currentMediaIndex]!;

  return (
    <article className='section footer'>
      <div className='section-center bg-gradient-to-b from-white via-gray-50 to-white min-h-screen'>
        {/* Back Button */}
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <Link href='/projects'>
            <Button variant='ghost' size='sm'>
              <ArrowLeft className='h-4 w-4 mr-2' />
              Back to Projects
            </Button>
          </Link>
        </div>

        {/* Project Header */}
        <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
          <div className='flex flex-wrap items-start justify-between gap-6 mb-8'>
            <div className='spacing flex-1 min-w-0'>
              {project.featured && (
                <Badge className='mb-4 bg-yellow-400 text-gray-900 hover:bg-yellow-500'>
                  <Star className='h-3 w-3 mr-1' />
                  Featured Project
                </Badge>
              )}
              <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-blue-600 mb-4'>
                {project.title}
              </h1>
              {project.tagline && (
                <p className='text-xl text-gray-600 italic mb-4'>
                  {project.tagline}
                </p>
              )}

              {/* Categories */}
              {project.category && project.category.length > 0 && (
                <div className='flex flex-wrap gap-2 mb-6'>
                  {project.category.map((cat) => (
                    <Badge key={cat} variant='secondary'>
                      {cat}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta Info */}
              <div className='flex flex-wrap gap-6 text-sm text-gray-600'>
                {project.status && (
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold'>Status:</span>
                    <Badge variant='outline' className='font-normal'>
                      {project.status}
                    </Badge>
                  </div>
                )}
                {project.year && (
                  <div className='flex items-center gap-2'>
                    <Calendar className='h-4 w-4' />
                    <span>{project.year}</span>
                  </div>
                )}
                {project.duration && (
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold'>Duration:</span>
                    <span>{project.duration}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className='flex flex-wrap gap-3'>
              {project.demoUrl && (
                <Link
                  href={project.demoUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button size='lg'>
                    <ExternalLink className='h-4 w-4 mr-2' />
                    View Live Demo
                  </Button>
                </Link>
              )}
              {project.githubUrl && (
                <Link
                  href={project.githubUrl}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <Button variant='outline' size='lg'>
                    <Github className='h-4 w-4 mr-2' />
                    View Code
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Main Media Display */}
        <section className='main max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
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
            <div className='spacing flex justify-center space-x-3 mt-8'>
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

        {/* Overview */}
        <section className='spacing max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
          <Card>
            <CardHeader>
              <CardTitle className='text-center mt-4 text-3xl'>
                Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className='spacing text-gray-700 text-lg leading-relaxed whitespace-pre-wrap'>
                {project.longDescription || project.description}
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Problem & Solution */}
        {(project.problem || project.solution) && (
          <section className='spacing max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
            <div className='grid md:grid-cols-2 gap-8'>
              {project.problem && (
                <Card className='border-red-200 bg-red-50/50'>
                  <CardHeader>
                    <CardTitle className='text-red-900'>The Problem</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-700 leading-relaxed'>
                      {project.problem}
                    </p>
                  </CardContent>
                </Card>
              )}
              {project.solution && (
                <Card className='border-green-200 bg-green-50/50'>
                  <CardHeader>
                    <CardTitle className='text-green-900'>
                      The Solution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className='text-gray-700 leading-relaxed'>
                      {project.solution}
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Features */}
        {project.features && project.features.length > 0 && (
          <section className='spacing max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
            <Card>
              <CardHeader>
                <CardTitle className='text-3xl'>Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='grid md:grid-cols-2 gap-4'>
                  {project.features.map((feature, idx) => (
                    <div key={idx} className='flex items-start gap-3'>
                      <CheckCircle2 className='h-6 w-6 text-green-500 flex-shrink-0 mt-0.5' />
                      <span className='text-gray-700'>{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Tech Stack */}
        {project.techStack && Object.keys(project.techStack).length > 0 && (
          <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
            <Card className='border-blue-200 shadow-lg'>
              <CardHeader className='bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100'>
                <CardTitle className='text-3xl flex items-center gap-3'>
                  <div className='p-2 bg-blue-600 rounded-lg'>
                    <Code className='h-6 w-6 text-white' />
                  </div>
                  Technology Stack
                </CardTitle>
              </CardHeader>
              <CardContent className='pt-8'>
                <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-8'>
                  {Object.entries(project.techStack).map(
                    ([category, technologies]) =>
                      technologies &&
                      technologies.length > 0 && (
                        <div key={category} className='space-y-3'>
                          <h3 className='font-bold text-gray-900 text-lg capitalize flex items-center gap-2 border-b border-gray-200 pb-2'>
                            <span className='w-2 h-2 bg-blue-600 rounded-full'></span>
                            {category}
                          </h3>
                          <div className='flex flex-wrap gap-2'>
                            {technologies.map((tech: string, idx: number) => (
                              <Badge
                                key={idx}
                                variant='secondary'
                                className='bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors'
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Challenges & Solutions */}
        {project.challenges && project.challenges.length > 0 && (
          <section className='spacing max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
            <Card>
              <CardHeader>
                <CardTitle className='text-3xl'>
                  Technical Challenges & Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-6'>
                  {project.challenges.map((item, idx) => (
                    <div
                      key={idx}
                      className='border-l-4 border-blue-500 pl-6 py-2'
                    >
                      <h3 className='font-semibold text-gray-900 mb-2'>
                        Challenge: {item.challenge}
                      </h3>
                      <p className='text-gray-700'>
                        <span className='font-semibold text-green-600'>
                          Solution:
                        </span>{' '}
                        {item.solution}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Results & Impact */}
        {((project.results && project.results.length > 0) ||
          project.metrics) && (
          <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
            <Card className='bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white border-0 shadow-2xl overflow-hidden relative'>
              {/* Decorative background pattern */}
              <div className='absolute inset-0 opacity-10'>
                <div className='absolute inset-0 bg-gradient-to-br from-white/20 to-transparent'></div>
              </div>

              <CardHeader className='relative z-10 pb-6'>
                <CardTitle className='text-3xl md:text-4xl font-bold flex items-center gap-3'>
                  <div className='p-2 bg-white/20 rounded-lg backdrop-blur-sm'>
                    <CheckCircle2 className='h-7 w-7' />
                  </div>
                  Results & Impact
                </CardTitle>
              </CardHeader>

              <CardContent className='relative z-10'>
                {project.results && project.results.length > 0 && (
                  <div className='mb-10'>
                    <ul className='space-y-4'>
                      {project.results.map((result, idx) => (
                        <li
                          key={idx}
                          className='flex items-start gap-4 bg-white/10 backdrop-blur-sm rounded-lg p-4 hover:bg-white/20 transition-all duration-300'
                        >
                          <div className='flex-shrink-0 mt-0.5'>
                            <div className='w-8 h-8 bg-green-400 rounded-full flex items-center justify-center'>
                              <CheckCircle2 className='h-5 w-5 text-green-900' />
                            </div>
                          </div>
                          <span className='text-lg leading-relaxed'>
                            {result}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Metrics */}
                {project.metrics && Object.keys(project.metrics).length > 0 && (
                  <div
                    className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${project.results && project.results.length > 0 ? 'pt-10 border-t border-white/30' : ''}`}
                  >
                    {Object.entries(project.metrics).map(([key, value]) => (
                      <div
                        key={key}
                        className='text-center bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-105'
                      >
                        <div className='text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-br from-white to-blue-100 bg-clip-text text-transparent'>
                          {value}
                        </div>
                        <div className='text-sm text-blue-100 capitalize font-medium'>
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </section>
        )}

        {/* Media Gallery Thumbnails */}
        {project.media.length > 1 && (
          <section className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16'>
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

        {/* CTA Section */}
        <section className='spacing max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mb-20'>
          <Card className='spacing bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700 text-white border-0'>
            <CardContent className='pt-12 pb-12 text-center'>
              <h2 className='text-3xl sm:text-4xl font-bold mb-6'>
                Interested in Similar Work?
              </h2>
              <p className='text-xl opacity-95 mb-8 max-w-2xl mx-auto'>
                Let's discuss how we can help bring your project ideas to life.
              </p>
              <Link href='/contact'>
                <Button
                  size='lg'
                  variant='secondary'
                  className='spacing btn text-lg px-8'
                >
                  Get In Touch
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>
      </div>
    </article>
  );
}
