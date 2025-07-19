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
  Menu,
  X,
} from 'lucide-react';
import { useEffect, useState } from 'react';

const menuItems = [
  { icon: LayoutGrid, labelKey: 'sidebar.dashboard', href: '/dashboard' },
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

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  // All hooks called first:
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      const onInit = () => setReady(true);
      i18n.on('initialized', onInit);
      return () => i18n.off('initialized', onInit);
    }
  }, [i18n]);

  useEffect(() => {
    if (typeof window !== 'undefined' && setIsOpen) {
      setIsOpen(window.innerWidth >= 1024); // Open by default on lg screens
    }
  }, [setIsOpen]);

  // Now safe to early return
  if (!ready) return null;

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setIsOpen && setIsOpen(!isOpen)}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 h-screen border-r flex flex-col transition-all duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'} z-40`}
      >
        <div className={`p-6 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">∞</span>
            </div>
            <span className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              HRMS
            </span>
          </div>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
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
                      <span>{t(labelKey)}</span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className={`flex rounded-lg p-1 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md flex-1 justify-center transition-all duration-200 ${
                theme === 'light'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Sun size={16} />
              <span className="text-sm font-medium">{t('sidebar.light')}</span>
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md flex-1 justify-center transition-all duration-200 ${
                theme === 'dark'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : isDarkMode
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <Moon size={16} />
              <span className="text-sm font-medium">{t('sidebar.dark')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
