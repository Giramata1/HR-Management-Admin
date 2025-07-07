import React, { useState } from 'react'
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
  
} from 'lucide-react'

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

const EmployeeProfile = ({ employee }: { employee: Employee }) => {
  const { name, designation, avatar, personalInfo, professionalInfo } = employee
  const [activeTab, setActiveTab] = useState('personal')
  const [activeSection, setActiveSection] = useState('profile')
 

  
  const attendanceRecords: AttendanceRecord[] = [
    { id: 1, date: "July 01, 2023", checkIn: "09:28 AM", checkOut: "07:00 PM", breakTime: "00:30 Min", workingHours: "09:02 Hrs", status: "On Time" },
    { id: 2, date: "July 02, 2023", checkIn: "09:20 AM", checkOut: "07:00 PM", breakTime: "00:30 Min", workingHours: "09:10 Hrs", status: "On Time" },
    { id: 3, date: "July 03, 2023", checkIn: "09:25 AM", checkOut: "07:00 PM", breakTime: "00:30 Min", workingHours: "09:05 Hrs", status: "On Time" },
    { id: 4, date: "July 04, 2023", checkIn: "09:45 AM", checkOut: "07:00 PM", breakTime: "00:40 Min", workingHours: "08:35 Hrs", status: "Late" },
    { id: 5, date: "July 05, 2023", checkIn: "10:00 AM", checkOut: "07:00 PM", breakTime: "00:30 Min", workingHours: "08:30 Hrs", status: "Late" },
    { id: 6, date: "July 06, 2023", checkIn: "09:28 AM", checkOut: "07:00 PM", breakTime: "00:30 Min", workingHours: "09:02 Hrs", status: "On Time" },
    { id: 7, date: "July 07, 2023", checkIn: "09:30 AM", checkOut: "07:00 PM", breakTime: "00:15 Min", workingHours: "09:15 Hrs", status: "On Time" },
    { id: 8, date: "July 08, 2023", checkIn: "09:52 AM", checkOut: "07:00 PM", breakTime: "00:45 Min", workingHours: "08:23 Hrs", status: "Late" },
    { id: 9, date: "July 09, 2023", checkIn: "09:10 AM", checkOut: "07:00 PM", breakTime: "00:30 Min", workingHours: "09:20 Hrs", status: "On Time" },
    { id: 10, date: "July 10, 2023", checkIn: "09:48 AM", checkOut: "07:00 PM", breakTime: "00:42 Min", workingHours: "08:30 Hrs", status: "Late" }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'On Time': return 'text-green-600 bg-green-50'
      case 'Late': return 'text-red-600 bg-red-50'
      case 'Present': return 'text-green-600 bg-green-50'
      case 'Absent': return 'text-red-600 bg-red-50'
      case 'Half Day': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'On Time': return <CheckCircle className="w-4 h-4" />
      case 'Present': return <CheckCircle className="w-4 h-4" />
      case 'Late': return <AlertCircle className="w-4 h-4" />
      case 'Absent': return <XCircle className="w-4 h-4" />
      case 'Half Day': return <Clock className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  
  return (
    <div className="bg-white rounded-xl shadow-sm max-w-7xl mx-auto p-6 space-y-6">
     
      <div className="flex justify-between items-center flex-wrap">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">{name}</h2>
          <nav className="text-sm text-gray-500">
            All Employees &gt; <span className="text-gray-800 font-medium">{name}</span>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="border rounded-md px-8 py-1.5 text-sm focus:ring-2 focus:ring-purple-500"
            />
          </div>
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
              alt="Robert Allen"
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover"
            />

            <div className="leading-tight">
              <p className="text-sm font-medium text-gray-800">Robert Allen</p>
              <p className="text-xs text-gray-500">HR Manager</p>
            </div>
          </div>
        </div>
     
      <div className="flex justify-between items-center flex-wrap border-b pb-6">
        <div className="flex items-center gap-4">
          <Image
            src={avatar}
            alt={name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover"
          />
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{name}</h3>
            <p className="text-sm text-gray-600">{designation}</p>
            <p className="text-sm text-gray-600">{personalInfo.email}</p>
          </div>
        </div>
        <button className="bg-violet-600 text-white px-4 py-2 rounded-md text-sm hover:bg-violet-500 flex items-center gap-2">
          <PencilLine className="w-4 h-4" /> Edit Profile
        </button>
      </div>

     
      <div className="flex gap-8">
       
        <div className="w-52 space-y-2 text-sm">
          <button 
            onClick={() => setActiveSection('profile')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === 'profile' 
                ? 'bg-violet-100 text-violet-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <UserRound className="w-4 h-4" /> Profile
          </button>
          <button 
            onClick={() => setActiveSection('attendance')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === 'attendance' 
                ? 'bg-violet-100 text-violet-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <CalendarCheck className="w-4 h-4" /> Attendance
          </button>
          <button 
            onClick={() => setActiveSection('projects')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === 'projects' 
                ? 'bg-violet-100 text-violet-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <FolderKanban className="w-4 h-4" /> Projects
          </button>
          <button 
            onClick={() => setActiveSection('leave')}
            className={`w-full flex items-center gap-2 px-4 py-2 rounded-md ${
              activeSection === 'leave' 
                ? 'bg-violet-100 text-violet-600 font-medium' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Leaf className="w-4 h-4" /> Leave
          </button>
        </div>

       
        <div className="flex-1 space-y-6">
         
          {activeSection === 'profile' && (
            <>
             
              <div className="border-b">
                <div className="flex gap-8 text-sm">
                  <button 
                    onClick={() => setActiveTab('personal')}
                    className={`flex items-center gap-1 font-medium py-2 ${
                      activeTab === 'personal' 
                        ? 'text-violet-600 border-b-2 border-violet-600' 
                        : 'text-gray-500 hover:text-violet-600'
                    }`}
                  >
                    <UserRound className="w-4 h-4" /> Personal Information
                  </button>
                  <button 
                    onClick={() => setActiveTab('professional')}
                    className={`flex items-center gap-1 font-medium py-2 ${
                      activeTab === 'professional' 
                        ? 'text-violet-600 border-b-2 border-violet-600' 
                        : 'text-gray-500 hover:text-violet-600'
                    }`}
                  >
                    <Briefcase className="w-4 h-4" /> Professional Information
                  </button>
                  <button 
                    onClick={() => setActiveTab('documents')}
                    className={`flex items-center gap-1 font-medium py-2 ${
                      activeTab === 'documents' 
                        ? 'text-violet-600 border-b-2 border-violet-600' 
                        : 'text-gray-500 hover:text-violet-600'
                    }`}
                  >
                    <FileText className="w-4 h-4" /> Documents
                  </button>
                  <button 
                    onClick={() => setActiveTab('account')}
                    className={`flex items-center gap-1 font-medium py-2 ${
                      activeTab === 'account' 
                        ? 'text-violet-600 border-b-2 border-violet-600' 
                        : 'text-gray-500 hover:text-violet-600'
                    }`}
                  >
                    <Lock className="w-4 h-4" /> Account Access
                  </button>
                </div>
              </div>

              
              {activeTab === 'personal' && (
                <div className="grid grid-cols-2 gap-6 text-sm text-gray-800">
                  <div>
                    <p className="text-gray-500">Date of Birth</p>
                    <p className="font-medium">{personalInfo.dateOfBirth}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Gender</p>
                    <p className="font-medium">{personalInfo.gender}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Marital Status</p>
                    <p className="font-medium">{personalInfo.maritalStatus}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Nationality</p>
                    <p className="font-medium">{personalInfo.nationality}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Address</p>
                    <p className="font-medium">{personalInfo.address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">City</p>
                    <p className="font-medium">{personalInfo.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">State</p>
                    <p className="font-medium">{personalInfo.country}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Zip Code</p>
                    <p className="font-medium">{personalInfo.zipCode}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Phone</p>
                    <p className="font-medium">{personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email</p>
                    <p className="font-medium">{personalInfo.email}</p>
                  </div>
                </div>
              )}

              {activeTab === 'professional' && (
                <div className="grid grid-cols-2 gap-6 text-sm text-gray-800">
                  <div>
                    <p className="text-gray-500">Employee ID</p>
                    <p className="font-medium">{professionalInfo.employeeId}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">User Name</p>
                    <p className="font-medium">{professionalInfo.userName}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Employee Type</p>
                    <p className="font-medium">{professionalInfo.employeeType}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Email Address</p>
                    <p className="font-medium">{professionalInfo.emailAddress}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Department</p>
                    <p className="font-medium">{professionalInfo.department}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Designation</p>
                    <p className="font-medium">{professionalInfo.designation}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Working Days</p>
                    <p className="font-medium">{professionalInfo.workingDays}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Joining Date</p>
                    <p className="font-medium">{professionalInfo.joiningDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-gray-500">Office Location</p>
                    <p className="font-medium">{professionalInfo.officeLocation}</p>
                  </div>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="text-center py-12 text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Documents section content will be displayed here.</p>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="text-center py-12 text-gray-500">
                  <Lock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Account access section content will be displayed here.</p>
                </div>
              )}
            </>
          )}

         
          {activeSection === 'attendance' && (
            <>
            <div className="bg-white border rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Date</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Check In</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Check Out</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Break Time</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Working Hours</th>
                        <th className="text-left p-4 text-sm font-medium text-gray-700">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {attendanceRecords.map((record) => (
                        <tr key={record.id} className="hover:bg-gray-50">
                          <td className="p-4 text-sm text-gray-900">{record.date}</td>
                          <td className="p-4 text-sm text-gray-900">{record.checkIn}</td>
                          <td className="p-4 text-sm text-gray-900">{record.checkOut}</td>
                          <td className="p-4 text-sm text-gray-900">{record.breakTime}</td>
                          <td className="p-4 text-sm text-gray-900">{record.workingHours}</td>
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
            </>
          )}

          {/* Projects Section */}
          {activeSection === 'projects' && (
            <div className="bg-white border rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
      <table className="w-full text-sm text-gray-700">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left p-4 font-medium">Sr. No.</th>
            <th className="text-left p-4 font-medium">Project Name</th>
            <th className="text-left p-4 font-medium">Start Date</th>
             <th className="text-left p-4 font-medium">Finish Date</th>
            <th className="text-left p-4 font-medium">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
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
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="p-4">{project.id}</td>
              <td className="p-4">{project.name}</td>
              <td className="p-4">{project.start}</td>
              <td className="p-4">{project.finish}</td>
              <td className="p-4">
                 <span
                  className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                    project.status === 'Completed'
                      ? 'text-green-600 bg-green-50'
                      : 'text-yellow-600 bg-yellow-50'
                  }`}
                >
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

          {/* Leave Section */}
          {activeSection === 'leave' && (
            <div className="text-center py-12 text-gray-500">
              <Leaf className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>Leave section content will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>

  )
}

export default EmployeeProfile
