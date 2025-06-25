'use client'

import Image from 'next/image'

interface Employee {
  name: string
  designation: string
  type: string
  checkInTime: string
  status: 'On Time' | 'Late'
  avatar: string
}

const employees: Employee[] = [] // Empty list

export default function AttendanceTable() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Attendance Overview</h3>
        <a href="#" className="text-indigo-500 text-sm font-medium hover:text-indigo-600">
          View All
        </a>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Employee Name
              </th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Designation
              </th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Check In Time
              </th>
              <th className="text-left py-3 px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-sm text-gray-500 py-6">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              employees.map((employee, index) => (
                <tr key={index} className="border-b border-gray-50">
                  <td className="py-4 px-3">
                    <div className="flex items-center">
                      <div className="w-9 h-9 rounded-full overflow-hidden mr-3">
                        <Image
                          src={employee.avatar}
                          alt={employee.name}
                          width={36}
                          height={36}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-sm">{employee.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-sm text-gray-600">{employee.designation}</td>
                  <td className="py-4 px-3 text-sm text-gray-600">{employee.type}</td>
                  <td className="py-4 px-3 text-sm text-gray-900">{employee.checkInTime}</td>
                  <td className="py-4 px-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        employee.status === 'On Time'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {employee.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
