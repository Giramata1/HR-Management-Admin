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

const Input = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { className?: string }) => (
  <input
    className={`py-2 px-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 ${className || ''}`}
    {...props}
  />
);

const Button = ({
  className,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { className?: string }) => (
  <button
    className={`px-3 py-2 rounded-md text-sm transition-colors ${className || ''}`}
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
  <div className={`rounded-full bg-gray-100 text-gray-600 font-semibold flex items-center justify-center ${className || ''}`}>
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

const departmentTitles: Record<string, string> = {
  sale: 'Sale Department',
  design: 'Design Department',
  'project-manager': 'Project Manager Department',
  marketing: 'Marketing Department',
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
  const params = useParams();
  const slug = (params.department as string)?.toLowerCase();
  const department = departmentTitles[slug] || 'Department';

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const itemsPerPage = 10;

  const employees: Employee[] = [
    { id: '345321231', name: 'Darlene Robertson', title: 'Lead UI/UX Designer', avatar: '', type: 'Office', status: 'Permanent' },
    { id: '987890345', name: 'Floyd Miles', title: 'Lead UI/UX Designer', avatar: '', type: 'Office', status: 'Permanent' },
    { id: '453367122', name: 'Cody Fisher', title: 'Sr. UI/UX Designer', avatar: '', type: 'Office', status: 'Permanent' },
    { id: '999999999', name: 'Dianne Russell', title: 'Sr. UI/UX Designer', avatar: '', type: 'Remote', status: 'Permanent' },
  ];

  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : words[0].slice(0, 2).toUpperCase();
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          emp.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = typeFilter ? emp.type === typeFilter : true;
    const matchesStatus = statusFilter ? emp.status === statusFilter : true;

    return matchesSearch && matchesType && matchesStatus;
  });

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-50">
<<<<<<< HEAD
      
=======
     
>>>>>>> b7f380b0a5a201b025fdd3e37de15b934fb42c37
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <div className="flex items-center space-x-2 text-sm text-gray-500 mb-1">
                <Link href="/" className="hover:text-gray-700">All Departments</Link>
                <span>›</span>
                <span className="text-gray-900 font-medium">{department}</span>
              </div>
              <h1 className="text-2xl font-semibold text-gray-900">{department}</h1>
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
              <Button className="text-gray-400 hover:text-gray-600 border-0 p-2">
                <Bell className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3 bg-white border border-gray-200 rounded-lg px-3 py-2">
                <Avatar className="h-8 w-8"><AvatarFallback>RA</AvatarFallback></Avatar>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">Robert Allen</p>
                  <p className="text-xs text-gray-500">HR Manager</p>
                </div>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

<<<<<<< HEAD
      
=======
     
>>>>>>> b7f380b0a5a201b025fdd3e37de15b934fb42c37
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>
          <div className="flex items-center space-x-3 relative">
            <Button className="bg-purple-600 text-white hover:bg-purple-700 flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add New Employee</span>
            </Button>
            <Button
              onClick={() => setShowFilter(!showFilter)}
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
            {showFilter && (
              <div className="absolute right-0 top-12 z-10 bg-white shadow-lg border rounded-md p-4 space-y-3 w-64">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                  >
                    <option value="">All</option>
                    <option value="Office">Office</option>
                    <option value="Remote">Remote</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-sm"
                  >
                    <option value="">All</option>
                    <option value="Permanent">Permanent</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

<<<<<<< HEAD
        
=======
>>>>>>> b7f380b0a5a201b025fdd3e37de15b934fb42c37
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Designation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{emp.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback>{getInitials(emp.name)}</AvatarFallback>
                      </Avatar>
                      <div><p className="text-sm font-medium text-gray-900">{emp.name}</p></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{emp.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{emp.type}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded bg-blue-100 text-blue-400">{emp.status}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button className="text-gray-400 hover:text-gray-600"><Eye className="h-4 w-4" /></button>
                      <button className="text-gray-400 hover:text-gray-600"><Edit className="h-4 w-4" /></button>
                      <button className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

<<<<<<< HEAD
        
=======
       
>>>>>>> b7f380b0a5a201b025fdd3e37de15b934fb42c37
        <div className="flex items-center justify-between mt-6">
          <span className="text-sm text-gray-700">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredEmployees.length)} of {filteredEmployees.length}
          </span>
          <div className="flex items-center space-x-1">
            <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>‹</Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button key={i} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'bg-purple-600 text-white' : ''}>
                {i + 1}
              </Button>
            ))}
            <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>›</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;
