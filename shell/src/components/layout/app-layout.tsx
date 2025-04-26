// app/components/layout/app-layout.tsx
import React, { useState, ReactNode, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, theme } from 'antd';
import { ChevronLeft, ChevronRight, User } from 'lucide-react';
import { useAuthState, useLogout } from '../../services/auth/hooks';
import './app-layout.scss';

import logoImage from '../../public/logo.png';

const { Sider, Content } = Layout; // Adjust path accordingly

export interface MenuItem {
  key: string;
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  children?: MenuItem[];
  path?: string;
}
interface ImageModule {
  src: string;
}


export interface AppLayoutProps {
  children: ReactNode;
  title: string;
  logo?: React.ReactNode;
  menuItems: MenuItem[];
  onMenuClick?: (key: string) => void;
  selectedKeys?: string[];
  openKeys?: string[];
  userDropdownItems?: {
    key: string;
    icon?: React.ReactNode;
    label: string;
    onClick?: () => void;
  }[];
  onLogout?: () => Promise<void>;
  direction?: 'ltr' | 'rtl';
  breadcrumbs?: { label: string; path?: string }[];
  siderStyle?: React.CSSProperties;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  menuItems,
  onMenuClick,
  selectedKeys = [],
  openKeys = [],
  userDropdownItems,
  onLogout,
  direction = 'ltr',
  breadcrumbs = [],
  logo,
  siderStyle,
}) => {
  // Get theme tokens from Ant Design
  const { token } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { user } = useAuthState();
  const { logout } = useLogout();

  // Detect mobile view
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };
      
      // Set initial value
      checkMobile();
      
      // Add event listener
      window.addEventListener('resize', checkMobile);
      
      // Cleanup
      return () => {
        window.removeEventListener('resize', checkMobile);
      };
    }
    
    return undefined;
  }, []);

  // Apply RTL class to support RTL mode
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (direction === 'rtl') {
        document.body.classList.add('rtl');
        document.body.setAttribute('dir', 'rtl');
      } else {
        document.body.classList.remove('rtl');
        document.body.setAttribute('dir', 'ltr');
      }
      
      return () => {
        document.body.classList.remove('rtl');
      };
    }
    
    return undefined;
  }, [direction]);

  const handleLogout = async () => {
    if (onLogout) {
      await onLogout();
    } else {
      await logout();
    }
  };

  const defaultUserDropdownItems = [
    {
      key: 'logout',
      icon: <User className="w-4 h-4" />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  const dropdownItems = userDropdownItems || defaultUserDropdownItems;

  // Handle menu click
  const handleMenuItemClick = (key: string) => {
    if (onMenuClick) {
      onMenuClick(key);
    }
  };

  // Default sidebar background - dark navy blue from reference image
  const siderDefaultStyle = {
    backgroundColor: '#0a1929',
    ...siderStyle
  };

  // Default collapsed state based on screen size
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  // Prepare menu items
  const menuItemsConfig = menuItems.map(item => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
    onClick: () => {
      if (item.onClick) {
        item.onClick();
      } else {
        handleMenuItemClick(item.key);
      }
    },
    children: item.children?.map(child => ({
      key: child.key,
      icon: child.icon,
      label: child.label,
      onClick: () => {
        if (child.onClick) {
          child.onClick();
        } else {
          handleMenuItemClick(child.key);
        }
      }
    }))
  }));

  return (
    <Layout className="app-layout" style={{ minHeight: '100vh' }}>
      {/* Main Content - Now on the left side */}
      <Layout style={{ 
        marginRight: collapsed ? 80 : 240,
        transition: 'all 0.2s',
      }}>
        {/* Content */}
        <Content style={{ 
          padding: token.padding, 
          background: token.colorBgContainer,
          minHeight: 280
        }}>
          {children}
        </Content>
      </Layout>
      
      {/* Sidebar - Now fixed to the right */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          right: 0,
          top: 0,
          bottom: 0,
          zIndex: 11,
          ...siderDefaultStyle
        }}
        width={240}
        collapsedWidth={80}
        theme="dark"
        className="app-sider"
      >
        {/* Logo and App Title */}
        <div className="app-logo" style={{ padding: '16px', textAlign: 'center' }}>
        {logo || <img src={(logoImage as unknown as ImageModule).src} alt='b2bLogo'/>}
        </div>
        
        {/* Main Menu */}
        <div className="menu-container" style={{ padding: '16px 0' }}>
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={selectedKeys}
            defaultOpenKeys={openKeys}
            style={{ 
              border: 'none', 
              backgroundColor: 'transparent'
            }}
            items={menuItemsConfig}
          />
        </div>
        
        {/* User Avatar - Now at the bottom of the sidebar */}
        <div className="user-profile" style={{ 
          position: 'absolute', 
          bottom: '20px', 
          right: 0, 
          left: 0, 
          display: 'flex', 
          justifyContent: 'center',
          padding: '0 16px'
        }}>
          <Dropdown
            menu={{
              items: dropdownItems.map(item => ({
                key: item.key,
                icon: item.icon,
                label: item.label,
                onClick: item.onClick,
              }))
            }}
            trigger={['click']}
            placement="topLeft"
          >
            <Avatar 
              size={40} 
              style={{ backgroundColor: '#3b82f6', cursor: 'pointer' }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || 'A'}
            </Avatar>
          </Dropdown>
        </div>
        
        {/* Toggle Button - Only shown on mobile */}
        {isMobile && (
          <Button
            type="text"
            icon={collapsed ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              position: 'absolute',
              top: '16px',
              left: '16px',
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              border: 'none'
            }}
          />
        )}
      </Sider>
    </Layout>
  );
};

export default AppLayout;