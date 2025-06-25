'use client'

import { useState } from 'react'
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

interface ScheduleItem {
  time: string
  role: string
  task: string
}

// Example schedule data keyed by ISO date string (yyyy-MM-dd)
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
  const [currentMonth, setCurrentMonth] = useState(new Date(2023, 6)) // July 2023
  const [selectedDate, setSelectedDate] = useState(new Date(2023, 6, 6))

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const dayHeaders = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const getScheduledDates = () => {
    const scheduledDates: Date[] = []
    Object.keys(scheduleData).forEach(dateKey => {
      const date = new Date(dateKey)
      if (isSameMonth(date, currentMonth)) {
        scheduledDates.push(date)
      }
    })
    return scheduledDates
  }

  const scheduledDates = getScheduledDates()

  return (
    <div className="bg-white rounded-2xl shadow-sm max-w-md mx-auto overflow-hidden">
      <div className="flex justify-between items-center p-8 pb-6">
        <h2 className="text-2xl font-bold text-gray-900">My Schedule</h2>
        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
          <Calendar className="w-6 h-6 text-purple-600" />
        </div>
      </div>

      <div className="px-8 pb-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevMonth}
            className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white hover:bg-purple-700"
          >
            ←
          </button>
          <h3 className="text-xl font-semibold text-gray-900">
            {format(currentMonth, 'MMMM, yyyy')}
          </h3>
          <button
            onClick={handleNextMonth}
            className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center text-white hover:bg-purple-700"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 px-8 mb-4">
        {dayHeaders.map((day) => (
          <div key={day} className="text-center text-base font-medium text-gray-500 py-3">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2 px-8 mb-6">
        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isSelected = isSameDay(day, selectedDate)
          const isScheduled = scheduledDates.some(scheduledDate => isSameDay(scheduledDate, day))

          return (
            <button
              key={day.toString()}
              onClick={() => setSelectedDate(day)}
              className={`aspect-square flex items-center justify-center text-lg rounded-xl cursor-pointer transition-colors
                ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : isScheduled && isCurrentMonth
                    ? 'bg-purple-100 text-purple-600'
                    : isCurrentMonth
                    ? 'hover:bg-gray-100 text-gray-900'
                    : 'text-gray-300'
                }
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      <div className="px-8 pb-8">
        {Object.keys(scheduleData).map((dateKey) => {
          const scheduleDate = new Date(dateKey)
          if (!isSameMonth(scheduleDate, currentMonth)) return null
          
          return (
            <div key={dateKey} className="mb-8 last:mb-0">
              <div className="flex justify-between items-center mb-4">
                <div className="text-base font-medium text-gray-900">
                  {format(scheduleDate, 'EEEE, dd MMMM yyyy')}
                </div>
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </div>
              
              <div className="space-y-6">
                {scheduleData[dateKey].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex flex-col items-center mr-6">
                      <div className="text-base font-bold text-gray-900 mb-2">
                        {item.time}
                      </div>
                      {index < scheduleData[dateKey].length - 1 && (
                        <div className="w-px h-10 bg-purple-200"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-3">
                      <div className="text-sm text-gray-500 mb-2">{item.role}</div>
                      <div className="text-base font-semibold text-gray-900">{item.task}</div>
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