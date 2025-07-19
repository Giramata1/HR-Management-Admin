'use client'

import React, { useState, useEffect } from 'react'
import { Search, Bell, ChevronDown, CheckCircle, XCircle, Clock } from 'lucide-react'
import { useLeave } from '@/contexts/LeaveContext'
import Image from 'next/image'

type User = {
  fullName: string
  role: string
  profileImage?: string
}

// Mock AuthContext for this example
const useAuth = () => ({ 
  user: { fullName: 'John Doe', role: 'HR Manager' } as User 
})

const EmployeeAvatar = ({ src, name }: { src: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
  src={imgSrc}
  alt={name}
  width={40}
  height={40}
  className="rounded-full w-10 h-10 object-cover"
  onError={() =>
    setImgSrc(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=40`
    )
  }
/>
  )
}

const LeaveManagementPage = () => {
  const { user } = useAuth()
  const { leaveRecords, updateLeaveStatus } = useLeave()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)

  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    borderB: isDarkMode ? 'border-b-gray-700' : 'border-b-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    tableBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900',
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = 'inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide'
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`
      default:
        return baseClasses
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'pending':
        return <Clock className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return null
    }
  }

  const filteredData = leaveRecords.filter(
    (item) =>
      item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.reason.toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
  }, [])

  const isHR = user?.role === 'HR Manager'

  return (
    <div className={`${themeClasses.bg} min-h-screen transition-colors duration-200`}>
      <header className={`${themeClasses.cardBg} shadow-sm border-b ${themeClasses.borderB}`}>
        <div className="px-6 py-5 lg:px-10">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className={`text-2xl font-semibold ${themeClasses.text} mb-1`}>Leaves</h1>
            </div>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none h-5 w-5 ${themeClasses.textMuted}`} />
                <input
                  type="text"
                  placeholder="Search leaves..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 ${themeClasses.input}`}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`p-2 ${themeClasses.textMuted} hover:text-gray-600 dark:hover:text-gray-300 transition-colors`}>
                <Bell className="h-6 w-6" />
              </button>
              <div className={`flex items-center space-x-3 cursor-pointer ${themeClasses.hover} rounded-lg p-2 transition-colors`}>
                <EmployeeAvatar
                  src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6b7280&color=fff&size=40`}
                  name={user?.fullName || 'User'}
                />
                <div className="flex flex-col">
                  <span className={`text-sm font-semibold ${themeClasses.text}`}>{user?.fullName || 'User'}</span>
                  <span className={`text-xs ${themeClasses.textMuted}`}>{user?.role || 'HR Manager'}</span>
                </div>
                <ChevronDown className={`h-4 w-4 ${themeClasses.textMuted}`} />
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="px-6 py-8 lg:px-10">
        <div className={`${themeClasses.cardBg} rounded-xl shadow-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${themeClasses.border}`}>
              <thead className={`${themeClasses.tableBg}`}>
                <tr>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>Date</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>Type</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>Duration</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>Days</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>Employee</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>Reason</th>
                  <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>Status</th>
                  {isHR && (
                    <th className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className={`divide-y ${themeClasses.border}`}>
                {filteredData.map((item) => (
                  <tr key={item.id} className={`${themeClasses.hover} transition-colors duration-150`}>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.text}`}>{item.date}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium ${themeClasses.textSecondary}`}>{item.type}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium ${themeClasses.textSecondary}`}>{item.duration}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.text}`}>{item.days}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium ${themeClasses.text}`}>{item.employee}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.textSecondary}`}>{item.reason}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={getStatusBadge(item.status)}>
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    {isHR && (
                      <td className="px-6 py-5 whitespace-nowrap">
                        {item.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateLeaveStatus(item.id, 'approved')}
                              className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateLeaveStatus(item.id, 'rejected')}
                              className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700"
                            >
                              Reject
                            </button>
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className={themeClasses.textMuted}>No leave requests found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default LeaveManagementPage