
'use client';

import { Search, Bell, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface Employee {
  name: string;
  title: string;
  type: string;
  time: string;
  status: 'On Time' | 'Late';
}

const employees: Employee[] = [
  { name: 'Albert Flores', title: 'React JS', type: 'Remote', time: '09:29 AM', status: 'On Time' },
  { name: 'Savannah Nguyen', title: 'IOS Developer', type: 'Remote', time: '10:50 AM', status: 'Late' },
  { name: 'Jenny Wilson', title: 'React JS Developer', type: 'Remote', time: '11:30 AM', status: 'Late' },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export default function AttendancePage() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Ensure language is set client-side to match user preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') || 'en';
    if (i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filtered.slice(startIndex, startIndex + itemsPerPage);

  // Status mapping to match translation keys
  const statusMap: Record<string, string> = {
    'On Time': 'onTime',
    'Late': 'late',
  };

  return (
    <div className="min-h-screen text-gray-900 dark:text-white bg-white dark:bg-gray-900 px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">{t('attendance.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('attendanceTable.title')}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('search.placeholder') || 'Search'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-72 bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <button className="p-2 rounded-full border border-gray-200 dark:border-gray-700" aria-label={t('notifications.title')}>
            <Bell className="h-5 w-5 text-gray-500 dark:text-gray-300" />
          </button>

          <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-700 dark:text-white">
              RA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">Robert Allen</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('role.hrManager')}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative max-w-sm">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('search.placeholder') || 'Search'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                  {t('attendanceTable.name')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                  {t('attendanceTable.designation')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                  {t('attendanceTable.type')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                  {t('attendanceTable.checkIn')}
                </th>
                <th className="px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300">
                  {t('attendanceTable.status')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('attendanceTable.noRecords')}
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp, i) => {
                  const roleKey = emp.title.toLowerCase().replace(/ /g, '').replace(/\//g, '');
                  console.log(`Looking up role key: roles.${roleKey} for ${emp.title}`); // Debug log
                  return (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-700 dark:text-white">
                          {getInitials(emp.name)}
                        </div>
                        {emp.name}
                      </td>
                      <td className="px-6 py-3">{t(`roles.${roleKey}`) || emp.title}</td>
                      <td className="px-6 py-3">{t(`employees.types.${emp.type.toLowerCase()}`) || emp.type}</td>
                      <td className="px-6 py-3">{emp.time}</td>
                      <td className="px-6 py-3">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            emp.status === 'On Time'
                              ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300'
                              : 'bg-red-100 text-red-500 dark:bg-red-900 dark:text-red-300'
                          }`}
                        >
                          {t(`attendanceTable.${statusMap[emp.status]}`) || emp.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span>{t('attendanceTable.showing') || 'Showing'}</span>
            <select
              className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              onChange={(e) => {
                const newItemsPerPage = parseInt(e.target.value);
                setItemsPerPage(newItemsPerPage);
                setCurrentPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
            </select>
          </div>
          <p>
            {t('employees.showing', {
              count: paginatedEmployees.length,
              total: filtered.length,
            }) || `Showing ${startIndex + 1} to ${Math.min(startIndex + itemsPerPage, filtered.length)} out of ${filtered.length} results`}
          </p>
          <div className="flex items-center gap-1">
            <button
              className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              {'<'}
            </button>
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                className={`px-2 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              {'>'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}