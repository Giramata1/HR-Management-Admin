'use client';
import React, { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

const LeaveManagementPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const leaveData = [
    {
      id: 1,
      date: 'July 01, 2023',
      duration: 'July 05 - July 08',
      days: '3 Days',
      employee: 'John Smith',
      manager: 'Mark Williams',
      status: 'pending',
    },
    {
      id: 2,
      date: 'Apr 05, 2023',
      duration: 'Apr 06 - Apr 10',
      days: '4 Days',
      employee: 'Sarah Johnson',
      manager: 'Mark Williams',
      status: 'approved',
    },
    {
      id: 3,
      date: 'Mar 12, 2023',
      duration: 'Mar 14 - Mar 16',
      days: '2 Days',
      employee: 'Mike Davis',
      manager: 'Mark Williams',
      status: 'approved',
    },
    {
      id: 4,
      date: 'Feb 01, 2023',
      duration: 'Feb 02 - Feb 10',
      days: '8 Days',
      employee: 'Emily Brown',
      manager: 'Mark Williams',
      status: 'approved',
    },
    {
      id: 5,
      date: 'Jan 01, 2023',
      duration: 'Jan 16 - Jan 19',
      days: '3 Days',
      employee: 'David Wilson',
      manager: 'Mark Williams',
      status: 'rejected',
    },
  ];

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide';
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-200 dark:text-yellow-900`;
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-900`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-900`;
      default:
        return baseClasses;
    }
  };

  const filteredData = leaveData.filter((item) =>
    item.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.employee.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.manager.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="px-6 py-5 lg:px-10">
          <div className="flex items-center justify-between">
            {/* Greeting */}
            <div className="flex flex-col">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Leaves</h1>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-full leading-5 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 sm:text-sm transition-all duration-200"
                />
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Bell className="h-6 w-6" />
              </button>

              <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2 transition-colors">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">RA</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">Robert Allen</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">HR Manager</span>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-300" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="px-6 py-8 lg:px-10">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Days
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Employee
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Reporting Manager
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.date}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-700 dark:text-gray-300">{item.duration}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900 dark:text-white">{item.days}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{item.employee}</td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-blue-600 dark:text-blue-400">{item.manager}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={getStatusBadge(item.status)}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredData.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No leave requests found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LeaveManagementPage;
