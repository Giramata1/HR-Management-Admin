'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
    Loader2, UserRound, Briefcase, FileText, Lock, CalendarCheck, 
    FolderKanban, Leaf, PencilLine, Mail, Eye, Download, ArrowLeft 
} from 'lucide-react'
import { Employee } from '@/types/employee' // Adjust path if needed

// --- FAKE API for getting a single employee from localStorage ---
const fakeApi = {
  getEmployeeById: async (employeeId: string): Promise<Employee | null> => {
    console.log(`FAKE API (Profile): Fetching employee with ID: ${employeeId}`);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

    try {
      const storedEmployees = localStorage.getItem('employees');
      if (!storedEmployees) return null;
      
      const employees: Employee[] = JSON.parse(storedEmployees);
      const employee = employees.find(emp => emp.id === employeeId);
      
      return employee || null;
    } catch (error) {
      console.error("Failed to parse or find employee in localStorage:", error);
      return null;
    }
  }
};


// Helper component for displaying info fields consistently
const InfoField = ({ label, value }: { label: string, value: string | undefined | null }) => (
    <div className="py-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        <p className="font-medium text-gray-800 dark:text-white">{value || 'N/A'}</p>
    </div>
);

export default function EmployeeProfilePage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeSection, setActiveSection] = useState('profile');
    const [activeInfoTab, setActiveInfoTab] = useState('personal');

    useEffect(() => {
        if (id) {
            const fetchEmployee = async () => {
                try {
                    setLoading(true);
                    const data = await fakeApi.getEmployeeById(id);
                    if (data) {
                        setEmployee(data);
                    } else {
                        setError(`Could not find employee with ID: ${id}`);
                    }
                } catch (err) {
                    setError('An unexpected error occurred while fetching employee data.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchEmployee();
        }
    }, [id]);

    if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-purple-600" /></div>;
    if (error) return <div className="flex justify-center items-center h-screen text-red-500">{error}</div>;
    if (!employee) return <div className="flex justify-center items-center h-screen">Employee not found.</div>;

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
    
    // Use optional chaining for safety when destructuring
    const { personalInfo, professionalInfo, documents, accountAccess } = employee;

    return (
        <div className="bg-gray-50 dark:bg-gray-900 p-4 sm:p-8 min-h-screen">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{`${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`}</h1>
                    <nav className="text-sm text-gray-500">
                        <span onClick={() => router.push('/employees')} className="hover:text-purple-600 cursor-pointer">All Employees</span>
                        <span> / </span>
                        <span>{`${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`}</span>
                    </nav>
                </div>
                 <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-purple-600">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            </header>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-6">
                    <div className="flex items-center gap-4">
                        <Image
                            src={employee.profileImage || `https://ui-avatars.com/api/?name=${personalInfo?.firstName}+${personalInfo?.lastName}`}
                            alt="Profile"
                            width={80}
                            height={80}
                            className="rounded-full object-cover"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{`${personalInfo?.firstName || ''} ${personalInfo?.lastName || ''}`}</h2>
                            <p className="flex items-center gap-2 text-sm text-gray-500 mt-1"><Briefcase className="w-4 h-4" />{professionalInfo?.designation || 'N/A'}</p>
                            <p className="flex items-center gap-2 text-sm text-gray-500 mt-1"><Mail className="w-4 h-4" />{professionalInfo?.emailAddress || personalInfo?.email || 'N/A'}</p>
                        </div>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold text-sm hover:bg-purple-700">
                        <PencilLine className="w-4 h-4" /> Edit Profile
                    </button>
                </div>

                <div className="flex flex-col md:flex-row gap-8 mt-6">
                    <aside className="w-full md:w-56 flex-shrink-0">
                        <nav className="space-y-2">
                            {mainSections.map(section => (
                                <button key={section.key} onClick={() => setActiveSection(section.key)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeSection === section.key ? 'bg-purple-600 text-white' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
                                    <section.icon className="w-5 h-5" />
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </aside>

                    <main className="flex-1">
                        {activeSection === 'profile' && (
                            <div>
                                <div className="border-b border-gray-200 dark:border-gray-700">
                                    <nav className="flex gap-6 -mb-px overflow-x-auto">
                                        {infoTabs.map(tab => (
                                            <button key={tab.key} onClick={() => setActiveInfoTab(tab.key)}
                                                className={`flex-shrink-0 flex items-center gap-2 px-1 py-3 text-sm font-medium border-b-2 ${activeInfoTab === tab.key ? 'border-purple-600 text-purple-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-200'}`}>
                                                <tab.icon className="w-4 h-4" />
                                                {tab.label}
                                            </button>
                                        ))}
                                    </nav>
                                </div>
                                <div className="mt-6">
                                    {activeInfoTab === 'personal' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <InfoField label="First Name" value={personalInfo?.firstName} />
                                            <InfoField label="Last Name" value={personalInfo?.lastName} />
                                            <InfoField label="Mobile Number" value={personalInfo?.mobileNumber} />
                                            <InfoField label="Email Address" value={personalInfo?.email} />
                                            <InfoField label="Date of Birth" value={personalInfo?.dateOfBirth} />
                                            <InfoField label="Marital Status" value={personalInfo?.maritalStatus} />
                                            <InfoField label="Gender" value={personalInfo?.gender} />
                                            <InfoField label="Nationality" value={personalInfo?.nationality} />
                                            <InfoField label="Address" value={personalInfo?.address} />
                                            <InfoField label="City" value={personalInfo?.city} />
                                            <InfoField label="State" value={personalInfo?.state} />
                                            <InfoField label="Zip Code" value={personalInfo?.zipCode} />
                                        </div>
                                    )}
                                    {activeInfoTab === 'professional' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <InfoField label="Employee ID" value={employee.id} />
                                            <InfoField label="User Name" value={professionalInfo?.userName} />
                                            <InfoField label="Employee Type" value={professionalInfo?.employeeType} />
                                            <InfoField label="Email Address" value={professionalInfo?.emailAddress} />
                                            <InfoField label="Department" value={professionalInfo?.department} />
                                            <InfoField label="Designation" value={professionalInfo?.designation} />
                                            <InfoField label="Working Days" value={professionalInfo?.workingDays} />
                                            <InfoField label="Joining Date" value={professionalInfo?.joiningDate} />
                                            <InfoField label="Office Location" value={professionalInfo?.officeLocation} />
                                        </div>
                                    )}
                                    {activeInfoTab === 'documents' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {documents && documents.length > 0 ? documents.map(doc => (
                                                <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center gap-3">
                                                        <FileText className="w-5 h-5 text-purple-600"/>
                                                        <span className="text-sm font-medium">{doc.fileName}</span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button className="text-gray-500 hover:text-blue-600"><Eye className="w-5 h-5"/></button>
                                                        <button className="text-gray-500 hover:text-green-600"><Download className="w-5 h-5"/></button>
                                                    </div>
                                                </div>
                                            )) : (
                                                <p className="col-span-2 text-center text-gray-500 py-8">No documents uploaded for this employee.</p>
                                            )}
                                        </div>
                                    )}
                                    {activeInfoTab === 'account' && (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                                            <InfoField label="Email Address" value={professionalInfo?.emailAddress} />
                                            <InfoField label="Slack ID" value={accountAccess?.slackId} />
                                            <InfoField label="Skype ID" value={accountAccess?.skypeId} />
                                            <InfoField label="Github ID" value={accountAccess?.githubId} />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                         {activeSection !== 'profile' && (
                             <div className="text-center p-16 text-gray-500 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                                <p className="font-semibold">Content for {activeSection} is not yet implemented.</p>
                             </div>
                         )}
                    </main>
                </div>
            </div>
        </div>
    );
}