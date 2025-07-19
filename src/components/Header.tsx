'use client';

import { useState, useEffect } from 'react';

import { useRouter } from 'next/navigation';
import { Search, Bell, LogOut, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/components/AuthContext'; // Adjust path based on your project

export default function Header() {
  const { t, i18n } = useTranslation();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();
  const [currentHour, setCurrentHour] = useState(new Date().getHours());
  const { user } = useAuth(); 

  useEffect(() => {
    // Theme detection logic
    const checkTheme = () => {
      if (typeof window !== 'undefined') {
        const savedTheme = localStorage.getItem('theme');
        const isDark = document.documentElement.classList.contains('dark');
        setIsDarkMode(savedTheme === 'dark' || isDark);
      }
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') checkTheme();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    // Wait for i18n initialization
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      const onInit = () => setReady(true);
      i18n.on('initialized', onInit);
      return () => i18n.off('initialized', onInit);
    }

    // Update hour every minute
    const timer = setInterval(() => setCurrentHour(new Date().getHours()), 60000);

    return () => {
      observer.disconnect();
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
      clearInterval(timer);
    };
  }, [i18n]);

  // Don't render translations before i18n is ready to avoid hydration errors
  if (!ready) return null;

  // Use translation keys for greetings with dynamic time-based logic
  const getGreeting = () => {
    if (currentHour < 12) return t('header.goodMorning');
    if (currentHour < 17) return t('header.goodAfternoon');
    return t('header.goodEvening');
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/loginForm');
  };

  // Fallback to localStorage if AuthContext is not available
  const loggedInUser = user || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {});
  const userName = loggedInUser.fullName || 'User';
  const userRole = loggedInUser.role || t('header.hrManager');

  return (
    <>
      {/* Overlay */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setDropdownOpen(false)}
        />
      )}

      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 relative z-40">
        {/* Left: Greeting */}
        <div className="w-full md:w-auto">
          <h1 className={`text-xl sm:text-2xl font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('header.helloUser', { name: userName })} 👋
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {getGreeting()}
          </p>
        </div>

        {/* Right: Search, Bell, Profile */}
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                isDarkMode
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
            />
          </div>

          {/* Notifications */}
          <button className={`relative ${isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'}`}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          {/* Profile Dropdown */}
          <div className="relative">
            <div
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}>
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {userName}
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {userRole}
                </span>
              </div>
              <svg
                className={`w-4 h-4 ml-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {dropdownOpen && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 border rounded-lg shadow-lg p-2 z-50 ${
                  isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-800'
                }`}
              >
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <User className="w-4 h-4 mr-2" />
                  {t('header.myProfile')}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-2 text-sm rounded-md text-red-500 hover:bg-red-50 dark:hover:bg-red-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {t('header.logout')}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}