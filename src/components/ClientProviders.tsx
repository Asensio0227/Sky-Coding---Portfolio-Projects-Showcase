'use client';

import { AuthProvider } from '@/context/AuthContext';
import { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';

interface Props {
  children: ReactNode;
}

export default function ClientProviders({ children }: Props) {
  return (
    <AuthProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AuthProvider>
  );
}
