'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Search, Download, ChevronLeft, ChevronRight, Bell, Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';


interface PayrollEmployee {
  employeeId: number;
  employeeName: string;
  ctc: number;
  salaryPerMonth: number;
  deduction: number;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  updatedAt: string;
  netSalary: number;
}


interface User {
  name: string;
  role: string;
  initials: string;
}

const getInitials = (name: string) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const PayrollPage = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [payrollData, setPayrollData] = useState<PayrollEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- NEW: State for logged-in user ---
  const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [newPayroll, setNewPayroll] = useState<Omit<PayrollEmployee, 'employeeId' | 'createdAt' | 'updatedAt' | 'netSalary'>>({
    employeeName: '',
    ctc: 0,
    salaryPerMonth: 0,
    deduction: 0,
    status: 'PENDING',
  });

  const API_BASE_URL = 'https://hr-management-system-pmfp.onrender.com/api/payroll';
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiSFIiLCJzdWIiOiJocm1zLmhyQGdtYWlsLmNvbSIsImlhdCI6MTc1MzE4ODkxNywiZXhwIjoxNzU2MjEyOTE3fQ.7yScLczcXGmzUeR8wRLd8gyZylZuiiNGIcniPvOKO0g';

  // --- NEW: Function to decode JWT and set user ---
  const decodeToken = (token: string): { name: string; role: string } => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const email = payload.sub || 'user@example.com';
      const name = email.split('@')[0].replace(/\./g, ' ').replace(/(^\w|\s\w)/g, (m: string) => m.toUpperCase());
      const role = payload.role || 'User';
      return { name, role };
    } catch (e) {
      console.error('Failed to decode token:', e);
      return { name: 'Guest User', role: 'User' };
    }
  };

  const fetchPayrollData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }

      const data: PayrollEmployee[] = await response.json();
      setPayrollData(data);
    } catch (err) {
      console.error("Failed to fetch payroll data:", err);
      setError('Failed to load payroll data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayrollData();

   
    const userData = decodeToken(AUTH_TOKEN);
    setLoggedInUser({
      name: userData.name,
      role: userData.role,
      initials: getInitials(userData.name),
    });
  }, [fetchPayrollData]);

  const filteredData = useMemo(() => {
    return payrollData.filter(employee =>
      employee.employeeName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, payrollData]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status: PayrollEmployee['status']): string => {
    return status === 'COMPLETED'
      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const handleExport = async () => {
    const exportApiUrl = 'https://hr-management-system-pmfp.onrender.com/api/payroll/export/pdf';

    try {
      const response = await fetch(exportApiUrl, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'payroll_report.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        alert('Payroll report exported successfully!');
      } else {
        const errorText = await response.text();
        console.error('Export failed:', response.status, errorText);
        alert('Failed to export payroll report. Please try again.');
      }
    } catch (error) {
      console.error('Error during export:', error);
      alert('An error occurred during export.');
    }
  };

  const openModal = (employee?: PayrollEmployee) => {
    if (employee) {
      setNewPayroll({
        employeeName: employee.employeeName,
        ctc: employee.ctc,
        salaryPerMonth: employee.salaryPerMonth,
        deduction: employee.deduction,
        status: employee.status,
      });
      setEditEmployeeId(employee.employeeId);
    } else {
      setNewPayroll({
        employeeName: '',
        ctc: 0,
        salaryPerMonth: 0,
        deduction: 0,
        status: 'PENDING',
      });
      setEditEmployeeId(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditEmployeeId(null);
    setNewPayroll({
      employeeName: '',
      ctc: 0,
      salaryPerMonth: 0,
      deduction: 0,
      status: 'PENDING',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPayroll(prev => ({
      ...prev,
      [name]: name === 'ctc' || name === 'salaryPerMonth' || name === 'deduction' ? Number(value) : value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editEmployeeId) {
        setPayrollData(prevData =>
          prevData.map(emp =>
            emp.employeeId === editEmployeeId
              ? {
                  ...emp,
                  ...newPayroll,
                  netSalary: newPayroll.salaryPerMonth - newPayroll.deduction,
                  updatedAt: new Date().toISOString().split('T')[0] + ' ' + new Date().toTimeString().split(' ')[0],
                }
              : emp
          )
        );
        alert('Payroll updated successfully!');
      } else {
        const newEmployeeId = payrollData.length > 0 ? Math.max(...payrollData.map(emp => emp.employeeId)) + 1 : 1;
        const now = new Date();
        const newPayrollEntry: PayrollEmployee = {
          employeeId: newEmployeeId,
          ...newPayroll,
          netSalary: newPayroll.salaryPerMonth - newPayroll.deduction,
          createdAt: now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0],
          updatedAt: now.toISOString().split('T')[0] + ' ' + now.toTimeString().split(' ')[0],
        };

        setPayrollData(prevData => [...prevData, newPayrollEntry]);
        alert('New payroll added successfully!');
      }
      closeModal();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error submitting form:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this payroll record?')) {
      return;
    }
    setLoading(true);
    try {
      setPayrollData(prevData => prevData.filter(emp => emp.employeeId !== id));
      alert('Payroll record deleted successfully!');
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error deleting payroll :", error);
      alert(`Failed to delete payroll record: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && payrollData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        Loading payroll data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-red-600 dark:text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="max-w-full sm:max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">
              {t('payroll.title')}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('payroll.subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-full sm:w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-800 dark:text-white text-sm"
              />
            </div>

            <button
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t('notifications.title')}
            >
              <Bell className="w-4 sm:w-6 h-4 sm:h-6" />
            </button>
            
            {/* --- MODIFIED: Dynamic User Profile --- */}
            {loggedInUser && (
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 sm:px-3 py-2 cursor-pointer select-none">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-base sm:text-lg">
                  {loggedInUser.initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {loggedInUser.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {loggedInUser.role}
                  </p>
                </div>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="max-w-full sm:max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
                  <input
                    type="text"
                    placeholder={t('search.placeholder')}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-900 dark:text-white text-sm"
                  />
                </div>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                  disabled={loading}
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">{t('payroll.export')}</span>
                  <span className="sm:hidden">{t('payroll.export')}</span>
                </button>

                <button
                  onClick={() => openModal()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm shadow-md"
                  disabled={loading}
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Payroll</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px]">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.employeeName')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.ctc')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.salaryPerMonth')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.deduction')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.netSalary')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.status')}
                    </th>
                    <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.length === 0 && !loading ? (
                    <tr>
                      <td colSpan={7} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        {t('payroll.noRecords', { defaultValue: 'No records found.' })}
                      </td>
                    </tr>
                  ) : (
                    paginatedData.map((employee) => (
                      <tr key={employee.employeeId} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-base sm:text-lg select-none">
                              {getInitials(employee.employeeName)}
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {employee.employeeName}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(employee.ctc)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(employee.salaryPerMonth)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {employee.deduction > 0 ? formatCurrency(employee.deduction) : '-'}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {formatCurrency(employee.netSalary)}
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                            {t(`payroll.statusValues.${employee.status.toLowerCase()}`, {defaultValue: employee.status})}
                          </span>
                        </td>
                        <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex gap-2">
                          <button
                            onClick={() => openModal(employee)}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            aria-label="Edit"
                            disabled={loading}
                          >
                            <Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee.employeeId)}
                            className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                            aria-label="Delete"
                            disabled={loading}
                          >
                            <Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-300" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {t('payroll.showingResults', {
                    start: filteredData.length > 0 ? startIndex + 1 : 0,
                    end: Math.min(startIndex + itemsPerPage, filteredData.length),
                    total: filteredData.length,
                  })}
                </div>

                <div className="flex items-center space-x-2 flex-wrap">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label={t('pagination.previous', { defaultValue: 'Previous Page' })}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${
                        currentPage === index + 1
                          ? 'bg-indigo-600 text-white'
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      aria-current={currentPage === index + 1 ? 'page' : undefined}
                      disabled={loading}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label={t('pagination.next', { defaultValue: 'Next Page' })}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close modal"
              disabled={loading}
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {editEmployeeId ? 'Edit Payroll' : 'Add New Payroll'}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4 text-gray-900 dark:text-white">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium mb-1">Employee Name</label>
                <input
                  type="text"
                  id="employeeName"
                  name="employeeName"
                  value={newPayroll.employeeName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="ctc" className="block text-sm font-medium mb-1">CTC</label>
                <input
                  type="number"
                  id="ctc"
                  name="ctc"
                  value={newPayroll.ctc}
                  onChange={handleInputChange}
                  min={0}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="salaryPerMonth" className="block text-sm font-medium mb-1">Salary per Month</label>
                <input
                  type="number"
                  id="salaryPerMonth"
                  name="salaryPerMonth"
                  value={newPayroll.salaryPerMonth}
                  onChange={handleInputChange}
                  min={0}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="deduction" className="block text-sm font-medium mb-1">Deduction</label>
                <input
                  type="number"
                  id="deduction"
                  name="deduction"
                  value={newPayroll.deduction}
                  onChange={handleInputChange}
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                <select
                  id="status"
                  name="status"
                  value={newPayroll.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={loading}
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
                  disabled={loading}
                >
                  {loading ? (editEmployeeId ? 'Updating...' : 'Adding...') : (editEmployeeId ? 'Update Payroll' : 'Add Payroll')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(PayrollPage), { ssr: false });
