'use client'

// All necessary imports for the full application
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import {
    Loader2, UserRound, Briefcase, FileText, Lock, CalendarCheck,
    FolderKanban, Leaf, PencilLine, Mail, Eye, Download, ArrowLeft, Plus, CheckCircle, Trash2, AlertTriangle
} from 'lucide-react'
import { Employee } from '@/types/employee'

// --- FAKE API (with update functionality) ---
const fakeApi = {
  getEmployeeById: async (employeeId: string): Promise<Employee | null> => {
    console.log(`FAKE API (Profile): Fetching employee with ID: ${employeeId}`);
    await new Promise(resolve => setTimeout(resolve, 500));
    try {
      const storedEmployees = localStorage.getItem('employees');
      if (!storedEmployees) return null;
      const employees: Employee[] = JSON.parse(storedEmployees);
      const employee = employees.find(emp => String(emp.id) === String(employeeId));
      return employee || null;
    } catch (error) {
      console.error("Failed to parse or find employee in localStorage:", error);
      return null;
    }
  },
  updateEmployee: async (updatedEmployee: Employee): Promise<boolean> => {
    console.log(`FAKE API (Profile): Updating employee with ID: ${updatedEmployee.id}`);
    await new Promise(resolve => setTimeout(resolve, 500));
     try {
      const storedEmployees = localStorage.getItem('employees');
      if (!storedEmployees) return false;
      let employees: Employee[] = JSON.parse(storedEmployees);
      employees = employees.map(emp => emp.id === updatedEmployee.id ? updatedEmployee : emp);
      localStorage.setItem('employees', JSON.stringify(employees));
      return true;
    } catch (error) {
      console.error("Failed to update employee in localStorage:", error);
      return false;
    }
  }
};


// --- DATA INTERFACES (for all sections) ---
// Base interface to ensure all records have common properties for generic functions
interface BaseRecord {
    id: string;
    employeeId: string;
    date: string; // Used for sorting
}

// --- THIS IS THE ONLY CHANGE ---
// The interface properties have been formatted onto separate lines to fix the parsing error.
// The functionality is identical.
interface AttendanceRecord extends BaseRecord {
  checkIn: string;
  checkOut: string;
  status: 'OnTime' | 'Late';
}
// --- END OF CHANGE ---

interface ProjectRecord extends BaseRecord {
  projectName: string; startDate: string; finishDate: string; status: 'Pending' | 'InProgress' | 'Completed';
}
interface LeaveRequest extends BaseRecord {
    employeeName: string;
    type: string;
    duration: 'FullDay' | 'HalfDay';
    days: number;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
}


// --- REUSABLE HELPER & MODAL COMPONENTS ---
const InfoField = ({ label, value }: { label: string, value: string | undefined | null }) => (
    <div className="py-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-800 dark:text-white">{value || 'N/A'}</p>
    </div>
);

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }: { isOpen: boolean, title: string, message: string, onConfirm: () => void, onCancel: () => void }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-[101] bg-black bg-opacity-60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto shadow-xl">
                <div className="flex items-center gap-3 mb-4"><AlertTriangle className="w-8 h-8 text-red-500"/><h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2></div>
                <p className="text-gray-600 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex justify-end gap-3"><button onClick={onCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-sm font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-500">Cancel</button><button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">Confirm</button></div>
            </div>
        </div>
    );
};


// --- MAIN PAGE COMPONENT ---
export default function EmployeeProfilePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState('profile');
    const [activeInfoTab, setActiveInfoTab] = useState('personal');
    const [profileImgSrc, setProfileImgSrc] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState('');

    const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
    const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    
    const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
    const [projectRecords, setProjectRecords] = useState<ProjectRecord[]>([]);
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

    const [attendanceToEdit, setAttendanceToEdit] = useState<AttendanceRecord | null>(null);
    const [projectToEdit, setProjectToEdit] = useState<ProjectRecord | null>(null);
    const [leaveToEdit, setLeaveToEdit] = useState<LeaveRequest | null>(null);
    const [deleteAction, setDeleteAction] = useState<(() => void) | null>(null);

    const showSuccessToast = (message: string) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };
    
    const requestDeleteConfirmation = (onConfirm: () => void) => {
        setDeleteAction(() => onConfirm);
        setIsConfirmationModalOpen(true);
    };
    
    const handleConfirmDelete = () => {
        if(deleteAction) {
            deleteAction();
        }
        setIsConfirmationModalOpen(false);
        setDeleteAction(null);
    };

    const fetchEmployeeData = useCallback(async () => {
        setLoading(true);
        const data = await fakeApi.getEmployeeById(id);
        if (data) {
            setEmployee(data);
            const fallbackUrl = `https://ui-avatars.com/api/?name=${data.personalInfo?.firstName}+${data.personalInfo?.lastName}`;
            const imageData = localStorage.getItem(data.profileImage || '');
            setProfileImgSrc(imageData || fallbackUrl);
        } else {
            setError(`Could not find employee with ID: ${id}`);
        }
        setLoading(false);
    }, [id]);

    useEffect(() => { if (id) { fetchEmployeeData(); } }, [id, fetchEmployeeData]);
    
    const fetchRecords = useCallback(<T extends BaseRecord>(
        storageKey: string, 
        employeeId: string, 
        setter: React.Dispatch<React.SetStateAction<T[]>>
    ) => {
        const rawData = localStorage.getItem(storageKey);
        if (rawData) {
            try {
                const allRecords: T[] = JSON.parse(rawData);
                const employeeRecords = allRecords.filter((rec) => rec.employeeId === employeeId);
                setter(employeeRecords.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
            } catch(e) {
                console.error(`Failed to parse ${storageKey}`, e);
                setter([]);
            }
        } else {
            setter([]);
        }
    }, []);

    useEffect(() => {
        if(employee) {
            if(activeSection === 'attendance') fetchRecords('allAttendance', employee.id, setAttendanceRecords);
            if(activeSection === 'projects') fetchRecords('allProjects', employee.id, setProjectRecords);
            if(activeSection === 'leave') fetchRecords('allLeaveRequests', employee.id, setLeaveRequests);
        }
    }, [activeSection, employee, fetchRecords]);

    const handleSaveEmployee = async (updatedEmployee: Employee) => {
        const success = await fakeApi.updateEmployee(updatedEmployee);
        if(success) {
            fetchEmployeeData();
            showSuccessToast('Profile updated successfully!');
        }
    };
    
    const handleSaveRecord = <T extends { id: string }>(
        storageKey: string, 
        record: T, 
        recordState: T[], 
        callback: () => void
    ) => {
        const rawData = localStorage.getItem(storageKey);
        let allRecords: T[] = rawData ? JSON.parse(rawData) : [];
        const isUpdating = recordState.some(r => r.id === record.id);

        if(isUpdating) {
            allRecords = allRecords.map((r) => r.id === record.id ? record : r);
        } else {
            allRecords.push(record);
        }
        localStorage.setItem(storageKey, JSON.stringify(allRecords));
        callback();
        showSuccessToast(`Record ${isUpdating ? 'updated' : 'saved'} successfully!`);
    };
    
    const handleDeleteRecord = (
        storageKey: string, 
        recordId: string, 
        callback: () => void
    ) => {
         requestDeleteConfirmation(() => {
            const rawData = localStorage.getItem(storageKey);
            let allRecords: { id: string }[] = rawData ? JSON.parse(rawData) : [];
            allRecords = allRecords.filter((r) => r.id !== recordId);
            localStorage.setItem(storageKey, JSON.stringify(allRecords));
            callback();
            showSuccessToast('Record deleted successfully!');
         });
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-purple-600" /></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!employee) return <div className="flex justify-center items-center h-screen">Employee not found.</div>;
    
    const { personalInfo, professionalInfo, documents, accountAccess } = employee;
    const mainSections = [
        { key: 'profile', label: 'Profile', icon: UserRound },
        { key: 'attendance', label: 'Attendance', icon: CalendarCheck },
        { key: 'projects', label: 'Projects', icon: FolderKanban },
        { key: 'leave', label: 'Leave', icon: Leaf },
    ];
    const infoTabs = [
        { key: 'personal', label: 'Personal Information', icon: UserRound },
        { key: 'professional', label: 'Professional Information', icon: Briefcase },
        { key: 'documents', label: 'Documents', icon: FileText },
        { key: 'account', label: 'Account Access', icon: Lock },
    ];

    return (
        <>
            {successMessage && <div className="fixed top-5 right-5 z-[102] flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg animate-pulse"><CheckCircle className="inline w-6 h-6 mr-2" />{successMessage}</div>}
            <ConfirmationModal isOpen={isConfirmationModalOpen} title="Confirm Deletion" message="Are you sure you want to delete this record? This action cannot be undone." onConfirm={handleConfirmDelete} onCancel={() => setIsConfirmationModalOpen(false)} />
            {isEditProfileModalOpen && <EditProfileModal isOpen={isEditProfileModalOpen} onClose={() => setIsEditProfileModalOpen(false)} employee={employee} onSave={handleSaveEmployee}/>}
            {isAttendanceModalOpen && <AttendanceModal isOpen={isAttendanceModalOpen} onClose={() => setIsAttendanceModalOpen(false)} onSave={(att) => handleSaveRecord('allAttendance', {...att, employeeId: employee.id}, attendanceRecords, () => fetchRecords('allAttendance', employee.id, setAttendanceRecords))} recordToEdit={attendanceToEdit} />}
            {isProjectModalOpen && <ProjectModal isOpen={isProjectModalOpen} onClose={() => setIsProjectModalOpen(false)} onSave={(p) => handleSaveRecord('allProjects', {...p, employeeId: employee.id, date: p.startDate }, projectRecords, () => fetchRecords('allProjects', employee.id, setProjectRecords))} projectToEdit={projectToEdit} />}
            {isLeaveModalOpen && <LeaveModal isOpen={isLeaveModalOpen} onClose={() => setIsLeaveModalOpen(false)} onSave={(l) => handleSaveRecord('allLeaveRequests', {...l, employeeId: employee.id, employeeName: `${employee.personalInfo.firstName} ${employee.personalInfo.lastName}`}, leaveRequests, () => fetchRecords('allLeaveRequests', employee.id, setLeaveRequests))} leaveToEdit={leaveToEdit} />}

            <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 min-h-screen">
                <header className="flex justify-between items-center mb-6">
                     <div><h1 className="text-2xl font-bold text-gray-800 dark:text-white">{`${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`}</h1><nav className="text-sm text-gray-500"><span onClick={() => router.push('/employees')} className="hover:text-purple-600 cursor-pointer">All Employees</span> / <span>{`${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`}</span></nav></div>
                     <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold"><ArrowLeft className="w-4 h-4" /> Back</button>
                </header>
                
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6">
                        <div className="flex items-center gap-4"><Image src={profileImgSrc} alt="Profile" width={80} height={80} className="rounded-full object-cover"/><div><h2 className="text-xl font-bold">{`${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`}</h2><p className="flex items-center gap-2 text-sm text-gray-500 mt-1"><Briefcase className="w-4 h-4" />{professionalInfo?.designation}</p><p className="flex items-center gap-2 text-sm text-gray-500 mt-1"><Mail className="w-4 h-4" />{professionalInfo?.emailAddress}</p></div></div>
                        <button onClick={() => setIsEditProfileModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm"><PencilLine className="w-4 h-4" /> Edit Profile</button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-8 mt-6">
                        <aside className="w-full md:w-56 flex-shrink-0">
                            <nav className="space-y-2">{mainSections.map(section => (<button key={section.key} onClick={() => setActiveSection(section.key)} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === section.key ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}><section.icon className="w-5 h-5" />{section.label}</button>))}</nav>
                        </aside>

                        <main className="flex-1">
                            {activeSection === 'profile' && (<div><div className="border-b border-gray-200 dark:border-gray-700"><nav className="flex gap-6 -mb-px overflow-x-auto">{infoTabs.map(tab => (<button key={tab.key} onClick={() => setActiveInfoTab(tab.key)} className={`flex-shrink-0 flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 ${activeInfoTab === tab.key ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}><tab.icon className="w-4 h-4" />{tab.label}</button>))}</nav></div><div className="mt-6">{activeInfoTab === 'personal' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><InfoField label="First Name" value={personalInfo?.firstName} /><InfoField label="Last Name" value={personalInfo?.lastName} /><InfoField label="Mobile Number" value={personalInfo?.mobileNumber} /><InfoField label="Email Address" value={personalInfo?.email} /><InfoField label="Date of Birth" value={personalInfo?.dateOfBirth} /><InfoField label="Marital Status" value={personalInfo?.maritalStatus} /><InfoField label="Gender" value={personalInfo?.gender} /><InfoField label="Nationality" value={personalInfo?.nationality} /><InfoField label="Address" value={personalInfo?.address} /><InfoField label="City" value={personalInfo?.city} /><InfoField label="State" value={personalInfo?.state} /><InfoField label="Zip Code" value={personalInfo?.zipCode} /></div>)}{activeInfoTab === 'professional' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><InfoField label="Employee ID" value={String(employee.id)} /><InfoField label="User Name" value={professionalInfo?.userName} /><InfoField label="Employee Type" value={professionalInfo?.employeeType} /><InfoField label="Email Address" value={professionalInfo?.emailAddress} /><InfoField label="Department" value={professionalInfo?.department} /><InfoField label="Designation" value={professionalInfo?.designation} /><InfoField label="Working Days" value={professionalInfo?.workingDays} /><InfoField label="Joining Date" value={professionalInfo?.joiningDate} /><InfoField label="Office Location" value={professionalInfo?.officeLocation} /></div>)}{activeInfoTab === 'documents' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4">{documents && documents.length > 0 ? documents.map((doc, index) => (<div key={`${doc.fileName}-${index}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border"><div className="flex items-center gap-3"><FileText className="w-5 h-5 text-purple-600"/><span className="text-sm font-medium">{doc.fileName}</span></div><div className="flex items-center gap-3"><button className="text-gray-500 hover:text-blue-600"><Eye className="w-5 h-5"/></button><button className="text-gray-500 hover:text-green-600"><Download className="w-5 h-5"/></button></div></div>)) : (<p className="col-span-2 text-center text-gray-500 py-8">No documents uploaded for this employee.</p>)}</div>)}{activeInfoTab === 'account' && (<div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4"><InfoField label="Email Address" value={professionalInfo?.emailAddress} /><InfoField label="Slack ID" value={accountAccess?.slackId} /><InfoField label="Skype ID" value={accountAccess?.skypeId} /><InfoField label="Github ID" value={accountAccess?.githubId} /></div>)}</div></div>)}
                            {activeSection === 'attendance' && (<div><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold text-gray-800 dark:text-white">Attendance</h3><button onClick={() => { setAttendanceToEdit(null); setIsAttendanceModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md"><Plus className="w-4 h-4" /> Add Record</button></div><div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg"><table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"><thead className="bg-gray-50 dark:bg-gray-700"><tr><th className="px-6 py-3 text-left text-xs font-medium uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Check-In</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Check-Out</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Status</th><th className="px-6 py-3 text-left text-xs font-medium uppercase">Actions</th></tr></thead><tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">{attendanceRecords.length > 0 ? attendanceRecords.map((record) => (<tr key={record.id}><td className="px-6 py-4 text-sm">{new Date(record.date).toLocaleDateString()}</td><td className="px-6 py-4 text-sm">{new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td className="px-6 py-4 text-sm">{new Date(record.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td className="px-6 py-4 text-sm"><span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${record.status === 'OnTime' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>{record.status}</span></td><td className="px-6 py-4 text-sm"><div className="flex items-center gap-4"><button onClick={() => { setAttendanceToEdit(record); setIsAttendanceModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><PencilLine className="w-5 h-5"/></button><button onClick={() => handleDeleteRecord('allAttendance', record.id, () => fetchRecords('allAttendance', employee.id, setAttendanceRecords))} className="text-red-600 hover:text-red-800"><Trash2 className="w-5 h-5"/></button></div></td></tr>)) : (<tr><td colSpan={5} className="text-center py-10 text-gray-500">No attendance records found.</td></tr>)}</tbody></table></div></div>)}
                            {activeSection === 'projects' && (<div><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Projects</h3><button onClick={() => { setProjectToEdit(null); setIsProjectModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-md"><Plus className="w-4 h-4"/> Assign Project</button></div><div className="overflow-x-auto border rounded-lg"><table className="min-w-full text-sm text-left"><thead className="bg-gray-50"><tr><th className="px-4 py-3 font-medium">Sr. No.</th><th className="px-4 py-3 font-medium">Project Name</th><th className="px-4 py-3 font-medium">Start Date</th><th className="px-4 py-3 font-medium">Finish Date</th><th className="px-4 py-3 font-medium">Status</th><th className="px-4 py-3 font-medium">Actions</th></tr></thead><tbody className="divide-y">{projectRecords.length > 0 ? projectRecords.map((proj, index) => (<tr key={proj.id}><td className="px-4 py-3">{index + 1}</td><td className="px-4 py-3">{proj.projectName}</td><td className="px-4 py-3">{new Date(proj.startDate).toLocaleDateString()}</td><td className="px-4 py-3">{new Date(proj.finishDate).toLocaleDateString()}</td><td className="px-4 py-3">{proj.status}</td><td className="px-4 py-3"><div className="flex gap-3"><button onClick={() => { setProjectToEdit(proj); setIsProjectModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><PencilLine className="w-4 h-4"/></button><button onClick={() => handleDeleteRecord('allProjects', proj.id, () => fetchRecords('allProjects', employee.id, setProjectRecords))} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4"/></button></div></td></tr>)) : (<tr><td colSpan={6} className="text-center py-10 text-gray-500">No projects assigned.</td></tr>)}</tbody></table></div></div>)}
                            {activeSection === 'leave' && (<div><div className="flex justify-between items-center mb-4"><h3 className="text-lg font-semibold">Leave Requests</h3><button onClick={() => { setLeaveToEdit(null); setIsLeaveModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm rounded-md"><Plus className="w-4 h-4"/> Apply for Leave</button></div><div className="overflow-x-auto border rounded-lg"><table className="min-w-full text-sm text-left"><thead className="bg-gray-50"><tr><th className="px-4 py-3 font-medium text-gray-600 uppercase">DATE</th><th className="px-4 py-3 font-medium text-gray-600 uppercase">TYPE</th><th className="px-4 py-3 font-medium text-gray-600 uppercase">DURATION</th><th className="px-4 py-3 font-medium text-gray-600 uppercase">DAYS</th><th className="px-4 py-3 font-medium text-gray-600 uppercase">EMPLOYEE</th><th className="px-4 py-3 font-medium text-gray-600 uppercase">REASON</th><th className="px-4 py-3 font-medium text-gray-600 uppercase">STATUS</th><th className="px-4 py-3 font-medium text-gray-600 uppercase">ACTIONS</th></tr></thead><tbody className="divide-y">{leaveRequests.length > 0 ? leaveRequests.map(leave => (<tr key={leave.id}><td className="px-4 py-3">{new Date(leave.date).toLocaleDateString()}</td><td className="px-4 py-3">{leave.type}</td><td className="px-4 py-3">{leave.duration}</td><td className="px-4 py-3">{leave.days}</td><td className="px-4 py-3">{leave.employeeName}</td><td className="px-4 py-3 truncate max-w-xs" title={leave.reason}>{leave.reason}</td><td className="px-4 py-3">{leave.status}</td><td className="px-4 py-3"><div className="flex gap-3"><button onClick={() => { setLeaveToEdit(leave); setIsLeaveModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><PencilLine className="w-4 h-4"/></button><button onClick={() => handleDeleteRecord('allLeaveRequests', leave.id, () => fetchRecords('allLeaveRequests', employee.id, setLeaveRequests))} className="text-red-600 hover:text-red-800"><Trash2 className="w-4 h-4"/></button></div></td></tr>)) : (<tr><td colSpan={8} className="text-center py-10 text-gray-500">No leave requests found.</td></tr>)}</tbody></table></div></div>)}
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
}

// --- MODAL COMPONENTS ---

const EditProfileModal = ({ isOpen, onClose, employee, onSave }: { isOpen: boolean, onClose: () => void, employee: Employee, onSave: (updatedEmployee: Employee) => void }) => {
    const [formData, setFormData] = useState<Employee>(employee);
    useEffect(() => { setFormData(employee) }, [employee, isOpen]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, section: 'personalInfo' | 'professionalInfo') => {
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [e.target.name]: e.target.value } }));
    };
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-4xl mx-auto shadow-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
                <h3 className="text-lg font-medium text-purple-600 mb-4 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                    <div><label className="text-sm">First Name</label><input name="firstName" value={formData.personalInfo.firstName} onChange={(e) => handleChange(e, 'personalInfo')} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
                    <div><label className="text-sm">Last Name</label><input name="lastName" value={formData.personalInfo.lastName} onChange={(e) => handleChange(e, 'personalInfo')} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
                    <div><label className="text-sm">Personal Email</label><input name="email" type="email" value={formData.personalInfo.email} onChange={(e) => handleChange(e, 'personalInfo')} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
                    <div><label className="text-sm">Mobile Number</label><input name="mobileNumber" value={formData.personalInfo.mobileNumber} onChange={(e) => handleChange(e, 'personalInfo')} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
                    <div><label className="text-sm">Date of Birth</label><input name="dateOfBirth" type="date" value={formData.personalInfo.dateOfBirth} onChange={(e) => handleChange(e, 'personalInfo')} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
                </div>
                <h3 className="text-lg font-medium text-purple-600 mb-4 border-b pb-2">Professional Information</h3>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div><label className="text-sm">Department</label><input name="department" value={formData.professionalInfo.department} onChange={(e) => handleChange(e, 'professionalInfo')} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
                    <div><label className="text-sm">Designation</label><input name="designation" value={formData.professionalInfo.designation} onChange={(e) => handleChange(e, 'professionalInfo')} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
                    <div><label className="text-sm">Official Email</label><input name="emailAddress" type="email" value={formData.professionalInfo.emailAddress} onChange={(e) => handleChange(e, 'professionalInfo')} className="w-full mt-1 px-3 py-2 border rounded-md" /></div>
                 </div>
                <div className="mt-8 flex justify-end gap-3">
                    <button onClick={onClose} className="px-5 py-2 bg-gray-300 text-sm rounded-md">Cancel</button>
                    <button onClick={() => { onSave(formData); onClose(); }} className="px-5 py-2 bg-purple-600 text-white text-sm rounded-md">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const AttendanceModal = ({ isOpen, onClose, onSave, recordToEdit }: { isOpen: boolean, onClose: () => void, onSave: (record: Omit<AttendanceRecord, 'employeeId'>) => void, recordToEdit: AttendanceRecord | null }) => {
    const isEditMode = !!recordToEdit;
    const [date, setDate] = useState('');
    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [status, setStatus] = useState<'OnTime' | 'Late'>('OnTime');
    
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && recordToEdit) {
                setDate(recordToEdit.date);
                setCheckIn(new Date(recordToEdit.checkIn).toTimeString().substring(0, 5));
                setCheckOut(new Date(recordToEdit.checkOut).toTimeString().substring(0, 5));
                setStatus(recordToEdit.status);
            } else {
                setDate(new Date().toISOString().split('T')[0]); setCheckIn(''); setCheckOut(''); setStatus('OnTime');
            }
        }
    }, [recordToEdit, isEditMode, isOpen]);

    const handleSave = () => {
        if (!checkIn || !checkOut) return;
        onSave({ id: isEditMode && recordToEdit ? recordToEdit.id : Date.now().toString(), date, status, checkIn: new Date(`${date}T${checkIn}`).toISOString(), checkOut: new Date(`${date}T${checkOut}`).toISOString() });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto"><h2 className="text-lg font-semibold mb-4">{isEditMode ? 'Update Attendance' : 'Add Attendance'}</h2><div className="space-y-4"><div><label className="text-sm">Date</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" /></div><div><label className="text-sm">Check-In Time</label><input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" /></div><div><label className="text-sm">Check-Out Time</label><input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded-md" /></div><div><label className="text-sm">Status</label><div className="flex gap-2 mt-1"><button onClick={() => setStatus('OnTime')} className={`px-4 py-2 text-sm rounded-md ${status === 'OnTime' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}>On Time</button><button onClick={() => setStatus('Late')} className={`px-4 py-2 text-sm rounded-md ${status === 'Late' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>Late</button></div></div></div><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 bg-gray-300 text-sm rounded-md">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md">{isEditMode ? 'Update' : 'Save'}</button></div></div>
        </div>
    );
};

const ProjectModal = ({ isOpen, onClose, onSave, projectToEdit }: { isOpen: boolean, onClose: () => void, onSave: (project: Omit<ProjectRecord, 'employeeId' | 'date'>) => void, projectToEdit: ProjectRecord | null }) => {
    const isEditMode = !!projectToEdit;
    const [projectName, setProjectName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [finishDate, setFinishDate] = useState('');
    const [status, setStatus] = useState<ProjectRecord['status']>('Pending');

    useEffect(() => {
        if (isOpen) {
            if (isEditMode && projectToEdit) {
                setProjectName(projectToEdit.projectName); setStartDate(projectToEdit.startDate); setFinishDate(projectToEdit.finishDate); setStatus(projectToEdit.status);
            } else {
                setProjectName(''); setStartDate(''); setFinishDate(''); setStatus('Pending');
            }
        }
    }, [projectToEdit, isEditMode, isOpen]);
    
    const handleSave = () => {
        if(!projectName || !startDate || !finishDate) return;
        onSave({ id: isEditMode && projectToEdit ? projectToEdit.id : Date.now().toString(), projectName, startDate, finishDate, status });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-auto"><h2 className="text-lg font-semibold mb-4">{isEditMode ? 'Update Project' : 'Assign New Project'}</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm">Project Name</label><input value={projectName} onChange={e => setProjectName(e.target.value)} className="w-full col-span-2 mt-1 px-3 py-2 border rounded"/></div><div><label className="text-sm">Start Date</label><input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded"/></div><div><label className="text-sm">Finish Date</label><input type="date" value={finishDate} onChange={e => setFinishDate(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded"/></div><div className="col-span-2"><label className="text-sm">Status</label><select value={status} onChange={e => setStatus(e.target.value as ProjectRecord['status'])} className="w-full mt-1 px-3 py-2 border rounded"><option value="Pending">Pending</option><option value="InProgress">In Progress</option><option value="Completed">Completed</option></select></div></div><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 bg-gray-300 text-sm rounded">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white text-sm rounded">{isEditMode ? 'Update' : 'Assign'}</button></div></div>
        </div>
    );
};

const LeaveModal = ({ isOpen, onClose, onSave, leaveToEdit }: { isOpen: boolean, onClose: () => void, onSave: (leave: Omit<LeaveRequest, 'employeeId' | 'employeeName'>) => void, leaveToEdit: LeaveRequest | null }) => {
    const isEditMode = !!leaveToEdit;
    const [date, setDate] = useState('');
    const [type, setType] = useState('Sick Leave');
    const [duration, setDuration] = useState<LeaveRequest['duration']>('FullDay');
    const [days, setDays] = useState(1);
    const [reason, setReason] = useState('');
    
    useEffect(() => {
        if (isOpen) {
            if (isEditMode && leaveToEdit) {
                setDate(leaveToEdit.date); setType(leaveToEdit.type); setDuration(leaveToEdit.duration); setDays(leaveToEdit.days); setReason(leaveToEdit.reason);
            } else {
                 setDate(new Date().toISOString().split('T')[0]); setType('Sick Leave'); setDuration('FullDay'); setDays(1); setReason('');
            }
        }
    }, [leaveToEdit, isEditMode, isOpen]);
    
    const handleSave = () => {
        if(!reason || days < 1) return;
        onSave({ id: isEditMode && leaveToEdit ? leaveToEdit.id : Date.now().toString(), date, type, duration, days, reason, status: 'Pending' });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-auto"><h2 className="text-lg font-semibold mb-4">{isEditMode ? 'Update Leave Request' : 'Apply for Leave'}</h2><div className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="text-sm">Date</label><input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded"/></div><div><label className="text-sm">Leave Type</label><select value={type} onChange={e => setType(e.target.value)} className="w-full mt-1 px-3 py-2 border rounded"><option>Sick Leave</option><option>Casual Leave</option><option>Vacation</option><option>Unpaid Leave</option></select></div><div><label className="text-sm">Duration</label><select value={duration} onChange={e => setDuration(e.target.value as LeaveRequest['duration'])} className="w-full mt-1 px-3 py-2 border rounded"><option value="FullDay">Full Day</option><option value="HalfDay">Half Day</option></select></div><div><label className="text-sm">Number of Days</label><input type="number" min="1" value={days} onChange={e => setDays(Number(e.target.value))} className="w-full mt-1 px-3 py-2 border rounded"/></div></div><div><label className="text-sm">Reason</label><textarea value={reason} onChange={e => setReason(e.target.value)} rows={4} className="w-full mt-1 px-3 py-2 border rounded" placeholder="Please provide a reason for your leave..."></textarea></div></div><div className="mt-6 flex justify-end gap-3"><button onClick={onClose} className="px-4 py-2 bg-gray-300 text-sm rounded">Cancel</button><button onClick={handleSave} className="px-4 py-2 bg-purple-600 text-white text-sm rounded">{isEditMode ? 'Update Request' : 'Submit Request'}</button></div></div>
        </div>
    );
}; 