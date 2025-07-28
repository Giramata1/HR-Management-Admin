'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';
import {
  Users, RefreshCw, CalendarCheck, CircleDollarSign, BriefcaseBusiness,
  UsersRound, ClipboardList, NotepadText, Settings, LayoutGrid, Sun, Moon, X,
} from 'lucide-react';
// FIX: Import the custom hook to get the user's role
import { useAuth } from '@/hooks/useAuth';

// This menuItems array remains UNCHANGED, as you requested.
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
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation();
  // FIX: Use the hook to get the current role and a loading state
  const { role, isAuthLoaded } = useAuth();

  const isDarkMode = theme === 'dark' || (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  // FIX: To prevent links from flickering on load, we wait until the role is loaded from localStorage.
  if (!isAuthLoaded) {
    return (
        <aside className={`fixed lg:static inset-y-0 left-0 w-64 h-screen border-r flex flex-col transition-transform duration-300 ease-in-out z-50 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            {/* You can optionally add a loading skeleton here */}
        </aside>
    );
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <aside
        className={`fixed lg:static inset-y-0 left-0 w-64 h-screen border-r flex flex-col transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 ${isDarkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
      >
        <div className={`p-6 border-b flex items-center justify-between ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">∞</span>
            </div>
            <span className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
              HRMS
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-gray-200">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-1">
            {/* 
              FIX: This is the permission check. We filter the list BEFORE rendering.
              This logic implements the exact rules you requested.
            */}
            {menuItems
              .filter(item => {
                // If the user is HR, show everything.
                if (role === 'HR') {
                  return true;
                }
                // If the user is an EMPLOYEE, only show these specific links.
                if (role === 'EMPLOYEE') {
                  const employeeLinks = ['/dashboard', '/employees', '/jobs', '/holidays', '/settings', '/leaves'];
                  return employeeLinks.includes(item.href);
                }
                // If the user is not logged in (role is null), show nothing.
                return false;
              })
              .map(({ icon: Icon, labelKey, href }) => {
                const isActive = pathname === href;
                return (
                  <li key={href}>
                    <Link href={href} onClick={onClose}>
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
                <button onClick={() => setTheme('light')} className={`flex items-center space-x-2 px-3 py-2 rounded-md flex-1 justify-center transition-all duration-200 ${ theme === 'light' ? 'bg-purple-600 text-white shadow-sm' : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800' }`}><Sun size={16} /><span className="text-sm font-medium">{t('sidebar.light')}</span></button>
                <button onClick={() => setTheme('dark')} className={`flex items-center space-x-2 px-3 py-2 rounded-md flex-1 justify-center transition-all duration-200 ${ theme === 'dark' ? 'bg-purple-600 text-white shadow-sm' : isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800' }`}><Moon size={16} /><span className="text-sm font-medium">{t('sidebar.dark')}</span></button>
            </div>
        </div>
      </aside>
    </>
  );
}