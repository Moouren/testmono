// apps/auth-example/app/client-providers.tsx
'use client';

import { AuthProvider, AuthService, RtlProvider, themeConfig } from '@nx/shell';
import { App as AntApp } from 'antd';
import { ReactNode } from 'react';

// Initialize auth service
const authService = new AuthService(process.env.NEXT_PUBLIC_AUTH_BACKEND_URL!);

// Client-side only providers
export default function ClientSideProviders({ 
  children 
}: { 
  children: ReactNode 
}) {
  return (
    <RtlProvider theme={themeConfig}>
      <AntApp>
        <AuthProvider authService={authService}>
          {children}
        </AuthProvider>
      </AntApp>
    </RtlProvider>
  );
}
