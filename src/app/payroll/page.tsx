
'use client';

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { Search, Download, ChevronLeft, ChevronRight, Plus, X, Edit2, Trash2, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
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

interface ModalState {
  isOpen: boolean;
  title: string;
  message: string;
  type: 'success' | 'error' | 'confirmation';
  onConfirm?: () => void;
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
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [payrollData, setPayrollData] = useState<PayrollEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [modalState, setModalState] = useState<ModalState>({ isOpen: false, title: '', message: '', type: 'success' });

  const [newPayroll, setNewPayroll] = useState<Omit<PayrollEmployee, 'employeeId' | 'createdAt' | 'updatedAt' | 'netSalary'>>({
    employeeName: '',
    ctc: 0,
    salaryPerMonth: 0,
    deduction: 0,
    status: 'PENDING',
  });

  const API_BASE_URL = 'https://hr-management-system-pmfp.onrender.com/api/payroll';
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiSFIiLCJzdWIiOiJocm1zLmhyQGdtYWlsLmNvbSIsImlhdCI6MTc1MzE4ODkxNywiZXhwIjoxNzU2MjEyOTE3fQ.7yScLczcXGmzUeR8wRLd8gyZylZuiiNGIcniPvOKO0g';

  const fetchPayrollData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.statusText}`);
      }
      const data: PayrollEmployee[] = await response.json();
      setPayrollData(data);
    } catch (err) {
      const error = err as Error;
      showModal('error', 'Failed to Load Data', error.message || 'Could not retrieve payroll data from the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayrollData();
  }, [fetchPayrollData]);

  const showModal = (type: ModalState['type'], title: string, message: string, onConfirm?: () => void) => {
    setModalState({ isOpen: true, type, title, message, onConfirm });
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

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
        headers: { 'accept': '*/*', 'Authorization': `Bearer ${AUTH_TOKEN}` },
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
        showModal('success', 'Export Successful', 'The payroll report has been downloaded.');
      } else {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to export the report due to a server error.');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error during export:', err);
      showModal('error', 'Export Failed', err.message);
    }
  };
  
  const openFormModal = (employee?: PayrollEmployee) => {
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
      setNewPayroll({ employeeName: '', ctc: 0, salaryPerMonth: 0, deduction: 0, status: 'PENDING' });
      setEditEmployeeId(null);
    }
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditEmployeeId(null);
    setNewPayroll({ employeeName: '', ctc: 0, salaryPerMonth: 0, deduction: 0, status: 'PENDING' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewPayroll(prev => ({ ...prev, [name]: name === 'ctc' || name === 'salaryPerMonth' || name === 'deduction' ? Number(value) : value }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    closeFormModal();
    try {
      if (editEmployeeId) {
        setPayrollData(prevData =>
          prevData.map(emp =>
            emp.employeeId === editEmployeeId ? { ...emp, ...newPayroll, netSalary: newPayroll.salaryPerMonth - newPayroll.deduction, updatedAt: new Date().toISOString() } : emp
          )
        );
        showModal('success', 'Update Successful', 'The payroll record has been updated.');
      } else {
        const newEmployeeId = payrollData.length > 0 ? Math.max(...payrollData.map(emp => emp.employeeId)) + 1 : 1;
        const now = new Date().toISOString();
        const newPayrollEntry: PayrollEmployee = { employeeId: newEmployeeId, ...newPayroll, netSalary: newPayroll.salaryPerMonth - newPayroll.deduction, createdAt: now, updatedAt: now };
        setPayrollData(prevData => [...prevData, newPayrollEntry]);
        showModal('success', 'Payroll Added', 'A new payroll record has been created.');
      }
    } catch (err) {
      const error = err as Error;
      showModal('error', 'Submission Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    const confirmDelete = () => {
        setLoading(true);
        try {
            setPayrollData(prevData => prevData.filter(emp => emp.employeeId !== id));
            showModal('success', 'Deletion Successful', 'The payroll record has been deleted.');
        } catch (err) {
            const error = err as Error;
            showModal('error', 'Deletion Failed', error.message);
        } finally {
            setLoading(false);
        }
    };

    showModal(
        'confirmation',
        'Confirm Deletion',
        'Are you sure you want to delete this payroll record? This action cannot be undone.',
        confirmDelete
    );
  };
  
  if (loading && payrollData.length === 0) {
    return <div className="flex h-full items-center justify-center">Loading payroll data...</div>;
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative flex-1 max-w-full sm:max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder', 'Search by employee name...')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-900 dark:text-white text-sm"
              />
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <button onClick={handleExport} className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm" disabled={loading}>
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">{t('payroll.export', 'Export PDF')}</span>
              </button>
              <button onClick={() => openFormModal()} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm" disabled={loading}>
                <Plus className="w-4 h-4" />
                <span>{t('payroll.addNew', 'Add New')}</span>
              </button>
            </div>
          </div>
        </div>

        
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
           
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('payroll.employeeName')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('payroll.ctc')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('payroll.salaryPerMonth')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('payroll.deduction')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('payroll.netSalary')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('payroll.status')}</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
          
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedData.length > 0 ? (
                paginatedData.map((employee) => (
                  <tr key={employee.employeeId} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center justify-center font-semibold text-sm select-none">
                          {getInitials(employee.employeeName)}
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{employee.employeeName}</div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatCurrency(employee.ctc)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{formatCurrency(employee.salaryPerMonth)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">{employee.deduction > 0 ? formatCurrency(employee.deduction) : '-'}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800 dark:text-white">{formatCurrency(employee.netSalary)}</td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                        {t(`payroll.statusValues.${employee.status.toLowerCase()}`, { defaultValue: employee.status })}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap flex gap-2">
                      <button onClick={() => openFormModal(employee)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Edit" disabled={loading}><Edit2 className="w-4 h-4 text-gray-500 dark:text-gray-300" /></button>
                      <button onClick={() => handleDelete(employee.employeeId)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Delete" disabled={loading}><Trash2 className="w-4 h-4 text-gray-500 dark:text-gray-300" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={7} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">{t('payroll.noRecords', { defaultValue: 'No records found.' })}</td></tr>
              )}
            </tbody>
          </table>
        </div>

       
        <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              {t('pagination.results', { start: filteredData.length > 0 ? startIndex + 1 : 0, end: Math.min(startIndex + itemsPerPage, filteredData.length), total: filteredData.length })}
            </div>
            <div className="flex items-center space-x-2 flex-wrap">
              <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || loading} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700" aria-label={t('pagination.previous', { defaultValue: 'Previous Page' })}><ChevronLeft className="w-4 h-4" /></button>
              {Array.from({ length: totalPages }, (_, index) => (
                <button key={index + 1} onClick={() => setCurrentPage(index + 1)} className={`px-3 py-1 rounded-lg text-sm font-medium ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'}`} aria-current={currentPage === index + 1 ? 'page' : undefined} disabled={loading}>{index + 1}</button>
              ))}
              <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || loading} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700" aria-label={t('pagination.next', { defaultValue: 'Next Page' })}><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      </div>
      
     
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button onClick={closeFormModal} className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" aria-label="Close modal" disabled={loading}><X className="w-6 h-6" /></button>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">{editEmployeeId ? 'Edit Payroll' : 'Add New Payroll'}</h2>
            <form onSubmit={handleFormSubmit} className="space-y-4 text-gray-900 dark:text-white">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-medium mb-1">Employee Name</label>
                <input type="text" id="employeeName" name="employeeName" value={newPayroll.employeeName} onChange={handleInputChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={loading} />
              </div>
              <div>
                <label htmlFor="ctc" className="block text-sm font-medium mb-1">CTC</label>
                <input type="number" id="ctc" name="ctc" value={newPayroll.ctc} onChange={handleInputChange} min={0} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={loading} />
              </div>
              <div>
                <label htmlFor="salaryPerMonth" className="block text-sm font-medium mb-1">Salary per Month</label>
                <input type="number" id="salaryPerMonth" name="salaryPerMonth" value={newPayroll.salaryPerMonth} onChange={handleInputChange} min={0} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={loading} />
              </div>
              <div>
                <label htmlFor="deduction" className="block text-sm font-medium mb-1">Deduction</label>
                <input type="number" id="deduction" name="deduction" value={newPayroll.deduction} onChange={handleInputChange} min={0} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={loading} />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                <select id="status" name="status" value={newPayroll.status} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500" disabled={loading}>
                  <option value="COMPLETED">Completed</option><option value="PENDING">Pending</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={closeFormModal} className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition" disabled={loading}>Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition" disabled={loading}>{loading ? (editEmployeeId ? 'Updating...' : 'Adding...') : (editEmployeeId ? 'Update Payroll' : 'Add Payroll')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
      
     
      {modalState.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[100] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full mb-4">
              {modalState.type === 'success' && <CheckCircle className="h-12 w-12 text-green-500" />}
              {modalState.type === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
              {modalState.type === 'confirmation' && <AlertTriangle className="h-12 w-12 text-yellow-500" />}
            </div>
            <h3 className="text-lg leading-6 font-semibold text-gray-900 dark:text-white" id="modal-title">
              {modalState.title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {modalState.message}
              </p>
            </div>
            <div className="mt-5 sm:mt-6 flex justify-center gap-3">
              {modalState.type === 'confirmation' ? (
                <>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white dark:bg-gray-700 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700"
                    onClick={() => {
                      modalState.onConfirm?.();
                      closeModal();
                    }}
                  >
                    Confirm
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700"
                  onClick={closeModal}
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default dynamic(() => Promise.resolve(PayrollPage), { ssr: false });
