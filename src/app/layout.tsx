'use client';

import './styles/globals.css';
import Sidebar from '@/components/Sidebar';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';
import { AuthProvider } from '@/components/AuthContext';
import { LeaveProvider } from '@/contexts/LeaveContext'; // ✅ Add this
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/' || pathname === '/loginForm' || pathname === '/register';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebarOpen(window.innerWidth >= 1024);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <AuthProvider>
              <LeaveProvider> {/* ✅ wrap here */}
                <div className="flex min-h-screen">
                  {!isLoginPage && (
                    <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                  )}
                  <main className="flex-1">
                    <div className="p-6 bg-gray-50 dark:bg-gray-800 min-h-screen transition-all duration-300 relative z-10">
                      {children}
                    </div>
                  </main>
                </div>
              </LeaveProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}
