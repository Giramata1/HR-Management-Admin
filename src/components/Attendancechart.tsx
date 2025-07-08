'use client'

import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const data = [
  { day: 'Mon', Present: 60, Late: 30, Absent: 10 },
  { day: 'Tue', Present: 60, Late: 25, Absent: 15 },
  { day: 'Wed', Present: 45, Late: 35, Absent: 20 },
  { day: 'Thu', Present: 60, Late: 25, Absent: 15 },
  { day: 'Fri', Present: 75, Late: 15, Absent: 10 },
  { day: 'Sat', Present: 45, Late: 40, Absent: 15 },
  { day: 'Sun', Present: 45, Late: 40, Absent: 15 },
]

const getBarSize = (width: number) => {
  if (width < 640) return 8; // Mobile
  if (width < 1024) return 10; // Tablet
  return 12; // Desktop
}

const getGapSize = (width: number) => {
  if (width < 640) return 1; // Mobile
  if (width < 1024) return 1.5; // Tablet
  return 2; // Desktop
}

const AttendanceChart = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024)

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const transformedData = data.map(item => ({
    day: item.day,
    Present: item.Present,
    Gap1: getGapSize(windowWidth),
    Late: item.Late,
    Gap2: getGapSize(windowWidth),
    Absent: item.Absent,
  }))

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
      attributeFilter: ['class'],
    })

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme') checkTheme()
    }
    window.addEventListener('storage', handleStorageChange)

    return () => {
      observer.disconnect()
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  const chartHeight = windowWidth < 640 ? 280 : windowWidth < 1024 ? 320 : 360

  return (
    <div
      className={`p-4 sm:p-6 md:p-8 lg:p-10 rounded-xl shadow-sm w-full max-w-full sm:max-w-3xl md:max-w-4xl mx-auto transition-colors duration-200 ${
        isDarkMode ? 'bg-gray-900' : 'bg-white'
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
        <h3
          className={`text-sm sm:text-base md:text-lg font-semibold transition-colors duration-200 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}
        >
          Attendance Overview
        </h3>
        <select
          className={`text-xs sm:text-sm border rounded px-2 py-1 sm:px-3 sm:py-1.5 w-full sm:w-auto transition-colors duration-200 ${
            isDarkMode
              ? 'bg-gray-800 border-gray-600 text-white'
              : 'bg-white border-gray-300 text-gray-700'
          }`}
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <ResponsiveContainer width="100%" height={chartHeight}>
        <BarChart data={transformedData}>
          <XAxis
            dataKey="day"
            tick={{
              fontSize: windowWidth < 640 ? 12 : 14,
              fill: isDarkMode ? '#9CA3AF' : '#374151',
            }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(val) => `${val}%`}
            tick={{
              fontSize: windowWidth < 640 ? 12 : 14,
              fill: isDarkMode ? '#9CA3AF' : '#374151',
            }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: isDarkMode ? '#1F2937' : '#FFFFFF',
              border: isDarkMode ? '1px solid #374151' : '1px solid #E5E7EB',
              borderRadius: '8px',
              color: isDarkMode ? '#FFFFFF' : '#374151',
              boxShadow: isDarkMode
                ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                : '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
              fontSize: windowWidth < 640 ? '12px' : '14px',
              padding: windowWidth < 640 ? '6px' : '8px',
            }}
            formatter={(val, name) => {
              if (name === 'Gap1' || name === 'Gap2') return null
              return [`${val}%`, name]
            }}
            labelFormatter={(label) => `${label}`}
          />
          <Bar
            dataKey="Present"
            stackId="a"
            fill="#6366F1"
            radius={[8, 8, 8, 8]}
            barSize={getBarSize(windowWidth)}
          />
          <Bar
            dataKey="Gap1"
            stackId="a"
            fill="transparent"
            barSize={getBarSize(windowWidth)}
          />
          <Bar
            dataKey="Late"
            stackId="a"
            fill="#FBBF24"
            radius={[8, 8, 8, 8]}
            barSize={getBarSize(windowWidth)}
          />
          <Bar
            dataKey="Gap2"
            stackId="a"
            fill="transparent"
            barSize={getBarSize(windowWidth)}
          />
          <Bar
            dataKey="Absent"
            stackId="a"
            fill="#EF4444"
            radius={[8, 8, 8, 8]}
            barSize={getBarSize(windowWidth)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AttendanceChart