'use client';

import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Settings,
  ShoppingBasketIcon,
  User,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface UserData {
  id: string;
  email: string;
  role: 'client' | 'admin';
  clientId?: string;
  client?: {
    id: string;
    name: string;
    domain: string;
  };
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<UserData | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // Only check auth once when component mounts
    if (!authChecked) {
      checkAuth();
    }
  }, [authChecked]);

  const checkAuth = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Auth check failed, redirecting to login');
        router.push('/login');
        return;
      }

      const data = await response.json();

      if (!data.success || !data.user) {
        console.error('No user data, redirecting to login');
        router.push('/login');
        return;
      }

      setUser(data.user);
      setAuthChecked(true);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      console.log('🔓 Initiating logout...');

      // Call logout API to clear cookie
      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) {
        console.error('Logout API call failed');
      }

      console.log('✅ Logout API called, clearing state...');

      // Clear user state
      setUser(null);
      setAuthChecked(false);

      // Small delay to ensure cookie is cleared
      await new Promise((resolve) => setTimeout(resolve, 100));

      console.log('🔄 Redirecting to login...');

      // Hard redirect to clear all state
      window.location.href = '/login';
    } catch (error) {
      console.error('❌ Logout error:', error);

      // Even on error, clear state and redirect
      setUser(null);
      setAuthChecked(false);
      window.location.href = '/login';
    } finally {
      setLoggingOut(false);
    }
  };

  const navItems = [
    {
      href: '/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/dashboard/conversations',
      label: 'Conversations',
      icon: MessageSquare,
    },
    {
      href: '/dashboard/chatbot',
      label: 'Chatbot',
      icon: MessageSquare, // or SmartToy
    },
    {
      href: '/dashboard/profile',
      label: 'Profile',
      icon: User,
    },
    {
      href: '/dashboard/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Don't render anything if no user (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Dashboard Navigation Bar */}
      <nav className='spacing bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50 h-16'>
        <div className='px-4 sm:px-6 lg:px-8 h-full'>
          <div className='flex justify-between items-center h-full'>
            <div className='flex items-center'>
              {/* Mobile menu button */}
              <Button
                variant='ghost'
                size='icon'
                className='lg:hidden mr-2'
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? (
                  <X className='h-6 w-6' />
                ) : (
                  <Menu className='h-6 w-6' />
                )}
              </Button>

              <Link href='/dashboard' className='flex items-center'>
                <div className='flex items-center space-x-2'>
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'>
                    <img
                      src='/fav.svg'
                      alt='Sky Coding Logo'
                      className='w-12 h-12'
                    />{' '}
                  </div>
                  <h1 className='text-xl font-bold text-gray-900 hidden sm:block'>
                    ChatBot Platform
                  </h1>
                </div>
              </Link>
            </div>

            <div className='flex items-center space-x-4'>
              {user.client && (
                <div className='hidden md:flex flex-col items-end'>
                  <p className='text-sm font-medium text-gray-900'>
                    {user.client.name}
                  </p>
                  <p className='text-xs text-gray-500'>{user.email}</p>
                </div>
              )}

              <Button
                variant='ghost'
                size='sm'
                onClick={handleLogout}
                disabled={loggingOut}
                className='flex items-center'
              >
                {loggingOut ? (
                  <>
                    <Loader2 className='h-4 w-4 mr-2 animate-spin' />
                    <span className='hidden sm:inline'>Logging out...</span>
                  </>
                ) : (
                  <>
                    <LogOut className='h-4 w-4 mr-2' />
                    <span className='hidden sm:inline'>Logout</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar & Main Content */}
      <div className='spacing flex pt-16'>
        {/* Sidebar */}
        <aside
          className={`spacing section footer
            fixed lg:static top-16 bottom-0 left-0 z-40
            w-64 bg-white border-r border-gray-200 
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            overflow-y-auto
          `}
        >
          <nav className='flex flex-col p-4 space-y-2'>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className='h-5 w-5 mr-3' />
                  <span className='font-medium'>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div
            className='fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden'
            style={{ top: '4rem' }}
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className='flex-1 w-full overflow-y-auto min-h-[calc(100vh-4rem)]'>
          <div className='max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8'>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
