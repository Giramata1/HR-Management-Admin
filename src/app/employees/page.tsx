'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Plus, Eye, Edit2, Trash2, Bell, Filter, Loader2, X } from 'lucide-react'
import EmployeeProfile from '@/components/EmployeeProfile'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/components/AuthContext'

type LocalEmployee = {
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
  profileImage?: string
}

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

const transformLocalEmployee = (localEmployee: LocalEmployee): Employee => {
  return {
    id: localEmployee.id % 1000000,
    name: localEmployee.fullName,
    employeeId: localEmployee.employeeId,
    department: localEmployee.department,
    designation: localEmployee.designation,
    type: localEmployee.employeeType === 'remote' ? 'Work from Home' : 'Office',
    status: localEmployee.status,
    avatar: localEmployee.profileImage || 'https://via.placeholder.com/32',
    personalInfo: {
      dateOfBirth: 'N/A',
      gender: 'N/A',
      address: 'N/A',
      city: 'N/A',
      zipCode: 'N/A',
      country: 'N/A',
      maritalStatus: 'N/A',
      nationality: 'N/A',
      email: localEmployee.email,
      phone: localEmployee.mobileNumber,
    },
    professionalInfo: {
      employeeId: localEmployee.employeeId,
      userName: `${localEmployee.firstName.toLowerCase()}.${localEmployee.lastName.toLowerCase()}`,
      employeeType: localEmployee.employeeType,
      emailAddress: localEmployee.email,
      department: localEmployee.department,
      designation: localEmployee.designation,
      workingDays: 'Monday - Friday',
      joiningDate: 'N/A',
      officeLocation: localEmployee.employeeType === 'remote' ? 'Remote' : 'Office',
    },
  }
}

const EmployeeTable = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [globalSearch, setGlobalSearch] = useState('')
  const [tableSearch, setTableSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null)
  const [editFormData, setEditFormData] = useState<Partial<Employee> | null>(null)
  const [filters, setFilters] = useState({
    departments: [] as string[],
    type: '',
  })
  const [searchEmployee, setSearchEmployee] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const router = useRouter()

  const departments = ['Engineering', 'Marketing', 'HR', 'Sales']
  const types = ['Office', 'Work from Home']

  useEffect(() => {
    const fetchEmployees = () => {
      setLoading(true)
      const localData: LocalEmployee[] = JSON.parse(localStorage.getItem('employees') || '[]')
      const transformedEmployees = localData.map(transformLocalEmployee)
      setEmployees(transformedEmployees)
      setLoading(false)
    }

    fetchEmployees()
  }, [])

  const handleDeleteEmployee = (employee: Employee) => {
    setEmployeeToDelete(employee)
    setIsDeleteModalOpen(true)
  }

  const confirmDelete = () => {
    if (!employeeToDelete) return

    setLoading(true)

    const updatedEmployees = employees.filter((emp) => emp.id !== employeeToDelete.id)
    setEmployees(updatedEmployees)

    const updatedLocalData: LocalEmployee[] = JSON.parse(localStorage.getItem('employees') || '[]').filter(
      (emp: LocalEmployee) => emp.id !== employeeToDelete.id
    )
    localStorage.setItem('employees', JSON.stringify(updatedLocalData))

    setIsDeleteModalOpen(false)
    setEmployeeToDelete(null)
    setLoading(false)
  }

  const cancelDelete = () => {
    setIsDeleteModalOpen(false)
    setEmployeeToDelete(null)
  }

  const handleEditEmployee = (employee: Employee) => {
    setEmployeeToEdit(employee)
    setEditFormData({
      name: employee.name,
      employeeId: employee.employeeId,
      department: employee.department,
      designation: employee.designation,
      type: employee.type,
      status: employee.status,
      personalInfo: { ...employee.personalInfo },
      professionalInfo: { ...employee.professionalInfo },
    })
    setIsEditModalOpen(true)
  }

  const handleEditFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setEditFormData((prev) => {
      if (!prev) return prev

      // Handle top-level fields
      if (!name.includes('.')) {
        return {
          ...prev,
          [name]: value,
        } as Partial<Employee>
      }

      // Handle nested personalInfo fields
      if (name.includes('personalInfo.')) {
        const field = name.split('.')[1] as keyof Employee['personalInfo']
        return {
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            [field]: value,
          } as Employee['personalInfo'],
        } as Partial<Employee>
      }

      // Handle nested professionalInfo fields
      if (name.includes('professionalInfo.')) {
        const field = name.split('.')[1] as keyof Employee['professionalInfo']
        return {
          ...prev,
          professionalInfo: {
            ...prev.professionalInfo,
            [field]: value,
          } as Employee['professionalInfo'],
        } as Partial<Employee>
      }

      return prev
    })
  }

  const confirmEdit = () => {
    if (!employeeToEdit || !editFormData) return

    setLoading(true)

    const updatedEmployee: Employee = {
      ...employeeToEdit,
      name: editFormData.name || employeeToEdit.name,
      employeeId: editFormData.employeeId || employeeToEdit.employeeId,
      department: editFormData.department || employeeToEdit.department,
      designation: editFormData.designation || employeeToEdit.designation,
      type: editFormData.type || employeeToEdit.type,
      status: editFormData.status || employeeToEdit.status,
      personalInfo: {
        ...employeeToEdit.personalInfo,
        ...editFormData.personalInfo,
      },
      professionalInfo: {
        ...employeeToEdit.professionalInfo,
        ...editFormData.professionalInfo,
      },
    }

    const updatedEmployees = employees.map((emp) =>
      emp.id === employeeToEdit.id ? updatedEmployee : emp
    )
    setEmployees(updatedEmployees)

    const updatedLocalData: LocalEmployee[] = JSON.parse(localStorage.getItem('employees') || '[]').map((emp: LocalEmployee) =>
      emp.id === employeeToEdit.id
        ? {
            id: updatedEmployee.id,
            employeeId: updatedEmployee.employeeId,
            firstName: updatedEmployee.name.split(' ')[0],
            lastName: updatedEmployee.name.split(' ').slice(1).join(' '),
            fullName: updatedEmployee.name,
            email: updatedEmployee.personalInfo.email,
            mobileNumber: updatedEmployee.personalInfo.phone,
            department: updatedEmployee.department,
            designation: updatedEmployee.designation,
            employeeType: updatedEmployee.professionalInfo.employeeType,
            status: updatedEmployee.status,
            profileImage: updatedEmployee.avatar !== 'https://via.placeholder.com/32' ? updatedEmployee.avatar : undefined,
          }
        : emp
    )
    localStorage.setItem('employees', JSON.stringify(updatedLocalData))

    setIsEditModalOpen(false)
    setEmployeeToEdit(null)
    setEditFormData(null)
    setLoading(false)
  }

  const cancelEdit = () => {
    setIsEditModalOpen(false)
    setEmployeeToEdit(null)
    setEditFormData(null)
  }

  const filteredEmployees = employees.filter(
    (emp) =>
      (emp.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
        emp.employeeId.includes(globalSearch) ||
        emp.department.toLowerCase().includes(globalSearch.toLowerCase()) ||
        emp.designation.toLowerCase().includes(globalSearch.toLowerCase()) ||
        emp.personalInfo.email.toLowerCase().includes(globalSearch.toLowerCase()) ||
        emp.personalInfo.phone.includes(globalSearch)) &&
      (emp.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
        emp.employeeId.includes(tableSearch) ||
        emp.department.toLowerCase().includes(tableSearch.toLowerCase()) ||
        emp.designation.toLowerCase().includes(tableSearch.toLowerCase())) &&
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
      [type]: type === 'departments' ? (prev.departments.includes(value) ? prev.departments.filter((d) => d !== value) : [...prev.departments, value]) : value,
    }))
  const handleApplyFilters = () => setIsFilterOpen(false)
  const handleCancelFilters = () => {
    setFilters({ departments: [], type: '' })
    setSearchEmployee('')
    setIsFilterOpen(false)
  }

  const filteredDepartments = departments.filter((dept) => dept.toLowerCase().includes(searchEmployee.toLowerCase()))

  if (selectedEmployee) return <EmployeeProfile employee={selectedEmployee} />

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-colors duration-200">
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
            <EmployeeAvatar
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6b7280&color=fff&size=36`}
              name={user?.fullName || 'User'}
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{user?.fullName || 'User'}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">{t(`header.${user?.role.toLowerCase()}`, user?.role || 'HR Manager')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 sm:p-6 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="previous left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
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
          </div>
        </div>

        {isFilterOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={handleFilterToggle} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('employees.filter')}</h3>
                  <button
                    onClick={handleFilterToggle}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
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
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {t(`employees.types.${type.toLowerCase().replace(' ', '')}`, type)}
                        </span>
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

        {isDeleteModalOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={cancelDelete} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('employees.deleteConfirmTitle')}</h3>
                  <button
                    onClick={cancelDelete}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  {t('employees.deleteConfirmMessage', { name: employeeToDelete?.name })}
                </p>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {t('employees.cancel')}
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="px-5 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 dark:hover:bg-red-500"
                  >
                    {t('employees.delete')}
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {isEditModalOpen && editFormData && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40" onClick={cancelEdit} />
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">{t('employees.editEmployee')}</h3>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('employees.name')}</label>
                    <input
                      type="text"
                      name="name"
                      value={editFormData.name || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('employees.id')}</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={editFormData.employeeId || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('sidebar.allDepartments')}</label>
                    <select
                      name="department"
                      value={editFormData.department || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>
                          {t(`employees.departments.${dept}`, dept)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attendanceTable.designation')}</label>
                    <input
                      type="text"
                      name="designation"
                      value={editFormData.designation || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('attendanceTable.type')}</label>
                    <select
                      name="type"
                      value={editFormData.type || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      {types.map((type) => (
                        <option key={type} value={type}>
                          {t(`employees.types.${type.toLowerCase().replace(' ', '')}`, type)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('employees.email')}</label>
                    <input
                      type="email"
                      name="personalInfo.email"
                      value={editFormData.personalInfo?.email || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('employees.phone')}</label>
                    <input
                      type="text"
                      name="personalInfo.phone"
                      value={editFormData.personalInfo?.phone || ''}
                      onChange={handleEditFormChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={cancelEdit}
                    className="px-5 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                  >
                    {t('employees.cancel')}
                  </button>
                  <button
                    onClick={confirmEdit}
                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:hover:bg-blue-500"
                  >
                    {t('employees.save')}
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
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                        {t(`employees.types.${emp.type.toLowerCase().replace(' ', '')}`, emp.type)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                            emp.status === 'Permanent'
                              ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300'
                              : emp.status === 'active'
                              ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300'
                              : 'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300'
                          }`}
                        >
                          {t(`employees.status.${emp.status.toLowerCase()}`, emp.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex space-x-2">
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" onClick={() => handleViewProfile(emp)}>
                            <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" onClick={() => handleEditEmployee(emp)}>
                            <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" onClick={() => handleDeleteEmployee(emp)}>
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

          <div className="md:hidden space-y-4">
            {loading ? (
              <div className="text-center py-12">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-600 dark:text-purple-400" />
                  <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Loading employees...</span>
                </div>
              </div>
            ) : currentEmployees.length === 0 ? (
              <div className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">{t('employees.noEmployees')}</div>
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
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" onClick={() => handleViewProfile(emp)}>
                        <Eye className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" onClick={() => handleEditEmployee(emp)}>
                        <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" onClick={() => handleDeleteEmployee(emp)}>
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
                          emp.status === 'Permanent'
                            ? 'bg-blue-100 text-blue-500 dark:bg-blue-900 dark:text-blue-300'
                            : emp.status === 'active'
                            ? 'bg-green-100 text-green-500 dark:bg-green-900 dark:text-green-300'
                            : 'bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-300'
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
            {loading
              ? 'Loading...'
              : t('employees.showing', { count: Math.min(filteredEmployees.length, itemsPerPage), total: filteredEmployees.length })}
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
              const page = i + Math.max(1, currentPage - 2)
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
              ) : null
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