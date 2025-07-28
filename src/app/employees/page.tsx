'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Plus, Eye, Edit2, Trash2, Filter, Loader2, CheckCircle2 } from 'lucide-react';
import { Employee } from '@/types/employee';


const fakeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      if (typeof window !== 'undefined') {
        const storedEmployees = localStorage.getItem('employees');
        return storedEmployees ? JSON.parse(storedEmployees) : [];
      } return [];
    } catch (error) { console.error("Failed to parse employees from localStorage:", error); return []; }
  },
  deleteEmployee: async (employeeId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const employees = await fakeApi.getEmployees();
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    if (typeof window !== 'undefined') localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },
  updateEmployee: async (updatedEmployee: Employee): Promise<Employee> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const employees = await fakeApi.getEmployees();
    const updatedEmployees = employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
    if (typeof window !== 'undefined') localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    return updatedEmployee;
  }
};

// --- Child Components (Unchanged) ---
const EmployeeAvatar = ({ src, name }: { src: string | null; name: string }) => {
    const [imgSrc, setImgSrc] = useState(src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`);
    useEffect(() => { setImgSrc(src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`) }, [src, name]);
    return (<Image src={imgSrc} alt={name} width={36} height={36} className="w-9 h-9 rounded-full object-cover" onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`)} />);
};
const SuccessModal = ({ onClose, message }: { onClose: () => void; message: string; }) => ( <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-sm w-full"><CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" /><h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Success!</h2><p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p><button onClick={onClose} className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Done</button></div></div>);
const EditEmployeeModal = ({ employee, onSave, onCancel }: { employee: Employee; onSave: (updatedData: Employee) => void; onCancel: () => void; }) => {
    const [formData, setFormData] = useState<Employee>(employee);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');
        if (section === 'personalInfo' || section === 'professionalInfo' || section === 'accountAccess') { setFormData(prev => { const currentSection = prev[section as keyof Employee]; if (typeof currentSection === 'object' && currentSection !== null) { const updatedSection = { ...currentSection, [key]: value }; return { ...prev, [section]: updatedSection }; } return prev; }); }
    };
    const handleSave = () => { onSave(formData); };
    return (<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"><div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-lg"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Employee</h3><div className="my-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm font-medium text-gray-600 dark:text-gray-300">First Name</label><input type="text" name="personalInfo.firstName" value={formData.personalInfo.firstName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/></div><div><label className="text-sm font-medium text-gray-600 dark:text-gray-300">Last Name</label><input type="text" name="personalInfo.lastName" value={formData.personalInfo.lastName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/></div></div><div><label className="text-sm font-medium text-gray-600 dark:text-gray-300">Department</label><input type="text" name="professionalInfo.department" value={formData.professionalInfo.department} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/></div><div><label className="text-sm font-medium text-gray-600 dark:text-gray-300">Designation</label><input type="text" name="professionalInfo.designation" value={formData.professionalInfo.designation} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"/></div></div><div className="flex justify-end gap-4 mt-6"><button onClick={onCancel} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button><button onClick={handleSave} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700">Save Changes</button></div></div></div>);
};


// --- Main Page Component ---
export default function EmployeeTablePage() {
  const router = useRouter();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const fetchEmployees = useCallback(async () => {
    try { setLoading(true); const data = await fakeApi.getEmployees(); setEmployees(data); }
    catch (err) { setError('Failed to fetch employee data.'); console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    if (!searchQuery) return employees;
    const lowercasedQuery = searchQuery.toLowerCase();
    return employees.filter(emp =>
      `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`.toLowerCase().includes(lowercasedQuery) ||
      (emp.id && emp.id.toLowerCase().includes(lowercasedQuery)) ||
      (emp.professionalInfo?.department && emp.professionalInfo.department.toLowerCase().includes(lowercasedQuery))
    );
  }, [employees, searchQuery]);

  // --- Handlers ---
  const handleSaveEdit = async (updatedEmployee: Employee) => {
    try {
        await fakeApi.updateEmployee(updatedEmployee);
        setEmployeeToEdit(null);
        setModalMessage(`Employee "${updatedEmployee.personalInfo.firstName}" has been updated successfully.`);
        setShowSuccessModal(true);
        fetchEmployees();
    } catch(err) { alert("Failed to update employee."); console.error(err); }
  };
  const handleDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await fakeApi.deleteEmployee(employeeToDelete.id);
      setModalMessage(`Employee "${employeeToDelete.personalInfo?.firstName}" has been deleted successfully.`);
      setShowSuccessModal(true);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (err) { alert('Failed to delete employee.'); console.error(err); }
  };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-12 h-12 animate-spin text-purple-600" /></div>;
  if (error) return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by name, ID, or department..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 w-64 border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg text-sm"/></div>
          <div className="flex items-center gap-3"><button onClick={() => router.push('/employees/add')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors"><Plus className="w-5 h-5"/> Add New Employee</button><button className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><Filter className="w-5 h-5"/> Filter</button></div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700"><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Name</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {/* THIS IS THE ONLY CHANGE: Changed .slice(0, 10) to .slice(0, 5) */}
              {filteredEmployees.slice(0, 5).map(emp => (
                emp && (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><EmployeeAvatar src={emp.profileImage} name={`${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`} /><span className="font-medium text-sm text-gray-800 dark:text-white">{`${emp.personalInfo?.firstName || 'N/A'} ${emp.personalInfo?.lastName || ''}`}</span></div></td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{emp.id || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{emp.professionalInfo?.department || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{emp.professionalInfo?.designation || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize whitespace-nowrap">{emp.professionalInfo?.employeeType || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${emp.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>{emp.status || 'inactive'}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3 text-gray-500"><button onClick={() => router.push(`/employees/${emp.id}`)} title="View"><Eye className="w-5 h-5 hover:text-blue-600"/></button><button onClick={() => setEmployeeToEdit(emp)} title="Edit"><Edit2 className="w-5 h-5 hover:text-yellow-600"/></button><button onClick={() => setEmployeeToDelete(emp)} title="Delete"><Trash2 className="w-5 h-5 hover:text-red-600"/></button></div></td>
                  </tr>
                )
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Modals are unchanged */}
      {employeeToDelete && (<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"><div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3><p className="my-4 text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete <span className="font-semibold">{`${employeeToDelete.personalInfo?.firstName || ''} ${employeeToDelete.personalInfo?.lastName || ''}`}</span>? This action cannot be undone.</p><div className="flex justify-end gap-4 mt-6"><button onClick={() => setEmployeeToDelete(null)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button><button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700">Delete</button></div></div></div>)}
      {showSuccessModal && (<SuccessModal message={modalMessage} onClose={() => setShowSuccessModal(false)} />)}
      {employeeToEdit && (<EditEmployeeModal employee={employeeToEdit} onSave={handleSaveEdit} onCancel={() => setEmployeeToEdit(null)} />)}
    </div>
  );
}
