'use client';

// React and Next.js Hooks
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Global Styles
import './styles/globals.css';

// Shared Components
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

// Context Providers
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/components/AuthContext';
import { LeaveProvider } from '@/contexts/LeaveContext';

// i18n
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === '/' || pathname === '/loginForm' || pathname === '/register';
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // This effect correctly handles showing/hiding the sidebar on different screen sizes.
  useEffect(() => {
    const handleResize = () => {
      // Logic for showing/hiding sidebar on resize
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="transition-colors duration-200">
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <AuthProvider>
              <LeaveProvider>
                {/* 
                  FIX: This is the new layout structure.
                  - It's a flex container that arranges its children side-by-side.
                  - `h-screen` ensures it takes the full height of the viewport.
                */}
                <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
                  {!isAuthPage ? (
                    <>
                      {/* Sidebar is the first item in the flex container. */}
                      <Sidebar
                        isOpen={isSidebarOpen}
                        onClose={handleCloseSidebar}
                      />
                      
                      {/* 
                        This wrapper contains the rest of your app and takes up the remaining space.
                        `overflow-hidden` is important for proper scrolling behavior.
                      */}
                      <div className="flex-1 flex flex-col overflow-hidden">
                        {/* 
                          The Header is now INSIDE the main content wrapper, not on top of it.
                        */}
                        <Header onMenuToggle={handleMenuToggle} />
                        
                        {/* 
                          The main content area is now the only part that scrolls.
                          The background color is removed from here and applied to the parent.
                        */}
                        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
                          {children}
                        </main>
                      </div>
                    </>
                  ) : (
                    <main className="flex-1">{children}</main>
                  )}
                </div>
              </LeaveProvider>
            </AuthProvider>
          </ThemeProvider>
        </I18nextProvider>
      </body>
    </html>
  );
}