'use client'
import 'antd/dist/reset.css';
import dynamic from 'next/dynamic';
import { iranYekan,AuthGuard } from '@nx/shell';
import '@nx/shell/styles'; // Import shell styles which include font CSS

// Dynamically import client-side components
const ClientSideProviders = dynamic(
  () => import('./client-provider'),
  { ssr: false }
);



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" dir="rtl">
      <head>
        {/* Next.js will automatically include your CSS here */}
      </head>
      <body className={iranYekan.className}>
        <ClientSideProviders>
          <AuthGuard>
            {children}
          </AuthGuard>
        </ClientSideProviders>
      </body>
    </html>
  );
}