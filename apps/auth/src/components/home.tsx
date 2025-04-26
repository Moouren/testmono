// auth-example/src/components/home.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@nx/shell';
import { Card, Button, Typography, Spin } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthState();

  useEffect(() => {
    // Redirect based on auth status after checking
    if (!loading) {
      if (isAuthenticated) {
        router.push('/dashboard');
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading indicator while checking auth
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        <Spin size="large" />
      </div>
    );
  }

  // Render a minimal welcome page (this will only show briefly before redirecting)
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '40px 20px',
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <Card style={{ maxWidth: '600px', textAlign: 'center', padding: '20px' }}>
        <Title level={2}>
          <KeyOutlined style={{ marginRight: '12px' }} />
          Authentication Portal
        </Title>
        <Paragraph style={{ fontSize: '16px', marginBottom: '24px' }}>
          Secure authentication service for all company applications
        </Paragraph>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
          <Button 
            type="primary" 
            icon={<UserOutlined />}
            onClick={() => router.push('/login')}
          >
            Login
          </Button>
          <Button 
            onClick={() => router.push('/register')}
          >
            Register
          </Button>
        </div>
      </Card>
      <div style={{ margin: '20px', textAlign: 'center' }}>
        <Paragraph>Redirecting to appropriate page...</Paragraph>
      </div>
    </div>
  );
}