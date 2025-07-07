'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface Employee {
  name: string
  designation: string
  type: string
  checkInTime: string
  status: 'On Time' | 'Late'
  avatar: string
}


const employees: Employee[] = [
  {
    name: 'Sarah Johnson',
    designation: 'Software Engineer',
    type: 'Full-time',
    checkInTime: '09:00 AM',
    status: 'On Time',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Michael Chen',
    designation: 'Product Manager',
    type: 'Full-time',
    checkInTime: '09:15 AM',
    status: 'Late',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Emma Davis',
    designation: 'UX Designer',
    type: 'Part-time',
    checkInTime: '10:00 AM',
    status: 'On Time',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'James Wilson',
    designation: 'DevOps Engineer',
    type: 'Full-time',
    checkInTime: '09:30 AM',
    status: 'Late',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  },
  {
    name: 'Lisa Rodriguez',
    designation: 'Marketing Manager',
    type: 'Full-time',
    checkInTime: '08:45 AM',
    status: 'On Time',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face'
  }
]

export default function AttendanceTable() {
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

  return (
    <div className={`p-6 rounded-xl shadow-sm transition-colors duration-200 ${
      isDarkMode ? 'bg-gray-900' : 'bg-white'
    }`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={`text-lg font-semibold transition-colors duration-200 ${
          isDarkMode ? 'text-white' : 'text-gray-800'
        }`}>
          Attendance Overview
        </h3>
        <a 
          href="#" 
          className={`text-sm font-medium transition-colors duration-200 ${
            isDarkMode 
              ? 'text-indigo-400 hover:text-indigo-300' 
              : 'text-indigo-500 hover:text-indigo-600'
          }`}
        >
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`border-b transition-colors duration-200 ${
              isDarkMode ? 'border-gray-700' : 'border-gray-200'
            }`}>
              <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Employee Name
              </th>
              <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Designation
              </th>
              <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Type
              </th>
              <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Check In Time
              </th>
              <th className={`text-left py-3 px-3 text-xs font-semibold uppercase tracking-wider transition-colors duration-200 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className={`text-center text-sm py-6 transition-colors duration-200 ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  No attendance records found.
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={index} className={`border-b transition-colors duration-200 ${
                  isDarkMode ? 'border-gray-800' : 'border-gray-50'
                }`}>
                  <td className="py-4 px-3">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
                        <Image
                          src={employee.avatar}
                          alt={employee.name}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <span className={`font-medium text-sm transition-colors duration-200 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {employee.name}
                      </span>
                    </div>
                  </td>
                  <td className={`py-4 px-3 text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {employee.designation}
                  </td>
                  <td className={`py-4 px-3 text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>
                    {employee.type}
                  </td>
                  <td className={`py-4 px-3 text-sm transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-200' : 'text-gray-900'
                  }`}>
                    {employee.checkInTime}
                  </td>
                  <td className="py-4 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'On Time'
                          ? isDarkMode
                            ? 'bg-green-900 text-green-200'
                            : 'bg-green-100 text-green-800'
                          : isDarkMode
                          ? 'bg-red-900 text-red-200'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}