'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  ClipboardList,
  BarChart2,
  Folder
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- Interfaces ---
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

// --- API Configuration ---
const API_BASE_URL = 'https://hr-management-system-pmfp.onrender.com/api';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiSFIiLCJzdWIiOiJocm1zLmhyQGdtYWlsLmNvbSIsImlhdCI6MTc1MzE4ODkxNywiZXhwIjoxNzU2MjEyOTE3fQ.7yScLczcXGmzUeR8wRLd8gyZylZuiiNGIcniPvOKO0g';


export default function DashboardCards() {
  const { t, i18n } = useTranslation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [ready, setReady] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [metrics, setMetrics] = useState<MetricCard[]>([
    {
      titleKey: 'dashboard.totalEmployee',
      value: '...', // Placeholder for loading
      change: '12%',
      isPositive: true,
      dateKey: 'dashboard.updateDate',
      iconBg: 'bg-blue-50 text-blue-600',
      iconBgDark: 'bg-blue-900/20 text-blue-400',
      icon: <Users className="w-5 h-5" />
    },
    {
      titleKey: 'dashboard.totalApplicant',
      value: '30', 
      change: '5%',
      isPositive: true,
      dateKey: 'dashboard.updateDate',
      iconBg: 'bg-green-50 text-green-600',
      iconBgDark: 'bg-green-900/20 text-green-400',
      icon: <ClipboardList className="w-5 h-5" />
    },
    {
      titleKey: 'dashboard.todayAttendance',
      value: '20', 
      change: '8%',
      isPositive: false,
      dateKey: 'dashboard.updateDate',
      iconBg: 'bg-red-50 text-red-600',
      iconBgDark: 'bg-red-900/20 text-red-400',
      icon: <BarChart2 className="w-5 h-5" />
    },
    {
      titleKey: 'dashboard.totalProjects',
      value: '12', 
      change: '12%',
      isPositive: true,
      dateKey: 'dashboard.updateDate',
      iconBg: 'bg-purple-50 text-purple-600',
      iconBgDark: 'bg-purple-900/20 text-purple-400',
      icon: <Folder className="w-5 h-5" />
    }
  ]);

  useEffect(() => {
    const fetchTotalEmployees = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/employees/count/total`, {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${AUTH_TOKEN}`,
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setMetrics(prevMetrics =>
          prevMetrics.map(metric =>
            metric.titleKey === 'dashboard.totalEmployee'
              ? { ...metric, value: data.totalEmployees.toString() }
              : metric
          )
        );
      } catch (error) {
        console.error("Failed to fetch total employees:", error);
        // Optionally set an error state for this metric
        setMetrics(prevMetrics =>
          prevMetrics.map(metric =>
            metric.titleKey === 'dashboard.totalEmployee'
              ? { ...metric, value: 'Error' }
              : metric
          )
        );
      }
    };

    fetchTotalEmployees();

    // NOTE: In a real application, you would also fetch the other metrics here.
    // For now, they will remain as static values.
    // fetchTotalApplicants();
    // fetchTodayAttendance();
    // fetchTotalProjects();

  }, []);


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

    if (i18n.isInitialized) {
      setReady(true)
    } else {
      const onInit = () => setReady(true)
      i18n.on('initialized', onInit)
      return () => i18n.off('initialized', onInit)
    }

    const timer = setInterval(() => setCurrentDate(new Date()), 60000);

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(timer);
    }
  }, [i18n])

  if (!ready) return null

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