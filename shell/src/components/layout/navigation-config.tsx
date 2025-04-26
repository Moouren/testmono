
import {
  DashboardOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  SettingOutlined,
  FileOutlined,
  TeamOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  KeyOutlined
} from '@ant-design/icons';
import { MenuItem } from './app-layout';

/**
 * Common icons map that can be used across applications
 */
export const IconMap = {
  dashboard: <DashboardOutlined />,
  products: <ShoppingOutlined />,
  orders: <ShoppingCartOutlined />,
  users: <UserOutlined />,
  customers: <TeamOutlined />,
  settings: <SettingOutlined />,
  reports: <BarChartOutlined />,
  files: <FileOutlined />,
  apps: <AppstoreOutlined />,
  auth: <KeyOutlined />
};

/**
 * Generate menu items with proper URL paths
 * @param items Basic menu item configuration
 * @param basePath Base path to prefix all routes
 * @param router Next.js router for navigation
 * @returns Complete menu items with click handlers
 */
export const generateMenuItems = (
  items: Partial<MenuItem>[],
  basePath: string = '',
  router?: any
): MenuItem[] => {
  return items.map(item => {
    const key = item.key || '';
    const path = item.path || `${basePath}/${key}`.replace(/\/+/g, '/');
    
    return {
      key,
      icon: item.icon,
      label: item.label || key.charAt(0).toUpperCase() + key.slice(1),
      onClick: item.onClick || (router ? () => router.push(path) : undefined),
      path,
      children: item.children 
        ? generateMenuItems(item.children, `${basePath}/${key}`, router) 
        : undefined
    };
  });
};

/**
 * Common menu items for authentication/admin applications
 */
export const authMenuItems: Partial<MenuItem>[] = [
  {
    key: 'dashboard',
    icon: IconMap.dashboard,
    label: 'Dashboard'
  },
  {
    key: 'users',
    icon: IconMap.users,
    label: 'Users'
  },
  {
    key: 'settings',
    icon: IconMap.settings,
    label: 'Settings'
  }
];

/**
 * Common menu items for e-commerce/sales applications
 */
export const salesMenuItems: Partial<MenuItem>[] = [
  {
    key: 'dashboard',
    icon: IconMap.dashboard,
    label: 'Dashboard'
  },
  {
    key: 'products',
    icon: IconMap.products,
    label: 'Products'
  },
  {
    key: 'orders',
    icon: IconMap.orders,
    label: 'Orders'
  },
  {
    key: 'customers',
    icon: IconMap.customers,
    label: 'Customers'
  },
  {
    key: 'reports',
    icon: IconMap.reports,
    label: 'Reports',
    children: [
      {
        key: 'sales',
        label: 'Sales Report'
      },
      {
        key: 'inventory',
        label: 'Inventory Report'
      }
    ]
  }
];

/**
 * Get the active menu key based on the current path
 * @param pathname Current path
 * @param defaultKey Default key to return if no match is found
 * @returns Active menu key
 */
export const getActiveMenuKey = (pathname: string, defaultKey = 'dashboard'): string => {
  const path = pathname.split('/').filter(Boolean);
  return path.length > 0 ? path[path.length - 1] : defaultKey;
};

/**
 * Get the open menu keys based on the current path
 * @param pathname Current path
 * @returns Array of open menu keys
 */
export const getOpenMenuKeys = (pathname: string): string[] => {
  const path = pathname.split('/').filter(Boolean);
  const result: string[] = [];
  
  // Build the array of parent keys
  for (let i = 0; i < path.length - 1; i++) {
    result.push(path[i]);
  }
  
  return result;
};