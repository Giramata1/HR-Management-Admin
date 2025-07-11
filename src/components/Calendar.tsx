'use client'

import { useState, useEffect } from 'react'
import { Calendar, MoreVertical } from 'lucide-react'
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
} from 'date-fns'
import { enUS, fr } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'

interface ScheduleItem {
  time: string
  role: string
  task: string
}

const scheduleData: Record<string, ScheduleItem[]> = {
  '2023-07-06': [
    { time: '09:30', role: 'UI/UX Designer', task: 'Practical Task Review' },
    { time: '12:00', role: 'Magento Developer', task: 'Resume Review' },
    { time: '01:30', role: 'Sales Manager', task: 'Final HR Round' }
  ],
  '2023-07-07': [
    { time: '09:30', role: 'Front end Developer', task: 'Practical Task Review' },
    { time: '11:00', role: 'React JS', task: 'TL Meeting' }
  ]
}

export default function ScheduleCalendar() {
  const { t, i18n } = useTranslation()

  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 6))
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 6, 6))
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Wait until client side to render, to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)

    const checkTheme = () => {
      const savedTheme = localStorage.getItem('theme')
      const hasDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(savedTheme === 'dark' || hasDark)
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
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

  if (!mounted) {
    return null // or loading spinner placeholder
  }

  const locale = i18n.language === 'fr' ? fr : enUS

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const getScheduledDates = () => {
    return Object.keys(scheduleData)
      .map(dateKey => new Date(dateKey))
      .filter(date => isSameMonth(date, currentMonth))
  }

  const scheduledDates = getScheduledDates()
  const dayHeaders = t('schedule.dayHeaders', { returnObjects: true }) as string[]

  return (
    <div className={`rounded-2xl shadow-sm mx-auto overflow-hidden transition-colors duration-200 w-full max-w-4xl
      ${isDarkMode ? 'bg-gray-800' : 'bg-white'}
    `}>
      {/* Header */}
      <div className="flex justify-between items-center p-4 sm:p-6 md:p-8">
        <h2 className={`text-lg sm:text-xl md:text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {t('schedule.title')}
        </h2>
        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center 
          ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-100'}`}>
          <Calendar className={`w-5 h-5 sm:w-6 sm:h-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
        </div>
      </div>

      {/* Month Navigation */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 pb-4">
        <button
          onClick={handlePrevMonth}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl text-white hover:bg-purple-700"
        >←</button>
        <h3 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
          {format(currentMonth, 'MMMM, yyyy', { locale })}
        </h3>
        <button
          onClick={handleNextMonth}
          className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600 rounded-xl text-white hover:bg-purple-700"
        >→</button>
      </div>

      {/* Day Headers */}
      <div className="grid grid-cols-7 gap-2 px-4 sm:px-6 md:px-8 text-center mb-2 sm:mb-4">
        {dayHeaders.map((day) => (
          <div key={day} className={`text-sm sm:text-base font-medium py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2 px-4 sm:px-6 md:px-8 mb-4 sm:mb-6">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = isSameDay(day, selectedDate)
          const isScheduled = scheduledDates.some(scheduledDate => isSameDay(scheduledDate, day))

          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square flex items-center justify-center text-sm sm:text-base rounded-xl transition-colors duration-200
                ${isSelected
                  ? 'bg-purple-600 text-white'
                  : isScheduled && isCurrentMonth
                  ? isDarkMode
                    ? 'bg-purple-900/20 text-purple-400'
                    : 'bg-purple-100 text-purple-600'
                  : isCurrentMonth
                  ? isDarkMode
                    ? 'hover:bg-gray-700 text-gray-200'
                    : 'hover:bg-gray-100 text-gray-900'
                  : isDarkMode
                  ? 'text-gray-600'
                  : 'text-gray-300'
                }`}
            >
              {format(day, 'd', { locale })}
            </button>
          )
        })}
      </div>

      {/* Schedule Items */}
      <div className="px-4 sm:px-6 md:px-8 pb-8">
        {Object.keys(scheduleData).map((dateKey) => {
          const scheduleDate = new Date(dateKey)
          if (!isSameMonth(scheduleDate, currentMonth)) return null

          return (
            <div key={dateKey} className="mb-6 last:mb-0">
              <div className="flex justify-between items-center mb-4">
                <div className={`text-sm sm:text-base font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                  {format(scheduleDate, 'EEEE, dd MMMM yyyy', { locale })}
                </div>
                <MoreVertical className={`w-4 h-4 sm:w-5 sm:h-5 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              </div>

              <div className="space-y-6">
                {scheduleData[dateKey].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-4 sm:mr-6">
                      <div className={`text-sm sm:text-base font-bold mb-2 ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {item.time}
                      </div>
                      {index < scheduleData[dateKey].length - 1 && (
                        <div className={`w-px h-8 sm:h-10 ${isDarkMode ? 'bg-purple-700' : 'bg-purple-200'}`}></div>
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className={`text-xs sm:text-sm mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {t(`schedule.roles.${item.role}`, item.role)}
                      </div>
                      <div className={`text-sm sm:text-base font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                        {t(`schedule.tasks.${item.task}`, item.task)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
