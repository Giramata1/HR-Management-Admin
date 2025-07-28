'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams} from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { Search, Eye, Edit, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { Employee } from '@/types/employee'; 

const fakeApi = {
  getEmployees: async (): Promise<Employee[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      if (typeof window !== 'undefined') {
        const storedEmployees = localStorage.getItem('employees');
        return storedEmployees ? JSON.parse(storedEmployees) : [];
      } return [];
    } catch (error) { console.error("Failed to parse employees:", error); return []; }
  },
  addEmployee: async (newEmployee: Employee): Promise<Employee> => {
      await new Promise(resolve => setTimeout(resolve, 300));
      const employees = await fakeApi.getEmployees();
      const updatedEmployees = [...employees, newEmployee];
      if (typeof window !== 'undefined') localStorage.setItem('employees', JSON.stringify(updatedEmployees));
      return newEmployee;
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


const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => <input {...props} />;
const Button = (props: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{props.children}</button>;
const EmployeeAvatar = ({ src, name }: { src: string | null; name: string }) => {
    const [imgSrc, setImgSrc] = useState(src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`);
    useEffect(() => { setImgSrc(src || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`) }, [src, name]);
    return (<Image src={imgSrc} alt={name} width={40} height={40} className="rounded-full h-10 w-10 object-cover" onError={() => setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`)} />);
};


const SuccessModal = ({ onClose, message }: { onClose: () => void; message: string; }) => (
  <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center max-w-sm w-full">
      <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
      <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">Success!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
      <button onClick={onClose} className="w-full bg-purple-600 text-white py-2.5 rounded-lg font-semibold hover:bg-purple-700 transition-colors">Done</button>
    </div>
  </div>
);


interface EmployeeFormData { firstName: string; lastName: string; email: string; designation: string; employeeType: string; }
const AddEmployeeModal = ({ isOpen, onClose, onSave, departmentName }: { isOpen: boolean; onClose: () => void; onSave: (formData: EmployeeFormData) => void; departmentName: string; }) => {
    const [formData, setFormData] = useState<EmployeeFormData>({ firstName: '', lastName: '', email: '', designation: '', employeeType: 'Full-Time' });
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { setFormData(prev => ({ ...prev, [e.target.name]: e.target.value })); };
    const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); onSave(formData); };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add New Employee to {departmentName}</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">First Name</label><input type="text" name="firstName" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                        <div><label className="text-sm font-medium">Last Name</label><input type="text" name="lastName" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    </div>
                     <div><label className="text-sm font-medium">Email Address</label><input type="email" name="email" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    <div><label className="text-sm font-medium">Designation</label><input type="text" name="designation" required onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border font-semibold text-sm">Cancel</button><button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold text-sm">Save Employee</button></div>
                </form>
            </div>
        </div>
    );
};


const ViewEmployeeModal = ({ employee, isOpen, onClose }: { employee: DepartmentEmployee | null; isOpen: boolean; onClose: () => void; }) => {
    if (!isOpen || !employee) return null;
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Employee Details</h3>
                <div className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                    <p><strong>ID:</strong> {employee.id}</p>
                    <p><strong>Name:</strong> {employee.name}</p>
                    <p><strong>Designation:</strong> {employee.title}</p>
                    <p><strong>Type:</strong> <span className="capitalize">{employee.type}</span></p>
                    <p><strong>Status:</strong> <span className="capitalize">{employee.status}</span></p>
                </div>
                <div className="flex justify-end gap-4 mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold text-sm">Close</button>
                </div>
            </div>
        </div>
    );
};



const EditEmployeeModal = ({ employee, isOpen, onClose, onSave }: { employee: Employee | null; isOpen: boolean; onClose: () => void; onSave: (updatedEmployee: Employee) => void; }) => {
    const [formData, setFormData] = useState<Employee | null>(employee);

    useEffect(() => { setFormData(employee); }, [employee]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const [section, key] = name.split('.');
        
        if (formData && (section === 'personalInfo' || section === 'professionalInfo')) {
            setFormData(prev => {
                if (!prev) return null;
                const currentSection = prev[section as keyof Employee];
                if (typeof currentSection === 'object' && currentSection !== null) {
                    const updatedSection = { ...currentSection, [key]: value };
                    return { ...prev, [section]: updatedSection };
                }
                return prev;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData) {
            onSave(formData);
        }
    };

    if (!isOpen || !formData) return null;
    
    return (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Employee</h3>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div><label className="text-sm font-medium">First Name</label><input type="text" name="personalInfo.firstName" value={formData.personalInfo.firstName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                        <div><label className="text-sm font-medium">Last Name</label><input type="text" name="personalInfo.lastName" value={formData.personalInfo.lastName} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    </div>
                     <div><label className="text-sm font-medium">Email Address</label><input type="email" name="professionalInfo.emailAddress" value={formData.professionalInfo.emailAddress} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    <div><label className="text-sm font-medium">Designation</label><input type="text" name="professionalInfo.designation" value={formData.professionalInfo.designation} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md"/></div>
                    <div>
                        <label className="text-sm font-medium">Employee Type</label>
                        <select name="professionalInfo.employeeType" value={formData.professionalInfo.employeeType} onChange={handleChange} className="w-full mt-1 p-2 border rounded-md">
                            <option>Full-Time</option>
                            <option>Part-Time</option>
                            <option>Contract</option>
                            <option>Remote</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-4 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border font-semibold text-sm">Cancel</button><button type="submit" className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold text-sm">Save Changes</button></div>
                </form>
            </div>
        </div>
    );
};


interface DepartmentEmployee { id: string; name: string; title: string; avatar: string | null; type: string; status: string; }

const DepartmentDetail = () => {
  useTranslation();
  const params = useParams();
  const slug = (params.department as string)?.toLowerCase();
  const departmentName = slug ? slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Department';

  const [employees, setEmployees] = useState<DepartmentEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
 
  const [employeeToView, setEmployeeToView] = useState<DepartmentEmployee | null>(null);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<DepartmentEmployee | null>(null);

  const fetchEmployees = useCallback(async () => {
      setLoading(true);
      try {
        const data: Employee[] = await fakeApi.getEmployees();
        const transformedEmployees = data
          .filter(emp => emp.professionalInfo.department.toLowerCase().replace(/\s+/g, '-') === slug)
          .map(emp => ({ id: emp.id, name: `${emp.personalInfo.firstName} ${emp.personalInfo.lastName}`.trim(), title: emp.professionalInfo.designation, avatar: emp.profileImage, type: emp.professionalInfo.employeeType.toLowerCase(), status: emp.status }));
        setEmployees(transformedEmployees);
      } catch (error) { console.error('Error fetching employees:', error); setEmployees([]); }
      finally { setLoading(false); }
  }, [slug]);

  useEffect(() => { if (slug) { fetchEmployees(); } }, [slug, fetchEmployees]);
  
  const filteredEmployees = employees.filter(emp => emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || emp.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleSaveNewEmployee = async (formData: EmployeeFormData) => {
    try {
      
      const newEmployee: Employee = {
        id: Date.now().toString(),
        personalInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          mobileNumber: '',
          email: formData.email,
          dateOfBirth: '',
          maritalStatus: '',
          gender: '',
          nationality: '',
          address: '',
          city: '',
          state: '',
          zipCode: '',
        },
        professionalInfo: {
          userName: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}`,
          emailAddress: formData.email,
          designation: formData.designation,
          employeeType: formData.employeeType,
          department: departmentName,
          workingDays: '',
          joiningDate: '',
          officeLocation: '',
        },
        profileImage: null,
        status: 'active',
        documents: [],
        accountAccess: { slackId: '', skypeId: '', githubId: '' },
      };
      await fakeApi.addEmployee(newEmployee);
      setModalMessage(`Employee "${formData.firstName} ${formData.lastName}" has been added.`);
      setShowSuccessModal(true);
      setShowAddModal(false);
      fetchEmployees();
    } catch (error) {
      console.error("Failed to add employee:", error);
      alert("Error adding employee.");
    }
  };
  
  const handleEditClick = (employeeId: string) => {
    const allEmployees: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');
    const empToEdit = allEmployees.find(emp => emp.id === employeeId);
    if (empToEdit) setEmployeeToEdit(empToEdit);
  };

  const handleSaveEdit = async (updatedEmployee: Employee) => {
      try {
          await fakeApi.updateEmployee(updatedEmployee);
          setModalMessage(`Employee "${updatedEmployee.personalInfo.firstName}" has been updated.`);
          setShowSuccessModal(true); setEmployeeToEdit(null); fetchEmployees();
      } catch (error) { console.error("Failed to update employee:", error); alert("Error."); }
  };

  const handleDelete = async () => {
    if (!employeeToDelete) return;
    try {
        await fakeApi.deleteEmployee(employeeToDelete.id);
        setModalMessage(`Employee "${employeeToDelete.name}" has been deleted.`);
        setShowSuccessModal(true); setEmployeeToDelete(null); fetchEmployees();
    } catch (error) { console.error("Failed to delete employee:", error); alert("Error."); }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="max-w-full sm:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input placeholder="Search employee..." value={searchTerm} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)} className="pl-10 w-full rounded-md" />
          </div>
          <Button onClick={() => setShowAddModal(true)} className="bg-purple-600 text-white hover:bg-purple-700 flex items-center gap-2 px-4 py-2 rounded-md">
            <Plus className="h-4 w-4" /> Add Employee
          </Button>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Employee ID', 'Employee Name', 'Designation', 'Type', 'Status', 'Actions'].map(text => (<th key={text} className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">{text}</th>))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-4">Loading...</td></tr>
              ) : filteredEmployees.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-4">No employees found in this department.</td></tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm">{emp.id}</td>
                    <td className="px-6 py-4"><div className="flex items-center space-x-3"><EmployeeAvatar src={emp.avatar} name={emp.name} /><p className="font-medium">{emp.name}</p></div></td>
                    <td className="px-6 py-4 text-sm">{emp.title}</td>
                    <td className="px-6 py-4 text-sm capitalize">{emp.type}</td>
                    <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{emp.status}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button onClick={() => setEmployeeToView(emp)} className="text-gray-400 hover:text-blue-500"><Eye className="h-4 w-4" /></button>
                        <button onClick={() => handleEditClick(emp.id)} className="text-gray-400 hover:text-yellow-500"><Edit className="h-4 w-4" /></button>
                        <button onClick={() => setEmployeeToDelete(emp)} className="text-gray-400 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    
      <AddEmployeeModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleSaveNewEmployee} departmentName={departmentName} />
      {showSuccessModal && <SuccessModal message={modalMessage} onClose={() => setShowSuccessModal(false)} />}
      <ViewEmployeeModal employee={employeeToView} isOpen={!!employeeToView} onClose={() => setEmployeeToView(null)} />
      <EditEmployeeModal employee={employeeToEdit} isOpen={!!employeeToEdit} onClose={() => setEmployeeToEdit(null)} onSave={handleSaveEdit} />
      {employeeToDelete && <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4"><div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl w-full max-w-md"><h3 className="text-lg font-bold">Confirm Deletion</h3><p className="my-4 text-sm">Are you sure you want to delete <strong>{employeeToDelete.name}</strong>?</p><div className="flex justify-end gap-4 mt-6"><button onClick={() => setEmployeeToDelete(null)} className="px-4 py-2 rounded-lg border">Cancel</button><button onClick={handleDelete} className="px-4 py-2 rounded-lg bg-red-600 text-white">Delete</button></div></div></div>}
    </div>
  );
};

export default DepartmentDetail;
