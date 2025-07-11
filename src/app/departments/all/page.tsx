'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Search,
  Bell,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  Filter,
  Plus,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

// Utility Components
const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input
    className={`py-2 px-3 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500 ${
      className || ''
    }`}
    {...props}
  />
);

const Button = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
  <button
    className={`px-3 py-2 rounded-md text-sm transition-colors ${
      className || ''
    }`}
    {...props}
  >
    {children}
  </button>
);

const Avatar = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-white font-semibold flex items-center justify-center ${
      className || ''
    }`}
  >
    {children}
  </div>
);

const AvatarFallback = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`w-full h-full flex items-center justify-center ${className || ''}`}>
    {children}
  </div>
);

// Dynamic department translation keys
const departmentTitles: Record<string, string> = {
  sale: 'departments.sale',
  design: 'departments.design',
  'project-manager': 'departments.projectManager',
  marketing: 'departments.marketing',
};

interface Employee {
  id: string;
  name: string;
  title: string;
  avatar: string;
  type: string;
  status: string;
}

const DepartmentDetail = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const params = useParams();
  const slug = (params.department as string)?.toLowerCase();
  const department = t(departmentTitles[slug] || 'departments.default');

  const isDarkMode =
    theme === 'dark' ||
    (theme === 'auto' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const itemsPerPage = 10;

  // Dummy Employee Data
  const employees: Employee[] = [
    {
      id: '345321231',
      name: 'Darlene Robertson',
      title: t('employees.roles.leadUIUXDesigner'),
      avatar: '',
      type: 'office',
      status: 'permanent',
    },
    {
      id: '987890345',
      name: 'Floyd Miles',
      title: t('employees.roles.leadUIUXDesigner'),
      avatar: '',
      type: 'office',
      status: 'permanent',
    },
    {
      id: '453367122',
      name: 'Cody Fisher',
      title: t('employees.roles.srUIUXDesigner'),
      avatar: '',
      type: 'office',
      status: 'permanent',
    },
    {
      id: '999999999',
      name: 'Dianne Russell',
      title: t('employees.roles.srUIUXDesigner'),
      avatar: '',
      type: 'remote',
      status: 'permanent',
    },
  ];

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  };

  // Filters
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter ? emp.type === typeFilter : true;
    const matchesStatus = statusFilter ? emp.status === statusFilter : true;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        isDarkMode ? 'dark:bg-gray-900' : ''
      } text-gray-900 ${isDarkMode ? 'dark:text-white' : ''}`}
    >
      {/* Header */}
      <div
        className={`bg-white ${isDarkMode ? 'dark:bg-gray-800' : ''} border-b border-gray-200 ${
          isDarkMode ? 'dark:border-gray-700' : ''
        }`}
      >
        <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center py-4 sm:py-6 space-y-4 sm:space-y-0">
            <div>
              <div
                className={`flex items-center space-x-2 text-xs sm:text-sm ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                } mb-1`}
              >
                <Link
                  href="/"
                  className={isDarkMode ? 'hover:text-white' : 'hover:text-gray-700'}
                >
                  {t('departments.all')}
                </Link>
                <span>›</span>
                <span
                  className={`font-medium ${
                    isDarkMode ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  {department}
                </span>
              </div>
              <h1
                className={`text-lg sm:text-2xl font-semibold ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}
              >
                {department}
              </h1>
            </div>
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="relative w-full sm:w-48 md:w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('search.placeholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
              <Button className="text-gray-400 hover:text-gray-600 dark:hover:text-white border-0 p-2">
                <Bell className="h-5 w-5" />
              </Button>
              <div
                className="flex items-center space-x-2 sm:space-x-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 sm:px-3 py-2"
                aria-label={t('role.hrManager')}
              >
                <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                  <AvatarFallback>RA</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Robert Allen
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('role.hrManager')}
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Filter/Search/Add */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('search.placeholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-3 relative">
            <Button className="bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2 px-3 sm:px-4 py-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">{t('employees.addNew')}</span>
              <span className="sm:hidden">{t('employees.add')}</span>
            </Button>
            <Button
              onClick={() => setShowFilter(!showFilter)}
              className="border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2 px-3 sm:px-4 py-2"
            >
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">{t('employees.filter')}</span>
              <span className="sm:hidden">{t('employees.filterShort')}</span>
            </Button>

            {/* Filter Dropdown */}
            {showFilter && (
              <div className="absolute right-0 top-12 z-10 bg-white dark:bg-gray-800 shadow-lg border dark:border-gray-700 rounded-md p-4 space-y-3 w-64 sm:w-72">
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300">
                    {t('employees.type')}
                  </label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">{t('common.all')}</option>
                    <option value="office">{t('employees.types.office')}</option>
                    <option value="remote">{t('employees.types.remote')}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium dark:text-gray-300">
                    {t('employees.status.label')}
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                  >
                    <option value="">{t('common.all')}</option>
                    <option value="permanent">{t('employees.status.permanent')}</option>
                    {/* Add more statuses here */}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                {[
                  t('employees.table.employeeID'),
                  t('employees.table.employeeName'),
                  t('employees.table.designation'),
                  t('employees.table.type'),
                  t('employees.table.status'),
                  t('employees.table.actions'),
                ].map((text, i) => (
                  <th
                    key={i}
                    className="px-4 sm:px-6 py-3 text-left text-xs font-medium dark:text-gray-300 text-gray-500 uppercase"
                  >
                    {text}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedEmployees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    {t('employees.noEmployees')}
                  </td>
                </tr>
              ) : (
                paginatedEmployees.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {emp.id}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                          <AvatarFallback>{getInitials(emp.name)}</AvatarFallback>
                        </Avatar>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {emp.name}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {emp.title}
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm text-gray-900 dark:text-white">
                      {t(`employees.types.${emp.type}`)}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-300">
                        {t(`employees.status.${emp.status}`)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                          aria-label={t('employees.actions.view')}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-white"
                          aria-label={t('employees.actions.edit')}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          className="text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                          aria-label={t('employees.actions.delete')}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6 space-y-4 sm:space-y-0">
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {filteredEmployees.length > 0
              ? t('employees.showing', {
                  count: paginatedEmployees.length,
                  total: filteredEmployees.length,
                })
              : null}
          </span>
          <div className="flex items-center space-x-1 flex-wrap">
            <Button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="border border-gray-300 dark:border-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              &lt;
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`border border-gray-300 dark:border-gray-700 px-3 py-1 rounded ${
                  currentPage === i + 1
                    ? 'bg-purple-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="border border-gray-300 dark:border-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              &gt;
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
