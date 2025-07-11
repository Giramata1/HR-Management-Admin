'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Plus, Eye, Edit2, Trash2, Bell, Filter, Loader2, X } from 'lucide-react'
import EmployeeProfile from '@/components/EmployeeProfile'
import { useTranslation } from 'react-i18next'

// API Response type based on your schema
type APIEmployee = {
  id: number
  employeeId: string
  firstName: string
  lastName: string
  fullName: string
  email: string
  mobileNumber: string
  department: string
  designation: string
  employeeType: string
  status: string
}

// Enhanced Employee type for internal use
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
    dateOfBirth: string
    gender: string
    address: string
    city: string
    zipCode: string
    country: string
    maritalStatus: string
    nationality: string
    email: string
    phone: string
  }
  professionalInfo: {
    employeeId: string
    userName: string
    employeeType: string
    emailAddress: string
    department: string
    designation: string
    workingDays: string
    joiningDate: string
    officeLocation: string
  }
}

const EmployeeAvatar = ({ src, name }: { src: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
      src={imgSrc}
      alt={name}
      width={32}
      height={32}
      className="rounded-full object-cover"
      onError={() =>
        setImgSrc(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=32`
        )
      }
    />
  )
}

const transformAPIEmployee = (apiEmployee: APIEmployee): Employee => {
  return {
    id: apiEmployee.id,
    name: apiEmployee.fullName || `${apiEmployee.firstName} ${apiEmployee.lastName}`,
    employeeId: apiEmployee.employeeId,
    department: apiEmployee.department,
    designation: apiEmployee.designation,
    type: apiEmployee.employeeType === 'remote' ? 'Work from Home' : 'Office',
    status: apiEmployee.status,
    avatar: "https://via.placeholder.com/32",
    personalInfo: {
      dateOfBirth: "N/A",
      gender: "N/A",
      address: "N/A",
      city: "N/A",
      zipCode: "N/A",
      country: "N/A",
      maritalStatus: "N/A",
      nationality: "N/A",
      email: apiEmployee.email,
      phone: apiEmployee.mobileNumber,
    },
    professionalInfo: {
      employeeId: apiEmployee.employeeId,
      userName: apiEmployee.firstName.toLowerCase() + "." + apiEmployee.lastName.toLowerCase(),
      employeeType: apiEmployee.employeeType,
      emailAddress: apiEmployee.email,
      department: apiEmployee.department,
      designation: apiEmployee.designation,
      workingDays: "Monday - Friday",
      joiningDate: "N/A",
      officeLocation: apiEmployee.employeeType === 'remote' ? 'Remote' : 'Office'
    }
  }
}

const EmployeeTable = () => {
  const { t } = useTranslation()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [globalSearch, setGlobalSearch] = useState('')
  const [tableSearch, setTableSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    departments: [] as string[],
    type: '',
  })
  const [searchEmployee, setSearchEmployee] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const router = useRouter()

  const departments = ["Design", "Java", "Python", "React JS", "HR", "Sales", "Business Analyst", "Project Manager", "Account", "Node JS"]
  const types = ["Office", "Work from Home"]

  // Fetch employees from API with Bearer token
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await fetch('https://hr-management-system-pmfp.onrender.com/api/employees/dashboard', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_TOKEN}`,
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`)
        }

        const data: APIEmployee[] = await response.json()
        const transformedEmployees = data.map(transformAPIEmployee)
        setEmployees(transformedEmployees)
      } catch (err) {
        console.error('Error fetching employees:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch employees')
        
        // Fallback to mock data if API fails
        const mockEmployees: Employee[] = [
          {
            id: 1,
            name: "John Doe",
            employeeId: "EMP001",
            department: "Design",
            designation: "Designer",
            type: "Office",
            status: "Permanent",
            avatar: "https://via.placeholder.com/32",
            personalInfo: {
              dateOfBirth: "Jul 15, 1990",
              gender: "Male",
              address: "1234 Royal Ln",
              city: "New York",
              zipCode: "10001",
              country: "United States",
              maritalStatus: "Married",
              nationality: "American",
              email: "john.doe@example.com",
              phone: "(123) 456-7890",
            },
            professionalInfo: {
              employeeId: "EMP001",
              userName: "john.doe",
              employeeType: "Full-time",
              emailAddress: "john.doe@example.com",
              department: "Design",
              designation: "Designer",
              workingDays: "Monday - Friday",
              joiningDate: "Jan 15, 2020",
              officeLocation: "New York Office"
            }
          }
        ]
        setEmployees(mockEmployees)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const filteredEmployees = employees.filter((emp) =>
    (
      emp.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
      emp.employeeId.includes(globalSearch) ||
      emp.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
      emp.designation.toLowerCase().includes(globalSearch.toLowerCase()) ||
      emp.personalInfo.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
      emp.personalInfo.phone.includes(globalSearch)
    ) &&
    (
      emp.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      emp.employeeId.includes(tableSearch) ||
      emp.department.toLowerCase().includes(tableSearch.toLowerCase()) ||
      emp.designation.toLowerCase().includes(tableSearch.toLowerCase())
    ) &&
    (filters.departments.length === 0 || filters.departments.includes(emp.department)) &&
    (filters.type === '' || filters.type === emp.type)
  )

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage)

  const handleNavigateToAddPage = () => router.push('/employees/add')
  const handleViewProfile = (employee: Employee) => setSelectedEmployee(employee)
  const handleFilterToggle = () => setIsFilterOpen(!isFilterOpen)
  const handleFilterChange = (type: string, value: string) =>
    setFilters((prev) => ({
      ...prev,
      [type]: type === 'departments'
        ? prev.departments.includes(value)
          ? prev.departments.filter((d) => d !== value)
          : [...prev.departments, value]
        : value,
    }))
  const handleApplyFilters = () => setIsFilterOpen(false)
  const handleCancelFilters = () => {
    setFilters({ departments: [], type: '' })
    setSearchEmployee('')
    setIsFilterOpen(false)
  }
  const handleRefresh = () => window.location.reload()

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchEmployee.toLowerCase())
  )

  if (selectedEmployee) return <EmployeeProfile employee={selectedEmployee} />

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{t('sidebar.allEmployees')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('sidebar.allEmployees')}</p>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>
          <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
            <Bell className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
              alt={t('header.profileAlt', { name: 'Robert Allen' })}
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">Robert Allen</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t('header.hrManager')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleNavigateToAddPage}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 dark:hover:bg-purple-500 w-full sm:w-auto"
            >
              <Plus className="w-4 h-4" />
              <span>{t('employees.addNew')}</span>
            </button>
            <button
              onClick={handleFilterToggle}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 w-full sm:w-auto"
            >
              <Filter className="w-4 h-4" />
              <span>{t('employees.filter')}</span>
            </button>
            {error && (
              <button
                onClick={handleRefresh}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 w-full sm:w-auto"
              >
                <span>Retry</span>
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <div className="text-red-800 dark:text-red-200">
                <strong>Error:</strong> {error}
              </div>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              Showing fallback data. Please check your internet connection and try again.
            </p>
          </div>
        )}

        {isFilterOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
              onClick={handleFilterToggle}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('employees.filter')}</h3>
                  <button onClick={handleFilterToggle} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                      type="text"
                      placeholder={t('header.searchPlaceholder')}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      value={searchEmployee}
                      onChange={(e) => setSearchEmployee(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">{t('sidebar.allDepartments')}</h4>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                    {filteredDepartments.map((dept) => (
                      <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.departments.includes(dept)}
                          onChange={() => handleFilterChange('departments', dept)}
                          className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{t(`employees.departments.${dept}`, dept)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">{t('employees.type')}</h4>
                  <div className="flex flex-col gap-3">
                    {types.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={filters.type === type}
                          onChange={() => handleFilterChange('type', type)}
                          className="w-4 h-4 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{t(`employees.types.${type.toLowerCase().replace(' ', '')}`, type)}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancelFilters}
                    className="px-5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {t('employees.cancel')}
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-500"
                  >
                    {t('employees.apply')}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="overflow-x-auto">
          <div className="hidden md:block">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-700 border-y border-gray-200 dark:border-gray-600">
                  <th className="px-6 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">{t('attendanceTable.name')}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">{t('employees.id')}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">{t('sidebar.allDepartments')}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">{t('attendanceTable.designation')}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">{t('attendanceTable.type')}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">{t('attendanceTable.status')}</th>
                  <th className="px-6 py-3 text-left font-medium text-gray-700 dark:text-gray-300 text-sm">{t('employees.actionsLabel')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12">
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading employees...</span>
                      </div>
                    </td>
                  </tr>
                ) : currentEmployees.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                      {t('employees.noEmployees')}
                    </td>
                  </tr>
                ) : (
                  currentEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <EmployeeAvatar src={emp.avatar} name={emp.name} />
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{emp.employeeId}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{t(`employees.departments.${emp.department}`, emp.department)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{emp.designation}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{t(`employees.types.${emp.type.toLowerCase().replace(' ', '')}`, emp.type)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                            emp.status === 'Permanent' ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' : 
                            emp.status === 'active' ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300' :
                            'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300'
                          }`}
                        >
                          {t(`employees.status.${emp.status.toLowerCase()}`, emp.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button
                            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                            onClick={() => handleViewProfile(emp)}
                          >
                            <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                            <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                            <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading employees...</span>
                </div>
              </div>
            ) : currentEmployees.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
                {t('employees.noEmployees')}
              </div>
            ) : (
              currentEmployees.map((emp) => (
                <div key={emp.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <EmployeeAvatar src={emp.avatar} name={emp.name} />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{emp.name}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{emp.employeeId}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded"
                        onClick={() => handleViewProfile(emp)}
                      >
                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded">
                        <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <div>
                      <p className="font-medium">{t('sidebar.allDepartments')}</p>
                      <p>{t(`employees.departments.${emp.department}`, emp.department)}</p>
                    </div>
                    <div>
                      <p className="font-medium">{t('attendanceTable.designation')}</p>
                      <p>{emp.designation}</p>
                    </div>
                    <div>
                      <p className="font-medium">{t('attendanceTable.type')}</p>
                      <p>{t(`employees.types.${emp.type.toLowerCase().replace(' ', '')}`, emp.type)}</p>
                    </div>
                    <div>
                      <p className="font-medium">{t('attendanceTable.status')}</p>
                      <p
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                          emp.status === 'Permanent' ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300' : 
                          emp.status === 'active' ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300' :
                          'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300'
                        }`}
                      >
                        {t(`employees.status.${emp.status.toLowerCase()}`, emp.status)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {loading ? (
              'Loading...'
            ) : (
              t('employees.showing', { count: Math.min(filteredEmployees.length, itemsPerPage), total: filteredEmployees.length })
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || loading}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              ←
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              const page = i + Math.max(1, currentPage - 2);
              return page <= totalPages ? (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  disabled={loading}
                  className={`px-3 py-2 text-sm rounded-lg disabled:opacity-50 ${
                    currentPage === page
                      ? 'bg-purple-600 text-white'
                      : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ) : null;
            }).filter(Boolean)}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeTable