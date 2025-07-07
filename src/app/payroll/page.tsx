'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { Search, Download, ChevronLeft, ChevronRight, Bell } from 'lucide-react';

interface PayrollEmployee {
    id: number;
    name: string;
    avatar: string;
    ctc: number;
    salaryPerMonth: number;
    deduction: number;
    status: 'Completed' | 'Pending';
}

const PayrollPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const payrollData = useMemo<PayrollEmployee[]>(() => [
    { id: 1, name: 'Leasie Watson', avatar: '👩🏻', ctc: 45000, salaryPerMonth: 3500, deduction: 0, status: 'Completed' },
    { id: 2, name: 'Darlene Robertson', avatar: '👩🏻‍🦱', ctc: 78000, salaryPerMonth: 6400, deduction: 100, status: 'Completed' },
    { id: 3, name: 'Jacob Jones', avatar: '👨🏻', ctc: 60000, salaryPerMonth: 5000, deduction: 250, status: 'Completed' },
    { id: 4, name: 'Kathryn Murphy', avatar: '👩🏼', ctc: 34000, salaryPerMonth: 2800, deduction: 0, status: 'Pending' },
    { id: 5, name: 'Leslie Alexander', avatar: '👨🏿', ctc: 40000, salaryPerMonth: 3400, deduction: 0, status: 'Pending' },
    { id: 6, name: 'Ronald Richards', avatar: '👨🏻', ctc: 45000, salaryPerMonth: 3500, deduction: 0, status: 'Completed' },
    { id: 7, name: 'Guy Hawkins', avatar: '👨🏻', ctc: 55000, salaryPerMonth: 4000, deduction: 50, status: 'Pending' },
    { id: 8, name: 'Albert Flores', avatar: '👨🏻', ctc: 60000, salaryPerMonth: 5000, deduction: 150, status: 'Completed' },
    { id: 9, name: 'Savannah Nguyen', avatar: '👩🏻', ctc: 25000, salaryPerMonth: 2200, deduction: 0, status: 'Pending' },
    { id: 10, name: 'Marvin McKinney', avatar: '👩🏻', ctc: 30000, salaryPerMonth: 2700, deduction: 0, status: 'Completed' },
    { id: 11, name: 'Jerome Bell', avatar: '👨🏻', ctc: 78000, salaryPerMonth: 6400, deduction: 0, status: 'Completed' },
  ], []);

  const filteredData = useMemo(() => {
    return payrollData.filter(employee =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, payrollData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: PayrollEmployee['status']): string => {
    return status === 'Completed' 
      ? 'bg-green-100 text-green-600' 
      : 'bg-yellow-100 text-yellow-600';
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const handleExport = () => {
    alert('Export functionality would be implemented here');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="  border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payroll</h1>
            <p className="text-sm text-gray-500">All Employee Payroll</p>
          </div>
          
          <div className="flex items-center gap-4">
          
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
           
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-6 h-6" />
            </button>
            
           
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
                  alt="Robert Allen"
                  fill
                  className="object-cover"
                  sizes="32px"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Robert Allen</p>
                <p className="text-xs text-gray-500">HR Manager</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="p-6 border-b border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
               
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

               
                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>
            </div>

           
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Employee Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CTC
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Salary Per Month
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Deduction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedData.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg">
                            {employee.avatar}
                          </div>
                          <div className="text-sm font-medium text-gray-900">
                            {employee.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(employee.ctc)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(employee.salaryPerMonth)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.deduction > 0 ? formatCurrency(employee.deduction) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium ${
                        currentPage === index + 1
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
