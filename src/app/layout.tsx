'use client';

import './styles/globals.css';
import Sidebar from '@/components/Sidebar';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();

  // 👇 This hides the sidebar only on the login page (/)
  const isLoginPage = pathname === '/';

  return (
    <html lang="en">
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="flex">
          {/* Show sidebar only when not on login page */}
          {!isLoginPage && <Sidebar />}

          <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
