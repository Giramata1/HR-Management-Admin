'use client';

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Bell, LogOut, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { t, i18n } = useTranslation()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Theme detection logic
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme')
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(savedTheme === 'dark' || isDark)
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') checkTheme()
    }

    window.addEventListener('storage', handleStorageChange)

    // Wait for i18n initialization
    if (i18n.isInitialized) {
      setReady(true)
    } else {
      const onInit = () => setReady(true)
      i18n.on('initialized', onInit)
      return () => i18n.off('initialized', onInit)
    }

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [i18n])

  // Don't render translations before i18n is ready to avoid hydration errors
  if (!ready) return null

  // Use translation keys for greetings with dynamic time-based logic
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return t('header.goodMorning')
    if (hour < 17) return t('header.goodAfternoon')
    return t('header.goodEvening')
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  return (
    <>
      {/* Overlay */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
          onClick={() => setDropdownOpen(false)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 relative z-40">
        {/* Left: Greeting */}
        <div>
          <h1 className={`text-xl sm:text-2xl font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {t('header.helloUser', { name: 'Robert' })} 👋
          </h1>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {getGreeting()}
          </p>
        </div>

        {/* Right: Search, Bell, Profile */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
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
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                  alt={t('header.profileAlt', { name: 'Robert Allen' })}
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Robert Allen
                </span>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {t('header.hrManager')}
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
  )
}
