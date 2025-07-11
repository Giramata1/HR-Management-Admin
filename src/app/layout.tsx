'use client'

import './styles/globals.css'
import Sidebar from '@/components/Sidebar'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/contexts/ThemeContext'

import '../i18n'
import { I18nextProvider } from 'react-i18next'
import i18n from '../i18n'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/'

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-200">
        <I18nextProvider i18n={i18n}>
          <ThemeProvider>
            <div className="flex">
              {!isLoginPage && <Sidebar />}
              <div className="flex-1 p-6 bg-gray-50 dark:bg-gray-800 min-h-screen transition-colors duration-200">
                {children}
              </div>
            </div>
          </ThemeProvider>
        </I18nextProvider>
      </body>
    </html>
  )
}
