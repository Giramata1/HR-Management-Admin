'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Download, ChevronLeft, ChevronRight, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface PayrollEmployee {
  id: number;
  name: string;
  avatar?: string;
  ctc: number;
  salaryPerMonth: number;
  deduction: number;
  status: 'Completed' | 'Pending';
}

const PayrollPage = () => {
  const { t } = useTranslation();
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fix hydration by ensuring client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  const payrollData = useMemo<PayrollEmployee[]>(() => [
    { id: 8, name: 'Albert Flores', ctc: 60000, salaryPerMonth: 5000, deduction: 150, status: 'Completed' },
    { id: 9, name: 'Savannah Nguyen', ctc: 25000, salaryPerMonth: 2200, deduction: 0, status: 'Pending' },
    { id: 10, name: 'Marvin McKinney', ctc: 30000, salaryPerMonth: 2700, deduction: 0, status: 'Completed' },
    { id: 11, name: 'Jerome Bell', ctc: 78000, salaryPerMonth: 6400, deduction: 0, status: 'Completed' },
  ], []);

  // Filter payroll by search term
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
      ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
      : 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
  };

  const formatCurrency = (amount: number): string => {
    return `$${amount.toLocaleString()}`;
  };

  const handleExport = () => {
    alert(t('exportAlert', { defaultValue: 'Export functionality would be implemented here' }));
  };

  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  // Show loading or fallback until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
        <div className="border-gray-200 px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Paie</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Toutes les fiches de paie des employés</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Rechercher"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
                />
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <Bell className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 cursor-pointer select-none">
                <div className="relative w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg">
                  R
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Robert Allen</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Gestionnaire RH</p>
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
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
              <div className="p-6 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Chargement...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{t('payroll.title', { defaultValue: 'Paie' })}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('payroll.subtitle', { defaultValue: 'Toutes les fiches de paie des employés' })}</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder', { defaultValue: 'Rechercher' })}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
              />
            </div>

            <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label={t('notifications', { defaultValue: 'Notifications' })}>
              <Bell className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 cursor-pointer select-none">
              <div className="relative w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg">
                R
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t('user.name', { defaultValue: 'Robert Allen' })}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('role.hrManager', { defaultValue: 'Gestionnaire RH' })}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={t('search.placeholder', { defaultValue: 'Rechercher' })}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-900 dark:text-white"
                  />
                </div>

                <button
                  onClick={handleExport}
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  {t('payroll.export', { defaultValue: 'Exporter' })}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.employeeName', { defaultValue: 'Nom de l\'employé' })}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.ctc', { defaultValue: 'CTC' })}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.salaryPerMonth', { defaultValue: 'Salaire par mois' })}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.deduction', { defaultValue: 'Déduction' })}
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      {t('payroll.status', { defaultValue: 'Statut' })}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedData.map((employee) => (
                    <tr key={employee.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-lg select-none">
                            {getInitial(employee.name)}
                          </div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {employee.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(employee.ctc)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {formatCurrency(employee.salaryPerMonth)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                        {employee.deduction > 0 ? formatCurrency(employee.deduction) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {t(`payroll.status.${employee.status.toLowerCase()}`, { 
                            defaultValue: employee.status === 'Completed' ? 'Terminé' : 'En attente' 
                          })}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  {t('payroll.showingResults', {
                    defaultValue: `Affichage de ${startIndex + 1} à ${Math.min(startIndex + itemsPerPage, filteredData.length)} sur ${filteredData.length} résultats`,
                    start: startIndex + 1,
                    end: Math.min(startIndex + itemsPerPage, filteredData.length),
                    total: filteredData.length,
                  })}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label={t('pagination.previous', { defaultValue: 'Page précédente' })}
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
                          : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                      aria-current={currentPage === index + 1 ? 'page' : undefined}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-700"
                    aria-label={t('pagination.next', { defaultValue: 'Page suivante' })}
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