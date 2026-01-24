'use client';

import { MediaUpload } from '@/components';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface Project {
  _id: string;
  title: string;
  description: string;
  media: { url: string; type: string; publicId: string }[];
  createdAt: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    media: [] as any[],
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalMedia: 0,
    recentProjects: 0,
  });

  useEffect(() => {
    if (authLoading) return;
    if (!user || user.role !== 'admin') {
      console.log('Not authenticated or not admin, redirecting...');
      router.push('/login');
      return;
    }
    console.log('Admin authenticated via context:', user);
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user || user.role !== 'admin') return;

    const fetchProjects = async () => {
      try {
        setFetchLoading(true);
        const response = await fetch('/api/projects');
        const data = await response.json();
        const projectsList = data.data || [];
        setProjects(projectsList);

        const totalMedia = projectsList.reduce(
          (acc: number, p: Project) => acc + p.media.length,
          0,
        );
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentProjects = projectsList.filter(
          (p: Project) => new Date(p.createdAt) > thirtyDaysAgo,
        ).length;

        setStats({
          totalProjects: projectsList.length,
          totalMedia,
          recentProjects,
        });
      } catch (err) {
        console.error('Failed to fetch projects', err);
      } finally {
        setFetchLoading(false);
      }
    };
    fetchProjects();
  }, [user]);

  const handleMediaAdded = (media: any) => {
    setFormData({
      ...formData,
      media: [...formData.media, media],
    });
  };

  const handleMediaRemove = (index: number) => {
    setFormData({
      ...formData,
      media: formData.media.filter((_, i) => i !== index),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (
        !formData.title.trim() ||
        !formData.description.trim() ||
        formData.media.length === 0
      ) {
        setError(
          'Title, description, and at least one media item are required',
        );
        setLoading(false);
        return;
      }

      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
          media: formData.media,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || 'Failed to create project');
        return;
      }

      setSuccess('Project created successfully!');
      setProjects([data.data, ...projects]);
      setFormData({ title: '', description: '', media: [] });
      setStats((prev) => ({
        ...prev,
        totalProjects: prev.totalProjects + 1,
        totalMedia: prev.totalMedia + data.data.media.length,
        recentProjects: prev.recentProjects + 1,
      }));

      setTimeout(() => {
        setSuccess('');
        setActiveTab('manage');
      }, 2000);
    } catch (err: any) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setProjects(projects.filter((p) => p._id !== projectId));
        setSuccess('Project deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete project');
      }
    } catch (err) {
      setError('Error deleting project');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (authLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4'></div>
          <p className='text-gray-600 text-lg'>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className='section-center footer min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
            <div>
              <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2'>
                Admin Dashboard
              </h1>
              <p className='text-gray-600 text-lg'>
                Manage your portfolio projects and content
              </p>
            </div>
            <div className='flex gap-3'>
              <Link
                href='/projects'
                className='btn px-6 py-3 rounded-xl bg-white text-gray-700 hover:bg-gray-100 transition-all shadow-md font-medium'
              >
                View Site
              </Link>
              <button
                onClick={handleLogout}
                className='btn px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all shadow-md font-medium'
              >
                Logout
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className='spacing grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8'>
            <div className='bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6'>
              <div className='spacing flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium mb-2'>
                    Total Projects
                  </p>
                  <p className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'>
                    {stats.totalProjects}
                  </p>
                </div>
                <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg'>
                  <span className='text-3xl'>📁</span>
                </div>
              </div>
            </div>

            <div className='bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6'>
              <div className='spacing flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium mb-2'>
                    Total Media
                  </p>
                  <p className='text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent'>
                    {stats.totalMedia}
                  </p>
                </div>
                <div className='w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg'>
                  <span className='text-3xl'>🖼️</span>
                </div>
              </div>
            </div>

            <div className='bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 p-6'>
              <div className='spacing flex items-center justify-between'>
                <div>
                  <p className='text-gray-600 text-sm font-medium mb-2'>
                    Recent (30d)
                  </p>
                  <p className='text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent'>
                    {stats.recentProjects}
                  </p>
                </div>
                <div className='w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center shadow-lg'>
                  <span className='text-3xl'>⚡</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className='spacing flex gap-4 border-b border-gray-200 mb-8'>
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeTab === 'create'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Create New Project
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-6 py-4 font-semibold transition-all ${
                activeTab === 'manage'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Manage Projects ({projects.length})
            </button>
          </div>
        </div>

        {/* Create Tab */}
        {activeTab === 'create' && (
          <div className='spacing max-w-3xl mx-auto'>
            <div className='spacing bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10'>
              <h2 className='text-3xl font-bold text-gray-900 mb-8'>
                Create New Project
              </h2>

              {error && (
                <div className='mb-8 p-6 rounded-xl bg-red-50 border-2 border-red-200'>
                  <p className='text-red-700 font-medium'>{error}</p>
                </div>
              )}

              {success && (
                <div className='mb-8 p-6 rounded-xl bg-green-50 border-2 border-green-200'>
                  <p className='text-green-700 font-medium'>{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className='spacing space-y-8'>
                <div>
                  <label className='label block text-sm font-semibold text-gray-800 mb-3'>
                    Project Title *
                  </label>
                  <input
                    type='text'
                    name='title'
                    value={formData.title}
                    onChange={handleChange}
                    placeholder='e.g., E-Commerce Platform'
                    className='w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400 text-base'
                  />
                </div>

                <div>
                  <label className='label spacing block text-sm font-semibold text-gray-800 mb-3'>
                    Project Description *
                  </label>
                  <textarea
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    placeholder='Describe your project in detail...'
                    rows={6}
                    className='w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-900 placeholder-gray-400 text-base resize-none'
                  />
                </div>

                <div>
                  <label className='label spacing block text-sm font-semibold text-gray-800 mb-3'>
                    Media Files * (Images or Videos)
                  </label>
                  <MediaUpload
                    onMediaAdded={handleMediaAdded}
                    isLoading={loading}
                  />
                </div>

                {formData.media.length > 0 && (
                  <div>
                    <p className='text-sm font-semibold text-gray-800 mb-4'>
                      Uploaded Media ({formData.media.length})
                    </p>
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-4'>
                      {formData.media.map((media, index) => (
                        <div
                          key={index}
                          className='relative group bg-gray-100 rounded-xl overflow-hidden aspect-video'
                        >
                          {media.type === 'image' ? (
                            <Image
                              src={media.url}
                              alt={`Media ${index + 1}`}
                              fill
                              className='object-cover'
                            />
                          ) : (
                            <video
                              src={media.url}
                              autoPlay
                              muted
                              loop
                              playsInline
                              className='w-full h-full object-cover'
                            />
                          )}
                          <div className='absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs font-semibold rounded-md'>
                            {media.type === 'video' ? '🎥 Video' : '🖼️ Image'}
                          </div>
                          <button
                            type='button'
                            onClick={() => handleMediaRemove(index)}
                            className='absolute top-2 right-2 bg-red-600 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700'
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
                                d='M6 18L18 6M6 6l12 12'
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type='submit'
                  disabled={loading}
                  className='btn spacing w-full py-5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {loading ? 'Creating Project...' : 'Create Project'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Manage Tab */}
        {activeTab === 'manage' && (
          <div>
            <h2 className='text-3xl font-bold text-gray-900 mb-8'>
              Manage Projects
            </h2>

            {fetchLoading ? (
              <div className='flex justify-center items-center py-20'>
                <div className='animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600'></div>
              </div>
            ) : projects.length === 0 ? (
              <div className='bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-16 text-center'>
                <div className='text-6xl mb-6'>📁</div>
                <h3 className='text-2xl font-bold text-gray-900 mb-4'>
                  No Projects Yet
                </h3>
                <p className='text-gray-600 mb-8'>
                  Create your first project to get started
                </p>
                <button
                  onClick={() => setActiveTab('create')}
                  className='px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all'
                >
                  Create Project
                </button>
              </div>
            ) : (
              <div className='grid gap-6'>
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className='group bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-2xl transition-all duration-300'
                  >
                    <div className='flex flex-col md:flex-row'>
                      <div className='relative w-full md:w-64 h-48 bg-gray-200 flex-shrink-0'>
                        {project.media[0] && (
                          <>
                            {project.media[0].type === 'image' ? (
                              <Image
                                src={project.media[0].url}
                                alt={project.title}
                                fill
                                className='object-cover'
                              />
                            ) : (
                              <video
                                src={project.media[0].url}
                                autoPlay
                                muted
                                loop
                                playsInline
                                className='w-full h-full object-cover'
                              />
                            )}
                          </>
                        )}
                        <div className='absolute top-3 right-3 px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg'>
                          {project.media.length} media
                        </div>
                      </div>

                      <div className='spacing flex-1 p-8'>
                        <div className='flex justify-between items-start mb-4'>
                          <div>
                            <h3 className='text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors'>
                              {project.title}
                            </h3>
                            <p className='text-sm text-gray-500'>
                              Created{' '}
                              {new Date(project.createdAt).toLocaleDateString(
                                'en-US',
                                {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        <p className='text-gray-600 line-clamp-3 mb-6 leading-relaxed'>
                          {project.description}
                        </p>

                        <div className='flex gap-3'>
                          <Link
                            href={`/projects/${project._id}`}
                            className='px-6 py-3 rounded-xl bg-blue-50 text-blue-600 font-semibold hover:bg-blue-100 transition-colors'
                          >
                            View
                          </Link>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className='px-6 py-3 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition-colors'
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
