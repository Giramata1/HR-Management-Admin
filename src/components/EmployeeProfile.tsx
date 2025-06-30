'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { User, Clock, Folder, Lock, Calendar, Briefcase } from 'lucide-react'

type EmployeeProfileProps = {
  employee: {
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
}

const EmployeeProfile: React.FC<EmployeeProfileProps> = ({ employee }) => {
  const [activeTab, setActiveTab] = useState('Personal Information')

  const renderTabContent = () => {
    if (activeTab === 'Personal Information') {
      return (
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <p><span className="font-medium text-gray-700">First Name:</span> {employee.name.split(' ')[0]}</p>
            <p><span className="font-medium text-gray-700">Mobile Number:</span> {employee.personalInfo.phone}</p>
            <p><span className="font-medium text-gray-700">Date of Birth:</span> {employee.personalInfo.dateOfBirth}</p>
            <p><span className="font-medium text-gray-700">Gender:</span> {employee.personalInfo.gender}</p>
            <p><span className="font-medium text-gray-700">Address:</span> {employee.personalInfo.address}</p>
            <p><span className="font-medium text-gray-700">Country:</span> {employee.personalInfo.country}</p>
          </div>
          <div className="space-y-2">
            <p><span className="font-medium text-gray-700">Last Name:</span> {employee.name.split(' ')[1] || ''}</p>
            <p><span className="font-medium text-gray-700">Email Address:</span> {employee.personalInfo.email}</p>
            <p><span className="font-medium text-gray-700">Marital Status:</span> {employee.personalInfo.maritalStatus}</p>
            <p><span className="font-medium text-gray-700">Nationality:</span> {employee.personalInfo.nationality}</p>
            <p><span className="font-medium text-gray-700">City:</span> {employee.personalInfo.city}</p>
            <p><span className="font-medium text-gray-700">Zip Code:</span> {employee.personalInfo.zipCode}</p>
          </div>
        </div>
      )
    } else if (activeTab === 'Professional Information') {
      return (
        <div className="space-y-2">
          <p><span className="font-medium text-gray-700">Department:</span> {employee.department}</p>
          <p><span className="font-medium text-gray-700">Designation:</span> {employee.designation}</p>
          <p><span className="font-medium text-gray-700">Type:</span> {employee.type}</p>
          <p><span className="font-medium text-gray-700">Status:</span> {employee.status}</p>
          <p><span className="font-medium text-gray-700">ID:</span> {employee.employeeId}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-6">
        <div className="flex items-center space-x-4 mb-6">
          <Image
            src={employee.avatar}
            alt={employee.name}
            width={50}
            height={50}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{employee.name}</h2>
            <p className="text-sm text-gray-500">{employee.designation}</p>
            <p className="text-sm text-gray-600">{employee.personalInfo.email}</p>
          </div>
        </div>
        <nav className="space-y-2">
          <button
            className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
              activeTab === 'Profile' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('Profile')}
          >
            <User className="w-4 h-4" />
            <span>Profile</span>
          </button>
          <button
            className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
              activeTab === 'Personal Information' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('Personal Information')}
          >
            <User className="w-4 h-4" />
            <span>Personal Information</span>
          </button>
          <button
            className={`w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg ${
              activeTab === 'Professional Information' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
            onClick={() => setActiveTab('Professional Information')}
          >
            <Briefcase className="w-4 h-4" />
            <span>Professional Information</span>
          </button>
          <button
            className="w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setActiveTab('Documents')}
          >
            <Folder className="w-4 h-4" />
            <span>Documents</span>
          </button>
          <button
            className="w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setActiveTab('Account Access')}
          >
            <Lock className="w-4 h-4" />
            <span>Account Access</span>
          </button>
          <button
            className="w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setActiveTab('Attendance')}
          >
            <Clock className="w-4 h-4" />
            <span>Attendance</span>
          </button>
          <button
            className="w-full flex items-center space-x-2 text-left px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
            onClick={() => setActiveTab('Leave')}
          >
            <Calendar className="w-4 h-4" />
            <span>Leave</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">All Employee : {employee.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Employee Profile</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
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
            <button className="px-4 py-2 bg-purple-600 text-white rounded-full text-sm hover:bg-purple-700">
              Edit Profile
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex space-x-4 mb-6 border-b border-gray-200 pb-2">
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'Personal Information' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('Personal Information')}
            >
              Personal Information
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'Professional Information' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('Professional Information')}
            >
              Professional Information
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'Documents' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('Documents')}
            >
              Documents
            </button>
            <button
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'Account Access' ? 'bg-purple-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('Account Access')}
            >
              Account Access
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>{renderTabContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfile