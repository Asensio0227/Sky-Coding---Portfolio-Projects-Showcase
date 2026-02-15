'use client';

import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      console.log('🔓 Initiating logout from navigation...');

      // Call logout API to clear cookie
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      console.log('✅ Logout API called, clearing state...');

      // Small delay to ensure cookie is cleared
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log('🔄 Redirecting to home...');

      // Hard redirect to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Logout failed:', error);

      // Even on error, try to redirect
      window.location.href = '/';
    } finally {
      setLoggingOut(false);
    }
  };

  // Build navigation links based on user role
  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  // Add role-specific links
  if (isAdmin) {
    navLinks.push({ name: 'Admin', path: '/admin' });
  }

  if (isClient) {
    navLinks.push({ name: 'Dashboard', path: '/dashboard' });
  }

  return (
    <nav
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
          : 'bg-white/60 backdrop-blur-md'
      }`}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-20'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center gap-3 group transition-transform hover:scale-105'
          >
            <div className='w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow'>
              <img src='/fav.svg' alt='Sky Coding Logo' className='w-12 h-12' />
            </div>
            <span className='text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden sm:block'>
              Sky Coding
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-2'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                  pathname === link.path
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Auth Buttons */}
            <div className='ml-4 flex items-center gap-2'>
              {loading ? (
                <div className='px-5 py-2.5'>
                  <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                </div>
              ) : isAuthenticated ? (
                <div className='flex items-center gap-2'>
                  {user?.email && (
                    <span className='text-sm text-gray-600 hidden lg:inline'>
                      {user.email}
                    </span>
                  )}
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className='px-5 py-2.5 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                  >
                    {loggingOut ? (
                      <span className='flex items-center gap-2'>
                        <div className='w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin'></div>
                        Logging out...
                      </span>
                    ) : (
                      'Logout'
                    )}
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href='/login'
                    className='px-5 py-2.5 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all'
                  >
                    Login
                  </Link>
                  <Link
                    href='/signup'
                    className='px-5 py-2.5 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg hover:shadow-xl transition-all'
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='md:hidden p-2.5 rounded-xl hover:bg-gray-100 transition-colors'
            aria-label='Toggle menu'
          >
            <svg
              className='w-6 h-6 text-gray-700'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              {isOpen ? (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              ) : (
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-xl'>
          <div className='px-4 py-6 space-y-3'>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-5 py-3 rounded-xl font-medium transition-all ${
                  pathname === link.path
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.name}
              </Link>
            ))}

            <div className='pt-4 border-t border-gray-200 space-y-3'>
              {loading ? (
                <div className='flex justify-center py-3'>
                  <div className='w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
                </div>
              ) : isAuthenticated ? (
                <>
                  {user?.email && (
                    <div className='px-5 py-2 text-sm text-gray-600'>
                      {user.email}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    disabled={loggingOut}
                    className='w-full px-5 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all text-left disabled:opacity-50'
                  >
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href='/login'
                    onClick={() => setIsOpen(false)}
                    className='block px-5 py-3 rounded-xl font-medium text-gray-700 hover:bg-gray-100 transition-all'
                  >
                    Login
                  </Link>
                  <Link
                    href='/signup'
                    onClick={() => setIsOpen(false)}
                    className='block px-5 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg text-center'
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
