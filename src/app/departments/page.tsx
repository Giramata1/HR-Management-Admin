'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input
    className={`py-2 px-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white dark:bg-gray-800 text-black dark:text-white ${className || ''}`}
    {...props}
  />
);

const Button = ({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
  <button className={`px-3 py-2 rounded-md border text-sm text-gray-600 dark:text-gray-300 ${className || ''}`} {...props}>
    {children}
  </button>
);

const Avatar = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-semibold flex items-center justify-center ${className || ''}`}>
    {children}
  </div>
);

const AvatarFallback = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`w-full h-full flex items-center justify-center ${className || ''}`}>
    {children}
  </div>
);

interface Employee {
  name: string;
  title: string;
  avatar: string;
}

interface Departments {
  [key: string]: Employee[];
}

const Index = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const departments: Departments = {
    [t('departments.design')]: [
      { name: 'Dianne Russell', title: t('roles.leadUIUXDesigner'), avatar: '' },
      { name: 'Arlene McCoy', title: t('roles.srUIUXDesigner'), avatar: '' },
      { name: 'Cody Fisher', title: t('roles.srUIUXDesigner'), avatar: '' },
      { name: 'Theresa Webb', title: t('roles.uiuxDesigner'), avatar: '' },
      { name: 'Ronald Richards', title: t('roles.uiuxDesigner'), avatar: '' },
    ],
    [t('departments.sale')]: [
      { name: 'Darrell Steward', title: t('roles.srSalesManager'), avatar: '' },
      { name: 'Kristin Watson', title: t('roles.srSalesManager'), avatar: '' },
      { name: 'Courtney Henry', title: t('roles.bdm'), avatar: '' },
      { name: 'Kathryn Murphy', title: t('roles.bde'), avatar: '' },
      { name: 'Albert Flores', title: t('roles.sales'), avatar: '' },
    ],
    [t('departments.projectManager')]: [
      { name: 'Leslie Alexander', title: t('roles.srProjectManager'), avatar: '' },
      { name: 'Ronald Richards', title: t('roles.srProjectManager'), avatar: '' },
      { name: 'Savannah Nguyen', title: t('roles.projectManager'), avatar: '' },
      { name: 'Eleanor Pena', title: t('roles.projectManager'), avatar: '' },
      { name: 'Esther Howard', title: t('roles.projectManager'), avatar: '' },
    ],
    [t('departments.marketing')]: [
      { name: 'Wade Warren', title: t('roles.srMarketingManager'), avatar: '' },
      { name: 'Brooklyn Simmons', title: t('roles.srMarketingManager'), avatar: '' },
      { name: 'Kristin Watson', title: t('roles.marketingCoordinator'), avatar: '' },
      { name: 'Jacob Jones', title: t('roles.marketingCoordinator'), avatar: '' },
      { name: 'Cody Fisher', title: t('roles.marketing'), avatar: '' },
    ],
  };

  const filteredDepartments = Object.keys(departments).reduce((acc, dept) => {
    const filteredEmployees = departments[dept].filter(emp =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredEmployees.length > 0) {
      acc[dept] = filteredEmployees;
    }
    return acc;
  }, {} as Departments);

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('allDepartments.title')}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('allDepartments.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t('header.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white border-0 p-2"
                title={t('notifications.title')}
              >
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>RA</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{t('header.helloUser', { name: 'Robert Allen' })}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t('role.hrManager')}</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {Object.entries(filteredDepartments).map(([deptName, employees]) => (
            <div key={deptName} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{deptName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{employees.length} {t('members')}</p>
                  </div>
                  <Link
                    href={`/departments/all`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    {t('viewAllDepartments')}
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {employees.slice(0, 5).map((employee, idx) => (
                  <div key={idx} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback>
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{employee.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{employee.title}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;