'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  UserRound,
  CalendarCheck,
  FolderKanban,
  Leaf,
  PencilLine,
  Briefcase,
  FileText,
  Lock,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlusCircle,
} from 'lucide-react'
import { useLeave } from '@/contexts/LeaveContext'

// Mock AuthContext for this example
const useAuth = () => ({
  user: { fullName: 'John Doe', role: 'HR Manager', profileImage: undefined },
})

type Employee = {
  id: number
  name: string
  employeeId: string
  department: string
  designation: string
  type: string
  status: string
  avatar: string
  personalInfo: {
    dateOfBirth?: string
    gender?: string
    address?: string
    city?: string
    zipCode?: string
    country?: string
    maritalStatus?: string
    nationality?: string
    email?: string
    phone?: string
  }
  professionalInfo: {
    employeeId?: string
    userName?: string
    employeeType?: string
    emailAddress?: string
    department?: string
    designation?: string
    workingDays?: string
    joiningDate?: string
    officeLocation?: string
  }
}

type AttendanceRecord = {
  id: number
  date: string
  checkIn: string
  checkOut: string
  breakTime: string
  workingHours: string
  status: 'Present' | 'Late' | 'Absent' | 'Half Day' | 'On Time'
  remarks?: string
}

interface EmployeeProfileProps {
  employee: Employee
}

// Component for rendering employee avatar with fallback
const EmployeeAvatar = ({ src, name }: { src: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
  src={imgSrc}
  alt={name}
  width={36}
  height={36}
  className="w-9 h-9 rounded-full object-cover"
  onError={() =>
    setImgSrc(
      `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=36`
    )
  }
/>
  )
}

const EmployeeProfile = ({ employee }: EmployeeProfileProps) => {
  const { user } = useAuth()
  const { getLeavesByEmployee, addLeave, updateLeaveStatus } = useLeave()
  const [activeTab, setActiveTab] = useState('personal')
  const [activeSection, setActiveSection] = useState('profile')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
  const [leaveForm, setLeaveForm] = useState({
    type: 'Casual Leave',
    from: '',
    to: '',
    reason: '',
  })

  const { name = 'Unknown', designation = 'Unknown', avatar = 'https://via.placeholder.com/80', personalInfo = {}, professionalInfo = {} } = employee || {}

  const employeeLeaveRecords = getLeavesByEmployee(name)

  const attendanceRecords: AttendanceRecord[] = [
    { id: 1, date: 'July 01, 2023', checkIn: '09:28 AM', checkOut: '07:00 PM', breakTime: '00:30 Min', workingHours: '09:02 Hrs', status: 'On Time' },
    { id: 2, date: 'July 02, 2023', checkIn: '09:20 AM', checkOut: '07:00 PM', breakTime: '00:30 Min', workingHours: '09:10 Hrs', status: 'On Time' },
    { id: 3, date: 'July 03, 2023', checkIn: '09:25 AM', checkOut: '07:00 PM', breakTime: '00:30 Min', workingHours: '09:05 Hrs', status: 'On Time' },
    { id: 4, date: 'July 04, 2023', checkIn: '09:45 AM', checkOut: '07:00 PM', breakTime: '00:40 Min', workingHours: '08:35 Hrs', status: 'Late' },
    { id: 5, date: 'July 05, 2023', checkIn: '10:00 AM', checkOut: '07:00 PM', breakTime: '00:30 Min', workingHours: '08:30 Hrs', status: 'Late' },
    { id: 6, date: 'July 06, 2023', checkIn: '09:28 AM', checkOut: '07:00 PM', breakTime: '00:30 Min', workingHours: '09:02 Hrs', status: 'On Time' },
    { id: 7, date: 'July 07, 2023', checkIn: '09:30 AM', checkOut: '07:00 PM', breakTime: '00:15 Min', workingHours: '09:15 Hrs', status: 'On Time' },
    { id: 8, date: 'July 08, 2023', checkIn: '09:52 AM', checkOut: '07:00 PM', breakTime: '00:45 Min', workingHours: '08:23 Hrs', status: 'Late' },
    { id: 9, date: 'July 09, 2023', checkIn: '09:10 AM', checkOut: '07:00 PM', breakTime: '00:30 Min', workingHours: '09:20 Hrs', status: 'On Time' },
    { id: 10, date: 'July 10, 2023', checkIn: '09:48 AM', checkOut: '07:00 PM', breakTime: '00:42 Min', workingHours: '08:30 Hrs', status: 'Late' },
  ]

  type StatusType = 'On Time' | 'Late' | 'Present' | 'Absent' | 'Half Day' | 'Completed' | 'In Process' | 'approved' | 'pending' | 'rejected'

  const getStatusColor = (status: StatusType | string) => {
    const baseColors: Record<StatusType, string> = {
      'On Time': isDarkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50',
      Late: isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50',
      Present: isDarkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50',
      Absent: isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50',
      'Half Day': isDarkMode ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-600 bg-yellow-50',
      Completed: isDarkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50',
      'In Process': isDarkMode ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-600 bg-yellow-50',
      approved: isDarkMode ? 'text-green-400 bg-green-900/30' : 'text-green-600 bg-green-50',
      pending: isDarkMode ? 'text-yellow-400 bg-yellow-900/30' : 'text-yellow-600 bg-yellow-50',
      rejected: isDarkMode ? 'text-red-400 bg-red-900/30' : 'text-red-600 bg-red-50',
    }
    return baseColors[status as StatusType] || (isDarkMode ? 'text-gray-400 bg-gray-800' : 'text-gray-600 bg-gray-50')
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Time':
      case 'Present':
      case 'approved':
        return <CheckCircle className="w-4 h-4" />
      case 'Late':
        return <AlertCircle className="w-4 h-4" />
      case 'Absent':
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      case 'Half Day':
      case 'pending':
        return <Clock className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark')
    setIsDarkMode(isDark)
    console.log('Syncing dark mode:', isDark)
  }, [])

  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-white',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-800',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    borderB: isDarkMode ? 'border-b-gray-700' : 'border-b-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    hoverAlt: isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-gray-300 text-gray-900',
    tableBg: isDarkMode ? 'bg-gray-800' : 'bg-gray-50',
    activeTab: isDarkMode ? 'bg-violet-900/30 text-violet-400' : 'bg-violet-100 text-violet-600',
    inactiveTab: isDarkMode ? 'text-gray-400 hover:text-violet-400' : 'text-gray-600 hover:bg-gray-100',
    activeSection: isDarkMode ? 'bg-violet-900/30 text-violet-400' : 'bg-violet-100 text-violet-600',
    inactiveSection: isDarkMode ? 'text-gray-400 hover:text-violet-400' : 'text-gray-500 hover:text-violet-600',
    modalBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    modalOverlay: isDarkMode ? 'bg-black/70' : 'bg-black/50',
  }

  const router = useRouter()

  const handleAllEmployeesClick = () => {
    router.push('/employees')
  }

  const handleApplyLeave = () => {
    setIsLeaveModalOpen(true)
  }

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fromDate = new Date(leaveForm.from)
    const toDate = new Date(leaveForm.to)
    const daysDiff = Math.ceil((toDate.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)) + 1

    const newLeave = {
      date: new Date('2025-07-19T22:13:00Z').toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' }),
      duration: `${fromDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })} - ${toDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}`,
      days: `${daysDiff} Day${daysDiff > 1 ? 's' : ''}`,
      employee: name,
      manager: 'Mark Williams',
      status: 'pending' as const,
      reason: leaveForm.reason,
      type: leaveForm.type,
    }

    addLeave(newLeave)
    setIsLeaveModalOpen(false)
    setLeaveForm({ type: 'Casual Leave', from: '', to: '', reason: '' })
  }

  const handleLeaveAction = (id: number, action: 'approved' | 'rejected') => {
    updateLeaveStatus(id, action)
  }

  const isHR = user?.role === 'HR Manager'

  const renderField = (label: string, value?: string) => {
    const displayValue = value || 'Not Available'
    console.log(`Rendering ${label}:`, displayValue)
    return (
      <div>
        <p className={themeClasses.textMuted}>{label}</p>
        <p className="font-medium">{displayValue}</p>
      </div>
    )
  }

  return (
    <div className={`${themeClasses.bg} rounded-xl shadow-sm max-w-7xl mx-auto p-6 space-y-6 min-h-screen transition-colors duration-200`}>
      <div className="flex justify-between items-center flex-wrap">
        <div>
          <h2 className={`text-lg font-semibold ${themeClasses.text}`}>{name}</h2>
          <nav className={`text-sm ${themeClasses.textMuted}`}>
            <button onClick={handleAllEmployeesClick} className={`hover:text-violet-600 ${themeClasses.textMuted}`}>
              All Employees
            </button>{' '}
            <span className={`${themeClasses.text} font-medium`}>{name}</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className={`absolute left-2.5 top-2.5 w-4 h-4 ${themeClasses.textMuted}`} />
            <input
              type="text"
              placeholder="Search"
              className={`border rounded-md px-8 py-1.5 text-sm focus:ring-2 focus:ring-purple-500 ${themeClasses.input}`}
            />
          </div>
          <div className="flex items-center gap-2">
            <EmployeeAvatar
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6b7280&color=fff&size=36`}
              name={user?.fullName || 'User'}
            />
            <div className="leading-tight">
              <p className={`text-sm font-medium ${themeClasses.text}`}>{user?.fullName || 'User'}</p>
              <p className={`text-xs ${themeClasses.textMuted}`}>{user?.role || 'HR Manager'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex justify-between items-center flex-wrap border-b ${themeClasses.borderB} pb-6`}>
        <div className="flex items-center gap-4">
         <Image
  src={avatar}
  alt={name}
  width={80}
  height={80}
  className="w-20 h-20 rounded-full object-cover"
  onError={(e) => {
    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=80`
  }}
/>
          <div>
            <h3 className={`text-xl font-semibold ${themeClasses.text}`}>{name}</h3>
            <p className={`text-sm ${themeClasses.textSecondary}`}>{designation}</p>
            <p className={`text-sm ${themeClasses.textSecondary}`}>{personalInfo.email}</p>
          </div>
        </div>
        <button className="bg-violet-600 text-white px-4 py-2 rounded-md text-sm hover:bg-violet-700 flex items-center gap-2">
          <PencilLine className="w-4 h-4" /> Edit Profile
        </button>
      </div>

      <div className="flex gap-8">
        <div className="w-52 space-y-2 text-sm">
          <button
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeSection === 'profile' ? themeClasses.activeTab : themeClasses.inactiveTab
            }`}
          >
            <UserRound className="w-4 h-4" /> Profile
          </button>
          <button
            onClick={() => setActiveSection('attendance')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeSection === 'attendance' ? themeClasses.activeTab : themeClasses.inactiveTab
            }`}
          >
            <CalendarCheck className="w-4 h-4" /> Attendance
          </button>
          <button
            onClick={() => setActiveSection('projects')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeSection === 'projects' ? themeClasses.activeTab : themeClasses.inactiveTab
            }`}
          >
            <FolderKanban className="w-4 h-4" /> Projects
          </button>
          <button
            onClick={() => setActiveSection('leave')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
              activeSection === 'leave' ? themeClasses.activeTab : themeClasses.inactiveTab
            }`}
          >
            <Leaf className="w-4 h-4" /> Leave
          </button>
        </div>

        <div className="flex-1 space-y-6">
          {activeSection === 'profile' && (
            <>
              <div className={`border-b ${themeClasses.borderB}`}>
                <div className="flex gap-8 text-sm">
                  <button
                    onClick={() => setActiveTab('personal')}
                    className={`flex items-center gap-1 font-medium py-2 transition-colors ${
                      activeTab === 'personal' ? `${themeClasses.activeSection} border-b-2 border-violet-600` : themeClasses.inactiveSection
                    }`}
                  >
                    <UserRound className="w-4 h-4" /> Personal Information
                  </button>
                  <button
                    onClick={() => setActiveTab('professional')}
                    className={`flex items-center gap-1 font-medium py-2 transition-colors ${
                      activeTab === 'professional' ? `${themeClasses.activeSection} border-b-2 border-violet-600` : themeClasses.inactiveSection
                    }`}
                  >
                    <Briefcase className="w-4 h-4" /> Professional Information
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`flex items-center gap-1 font-medium py-2 transition-colors ${
                      activeTab === 'documents' ? `${themeClasses.activeSection} border-b-2 border-violet-600` : themeClasses.inactiveSection
                    }`}
                  >
                    <FileText className="w-4 h-4" /> Documents
                  </button>
                  <button
                    onClick={() => setActiveTab('account')}
                    className={`flex items-center gap-1 font-medium py-2 transition-colors ${
                      activeTab === 'account' ? `${themeClasses.activeSection} border-b-2 border-violet-600` : themeClasses.inactiveSection
                    }`}
                  >
                    <Lock className="w-4 h-4" /> Account Access
                  </button>
                </div>
              </div>

              {activeTab === 'personal' && (
                <div className={`grid grid-cols-2 gap-6 text-sm ${themeClasses.text}`}>
                  {renderField('Date of Birth', personalInfo.dateOfBirth)}
                  {renderField('Gender', personalInfo.gender)}
                  {renderField('Marital Status', personalInfo.maritalStatus)}
                  {renderField('Nationality', personalInfo.nationality)}
                  {renderField('Address', personalInfo.address)}
                  {renderField('City', personalInfo.city)}
                  {renderField('State', personalInfo.country)}
                  {renderField('Zip Code', personalInfo.zipCode)}
                  {renderField('Phone', personalInfo.phone)}
                  {renderField('Email', personalInfo.email)}
                </div>
              )}

              {activeTab === 'professional' && (
                <div className={`grid grid-cols-2 gap-6 text-sm ${themeClasses.text}`}>
                  {renderField('Employee ID', professionalInfo.employeeId)}
                  {renderField('User Name', professionalInfo.userName)}
                  {renderField('Employee Type', professionalInfo.employeeType)}
                  {renderField('Email Address', professionalInfo.emailAddress)}
                  {renderField('Department', professionalInfo.department)}
                  {renderField('Designation', professionalInfo.designation)}
                  {renderField('Working Days', professionalInfo.workingDays)}
                  {renderField('Joining Date', professionalInfo.joiningDate)}
                  <div className="col-span-2">{renderField('Office Location', professionalInfo.officeLocation)}</div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className={`grid grid-cols-2 gap-4 text-sm ${themeClasses.text}`}>
                  {['Appointment Letter.pdf', 'Salary Slip_June.pdf', 'Salary Slip_May.pdf', 'Salary Slip_April.pdf', 'Relieving Letter.pdf', 'Experience Letter.pdf'].map((doc, index) => (
                    <div key={index} className={`flex items-center gap-2 p-2 ${themeClasses.cardBg} ${themeClasses.border} rounded-md`}>
                      <FileText className={`w-4 h-4 ${themeClasses.textMuted}`} />
                      <span className={themeClasses.text}>{doc}</span>
                      <button className={`ml-auto text-violet-600 hover:text-violet-500`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542-7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                      <button className={`text-green-600 hover:text-green-500`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'account' && (
                <div className={`p-6 ${themeClasses.cardBg} ${themeClasses.border} rounded-lg`}>
                  <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Account Access</h3>
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <label className={`block mb-1 font-medium ${themeClasses.textMuted}`}>Email Address</label>
                      <p className={`p-2 rounded-md border ${themeClasses.input}`}>{personalInfo.email || 'Not Available'}</p>
                    </div>
                    <div>
                      <label className={`block mb-1 font-medium ${themeClasses.textMuted}`}>Bank Account Number</label>
                      <p className={`p-2 rounded-md border ${themeClasses.input}`}>**** **** **** 2345</p>
                    </div>
                    <div>
                      <label className={`block mb-1 font-medium ${themeClasses.textMuted}`}>GitHub ID</label>
                      <p className={`p-2 rounded-md border ${themeClasses.input}`}>not-connected</p>
                    </div>
                    <div>
                      <label className={`block mb-1 font-medium ${themeClasses.textMuted}`}>LinkedIn</label>
                      <p className={`p-2 rounded-md border ${themeClasses.input}`}>linkedin.com/in/robert-allen</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {activeSection === 'attendance' && (
            <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className={`${themeClasses.tableBg} border-b ${themeClasses.borderB}`}>
                    <tr>
                      <th className={`text-left p-4 text-sm font-medium ${themeClasses.text}`}>Date</th>
                      <th className={`text-left p-4 text-sm font-medium ${themeClasses.text}`}>Check In</th>
                      <th className={`text-left p-4 text-sm font-medium ${themeClasses.text}`}>Check Out</th>
                      <th className={`text-left p-4 text-sm font-medium ${themeClasses.text}`}>Break Time</th>
                      <th className={`text-left p-4 text-sm font-medium ${themeClasses.text}`}>Working Hours</th>
                      <th className={`text-left p-4 text-sm font-medium ${themeClasses.text}`}>Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${themeClasses.border}`}>
                    {attendanceRecords.map((record) => (
                      <tr key={record.id} className={themeClasses.hover}>
                        <td className={`p-4 text-sm ${themeClasses.text}`}>{record.date}</td>
                        <td className={`p-4 text-sm ${themeClasses.text}`}>{record.checkIn}</td>
                        <td className={`p-4 text-sm ${themeClasses.text}`}>{record.checkOut}</td>
                        <td className={`p-4 text-sm ${themeClasses.text}`}>{record.breakTime}</td>
                        <td className={`p-4 text-sm ${themeClasses.text}`}>{record.workingHours}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                            {getStatusIcon(record.status)}
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'projects' && (
            <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className={`w-full text-sm ${themeClasses.text}`}>
                  <thead className={`${themeClasses.tableBg} border-b ${themeClasses.borderB}`}>
                    <tr>
                      <th className="text-left p-4 font-medium">Sr. No.</th>
                      <th className="text-left p-4 font-medium">Project Name</th>
                      <th className="text-left p-4 font-medium">Start Date</th>
                      <th className="text-left p-4 font-medium">Finish Date</th>
                      <th className="text-left p-4 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${themeClasses.border}`}>
                    {[
                      {
                        id: 1,
                        name: 'Amongus - Discovery Phase',
                        start: 'Feb 01, 2023',
                        finish: 'Mar 05, 2023',
                        status: 'Completed',
                      },
                      {
                        id: 2,
                        name: 'Wildcare - Development Project',
                        start: 'Feb 12, 2023',
                        finish: 'April 20, 2023',
                        status: 'Completed',
                      },
                      {
                        id: 3,
                        name: 'Hingutsan Web Development',
                        start: 'April 05, 2023',
                        finish: 'October 05, 2023',
                        status: 'In Process',
                      },
                      {
                        id: 4,
                        name: 'Montilisi Ecommerce Platform',
                        start: 'May 12, 2023',
                        finish: 'August 12, 2023',
                        status: 'In Process',
                      },
                    ].map((project) => (
                      <tr key={project.id} className={themeClasses.hover}>
                        <td className="p-4">{project.id}</td>
                        <td className="p-4">{project.name}</td>
                        <td className="p-4">{project.start}</td>
                        <td className="p-4">{project.finish}</td>
                        <td className="p-4">
                          <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === 'leave' && (
            <div className={`${themeClasses.cardBg} border ${themeClasses.border} rounded-lg overflow-hidden`}>
              <div className="flex justify-between items-center p-4 border-b ${themeClasses.borderB}">
                <h3 className={`text-lg font-semibold ${themeClasses.text}`}>Leave Records</h3>
                <button
                  onClick={handleApplyLeave}
                  className="bg-violet-600 text-white px-4 py-2 rounded-md text-sm hover:bg-violet-700 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Apply for Leave
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className={`w-full text-sm ${themeClasses.text}`}>
                  <thead className={`${themeClasses.tableBg} border-b ${themeClasses.borderB}`}>
                    <tr>
                      <th className="text-left p-4 font-medium">Leave Type</th>
                      <th className="text-left p-4 font-medium">Date</th>
                      <th className="text-left p-4 font-medium">Duration</th>
                      <th className="text-left p-4 font-medium">Days</th>
                      <th className="text-left p-4 font-medium">Reason</th>
                      <th className="text-left p-4 font-medium">Status</th>
                      {isHR && <th className="text-left p-4 font-medium">Actions</th>}
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${themeClasses.border}`}>
                    {employeeLeaveRecords.map((leave) => (
                      <tr key={leave.id} className={themeClasses.hover}>
                        <td className="p-4">{leave.type}</td>
                        <td className="p-4">{leave.date}</td>
                        <td className="p-4">{leave.duration}</td>
                        <td className="p-4">{leave.days}</td>
                        <td className="p-4">{leave.reason}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}>
                            {getStatusIcon(leave.status)}
                            {leave.status.charAt(0).toUpperCase() + leave.status.slice(1)}
                          </span>
                        </td>
                        {isHR && (
                          <td className="p-4">
                            {leave.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleLeaveAction(leave.id, 'approved')}
                                  className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleLeaveAction(leave.id, 'rejected')}
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
            </div>
          )}
        </div>
      </div>

      {isLeaveModalOpen && (
        <div className={`fixed inset-0 ${themeClasses.modalOverlay} flex items-center justify-center z-50`}>
          <div className={`${themeClasses.modalBg} rounded-lg p-6 w-full max-w-md shadow-xl`}>
            <h3 className={`text-lg font-semibold mb-4 ${themeClasses.text}`}>Apply for Leave</h3>
            <form onSubmit={handleLeaveSubmit} className="space-y-4">
              <div>
                <label className={`block mb-1 font-medium ${themeClasses.textMuted}`}>Leave Type</label>
                <select
                  value={leaveForm.type}
                  onChange={(e) => setLeaveForm({ ...leaveForm, type: e.target.value })}
                  className={`w-full p-2 rounded-md border ${themeClasses.input}`}
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Annual Leave">Annual Leave</option>
                </select>
              </div>
              <div>
                <label className={`block mb-1 font-medium ${themeClasses.textMuted}`}>From</label>
                <input
                  type="date"
                  value={leaveForm.from}
                  onChange={(e) => setLeaveForm({ ...leaveForm, from: e.target.value })}
                  className={`w-full p-2 rounded-md border ${themeClasses.input}`}
                  required
                />
              </div>
              <div>
                <label className={`block mb-1 font-medium ${themeClasses.textMuted}`}>To</label>
                <input
                  type="date"
                  value={leaveForm.to}
                  onChange={(e) => setLeaveForm({ ...leaveForm, to: e.target.value })}
                  className={`w-full p-2 rounded-md border ${themeClasses.input}`}
                  required
                />
              </div>
              <div>
                <label className={`block mb-1 font-medium ${themeClasses.textMuted}`}>Reason</label>
                <textarea
                  value={leaveForm.reason}
                  onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
                  className={`w-full p-2 rounded-md border ${themeClasses.input}`}
                  rows={4}
                  placeholder="Enter reason for leave"
                  required
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsLeaveModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-violet-600 text-white px-4 py-2 rounded-md text-sm hover:bg-violet-700"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmployeeProfile