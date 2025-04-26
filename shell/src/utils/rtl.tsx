// libs/src/lib/components/providers/rtl-provider.tsx
import React, { ReactNode, useEffect } from 'react';
import { ConfigProvider } from 'antd';
import fa_IR from 'antd/lib/locale/fa_IR';
import './rtl-provider.scss';
import { ThemeConfig } from 'antd/lib';
import { Locale } from 'antd/es/locale';

export interface RtlProviderProps {
  children: ReactNode;
  theme?: ThemeConfig;
  customLocale?: Locale;
}

/**
 * RtlProvider component optimized for Persian/Farsi without Emotion dependencies
 */
export const RtlProvider: React.FC<RtlProviderProps> = ({ 
  children,
  theme,
  customLocale
}) => {
  // Apply RTL class to the document body for global RTL styling
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.body.classList.add('rtl');
      document.body.classList.add('lang-fa');
      document.dir = 'rtl';
      
      // Cleanup function
      return () => {
        document.body.classList.remove('rtl');
        document.body.classList.remove('lang-fa');
        document.dir = 'ltr';
      };
    }
    return undefined;
  }, []);

  // Use custom locale if provided, otherwise default to Farsi
  const locale = customLocale || fa_IR;

  return (
    <ConfigProvider
      direction="rtl"
      locale={locale}
      theme={{
        token: theme?.token,
        components: theme?.components,
        algorithm: theme?.algorithm,
        hashed: theme?.hashed
      }}
    >
      <div className="rtl-wrapper lang-fa">
        {children}
      </div>
    </ConfigProvider>
  );
};

export default RtlProvider;