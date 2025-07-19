
'use client'

import { useState } from 'react'
import { Search, Bell, ChevronDown, ChevronRight, Plus } from 'lucide-react'
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/components/AuthContext'
import Image from 'next/image'

interface Employee {
  name: string
  title: string
  avatar: string
}

interface Departments {
  [slug: string]: {
    name: string
    employees: Employee[]
  }
}

// Component for rendering employee avatar with fallback
const EmployeeAvatar = ({ src, name }: { src: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
      src={imgSrc}
      alt={name}
      width={32}
      height={32}
      className="rounded-full h-8 w-8 object-cover"
      onError={() =>
        setImgSrc(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=32`
        )
      }
    />
  )
}

const Index = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddDepartment, setShowAddDepartment] = useState(false)
  const [newDepartmentName, setNewDepartmentName] = useState('')

  const departments: Departments = {
    design: {
      name: t('departments.design'),
      employees: [
        { name: 'Dianne Russell', title: t('roles.leadUIUXDesigner'), avatar: '' },
        { name: 'Arlene McCoy', title: t('roles.srUIUXDesigner'), avatar: '' },
        { name: 'Cody Fisher', title: t('roles.srUIUXDesigner'), avatar: '' },
        { name: 'Theresa Webb', title: t('roles.uiuxDesigner'), avatar: '' },
        { name: 'Ronald Richards', title: t('roles.uiuxDesigner'), avatar: '' },
      ],
    },
    sale: {
      name: t('departments.sale'),
      employees: [
        { name: 'Darrell Steward', title: t('roles.srSalesManager'), avatar: '' },
        { name: 'Kristin Watson', title: t('roles.srSalesManager'), avatar: '' },
        { name: 'Courtney Henry', title: t('roles.bdm'), avatar: '' },
        { name: 'Kathryn Murphy', title: t('roles.bde'), avatar: '' },
        { name: 'Albert Flores', title: t('roles.sales'), avatar: '' },
      ],
    },
    projectmanager: {
      name: t('departments.projectManager'),
      employees: [
        { name: 'Leslie Alexander', title: t('roles.srProjectManager'), avatar: '' },
        { name: 'Ronald Richards', title: t('roles.srProjectManager'), avatar: '' },
        { name: 'Savannah Nguyen', title: t('roles.projectManager'), avatar: '' },
        { name: 'Eleanor Pena', title: t('roles.projectManager'), avatar: '' },
        { name: 'Esther Howard', title: t('roles.projectManager'), avatar: '' },
      ],
    },
    marketing: {
      name: t('departments.marketing'),
      employees: [
        { name: 'Wade Warren', title: t('roles.srMarketingManager'), avatar: '' },
        { name: 'Brooklyn Simmons', title: t('roles.srMarketingManager'), avatar: '' },
        { name: 'Kristin Watson', title: t('roles.marketingCoordinator'), avatar: '' },
        { name: 'Jacob Jones', title: t('roles.marketingCoordinator'), avatar: '' },
        { name: 'Cody Fisher', title: t('roles.marketing'), avatar: '' },
      ],
    },
  }

  // State to manage dynamic departments
  const [dynamicDepartments, setDynamicDepartments] = useState<Departments>(departments)

  const filteredDepartments = Object.entries(dynamicDepartments).reduce((acc, [slug, dept]) => {
    const filteredEmployees = dept.employees.filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
    if (filteredEmployees.length > 0) {
      acc[slug] = {
        name: dept.name,
        employees: filteredEmployees,
      }
    }
    return acc
  }, {} as Departments)

  const getInitials = (name: string) => {
    const words = name.trim().split(' ')
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase()
  }

  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault()
    if (newDepartmentName.trim() && !dynamicDepartments[newDepartmentName.toLowerCase()]) {
      setDynamicDepartments(prev => ({
        ...prev,
        [newDepartmentName.toLowerCase()]: {
          name: newDepartmentName,
          employees: [],
        },
      }))
      setNewDepartmentName('')
      setShowAddDepartment(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-8 py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('allDepartments.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('allDepartments.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <Bell className="text-gray-500 dark:text-gray-400 cursor-pointer" />
          <button
            onClick={() => setShowAddDepartment(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('Add Department')}
          </button>
          <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border px-3 py-2 rounded-lg">
            <EmployeeAvatar
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6b7280&color=fff&size=32`}
              name={user?.fullName || 'User'}
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || 'HR Manager'}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(filteredDepartments).map(([slug, dept]) => (
          <div key={slug} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dept.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{dept.employees.length} {t('members')}</p>
              </div>
              <Link href={`/departments/${slug}`} className="text-purple-600 text-sm font-medium hover:underline flex items-center">
                {t('viewAllDepartments')} <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-100 dark:divide-gray-700">
              {dept.employees.slice(0, 5).map((employee, idx) => (
                <div key={idx} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gray-200 dark:bg-gray-600 h-10 w-10 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-white">
                      {getInitials(employee.name)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{employee.title}</p>
                    </div>
                  </div>
                  <ChevronRight className="text-gray-400 h-4 w-4" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Add Department Modal */}
      {showAddDepartment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Add New Department ')}</h2>
            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300"></label>
                <input
                  type="text"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder={t('Enter DepartmentName')}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddDepartment(false)
                    setNewDepartmentName('')
                  }}
                  className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
                >
                  {t('Add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Index
