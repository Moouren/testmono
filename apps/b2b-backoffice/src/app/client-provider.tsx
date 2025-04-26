// apps/auth-example/app/client-providers.tsx
'use client';

import { AuthProvider, AuthService, RtlProvider, themeConfig } from '@nx/shell';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntApp } from 'antd';
import { ReactNode } from 'react';

// Initialize auth service
const authService = new AuthService(process.env.NEXT_PUBLIC_AUTH_BACKEND_URL || 'http://localhost:3001/api');

// Client-side only providers
export default function ClientSideProviders({ 
  children 
}: { 
  children: ReactNode 
}) {
  const queryClient = new QueryClient()

  return (
    <RtlProvider theme={themeConfig}>
      <AntApp>
        <QueryClientProvider client={queryClient}>
        <AuthProvider authService={authService}>
          {children}
        </AuthProvider>
        </QueryClientProvider>
      </AntApp>
    </RtlProvider>
  );
}
