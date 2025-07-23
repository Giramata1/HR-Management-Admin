'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Plus, Eye, Edit2, Trash2, Filter, Loader2,  Bell, ChevronDown } from 'lucide-react'
import { Employee } from '@/types/employee' // Adjust path if needed

// --- FAKE API using localStorage ---
const fakeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    console.log("FAKE API (Table): Fetching employees from localStorage...");
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const storedEmployees = localStorage.getItem('employees');
      return storedEmployees ? JSON.parse(storedEmployees) : [];
    } catch (error) {
      console.error("Failed to parse employees from localStorage:", error);
      return [];
    }
  },
  deleteEmployee: async (employeeId: string): Promise<void> => {
    console.log(`FAKE API (Table): Deleting employee with ID: ${employeeId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    const employees = await fakeApi.getEmployees();
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    console.log("FAKE API (Table): Employee deleted successfully.");
  }
};

// Helper Avatar Component (No changes needed)
const EmployeeAvatar = ({ src, name }: { src: string | null; name: string }) => {
    const [imgSrc, setImgSrc] = useState(src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`);
    useEffect(() => { setImgSrc(src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`) }, [src, name]);
    
    return (
      <Image
        src={imgSrc}
        alt={name}
        width={36}
        height={36}
        className="w-9 h-9 rounded-full object-cover"
        onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`)}
      />
    );
};

// --- Main Component ---
export default function EmployeeTablePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await fakeApi.getEmployees();
        setEmployees(data);
      } catch (err) {
        setError('Failed to fetch employee data from localStorage.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const lowercasedQuery = searchQuery.toLowerCase();
    // FIX: Add optional chaining to prevent crash during filter
    return employees.filter(emp =>
      `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`.toLowerCase().includes(lowercasedQuery) ||
      (emp.id && emp.id.toLowerCase().includes(lowercasedQuery)) ||
      (emp.professionalInfo?.department && emp.professionalInfo.department.toLowerCase().includes(lowercasedQuery))
    );
  }, [employees, searchQuery]);

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await fakeApi.deleteEmployee(employeeToDelete.id);
      setEmployees(prev => prev.filter(emp => emp.id !== employeeToDelete.id));
      setEmployeeToDelete(null);
    } catch (err) {
      alert('Failed to delete employee. Please try again.');
      console.error(err);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-purple-600" /></div>;
  if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;

  return (
    <div className="bg-gray-50 dark:bg-gray-900 p-8 min-h-screen">
      {/* Header - RESTORED */}
      <header className="flex justify-between items-center mb-6">
        <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">All Employees</h1>
            <p className="text-sm text-gray-500">All Employees</p>
        </div>
        <div className="flex items-center gap-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-64 border bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-lg"/>
            </div>
            <Bell className="w-6 h-6 text-gray-500"/>
            <div className="flex items-center gap-2">
                <Image src="https://i.pravatar.cc/150?img=3" alt="User" width={40} height={40} className="rounded-full"/>
                <div>
                    <p className="font-semibold text-sm text-gray-800 dark:text-white">User</p>
                    <p className="text-xs text-gray-500">HR Manager</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500"/>
            </div>
        </div>
      </header>

      {/* Main Content - RESTORED */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 w-64 border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg text-sm"
                />
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => router.push('/employees/add')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700">
                    <Plus className="w-5 h-5"/> Add New Employee
                </button>
                <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold">
                    <Filter className="w-5 h-5"/> Filter
                </button>
            </div>
        </div>

        {/* Table - WITH FIXES */}
        <div className="overflow-x-auto">
            <table className="min-w-full">
                <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Employee Name</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Designation</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Type</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredEmployees.map(emp => (
                        // Check if emp object is valid before trying to render it
                        emp && (
                            <tr key={emp.id}>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {/* FIX: Use optional chaining and fallbacks to prevent crashes */}
                                        <EmployeeAvatar src={emp.profileImage} name={`${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`} />
                                        <span className="font-medium text-sm text-gray-800 dark:text-white">
                                            {`${emp.personalInfo?.firstName || 'N/A'} ${emp.personalInfo?.lastName || ''}`}
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">{emp.id || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{emp.professionalInfo?.department || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500">{emp.professionalInfo?.designation || 'N/A'}</td>
                                <td className="px-6 py-4 text-sm text-gray-500 capitalize">{emp.professionalInfo?.employeeType || 'N/A'}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {emp.status || 'inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3 text-gray-500">
                                        <button onClick={() => router.push(`/employees/${emp.id}`)} title="View"><Eye className="w-5 h-5 hover:text-blue-600"/></button>
                                        <button onClick={() => alert('Edit functionality to be implemented.')} title="Edit"><Edit2 className="w-5 h-5 hover:text-yellow-600"/></button>
                                        <button onClick={() => setEmployeeToDelete(emp)} title="Delete"><Trash2 className="w-5 h-5 hover:text-red-600"/></button>
                                    </div>
                                </td>
                            </tr>
                        )
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      
      {/* Delete Modal - WITH FIXES */}
      {employeeToDelete && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold">Confirm Deletion</h3>
                {/* FIX: Use optional chaining in the modal as well */}
                <p className="my-4 text-sm text-gray-600 dark:text-gray-300">
                    Are you sure you want to delete <span className="font-semibold">{`${employeeToDelete.personalInfo?.firstName || ''} ${employeeToDelete.personalInfo?.lastName || ''}`}</span>? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                    <button onClick={() => setEmployeeToDelete(null)} className="px-4 py-2 rounded-lg border">Cancel</button>
                    <button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}