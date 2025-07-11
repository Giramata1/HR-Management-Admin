'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  ClipboardList,
  BarChart2,
  Folder
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MetricCard {
  titleKey: string
  value: string
  change: string
  isPositive: boolean
  dateKey: string
  iconBg: string
  iconBgDark: string
  icon: React.ReactNode
}

const metrics: MetricCard[] = [
  {
    titleKey: 'dashboard.totalEmployee',
    value: '560',
    change: '12%',
    isPositive: true,
    dateKey: 'dashboard.updateDate',
    iconBg: 'bg-blue-50 text-blue-600',
    iconBgDark: 'bg-blue-900/20 text-blue-400',
    icon: <Users className="w-5 h-5" />
  },
  {
    titleKey: 'dashboard.totalApplicant',
    value: '1050',
    change: '5%',
    isPositive: true,
    dateKey: 'dashboard.updateDate',
    iconBg: 'bg-green-50 text-green-600',
    iconBgDark: 'bg-green-900/20 text-green-400',
    icon: <ClipboardList className="w-5 h-5" />
  },
  {
    titleKey: 'dashboard.todayAttendance',
    value: '470',
    change: '8%',
    isPositive: false,
    dateKey: 'dashboard.updateDate',
    iconBg: 'bg-red-50 text-red-600',
    iconBgDark: 'bg-red-900/20 text-red-400',
    icon: <BarChart2 className="w-5 h-5" />
  },
  {
    titleKey: 'dashboard.totalProjects',
    value: '250',
    change: '12%',
    isPositive: true,
    dateKey: 'dashboard.updateDate',
    iconBg: 'bg-purple-50 text-purple-600',
    iconBgDark: 'bg-purple-900/20 text-purple-400',
    icon: <Folder className="w-5 h-5" />
  }
];

export default function DashboardCards() {
  const { t, i18n } = useTranslation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

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

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') {
        checkTheme()
      }
    }
    window.addEventListener('storage', handleStorageChange)

    // Wait for i18n to be initialized before rendering
    if (i18n.isInitialized) {
      setReady(true)
    } else {
      const onInit = () => setReady(true)
      i18n.on('initialized', onInit)
      return () => i18n.off('initialized', onInit)
    }

    // Update date every minute
    const timer = setInterval(() => setCurrentDate(new Date()), 60000);

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(timer);
    }
  }, [i18n])

  if (!ready) return null // or a loader

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl">
      {metrics.map((metric, index) => (
        <div 
          key={index} 
          className={`p-6 rounded-2xl shadow-sm border transition-colors duration-200 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-100'
          }`}
        >
          <div className="flex items-center mb-6">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors duration-200 ${
              isDarkMode ? metric.iconBgDark : metric.iconBg
            }`}>
              {metric.icon}
            </div>
            <div className={`text-sm font-medium transition-colors duration-200 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              {t(metric.titleKey)}
            </div>
          </div>
                     
          <div className="flex items-center justify-between mb-4">
            <div className={`text-4xl font-bold transition-colors duration-200 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {metric.value}
            </div>
            <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full transition-colors duration-200 ${
              metric.isPositive
                ? isDarkMode 
                  ? 'bg-green-900/20 text-green-400' 
                  : 'bg-green-100 text-green-600'
                : isDarkMode 
                  ? 'bg-red-900/20 text-red-400' 
                  : 'bg-red-100 text-red-600'
            }`}>
              <span className="mr-1">
                {metric.isPositive ? '▲' : '▼'}
              </span>
              {metric.change}
            </div>
          </div>
                     
          <div className={`border-t pt-3 transition-colors duration-200 ${
            isDarkMode ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <div className={`text-xs transition-colors duration-200 ${
              isDarkMode ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {t(metric.dateKey, { date: currentDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}