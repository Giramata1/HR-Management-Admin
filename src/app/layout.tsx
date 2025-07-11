'use client';

import './styles/globals.css';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

import '../i18n';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Only hide sidebar on /login (or update if you have other routes like /register)
  const isLoginPage = pathname === '/login';

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024); // Open sidebar on large screens
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <div className="flex min-h-screen">
              {/* Sidebar shown on all except login */}
              {!isLoginPage && (
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
              )}

              {/* Main content area */}
              <main className="flex-1">
                <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen transition-all duration-300 relative z-10">
                  {children}
                </div>
              </main>
            </div>
          </ThemeProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
