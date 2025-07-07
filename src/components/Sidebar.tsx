'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  UserPlus,
  Leaf,
  Gift,
  Settings,
  LayoutDashboard,
  Sun,
  Moon,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'All Employees', href: '/employees' },
  { icon: Building2, label: 'All Departments', href: '/departments' },
  { icon: Calendar, label: 'Attendance', href: '/attendance' },
  { icon: DollarSign, label: 'Payroll', href: '/payroll' },
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  { icon: UserPlus, label: 'Candidates', href: '/candidates' },
  { icon: Leaf, label: 'Leaves', href: '/leaves' },
  { icon: Gift, label: 'Holidays', href: '/holidays' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();
  const [isDarkMode, setIsDarkMode] = useState(false);

  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark');
    } else {
     
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
  }, []);

  
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);


  return (
    <aside className={`w-64 h-screen border-r flex flex-col transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-gray-50 border-gray-200'
    }`}>
      
      <div className={`p-6 border-b transition-colors duration-200 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">∞</span>
          </div>
          <span className={`text-xl font-semibold transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
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

      
      <div className={`p-4 border-t transition-colors duration-200 ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className={`flex rounded-lg p-1 transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
        }`}>
          <button
            onClick={() => setIsDarkMode(false)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md flex-1 justify-center transition-all duration-200 ${
              !isDarkMode
                ? 'bg-purple-600 text-white shadow-sm'
                : isDarkMode
                ? 'text-gray-400 hover:text-gray-300'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Sun size={16} />
            <span className="text-sm font-medium">Light</span>
          </button>
          <button
            onClick={() => setIsDarkMode(true)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md flex-1 justify-center transition-all duration-200 ${
              isDarkMode
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