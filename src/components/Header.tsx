'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Bell } from 'lucide-react'

export default function Header() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  
  useEffect(() => {
    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme')
      const documentHasDarkClass = document.documentElement.classList.contains('dark')
      setIsDarkMode(savedTheme === 'dark' || documentHasDarkClass)
    }

   
    checkTheme()

    
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })

   
    interface StorageEventWithKey extends StorageEvent {
      key: string | null;
    }

    const handleStorageChange = (e: StorageEventWithKey) => {
      if (e.key === 'theme') {
        checkTheme()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours();
    return hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';
  };

  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className={`text-2xl font-semibold mb-1 transition-colors duration-200 ${
          isDarkMode ? 'text-white' : 'text-gray-900'
        }`}>
          Hello Robert 👋
        </h1>
        <p className={`text-sm transition-colors duration-200 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {getGreeting()}
        </p>
      </div>

      <div className="flex items-center gap-4">
        
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 transition-colors duration-200 ${
            isDarkMode ? 'text-gray-500' : 'text-gray-400'
          }`} />
          <input
            type="text"
            placeholder="Search..."
            className={`pl-9 pr-3 py-2 border rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
          />
        </div>

       
        <div className="flex items-center gap-4">
          <button className={`relative transition-colors duration-200 ${
            isDarkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800'
          }`}>
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>

          <div className="relative group">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                  alt="Robert Allen"
                  width={40}
                  height={40}
                  className="rounded-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className={`text-sm font-medium transition-colors duration-200 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Robert Allen
                </span>
                <span className={`text-xs transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  HR Manager
                </span>
              </div>
              <svg
                className={`w-4 h-4 ml-1 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <div className={`absolute right-0 top-full mt-2 w-48 border rounded-lg shadow-lg p-2 hidden group-hover:block transition-colors duration-200 ${
              isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}