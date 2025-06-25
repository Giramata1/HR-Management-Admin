'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Plus, Eye, Edit2, Trash2, Bell } from 'lucide-react'

type Employee = {
  id: number
  name: string
  employeeId: string
  department: string
  designation: string
  type: string
  status: string
  avatar: string
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
  const [employees] = useState<Employee[]>([])
  const [globalSearch, setGlobalSearch] = useState('')
  const [tableSearch, setTableSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const router = useRouter()

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    emp.employeeId.includes(tableSearch) ||
    emp.department.toLowerCase().includes(tableSearch.toLowerCase()) ||
    emp.designation.toLowerCase().includes(tableSearch.toLowerCase())
  )

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage)

  const handleNavigateToAddPage = () => {
    router.push('/employees/add') // ✅ Updated route
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8 space-y-6">
      {/* 🔷 HEADER SECTION */}
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

      {/* 🟩 TABLE SECTION */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Controls */}
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

            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-sm hover:bg-gray-50">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600 text-sm">
                {['Name', 'ID', 'Department', 'Designation', 'Type', 'Status', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-3 text-left font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-sm text-gray-500">
                    No employees found. Click &quot;Add New Employee&quot;.
                  </td>
                </tr>
              ) : (
                currentEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 border-b">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <EmployeeAvatar src={emp.avatar} name={emp.name} />
                        <span className="text-sm font-medium text-gray-900">{emp.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.employeeId}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.department}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.designation}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{emp.type}</td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded-full">
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex space-x-2">
                        <button><Eye className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
                        <button><Edit2 className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
                        <button><Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-600" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-4 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Showing {Math.min(filteredEmployees.length, itemsPerPage)} of {filteredEmployees.length} results
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 5)
              .map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm rounded ${
                    currentPage === page ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            <button
              onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm disabled:opacity-50"
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
