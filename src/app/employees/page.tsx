'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, Plus, Eye, Edit2, Trash2, SlidersHorizontal, Loader2, CheckCircle2, X } from 'lucide-react';
import { Employee } from '@/types/employee';


const fakeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      if (typeof window !== 'undefined') {
        const storedEmployees = localStorage.getItem('employees');

       
        if (storedEmployees && JSON.parse(storedEmployees).length > 0) {
          console.log("Fetching employees from localStorage...");
          return JSON.parse(storedEmployees);
        }
      
        else {
          console.log("No employees Loading default data...");
          const rawEmployeeData = [
            { "employeeId": "EMP002", "firstName": "Arlene", "lastName": "McCoy", "email": "arlene.mccoy@company.com", "mobileNumber": "+12147483647", "department": "Design Department", "designation": "UI/UX Designer", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP003", "firstName": "Cody", "lastName": "Fisher", "email": "cody.fisher@company.com", "mobileNumber": "+12124230394", "department": "Design Department", "designation": "Graphic Designer", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP004", "firstName": "Theresa", "lastName": "Webb", "email": "theresa.webb@company.com", "mobileNumber": "+12147483647", "department": "Design Department", "designation": "Product Designer", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP005", "firstName": "Ronald", "lastName": "Richards", "email": "ronald.richards@company.com", "mobileNumber": "+12147483647", "department": "Design Department", "designation": "Design Lead", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP006", "firstName": "Darrell", "lastName": "Steward", "email": "darrell.steward@company.com", "mobileNumber": "+12147483647", "department": "Sales Department", "designation": "Sales Manager", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP007", "firstName": "Kristin", "lastName": "Watson", "email": "kristin.watson@company.com", "mobileNumber": "+12147483647", "department": "Sales Department", "designation": "Sales Executive", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP008", "firstName": "Courtney", "lastName": "Henry", "email": "courtney.henry@company.com", "mobileNumber": "+12147483647", "department": "Sales Department", "designation": "Account Manager", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP009", "firstName": "Kathryn", "lastName": "Murphy", "email": "kathryn.murphy@company.com", "mobileNumber": "+11099933386", "department": "Sales Department", "designation": "Sales Representative", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP010", "firstName": "Albert", "lastName": "Flores", "email": "albert.flores@company.com", "mobileNumber": "+12147483647", "department": "Sales Department", "designation": "Business Development", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP011", "firstName": "Wade", "lastName": "Warren", "email": "wade.warren@company.com", "mobileNumber": "+12147483647", "department": "Marketing Department", "designation": "Marketing Manager", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP012", "firstName": "Brooklyn", "lastName": "Simmons", "email": "brooklyn.simmons@company.com", "mobileNumber": "+12147483647", "department": "Marketing Department", "designation": "Digital Marketer", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP013", "firstName": "Jacob", "lastName": "Jones", "email": "jacob.jones@company.com", "mobileNumber": "+12147483647", "department": "Marketing Department", "designation": "Content Creator", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP014", "firstName": "Cody", "lastName": "Fisher", "email": "cody.fisher.marketing@company.com", "mobileNumber": "+12147483647", "department": "Marketing Department", "designation": "SEO Specialist", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP015", "firstName": "Leslie", "lastName": "Alexander", "email": "leslie.alexander@company.com", "mobileNumber": "+12147483647", "department": "Information Technology", "designation": "Project Manager", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP016", "firstName": "Savannah", "lastName": "Nguyen", "email": "savannah.nguyen@company.com", "mobileNumber": "+12147483647", "department": "Information Technology", "designation": "Software Developer", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP017", "firstName": "Eleanor", "lastName": "Pena", "email": "eleanor.pena@company.com", "mobileNumber": "+12074832620", "department": "Information Technology", "designation": "DevOps Engineer", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "EMP018", "firstName": "Esther", "lastName": "Howard", "email": "esther.howard@company.com", "mobileNumber": "+11826096727", "department": "Information Technology", "designation": "QA Engineer", "employeeType": "Full-time", "status": "Active" },
            { "employeeId": "HR001", "firstName": "HR", "lastName": "Manager", "email": "hrms.hr@gmail.com", "mobileNumber": "+1234567890", "department": "Human Resources", "designation": "HR Manager", "employeeType": "Full-time", "status": "Active" }
          ];

        
          const employeeData: Employee[] = rawEmployeeData.map(emp => ({
            id: emp.employeeId,
            personalInfo: { profileImage: null, firstName: emp.firstName, lastName: emp.lastName, mobileNumber: emp.mobileNumber, email: emp.email, dateOfBirth: 'N/A', maritalStatus: 'N/A', gender: 'N/A', nationality: 'N/A', address: 'N/A', city: 'N/A', state: 'N/A', zipCode: 'N/A' },
            professionalInfo: { department: emp.department, designation: emp.designation, employeeType: emp.employeeType, userName: emp.email.split('@')[0], emailAddress: emp.email, workingDays: 'Mon-Fri', joiningDate: 'N/A', officeLocation: 'N/A' },
           
            status: emp.status.toLowerCase() as 'active' | 'inactive',
            profileImage: null,
            documents: [],
            accountAccess: { slackId: '', skypeId: '', githubId: '' }
          }));

          localStorage.setItem('employees', JSON.stringify(employeeData));
          return employeeData;
        }
      }
      return [];
    } catch (error) {
      console.error("Failed to process employees:", error);
      return [];
    }
  },
  deleteEmployee: async (employeeId: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedEmployees = localStorage.getItem('employees');
    const employees: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : [];
    const updatedEmployees = employees.filter(emp => emp.id !== employeeId);
    if (typeof window !== 'undefined') localStorage.setItem('employees', JSON.stringify(updatedEmployees));
  },
  updateEmployee: async (updatedEmployee: Employee): Promise<Employee> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedEmployees = localStorage.getItem('employees');
    const employees: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : [];
    const updatedEmployees = employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
    if (typeof window !== 'undefined') localStorage.setItem('employees', JSON.stringify(updatedEmployees));
    return updatedEmployee;
  }
};



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
const FilterModal = ({ isOpen, onClose, onApply, currentFilters, allDepartments }: { isOpen: boolean; onClose: () => void; onApply: (filters: { departments: string[]; employeeType: string }) => void; currentFilters: { departments: string[]; employeeType: string }; allDepartments: string[]; }) => {
  const [tempFilters, setTempFilters] = useState(currentFilters);
  const [internalSearch, setInternalSearch] = useState('');
  useEffect(() => { setTempFilters(currentFilters); }, [isOpen, currentFilters]);
  const handleDepartmentChange = (department: string) => { setTempFilters(prev => { const newDepartments = prev.departments.includes(department) ? prev.departments.filter(d => d !== department) : [...prev.departments, department]; return { ...prev, departments: newDepartments }; }); };
  const handleApply = () => { onApply(tempFilters); onClose(); };
  const handleCancel = () => { setTempFilters(currentFilters); onClose(); };
  const filteredDepartments = allDepartments.filter(dept => dept.toLowerCase().includes(internalSearch.toLowerCase()));
  if (!isOpen) return null;
  return (<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"><div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md"><div className="flex justify-between items-center mb-6"><h2 className="text-xl font-bold text-gray-900 dark:text-white">Filter</h2><button onClick={onClose} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"><X size={20} /></button></div><div className="relative mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search Departments..." value={internalSearch} onChange={(e) => setInternalSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg text-sm" /></div><div className="mb-6"><h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Department</h3><div className="grid grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2">{filteredDepartments.map(dept => (<label key={dept} className="flex items-center space-x-2 cursor-pointer"><input type="checkbox" checked={tempFilters.departments.includes(dept)} onChange={() => handleDepartmentChange(dept)} className="h-4 w-4 rounded text-purple-600 focus:ring-purple-500 border-gray-300" /><span className="text-sm text-gray-700 dark:text-gray-300">{dept}</span></label>))}</div></div><div className="mb-8"><h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Select Type</h3><div className="flex items-center space-x-6"><label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="employeeType" value="Office" checked={tempFilters.employeeType === 'Office'} onChange={(e) => setTempFilters(prev => ({...prev, employeeType: e.target.value}))} className="h-4 w-4 text-purple-600 focus:ring-purple-500" /><span className="text-sm text-gray-700 dark:text-gray-300">Office</span></label><label className="flex items-center space-x-2 cursor-pointer"><input type="radio" name="employeeType" value="Remote" checked={tempFilters.employeeType === 'Remote'} onChange={(e) => setTempFilters(prev => ({...prev, employeeType: e.target.value}))} className="h-4 w-4 text-purple-600 focus:ring-purple-500" /><span className="text-sm text-gray-700 dark:text-gray-300">Work from Home</span></label></div></div><div className="flex justify-end gap-4"><button onClick={handleCancel} className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button><button onClick={handleApply} className="px-6 py-2 rounded-lg bg-purple-600 text-white font-semibold text-sm hover:bg-purple-700">Apply</button></div></div></div>);
};



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
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filters, setFilters] = useState({ departments: [] as string[], employeeType: '' });

  
  const departmentOptions = useMemo(() => {
    const depts = employees.map(emp => emp.professionalInfo.department);
    return Array.from(new Set(depts)); 
  }, [employees]);

  const fetchEmployees = useCallback(async () => { try { setLoading(true); const data = await fakeApi.getEmployees(); setEmployees(data); } catch (err) { setError('Failed to fetch employee data.'); console.error(err); } finally { setLoading(false); } }, []);
  useEffect(() => { fetchEmployees(); }, [fetchEmployees]);

  const filteredEmployees = useMemo(() => {
    let filtered = employees;
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(emp =>
        `${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`.toLowerCase().includes(lowercasedQuery) ||
        (emp.id && emp.id.toLowerCase().includes(lowercasedQuery))
      );
    }
    if (filters.departments.length > 0) {
      filtered = filtered.filter(emp =>
        emp.professionalInfo?.department && filters.departments.includes(emp.professionalInfo.department)
      );
    }
    if (filters.employeeType) {
      const isRemote = filters.employeeType === 'Remote';
      filtered = filtered.filter(emp => {
          const officeLocation = emp.professionalInfo?.officeLocation?.toLowerCase();
          return isRemote ? officeLocation === 'remote' : officeLocation !== 'remote';
      });
    }
    return filtered;
  }, [employees, searchQuery, filters]);

  const handleSaveEdit = async (updatedEmployee: Employee) => { try { await fakeApi.updateEmployee(updatedEmployee); setEmployeeToEdit(null); setModalMessage(`Employee "${updatedEmployee.personalInfo.firstName}" has been updated successfully.`); setShowSuccessModal(true); fetchEmployees(); } catch(err) { alert("Failed to update employee."); console.error(err); } };
  const handleDelete = async () => { if (!employeeToDelete) return; try { await fakeApi.deleteEmployee(employeeToDelete.id); setModalMessage(`Employee "${employeeToDelete.personalInfo.firstName}" has been deleted successfully.`); setShowSuccessModal(true); setEmployeeToDelete(null); fetchEmployees(); } catch (err) { alert('Failed to delete employee.'); console.error(err); } };
  const handleApplyFilters = (newFilters: { departments: string[]; employeeType: string }) => { setFilters(newFilters); };

  if (loading) return <div className="flex justify-center items-center h-full"><Loader2 className="w-12 h-12 animate-spin text-purple-600" /></div>;
  if (error) return <div className="flex justify-center items-center h-full text-red-500">{error}</div>;

  return (<div><div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"><div className="flex justify-between items-center mb-4 flex-wrap gap-4"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" /><input type="text" placeholder="Search by name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 pr-4 py-2 w-64 border bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 rounded-lg text-sm"/></div><div className="flex items-center gap-3"><button onClick={() => router.push('/employees/add')} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700 transition-colors"><Plus className="w-5 h-5"/> Add New Employee</button><button onClick={() => setShowFilterModal(true)} className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"><SlidersHorizontal className="w-5 h-5"/> Filter</button></div></div><div className="overflow-x-auto"><table className="min-w-full"><thead><tr className="border-b border-gray-200 dark:border-gray-700"><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee Name</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Designation</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th><th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th></tr></thead><tbody className="divide-y divide-gray-200 dark:divide-gray-700">{filteredEmployees.map(emp => (emp && (<tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50"><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3"><EmployeeAvatar src={emp.profileImage} name={`${emp.personalInfo?.firstName || ''} ${emp.personalInfo?.lastName || ''}`} /><span className="font-medium text-sm text-gray-800 dark:text-white">{`${emp.personalInfo?.firstName || 'N/A'} ${emp.personalInfo?.lastName || ''}`}</span></div></td><td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{emp.id || 'N/A'}</td><td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{emp.professionalInfo?.department || 'N/A'}</td><td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">{emp.professionalInfo?.designation || 'N/A'}</td><td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 capitalize whitespace-nowrap">{emp.professionalInfo?.employeeType || 'N/A'}</td><td className="px-6 py-4 whitespace-nowrap"><span className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${emp.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>{emp.status || 'inactive'}</span></td><td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-3 text-gray-500"><button onClick={() => router.push(`/employees/${emp.id}`)} title="View"><Eye className="w-5 h-5 hover:text-blue-600"/></button><button onClick={() => setEmployeeToEdit(emp)} title="Edit"><Edit2 className="w-5 h-5 hover:text-yellow-600"/></button><button onClick={() => setEmployeeToDelete(emp)} title="Delete"><Trash2 className="w-5 h-5 hover:text-red-600"/></button></div></td></tr>)))}</tbody></table></div></div>{employeeToDelete && (<div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50"><div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md"><h3 className="text-lg font-bold text-gray-900 dark:text-white">Confirm Deletion</h3><p className="my-4 text-sm text-gray-600 dark:text-gray-300">Are you sure you want to delete <span className="font-semibold">{`${employeeToDelete.personalInfo?.firstName || ''} ${employeeToDelete.personalInfo?.lastName || ''}`}</span>? This action cannot be undone.</p><div className="flex justify-end gap-4 mt-6"><button onClick={() => setEmployeeToDelete(null)} className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button><button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold text-sm hover:bg-red-700">Delete</button></div></div></div>)}{showSuccessModal && (<SuccessModal message={modalMessage} onClose={() => setShowSuccessModal(false)} />)}{employeeToEdit && (<EditEmployeeModal employee={employeeToEdit} onSave={handleSaveEdit} onCancel={() => setEmployeeToEdit(null)} />)}<FilterModal isOpen={showFilterModal} onClose={() => setShowFilterModal(false)} onApply={handleApplyFilters} currentFilters={filters} allDepartments={departmentOptions} /></div>);
}
