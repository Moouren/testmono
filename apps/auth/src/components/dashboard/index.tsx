// auth-example/src/components/dashboard/index.tsx
'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Card, Typography, Statistic, Row, Col, App } from 'antd';
import { UserOutlined, TeamOutlined, KeyOutlined } from '@ant-design/icons';
import { useAuthState, useLogout, AppLayout, IconMap, generateMenuItems, getActiveMenuKey, getOpenMenuKeys } from '@nx/shell';

const { Title, Text } = Typography;

export default function Dashboard() {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { user } = useAuthState();
  const { logout } = useLogout();
  const { message } = App.useApp();

  // Define menu items
  const menuItems = generateMenuItems([
    {
      key: 'dashboard',
      icon: IconMap.dashboard,
      label: 'Dashboard',
      path: '/dashboard'
    },
    {
      key: 'users',
      icon: IconMap.users,
      label: 'User Management',
      children: [
        {
          key: 'list',
          label: 'All Users',
          path: '/dashboard/users'
        },
        {
          key: 'roles',
          label: 'Roles & Permissions',
          path: '/dashboard/users/roles'
        }
      ]
    },
    {
      key: 'settings',
      icon: IconMap.settings,
      label: 'Settings',
      path: '/dashboard/settings'
    }
  ], '', router);




  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      message.success('Logged out successfully');
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      message.error('Logout failed');
    }
  };

  // Get active menu key based on pathname
  const selectedKey = getActiveMenuKey(pathname, 'dashboard');
  const openKeys = getOpenMenuKeys(pathname);

  return (
    <AppLayout
      title="Auth Portal"
      menuItems={menuItems}
      selectedKeys={[selectedKey]}
      openKeys={openKeys}
      onLogout={handleLogout}
      direction="rtl"
    >
      <div>
        <Title level={3}>Welcome, {user?.name}</Title>
        <Text>You are logged in as {user?.email}</Text>
        
        <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Active Users"
                value={124}
                prefix={<UserOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="Admin Users"
                value={12}
                prefix={<TeamOutlined />}
              />
            </Card>
          </Col>
          <Col xs={24} sm={8}>
            <Card>
              <Statistic
                title="API Keys"
                value={5}
                prefix={<KeyOutlined />}
              />
            </Card>
          </Col>
        </Row>
        
        <Card style={{ marginTop: 24 }}>
          <Title level={4}>Account Details</Title>
          <div style={{ marginTop: 16 }}>
            <Text strong>Role: </Text>
            <Text>{user?.role || 'User'}</Text>
          </div>
          {user?.permissions && (
            <div style={{ marginTop: 8 }}>
              <Text strong>Permissions: </Text>
              <Text>{user.permissions.join(', ')}</Text>
            </div>
          )}
        </Card>
      </div>
    </AppLayout>
  );
}