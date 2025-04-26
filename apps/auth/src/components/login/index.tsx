'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Button, 
  Card, 
  Form, 
  Input, 
  Typography, 
  App, 
  Spin, 
} from 'antd';
import { useLogin, useAuth, useAuthState } from '@nx/shell';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import Image from 'next/image';

const { Title, Text } = Typography;

// LoginFormValues interface
interface LoginFormValues {
  email: string;
  password: string;
  device_name: string;
}

export default function Login() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loading } = useLogin();
  const { setRedirectAfterLogin } = useAuth();
  const { isAuthenticated, user } = useAuthState();
  const [form] = Form.useForm();
  const { message } = App.useApp();
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  // Get return URL from query parameters if available
  const returnUrl = searchParams.get('returnUrl');
  const isLogout = searchParams.get('logout') === 'true';
  
  // Handle logout if that's why we're here
  useEffect(() => {
    if (isLogout) {
      message.success('You have been logged out successfully');
    }
  }, [isLogout, message]);

  // Save return URL when component mounts
  useEffect(() => {
    if (returnUrl) {
      setRedirectAfterLogin(returnUrl);
    }
  }, [returnUrl, setRedirectAfterLogin]);

  // Check if user is already authenticated
  useEffect(() => {
    if (isAuthenticated && user && !isRedirecting) {
      setIsRedirecting(true);

      // If return URL is provided, go there
      if (returnUrl) {
        // Check if this is a cross-domain redirect
        if (!returnUrl.startsWith(window.location.origin)) {
          try {
            
            // Add small delay to ensure everything is ready
            setTimeout(() => {
              window.location.href = returnUrl;
            }, 1000);
          } catch (error) {
            console.error('Error during redirect:', error);
            message.error('Redirect failed');
            setIsRedirecting(false);
          }
        } else {
          // Same domain redirect
          setTimeout(() => {
            window.location.href = returnUrl;
          }, 500);
        }
      } else {
        // Otherwise go to the dashboard
        setTimeout(() => {
          router.push('/dashboard');
          setIsRedirecting(false);
        }, 500);
      }
    }
  }, [isAuthenticated, returnUrl, router, user, message, isRedirecting]);

  // Login form submission handler - uses the real API via the useLogin hook
  const handleSubmit = async (values: LoginFormValues) => {
    try {
      console.log('Form submitted with values:', values);
      
      // Call the login method from useLogin hook - this invokes the AuthService's login method
      const loginResponse = await login({
        email: values.email,
        password: values.password,
        device_name: values.device_name || 'web',
      });
      
      console.log('Login successful, response:', loginResponse);
      message.success('Login successful!');
      setIsRedirecting(true);
      
      // After successful login, handle redirect
      if (returnUrl) {
        // For cross-domain redirects, include token data
        if (!returnUrl.startsWith(window.location.origin)) {
          try {
      
      
            // Add longer delay to ensure everything is ready
            setTimeout(() => {
              window.location.href = returnUrl;
            }, 1000);
          } catch (error) {
            console.error('Error during redirect:', error);
            message.error('Redirect failed');
            setIsRedirecting(false);
          }
        } else {
          // Same domain redirect
          setTimeout(() => {
            window.location.href = returnUrl;
          }, 500);
        }
      } else {
        // Go to dashboard
        setTimeout(() => {
          router.push('/dashboard');
          setIsRedirecting(false);
        }, 500);
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('Login failed. Please try again.');
      }
      setIsRedirecting(false);
    }
  };

  if (isAuthenticated && !isLogout && !isRedirecting) {
    return (
      <div className="auth-container">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <div style={{ marginTop: 16 }}>You are already logged in. Redirecting...</div>
      </div>
    );
  }

  if (isRedirecting) {
    return (
      <div className="auth-container">
        <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        <div style={{ marginTop: 16 }}>Redirecting to application...</div>
      </div>
    );
  }

  return (
    <div className="auth-container" style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      direction: 'rtl' // Right-to-left support
    }}>
      <Card 
        style={{ 
          width: 420,
          borderRadius: 12,
          overflow: 'hidden'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <Image src='/logo-dark.svg' alt='b2bLogo' width={250} height={42} priority/>
          <Title level={3} style={{ marginBottom: 8 }}>
          </Title>
          <Text type="secondary">
            لطفا ایمیل و رمز عبور خود را وارد کنید
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ email: 'user@example.com', password: 'password123', device_name: 'web' }}
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'لطفا ایمیل خود را وارد کنید' },
              { type: 'email', message: 'لطفا یک ایمیل معتبر وارد کنید' },
            ]}
          >
            <Input 
              prefix={<UserOutlined  />} 
              placeholder="ایمیل" 
              autoComplete="email"
              style={{ height: 44 }}
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'لطفا رمز عبور خود را وارد کنید' }]}
          >
            <Input.Password 
              prefix={<LockOutlined/>} 
              placeholder="رمز عبور" 
              autoComplete="current-password"
              style={{ height: 44 }}
            />
          </Form.Item>
          
          {/* Hidden field for device_name - not shown to users */}
          <Form.Item
            name="device_name"
            hidden
          >
            <Input />
          </Form.Item>
          
          <Form.Item style={{ marginBottom: 12 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size='large'
            >
              ورود
            </Button>
          </Form.Item>
        </Form>     
        {returnUrl && (
          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.9em' }}>
            پس از ورود، به برنامه خود بازگردانده خواهید شد.
          </div>
        )}
      </Card>
      
    </div>
  );
}