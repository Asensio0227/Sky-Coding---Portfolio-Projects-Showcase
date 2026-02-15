// src/app/admin/layout.tsx
'use client';

import { Button } from '@/components/ui/button';
import {
  Building2,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Projector,
  Settings,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      const response = await fetch(`${base}/api/auth/me`, {
        credentials: 'include',
      });

      if (!response.ok) {
        router.push('/login');
        return;
      }

      const data = await response.json();

      if (!data.success || !data.user || data.user.role !== 'admin') {
        router.push('/');
        return;
      }

      setUser(data.user);
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || '';
      await fetch(`${base}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const navItems = [
    {
      href: '/admin',
      label: 'Dashboard',
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: '/admin/clients',
      label: 'Clients',
      icon: Building2,
    },
    {
      href: '/admin/users',
      label: 'Users',
      icon: Users,
    },
    // {
    //   href: '/admin/conversations',
    //   label: 'Conversations',
    //   icon: MessageSquare,
    // },
    {
      href: '/admin/projects',
      label: 'Projects',
      icon: Projector,
    },
    {
      href: '/admin/settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  if (isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <Loader2 className='h-8 w-8 animate-spin text-blue-600 mx-auto mb-4' />
          <p className='text-gray-600'>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className='main spacing min-h-screen flex bg-gray-50'>
      {/* Mobile Header */}
      <div className='lg:hidden fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 z-50 h-16 flex items-center justify-between px-4'>
        <Button
          variant='ghost'
          size='icon'
          className='text-white'
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          {isSidebarOpen ? (
            <X className='h-6 w-6' />
          ) : (
            <Menu className='h-6 w-6' />
          )}
        </Button>
        <h1 className='text-white font-bold text-lg'>Admin Panel</h1>
        <div className='w-10' /> {/* Spacer */}
      </div>

      {/* Sidebar */}
      <aside
        className={`spacing
          fixed lg:static inset-y-0 left-0 z-40
          w-64 bg-white border-r border-gray-200 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarOpen ? 'pt-16 lg:pt-0' : ''}
        `}
      >
        {/* Logo */}
        <div className='spacing hidden lg:flex items-center space-x-3 p-6 bg-gradient-to-r from-blue-600 to-purple-600'>
          <div className='w-10 h-10 bg-white rounded-lg flex items-center justify-center spacing'>
            <img src='/fav.svg' alt='Sky Coding Logo' className='w-12 h-12' />
          </div>
          <div>
            <h1 className='text-white font-bold text-xl'>Admin Panel</h1>
            <p className='text-blue-100 text-xs'>{user.email}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex flex-col gap-1 p-4'>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href) && item.href !== '/admin';

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`
                  flex items-center px-4 py-3 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
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

        {/* Logout Button */}
        <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200'>
          <Button
            variant='ghost'
            onClick={handleLogout}
            className='w-full justify-start text-red-600 hover:bg-red-50 hover:text-red-700'
          >
            <LogOut className='h-5 w-5 mr-3' />
            Logout
          </Button>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden'
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className='flex-1 overflow-y-auto pt-16 lg:pt-0'>
        <div className='p-6 lg:p-8'>{children}</div>
      </main>
    </div>
  );
}
