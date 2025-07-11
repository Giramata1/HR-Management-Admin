'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  Users,
  RefreshCw,
  CalendarCheck,
  CircleDollarSign,
  BriefcaseBusiness,
  UsersRound,
  ClipboardList,
  NotepadText,
  Settings,
  LayoutGrid,
  Sun,
  Moon,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const menuItems = [
  { icon: LayoutGrid, labelKey: 'sidebar.dashboard', href: '/' },
  { icon: Users, labelKey: 'sidebar.allEmployees', href: '/employees' },
  { icon: RefreshCw, labelKey: 'sidebar.allDepartments', href: '/departments' },
  { icon: CalendarCheck, labelKey: 'sidebar.attendance', href: '/attendance' },
  { icon: CircleDollarSign, labelKey: 'sidebar.payroll', href: '/payroll' },
  { icon: BriefcaseBusiness, labelKey: 'sidebar.jobs', href: '/jobs' },
  { icon: UsersRound, labelKey: 'sidebar.candidates', href: '/candidates' },
  { icon: ClipboardList, labelKey: 'sidebar.leaves', href: '/leaves' },
  { icon: NotepadText, labelKey: 'sidebar.holidays', href: '/holidays' },
  { icon: Settings, labelKey: 'sidebar.settings', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t, ready } = useTranslation();

  // Local state to store dark mode to avoid mismatch between SSR and client
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Default dark mode on server: false (light)
    if (typeof window === 'undefined') return false;

    // On client, initial guess based on theme or system preference
    if (theme === 'dark') return true;
    if (theme === 'auto') return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (theme === 'dark') {
      setIsDarkMode(true);
    } else if (theme === 'auto') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(mediaQuery.matches);

      const handler = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    } else {
      setIsDarkMode(false);
    }
  }, [theme]);

  if (!ready) {
    // Don't render until i18n is ready to avoid hydration mismatch
    return null;
  }

  return (
    <aside
      className={`w-64 h-screen border-r flex flex-col transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div
        className={`p-6 border-b transition-colors duration-200 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">∞</span>
          </div>
          <span
            className={`text-xl font-semibold transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}
          >
            HRMS
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map(({ icon: Icon, labelKey, href }, index) => {
            const isActive = pathname === href;

            return (
              <li key={index}>
                <Link href={href}>
                  <div
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-white bg-purple-600 hover:bg-purple-700'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={20} className="mr-3" />
                    {/* translate label inline */}
                    <span suppressHydrationWarning>{t(labelKey)}</span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`p-4 border-t transition-colors duration-200 ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}
      >
        <div
          className={`flex rounded-lg p-1 transition-colors duration-200 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
          }`}
        >
          <button
            onClick={() => setTheme('light')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md flex-1 justify-center transition-all duration-200 ${
              theme === 'light'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Sun size={16} />
            <span suppressHydrationWarning className="text-sm font-medium">
              {t('sidebar.light')}
            </span>
          </button>

          <button
            onClick={() => setTheme('dark')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md flex-1 justify-center transition-all duration-200 ${
              theme === 'dark'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Moon size={16} />
            <span suppressHydrationWarning className="text-sm font-medium">
              {t('sidebar.dark')}
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
