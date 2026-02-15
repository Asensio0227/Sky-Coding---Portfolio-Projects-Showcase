'use client';

import { ProjectCard } from '@/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Filter, Search, X } from 'lucide-react';
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
  techStack?: TechStack;
  year?: number;
  createdAt: string;
}

const CATEGORIES = [
  'All',
  'AI Solutions',
  'SaaS',
  'Full-Stack',
  'E-Commerce',
  'Mobile',
  'Hospitality',
  'Web Development',
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

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

  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      (project.category && project.category.includes(selectedCategory));

    const matchesSearch =
      searchQuery === '' ||
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.tagline &&
        project.tagline.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  // Separate featured and regular projects
  const featuredProjects = filteredProjects.filter((p) => p.featured);
  const regularProjects = filteredProjects.filter((p) => !p.featured);

  const clearFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const hasActiveFilters = selectedCategory !== 'All' || searchQuery !== '';

  return (
    <article className='section footer'>
      <div className='section-center bg-gradient-to-b from-white via-gray-50 to-white min-h-screen'>
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

            {/* Stats */}
            <div className='flex flex-wrap justify-center gap-6 mt-12'>
              <div className='bg-white rounded-xl shadow-lg px-6 py-4 border border-gray-200'>
                <div className='spacing text-3xl font-bold text-blue-600'>
                  {projects.length}
                </div>
                <div className='spacing text-sm text-gray-600 mt-1'>
                  Total Projects
                </div>
              </div>
              <div className='bg-white rounded-xl shadow-lg px-6 py-4 border border-gray-200'>
                <div className='spacing text-3xl font-bold text-purple-600'>
                  {featuredProjects.length}
                </div>
                <div className='spacing text-sm text-gray-600 mt-1'>
                  Featured
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Filters Section */}
        <section className='section-center spacing max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12'>
          <Card>
            <CardContent className='pt-6'>
              {/* Search Bar */}
              <div className='spacing mb-6'>
                <div className='spacing relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                  <Input
                    type='text'
                    placeholder='Search projects by title, description, or tags...'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className='spacing pl-10 pr-10 py-6 text-lg'
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                    >
                      <X className='h-5 w-5' />
                    </button>
                  )}
                </div>
              </div>

              {/* Filter Toggle (Mobile) */}
              <div className='spacing flex items-center justify-between mb-4 lg:hidden'>
                <h3 className='text-lg font-semibold text-gray-900 flex items-center'>
                  <Filter className='h-5 w-5 mr-2' />
                  Filters
                </h3>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => setShowFilters(!showFilters)}
                >
                  {showFilters ? 'Hide' : 'Show'}
                </Button>
              </div>

              {/* Category Filters */}
              <div
                className={`${showFilters ? 'block' : 'hidden'} spacing lg:block`}
              >
                <h3 className='text-sm font-semibold text-gray-700 mb-3 hidden lg:block'>
                  Categories
                </h3>
                <div className='flex flex-wrap gap-2'>
                  {CATEGORIES.map((category) => (
                    <Button
                      key={category}
                      variant={
                        selectedCategory === category ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => setSelectedCategory(category)}
                      className='spacing rounded-full'
                    >
                      {category}
                      {category !== 'All' && (
                        <Badge
                          variant='secondary'
                          className='ml-2 rounded-full px-2 py-0'
                        >
                          {
                            projects.filter(
                              (p) =>
                                p.category && p.category.includes(category),
                            ).length
                          }
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div className='spacing flex items-center gap-3 mt-6 pt-6 border-t border-gray-200'>
                  <span className='text-sm font-medium text-gray-600'>
                    Active filters:
                  </span>
                  {selectedCategory !== 'All' && (
                    <Badge variant='secondary' className='gap-1'>
                      {selectedCategory}
                      <button
                        onClick={() => setSelectedCategory('All')}
                        className='ml-1 hover:text-red-600'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant='secondary' className='gap-1'>
                      Search: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery('')}
                        className='ml-1 hover:text-red-600'
                      >
                        <X className='h-3 w-3' />
                      </button>
                    </Badge>
                  )}
                  <Button
                    variant='ghost'
                    size='sm'
                    onClick={clearFilters}
                    className='text-blue-600 hover:text-blue-700'
                  >
                    Clear all
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Count */}
          <div className='mt-6 text-center'>
            <p className='text-gray-600'>
              Showing{' '}
              <span className='font-semibold'>{filteredProjects.length}</span>{' '}
              of <span className='font-semibold'>{projects.length}</span>{' '}
              projects
            </p>
          </div>
        </section>

        {/* Projects Grid */}
        <section className='spacing max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32'>
          {loading ? (
            <div className='flex justify-center items-center py-32'>
              <div className='text-center'>
                <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6'></div>
                <p className='text-lg text-gray-600'>Loading projects...</p>
              </div>
            </div>
          ) : error ? (
            <div className='spacing bg-gradient-to-br from-red-50 to-red-100 border border-red-300 rounded-2xl p-12 text-center backdrop-blur-sm'>
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
          ) : filteredProjects.length === 0 ? (
            <div className='bg-gradient-to-br from-gray-50 via-blue-50 to-gray-50 border border-gray-300 rounded-2xl p-16 text-center backdrop-blur-sm'>
              <div className='inline-block bg-blue-100 rounded-full p-4 mb-6'>
                <Search className='w-12 h-12 text-blue-600' />
              </div>
              <h3 className='text-3xl font-bold text-gray-900 mb-4'>
                No Projects Found
              </h3>
              <p className='text-gray-600 text-lg mb-8 max-w-md mx-auto leading-relaxed'>
                {hasActiveFilters
                  ? "We couldn't find any projects matching your filters. Try adjusting your search."
                  : "We're currently working on some exciting projects. Check back soon!"}
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} size='lg' className='spacing'>
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <div className='spacing space-y-16'>
              {/* Featured Projects */}
              {featuredProjects.length > 0 && (
                <div>
                  <div className='flex items-center gap-3 mb-8'>
                    <h2 className='text-3xl font-bold text-gray-900'>
                      ⭐ Featured Projects
                    </h2>
                    <Badge variant='secondary' className='text-lg px-3 py-1'>
                      {featuredProjects.length}
                    </Badge>
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                    {featuredProjects.map((project) => (
                      <div key={project._id} className='relative'>
                        <div className='absolute -top-3 -right-3 z-10'>
                          <div className='bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold shadow-lg'>
                            ⭐ Featured
                          </div>
                        </div>
                        <ProjectCard
                          id={project._id}
                          title={project.title}
                          description={project.description}
                          media={project.media}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Projects */}
              {regularProjects.length > 0 && (
                <div>
                  {featuredProjects.length > 0 && (
                    <div className='flex items-center gap-3 mb-8'>
                      <h2 className='text-3xl font-bold text-gray-900'>
                        All Projects
                      </h2>
                      <Badge variant='secondary' className='text-lg px-3 py-1'>
                        {regularProjects.length}
                      </Badge>
                    </div>
                  )}
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                    {regularProjects.map((project) => (
                      <ProjectCard
                        key={project._id}
                        id={project._id}
                        title={project.title}
                        description={project.description}
                        media={project.media}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </article>
  );
}
