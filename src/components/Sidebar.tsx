'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from '@/contexts/ThemeContext';
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

const menuItems = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'All Employees', href: '/employees' },
  { icon: RefreshCw, label: 'All Departments', href: '/departments' },
  { icon: CalendarCheck, label: 'Attendance', href: '/attendance' },
  { icon: CircleDollarSign, label: 'Payroll', href: '/payroll' },
  { icon: BriefcaseBusiness, label: 'Jobs', href: '/jobs' },
  { icon: UsersRound, label: 'Candidates', href: '/candidates' },
  { icon: ClipboardList, label: 'Leaves', href: '/leaves' },
  { icon: NotepadText, label: 'Holidays', href: '/holidays' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

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
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <li key={index}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-white bg-purple-600 hover:bg-purple-700'
                        : isDarkMode
                        ? 'text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.label}
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
            <span className="text-sm font-medium">Light</span>
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
            <span className="text-sm font-medium">Dark</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
