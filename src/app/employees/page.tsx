'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Plus, Eye, Edit2, Trash2, Bell, Filter } from 'lucide-react'
import EmployeeProfile from '@/components/EmployeeProfile' 

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

const EmployeeTable = () => {
  const [employees] = useState<Employee[]>([
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
    },
    {
      id: 2,
      name: "Jane Smith",
      employeeId: "EMP002",
      department: "Java",
      designation: "Developer",
      type: "Work from Home",
      status: "Permanent",
      avatar: "https://via.placeholder.com/32",
      personalInfo: {
        dateOfBirth: "Aug 20, 1985",
        gender: "Female",
        address: "5678 Park Ave",
        city: "Los Angeles",
        zipCode: "90001",
        country: "United States",
        maritalStatus: "Single",
        nationality: "American",
        email: "jane.smith@example.com",
        phone: "(234) 567-8901",
      },
    },
    // Add similar data for other employees
    {
      id: 3,
      name: "Bob Johnson",
      employeeId: "EMP003",
      department: "Python",
      designation: "Developer",
      type: "Office",
      status: "Permanent",
      avatar: "https://via.placeholder.com/32",
      personalInfo: {
        dateOfBirth: "Sep 10, 1988",
        gender: "Male",
        address: "9012 Hill St",
        city: "Chicago",
        zipCode: "60601",
        country: "United States",
        maritalStatus: "Married",
        nationality: "American",
        email: "bob.johnson@example.com",
        phone: "(345) 678-9012",
      },
    },
    {
      id: 4,
      name: "Alice Brown",
      employeeId: "EMP004",
      department: "React JS",
      designation: "Frontend Developer",
      type: "Work from Home",
      status: "Permanent",
      avatar: "https://via.placeholder.com/32",
      personalInfo: {
        dateOfBirth: "Oct 15, 1992",
        gender: "Female",
        address: "3456 Oak Rd",
        city: "Seattle",
        zipCode: "98101",
        country: "United States",
        maritalStatus: "Single",
        nationality: "American",
        email: "alice.brown@example.com",
        phone: "(456) 789-0123",
      },
    },
    {
      id: 5,
      name: "Charlie Wilson",
      employeeId: "EMP005",
      department: "HR",
      designation: "HR Manager",
      type: "Office",
      status: "Permanent",
      avatar: "https://via.placeholder.com/32",
      personalInfo: {
        dateOfBirth: "Nov 20, 1987",
        gender: "Male",
        address: "7890 Pine St",
        city: "Houston",
        zipCode: "77001",
        country: "United States",
        maritalStatus: "Married",
        nationality: "American",
        email: "charlie.wilson@example.com",
        phone: "(567) 890-1234",
      },
    },
    {
      id: 6,
      name: "Diana Miller",
      employeeId: "EMP006",
      department: "Sales",
      designation: "Sales Executive",
      type: "Office",
      status: "Permanent",
      avatar: "https://via.placeholder.com/32",
      personalInfo: {
        dateOfBirth: "Dec 25, 1991",
        gender: "Female",
        address: "2468 Maple Dr",
        city: "Miami",
        zipCode: "33101",
        country: "United States",
        maritalStatus: "Single",
        nationality: "American",
        email: "diana.miller@example.com",
        phone: "(678) 901-2345",
      },
    },
  ])
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

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    emp.employeeId.includes(tableSearch) ||
    emp.department.toLowerCase().includes(tableSearch.toLowerCase()) ||
    emp.designation.toLowerCase().includes(tableSearch.toLowerCase()) &&
    (filters.departments.length === 0 || filters.departments.includes(emp.department)) &&
    (filters.type === '' || filters.type === emp.type)
  )

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage)

  const handleNavigateToAddPage = () => {
    router.push('/employees/add')
  }

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee)
    // For simplicity, we'll render the profile here; in a real app, use router.push(`/employees/${employee.id}`)
  }

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen)
  }

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: type === 'departments'
        ? prev.departments.includes(value)
          ? prev.departments.filter((d) => d !== value)
          : [...prev.departments, value]
        : value,
    }))
  }

  const handleApplyFilters = () => {
    setIsFilterOpen(false)
  }

  const handleCancelFilters = () => {
    setFilters({ departments: [], type: '' })
    setSearchEmployee('')
    setIsFilterOpen(false)
  }

  const filteredDepartments = departments.filter((dept) =>
    dept.toLowerCase().includes(searchEmployee.toLowerCase())
  )

  if (selectedEmployee) {
    return <EmployeeProfile employee={selectedEmployee} />
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center flex-wrap gap-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Employees</h1>
          <p className="text-sm text-gray-500 mt-1">All Employee Information</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
            />
          </div>

          <button className="text-gray-600 hover:text-gray-800">
            <Bell className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
              alt="Robert Allen"
              width={36}
              height={36}
              className="rounded-full object-cover"
            />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-gray-900">Robert Allen</span>
              <span className="text-xs text-gray-500">HR Manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 relative">
        {/* Search and Actions */}
        <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search employees..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleNavigateToAddPage}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Employee</span>
            </button>

            <button
              onClick={handleFilterToggle}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Filter Modal */}
        {isFilterOpen && (
          <>
            <div
              className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-40"
              onClick={handleFilterToggle}
            />
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl p-6 w-80 max-h-[80vh] overflow-y-auto border border-gray-200">
                <div className="flex items-center justify-center mb-6 relative">
                  <h3 className="text-lg font-medium text-gray-900">Filter</h3>
                </div>
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search Employee"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      value={searchEmployee}
                      onChange={(e) => setSearchEmployee(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Department</h4>
                  <div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto">
                    {filteredDepartments.map((dept) => (
                      <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.departments.includes(dept)}
                          onChange={() => handleFilterChange('departments', dept)}
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{dept}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Select Type</h4>
                  <div className="flex gap-6">
                    {types.map((type) => (
                      <label key={type} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={filters.type === type}
                          onChange={() => handleFilterChange('type', type)}
                          className="w-4 h-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <button
                    onClick={handleCancelFilters}
                    className="px-5 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-5 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 border-y border-gray-200">
                {['Name', 'ID', 'Department', 'Designation', 'Type', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left font-medium text-gray-700 text-sm">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-sm text-gray-500">
                    No employees found. Click &quot;Add New Employee&quot;.
                  </td>
                </tr>
              ) : (
                currentEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <EmployeeAvatar src={emp.avatar} name={emp.name} />
                        <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.designation}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{emp.type}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${
                          emp.status === 'Permanent' ? 'bg-blue-100 text-blue-500' : ''
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button
                          className="p-1 hover:bg-gray-100 rounded"
                          onClick={() => handleViewProfile(emp)}
                        >
                          <Eye className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Edit2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
                        </button>
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-gray-700" />
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
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {Math.min(filteredEmployees.length, itemsPerPage)} of {filteredEmployees.length} results
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              ←
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-2 text-sm rounded-lg ${
                  currentPage === page
                    ? 'bg-purple-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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