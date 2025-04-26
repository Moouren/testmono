// libs/src/lib/components/providers/rtl-provider.tsx
import React, { ReactNode, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import fa_IR from 'antd/lib/locale/fa_IR';
import './rtl-provider.scss';

export interface RtlProviderProps {
  children: ReactNode;
  theme?: {
    colorPrimary?: string;
    [key: string]: any;
  };
  customLocale?: any;
}

/**
 * RtlProvider component optimized for Persian/Farsi
 * Uses SCSS for RTL transformations rather than Emotion/Stylis
 */
export const RtlProvider: React.FC<RtlProviderProps> = ({ 
  children,
  theme = {
    colorPrimary: '#1890ff',
  },
  customLocale
}) => {
  // Apply RTL class to the document body for global RTL styling
  useEffect(() => {
    document.body.classList.add('rtl');
    document.body.classList.add('lang-fa');
    document.dir = 'rtl';
    
    // Cleanup function
    return () => {
      document.body.classList.remove('rtl');
      document.body.classList.remove('lang-fa');
      document.dir = 'ltr';
    };
  }, []);

  // Use custom locale if provided, otherwise default to Farsi
  const locale = customLocale || fa_IR;

  return (
    <div className="rtl-wrapper lang-fa">
      <ConfigProvider
        direction="rtl"
        locale={locale}
        theme={{
          token: theme,
        }}
      >
        {children}
      </ConfigProvider>
    </div>
  );
};

export default RtlProvider;