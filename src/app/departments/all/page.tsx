'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  Search,
  Bell,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Filter,
  Plus,
} from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/components/AuthContext'
import Image from 'next/image'

// Utility Components
const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input
    className={`py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
      className || ''
    }`}
    {...props}
  />
)

const Button = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
  <button
    className={`px-3 py-2 rounded-md text-sm transition-colors ${
      className || ''
    }`}
    {...props}
  >
    {children}
  </button>
)

const Avatar = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div
    className={`rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white font-semibold flex items-center justify-center ${
      className || ''
    }`}
  >
    {children}
  </div>
)

const AvatarFallback = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  <div className={`w-full h-full flex items-center justify-center ${className || ''}`}>
    {children}
  </div>
)

// Component for rendering authenticated user's avatar with fallback
const EmployeeAvatar = ({ src, name }: { src: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
      src={imgSrc}
      alt={name}
      width={40}
      height={40}
      className="rounded-full h-8 w-8 sm:h-10 sm:w-10 object-cover"
      onError={() =>
        setImgSrc(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=40`
        )
      }
    />
  )
}

// Dynamic department translation keys
const departmentTitles: Record<string, string> = {
  sale: 'departments.sale',
  design: 'departments.design',
  'project-manager': 'departments.projectManager',
  marketing: 'departments.marketing',
}

// Interface for API employee data
interface ApiEmployee {
  id: string
  personal: {
    firstName: string
    lastName: string
    mobileNumber: string
    emailAddress: string
    dateOfBirth: string
    maritalStatus: string
    gender: string
    nationality: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  professional: {
    employeeID: string
    userName: string
    employeeType: string
    emailAddress: string
    department: string
    designation: string
    joiningDate: string
    officeLocation: string
  }
  photo?: string
  documents?: { name: string; url: string }[]
  accountAccess?: {
    emailAddress: string
    slackId: string
    skypeId: string
    githubId: string
  }
}

interface Employee {
  id: string
  name: string
  title: string
  avatar: string
  type: string
  status: string
}

const DepartmentDetail = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { user } = useAuth()
  const params = useParams()
  const slug = (params.department as string)?.toLowerCase()
  const department = t(departmentTitles[slug] || 'departments.default')

  const [isDarkMode, setIsDarkMode] = useState(
    theme === 'dark' ||
    (theme === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  )

  useEffect(() => {
    setIsDarkMode(
      theme === 'dark' ||
      (theme === 'auto' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    )
  }, [theme])

  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilter, setShowFilter] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [showAddEmployee, setShowAddEmployee] = useState(false)
  const [showViewEmployee, setShowViewEmployee] = useState(false)
  const [showUpdateEmployee, setShowUpdateEmployee] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employeeForm, setEmployeeForm] = useState({
    employeeId: '',
    employeeName: '',
    designation: '',
    type: 'Office',
    status: 'Permanent',
  })
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  const itemsPerPage = 10

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/employees')
        if (!response.ok) {
          throw new Error('Failed to fetch employees')
        }
        const data: ApiEmployee[] = await response.json()
        const transformedEmployees = data
          .filter((emp) => emp.professional.department.toLowerCase() === slug)
          .map((emp) => ({
            id: emp.professional.employeeID || emp.id,
            name: `${emp.personal.firstName} ${emp.personal.lastName}`.trim() || 'Unknown',
            title: emp.professional.designation || 'N/A',
            avatar: emp.photo || '',
            type: emp.professional.employeeType || 'office',
            status: 'permanent', // Default status, as API doesn't provide one
          }))
        setEmployees(transformedEmployees)
      } catch (error) {
        console.error('Error fetching employees:', error)
        // Fallback to static data if API fails
        setEmployees([
          {
            id: '345321231',
            name: 'Darlene Robertson',
            title: t('employees.roles.leadUIUXDesigner'),
            avatar: '',
            type: 'office',
            status: 'permanent',
          },
          {
            id: '987890345',
            name: 'Floyd Miles',
            title: t('employees.roles.leadUIUXDesigner'),
            avatar: '',
            type: 'office',
            status: 'permanent',
          },
          {
            id: '453367122',
            name: 'Cody Fisher',
            title: t('employees.roles.srUIUXDesigner'),
            avatar: '',
            type: 'office',
            status: 'permanent',
          },
          {
            id: '999999999',
            name: 'Dianne Russell',
            title: t('employees.roles.srUIUXDesigner'),
            avatar: '',
            type: 'remote',
            status: 'permanent',
          },
        ])
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [slug, t])

  const getInitials = (name: string) => {
    const words = name.trim().split(' ')
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase()
  }

  // Filters
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = typeFilter ? emp.type === typeFilter : true
    const matchesStatus = statusFilter ? emp.status === statusFilter : true
    return matchesSearch && matchesType && matchesStatus
  })

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  )

  // Fixed: Explicitly type the event parameter
  const handleEmployeeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setEmployeeForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // Post to API
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: employeeForm.employeeName.split(' ')[0] || '',
          lastName: employeeForm.employeeName.split(' ').slice(1).join(' ') || '',
          employeeID: employeeForm.employeeId,
          designation: employeeForm.designation,
          employeeType: employeeForm.type.toLowerCase(),
          department: slug,
          emailAddress: '',
          mobileNumber: '',
          dateOfBirth: '',
          maritalStatus: '',
          gender: '',
          nationality: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
          userName: employeeForm.employeeName.toLowerCase().replace(/\s+/g, '.'),
          joiningDate: '',
          officeLocation: '',
        }),
      })
      if (response.ok) {
        const { id } = await response.json()
        setEmployees((prev) => [
          ...prev,
          {
            id: employeeForm.employeeId || id,
            name: employeeForm.employeeName,
            title: employeeForm.designation,
            avatar: '',
            type: employeeForm.type.toLowerCase(),
            status: employeeForm.status.toLowerCase(),
          },
        ])
        setShowAddEmployee(false)
        setEmployeeForm({ employeeId: '', employeeName: '', designation: '', type: 'Office', status: 'Permanent' })
      } else {
        throw new Error('Failed to add employee')
      }
    } catch (error) {
      console.error('Error adding employee:', error)
    }
  }

  // Fixed: Explicitly type the event parameter
  const handleUpdateEmployeeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setEmployeeForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdateEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedEmployee) {
      try {
        // Simulate update (API doesn't have PUT endpoint yet)
        setEmployees((prev) =>
          prev.map((emp) =>
            emp.id === selectedEmployee.id
              ? { ...emp, ...employeeForm, title: employeeForm.designation }
              : emp
          )
        )
        setShowUpdateEmployee(false)
        setSelectedEmployee(null)
      } catch (error) {
        console.error('Error updating employee:', error)
      }
    }
  }

  const handleDeleteEmployee = async () => {
    if (selectedEmployee) {
      try {
        // Simulate delete (API doesn't have DELETE endpoint yet)
        setEmployees((prev) => prev.filter((emp) => emp.id !== selectedEmployee.id))
        setShowDeleteConfirm(false)
        setSelectedEmployee(null)
      } catch (error) {
        console.error('Error deleting employee:', error)
      }
    }
  }

  const handleViewEmployee = (emp: Employee) => {
    setSelectedEmployee(emp)
    setShowViewEmployee(true)
  }

  const handleUpdateEmployee = (emp: Employee) => {
    setSelectedEmployee(emp)
    setEmployeeForm({ employeeId: emp.id, employeeName: emp.name, designation: emp.title, type: emp.type, status: emp.status })
    setShowUpdateEmployee(true)
  }

  const handleDeleteConfirm = (emp: Employee) => {
    setSelectedEmployee(emp)
    setShowDeleteConfirm(true)
  }

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        isDarkMode ? 'dark:bg-gray-900' : ''
      } text-gray-900 ${isDarkMode ? 'dark:text-white' : ''}`}
    >
      {/* Header */}
      <div
        className={`bg-white ${isDarkMode ? 'dark:bg-gray-800' : ''} border-b border-gray-200 ${
          isDarkMode ? 'dark:border-gray-700' : ''
        }`}
      >
        <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div>
              <div
                className={`flex items-center space-x-2 text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } mb-1`}
              >
                <Link
                  href="/"
                  className={isDarkMode ? 'hover:text-white' : 'hover:text-gray-700'}
                >
                  {t('departments.all')}
                </Link>
                <span>›</span>
                <span
                  className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {department}
                </span>
              </div>
              <h1
                className={`text-lg sm:text-2xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {department}
              </h1>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative w-full sm:w-48 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Button className="text-gray-400 hover:text-gray-600 dark:hover:text-white border-0 p-2">
                <Bell className="h-5 w-5" />
              </Button>
              <div
                className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 sm:px-3 py-2"
                aria-label={user?.role || t('role.hrManager')}
              >
                <EmployeeAvatar
                  src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6b7280&color=fff&size=40`}
                  name={user?.fullName || 'User'}
                />
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {user?.fullName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {user?.role || t('role.hrManager')}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filter/Search/Add */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-3 relative">
            <Button
              onClick={() => setShowAddEmployee(true)}
              className="bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2 px-3 sm:px-4 py-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('employees.addNew')}</span>
              <span className="sm:hidden">{t('employees.add')}</span>
            </Button>
            <Button
              onClick={() => setShowFilter(!showFilter)}
              className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 px-3 sm:px-4 py-2"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t('employees.filter')}</span>
              <span className="sm:hidden">{t('employees.filterShort')}</span>
            </Button>

            {/* Filter Dropdown */}
            {showFilter && (
              <div className="absolute right-0 top-12 z-10 bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 rounded-md p-4 space-y-3 w-64 sm:w-72">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300">
                    {t('employees.type')}
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">All</option>
                    <option value="office">office</option>
                    <option value="remote">remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">All</option>
                    <option value="permanent">Permanent</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Add New Employee Form */}
        {showAddEmployee && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDarkMode ? 'dark:bg-opacity-75' : ''}`}>
            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? 'dark:shadow-gray-900' : 'shadow-gray-200'}`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>Add New Employee</h2>
              <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.employeeID')}
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={employeeForm.employeeId}
                    onChange={handleEmployeeChange}
                    className={`mt-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-black'} p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder={t('employees.enterEmployeeID')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.employeeName')}
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    value={employeeForm.employeeName}
                    onChange={handleEmployeeChange}
                    className={`mt-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-black'} p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder={t('employees.enterEmployeeName')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.designation')}
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={employeeForm.designation}
                    onChange={handleEmployeeChange}
                    className={`mt-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-black'} p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder={t('employees.enterDesignation')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.type')}
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="Office"
                        checked={employeeForm.type === 'Office'}
                        onChange={handleEmployeeChange}
                        className={`form-radio ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} focus:ring-${isDarkMode ? 'purple-400' : 'purple-500'}`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('employees.types.office')}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="Remote"
                        checked={employeeForm.type === 'Remote'}
                        onChange={handleEmployeeChange}
                        className={`form-radio ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} focus:ring-${isDarkMode ? 'purple-400' : 'purple-500'}`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('employees.types.remote')}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.status')}
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Permanent"
                        checked={employeeForm.status === 'Permanent'}
                        onChange={handleEmployeeChange}
                        className={`form-radio ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} focus:ring-${isDarkMode ? 'purple-400' : 'purple-500'}`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('employees.status.permanent')}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Contract"
                        checked={employeeForm.status === 'Contract'}
                        onChange={handleEmployeeChange}
                        className={`form-radio ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} focus:ring-${isDarkMode ? 'purple-400' : 'purple-500'}`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('employees.status.contract')}</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    type="button"
                    onClick={() => setShowAddEmployee(false)}
                    className={`text-${isDarkMode ? 'gray-300 hover:text-white' : 'gray-700 hover:text-gray-900'} border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} px-4 py-2 rounded-md`}
                  >
                    {t('employees.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className={`bg-${isDarkMode ? 'purple-600' : 'purple-600'} text-white hover:bg-${isDarkMode ? 'purple-700' : 'purple-700'} px-4 py-2 rounded-md`}
                  >
                    {t('employees.apply')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View Employee Modal */}
        {showViewEmployee && selectedEmployee && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDarkMode ? 'dark:bg-opacity-75' : ''}`}>
            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? 'dark:shadow-gray-900' : 'shadow-gray-200'}`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{t('employees.actions.view')}</h2>
              <div className="space-y-4">
                <p><strong>{t('employees.table.employeeID')}:</strong> {selectedEmployee.id}</p>
                <p><strong>{t('employees.table.employeeName')}:</strong> {selectedEmployee.name}</p>
                <p><strong>{t('employees.table.designation')}:</strong> {selectedEmployee.title}</p>
                <p><strong>{t('employees.table.type')}:</strong> {t(`employees.types.${selectedEmployee.type}`)}</p>
                <p><strong>{t('employees.table.status')}:</strong> {t(`employees.status.${selectedEmployee.status}`)}</p>
              </div>
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  type="button"
                  onClick={() => { setShowViewEmployee(false); setSelectedEmployee(null); }}
                  className={`text-${isDarkMode ? 'gray-300 hover:text-white' : 'gray-700 hover:text-gray-900'} border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} px-4 py-2 rounded-md`}
                >
                  {t('employees.cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Update Employee Form */}
        {showUpdateEmployee && selectedEmployee && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDarkMode ? 'dark:bg-opacity-75' : ''}`}>
            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? 'dark:shadow-gray-900' : 'shadow-gray-200'}`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{t('employees.actions.edit')}</h2>
              <form onSubmit={handleUpdateEmployeeSubmit} className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.employeeID')}
                  </label>
                  <input
                    type="text"
                    name="employeeId"
                    value={employeeForm.employeeId}
                    onChange={handleUpdateEmployeeChange}
                    className={`mt-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-black'} p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder={t('employees.enterEmployeeID')}
                    disabled
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.employeeName')}
                  </label>
                  <input
                    type="text"
                    name="employeeName"
                    value={employeeForm.employeeName}
                    onChange={handleUpdateEmployeeChange}
                    className={`mt-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-black'} p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder={t('employees.enterEmployeeName')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.designation')}
                  </label>
                  <input
                    type="text"
                    name="designation"
                    value={employeeForm.designation}
                    onChange={handleUpdateEmployeeChange}
                    className={`mt-1 block w-full rounded-md border ${isDarkMode ? 'border-gray-700 bg-gray-900 text-white' : 'border-gray-300 bg-white text-black'} p-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500`}
                    placeholder={t('employees.enterDesignation')}
                  />
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.type')}
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="Office"
                        checked={employeeForm.type === 'Office'}
                        onChange={handleUpdateEmployeeChange}
                        className={`form-radio ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} focus:ring-${isDarkMode ? 'purple-400' : 'purple-500'}`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('employees.types.office')}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value="Remote"
                        checked={employeeForm.type === 'Remote'}
                        onChange={handleUpdateEmployeeChange}
                        className={`form-radio ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} focus:ring-${isDarkMode ? 'purple-400' : 'purple-500'}`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('employees.types.remote')}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {t('employees.table.status')}
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Permanent"
                        checked={employeeForm.status === 'Permanent'}
                        onChange={handleUpdateEmployeeChange}
                        className={`form-radio ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} focus:ring-${isDarkMode ? 'purple-400' : 'purple-500'}`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('employees.status.permanent')}</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="status"
                        value="Contract"
                        checked={employeeForm.status === 'Contract'}
                        onChange={handleUpdateEmployeeChange}
                        className={`form-radio ${isDarkMode ? 'text-purple-400' : 'text-purple-600'} focus:ring-${isDarkMode ? 'purple-400' : 'purple-500'}`}
                      />
                      <span className={`ml-2 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{t('employees.status.contract')}</span>
                    </label>
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-4">
                  <Button
                    type="button"
                    onClick={() => { setShowUpdateEmployee(false); setSelectedEmployee(null); }}
                    className={`text-${isDarkMode ? 'gray-300 hover:text-white' : 'gray-700 hover:text-gray-900'} border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} px-4 py-2 rounded-md`}
                  >
                    {t('employees.cancel')}
                  </Button>
                  <Button
                    type="submit"
                    className={`bg-${isDarkMode ? 'purple-600' : 'purple-600'} text-white hover:bg-${isDarkMode ? 'purple-700' : 'purple-700'} px-4 py-2 rounded-md`}
                  >
                    {t('employees.update')}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedEmployee && (
          <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${isDarkMode ? 'dark:bg-opacity-75' : ''}`}>
            <div className={`bg-${isDarkMode ? 'gray-800' : 'white'} p-6 rounded-lg shadow-lg w-full max-w-md ${isDarkMode ? 'dark:shadow-gray-900' : 'shadow-gray-200'}`}>
              <h2 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'} mb-4`}>{t('employees.actions.delete')}</h2>
              <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {t('deleteConfirmMessage', { name: selectedEmployee.name })}
              </p>
              <div className="flex justify-end space-x-4 mt-4">
                <Button
                  type="button"
                  onClick={() => { setShowDeleteConfirm(false); setSelectedEmployee(null); }}
                  className={`text-${isDarkMode ? 'gray-300 hover:text-white' : 'gray-700 hover:text-gray-900'} border ${isDarkMode ? 'border-gray-700 hover:bg-gray-700' : 'border-gray-300 hover:bg-gray-50'} px-4 py-2 rounded-md`}
                >
                  {t('employees.cancel')}
                </Button>
                <Button
                  type="button"
                  onClick={handleDeleteEmployee}
                  className={`bg-red-600 text-white hover:bg-red-700 px-4 py-2 rounded-md`}
                >
                  {t('employees.delete')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {[
                  t('employees.table.employeeID'),
                  t('employees.table.employeeName'),
                  t('employees.table.designation'),
                  t('employees.table.type'),
                  t('employees.table.status'),
                  t('employees.table.actions'),
                ].map((text, i) => (
                  <th
                    key={i}
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase"
                  >
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Loading employees...
                  </td>
                </tr>
              ) : paginatedEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {t('employees.noEmployees')}
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {emp.id}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarFallback>{getInitials(emp.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {emp.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {emp.title}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {t(`employees.types.${emp.type}`)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                        {t(`employees.status.${emp.status}`)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewEmployee(emp)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                          aria-label={t('employees.actions.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateEmployee(emp)}
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                          aria-label={t('employees.actions.edit')}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteConfirm(emp)}
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          aria-label={t('employees.actions.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 space-y-4 sm:space-y-0">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {filteredEmployees.length > 0
              ? t('employees.showing', {
                  count: paginatedEmployees.length,
                  total: filteredEmployees.length,
                })
              : null}
          </span>
          <div className="flex items-center space-x-1 flex-wrap">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="border border-gray-300 dark:border-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              {'<'}
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`border border-gray-300 dark:border-gray-700 px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border border-gray-300 dark:border-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              {'>'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DepartmentDetail