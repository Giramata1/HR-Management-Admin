'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, ChevronRight } from 'lucide-react';
import Link from 'next/link';


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
  
  const [searchTerm, setSearchTerm] = useState('');

  const departments: Departments = {
    'Design Department': [
      { name: 'Dianne Russell', title: 'Lead UI/UX Designer', avatar: '' },
      { name: 'Arlene McCoy', title: 'Sr UI/UX Designer', avatar: '' },
      { name: 'Cody Fisher', title: 'Sr UI/UX Designer', avatar: '' },
      { name: 'Theresa Webb', title: 'UI/UX Designer', avatar: '' },
      { name: 'Ronald Richards', title: 'UI/UX Designer', avatar: '' },
    ],
    'Sales Department': [
      { name: 'Darrell Steward', title: 'Sr Sales Manager', avatar: '' },
      { name: 'Kristin Watson', title: 'Sr Sales Manager', avatar: '' },
      { name: 'Courtney Henry', title: 'BDM', avatar: '' },
      { name: 'Kathryn Murphy', title: 'BDE', avatar: '' },
      { name: 'Albert Flores', title: 'Sales', avatar: '' },
    ],
    'Project Manager Department': [
      { name: 'Leslie Alexander', title: 'Sr Project Manager', avatar: '' },
      { name: 'Ronald Richards', title: 'Sr Project Manager', avatar: '' },
      { name: 'Savannah Nguyen', title: 'Project Manager', avatar: '' },
      { name: 'Eleanor Pena', title: 'Project Manager', avatar: '' },
      { name: 'Esther Howard', title: 'Project Manager', avatar: '' },
    ],
    'Marketing Department': [
      { name: 'Wade Warren', title: 'Sr Marketing Manager', avatar: '' },
      { name: 'Brooklyn Simmons', title: 'Sr Marketing Manager', avatar: '' },
      { name: 'Kristin Watson', title: 'Marketing Coordinator', avatar: '' },
      { name: 'Jacob Jones', title: 'Marketing Coordinator', avatar: '' },
      { name: 'Cody Fisher', title: 'Marketing', avatar: '' },
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
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">All Departments</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">All Departments Information</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button className="text-gray-400 hover:text-gray-600 dark:hover:text-white border-0 p-2" title="notifications">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>RA</AvatarFallback>
                </Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Robert Allen</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">HR Manager</p>
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
              placeholder="Search"
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">{employees.length} Members</p>
                  </div>
                  <Link
                    href={`/departments/all`}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    View All
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
