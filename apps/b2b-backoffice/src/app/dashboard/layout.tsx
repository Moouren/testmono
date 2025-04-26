// auth-example/src/components/dashboard/index.tsx
'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { App } from 'antd';
import { useAuthState, useLogout, AppLayout, IconMap, generateMenuItems, getActiveMenuKey, getOpenMenuKeys } from '@nx/shell';


export default function DashboardLayout({children}:{children:ReactNode}) {
  const router = useRouter();
  const pathname = usePathname() || '';
  const { isAuthenticated, loading } = useAuthState();
  const { logout } = useLogout();
  const { message } = App.useApp();
  const [initialLoading, setInitialLoading] = useState(true)
  
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(`${process.env.NEXT_PUBLIC_AUTH_URL}/login`);
    } else {
      setInitialLoading(false);
    }
  }, [isAuthenticated, loading, router]);
  console.log('is',isAuthenticated,loading)
  // Define menu items
  const menuItems = generateMenuItems([
    {
      key: 'purchase',
      icon: IconMap.dashboard,
      label: 'مدیریت سند های خرید',
      path: '/dashboard/purchase-management'
    },
    {
      key: 'product',
      icon: IconMap.dashboard,
      label: 'مدیریت انبار',
      path: '/dashboard/product-management'
    },
    // {
    //   key: 'users',
    //   icon: IconMap.users,
    //   label: 'User Management',
    //   children: [
    //     {
    //       key: 'list',
    //       label: 'All Users',
    //       path: '/dashboard/users'
    //     },
    //     {
    //       key: 'roles',
    //       label: 'Roles & Permissions',
    //       path: '/dashboard/users/roles'
    //     }
    //   ]
    // },
    // {
    //   key: 'settings',
    //   icon: IconMap.settings,
    //   label: 'Settings',
    //   path: '/dashboard/settings'
    // }
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

  if (loading || initialLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

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
        {children}
      </div>
    </AppLayout>
  );
}