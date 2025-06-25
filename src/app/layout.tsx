import './styles/globals.css';
import Sidebar from '@/components/Sidebar'; 
import { ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
        <div className="flex">
        
          <Sidebar />

          
          <div className="flex-1 p-6 bg-gray-50 min-h-screen">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
