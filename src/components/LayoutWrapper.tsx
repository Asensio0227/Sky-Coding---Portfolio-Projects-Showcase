'use client';

import { Footer, Navigation } from '@/components';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutWrapperProps {
  children: ReactNode;
}

export default function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuthPage = pathname === '/login' || pathname === '/signup';

  // Don't show navigation/footer on dashboard or auth pages
  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <div className='flex flex-col min-h-screen'>
      <Navigation />
      <main className=' flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
