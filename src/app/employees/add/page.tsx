/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';

export default function AddEmployeePage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const docInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeTab, setActiveTab] = useState('personal');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [uploadedDocs, setUploadedDocs] = useState<File[]>(new Array(4).fill(null));
  const [personalFormData, setPersonalFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    zipCode: ''
  });
  const [professionalFormData, setProfessionalFormData] = useState({
    employeeID: '',
    userName: '',
    employeeType: '',
    emailAddress: '',
    department: '',
    designation: '',
    joiningDate: '',
    officeLocation: ''
  });
  const [accountAccessFormData, setAccountAccessFormData] = useState({
    emailAddress: '',
    slackID: '',
    skypeID: '',
    githubID: ''
  });

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfessionalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfessionalFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAccountAccessInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountAccessFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDocUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newDocs = [...uploadedDocs];
      newDocs[index] = file;
      setUploadedDocs(newDocs);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerDocInput = (index: number) => {
    docInputRefs.current[index]?.click();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', {
      personal: personalFormData,
      professional: professionalFormData,
      accountAccess: accountAccessFormData,
      profileImage,
      documents: uploadedDocs.map((doc, i) => ({ title: ['Appointment Letter', 'Salary Slips', 'Relieving Letter', 'Experience Letter'][i], file: doc?.name })),
    });
    router.push('/employees');
  };

  const employeeTypes = ['Full-Time', 'Part-Time', 'Contract', 'Intern'];
  const departments = ['Human Resources', 'Information Technology', 'Finance', 'Marketing'];
  const officeLocations = ['New York', 'London', 'Tokyo', 'Sydney'];

  const docTitles = ['Appointment Letter', 'Salary Slips', 'Relieving Letter', 'Experience Letter'];

  return (
    <div className="min-h-screen">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Add New Employee</h1>
            <div className="text-sm text-gray-500 mt-1">
              <span>All Employee</span>
              <span className="mx-2 text-gray-400">›</span>
              <span>Add New Employee</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face" alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">Robert Allen</div>
                <div className="text-xs text-gray-500">HR Manager</div>
              </div>
              <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              <button className={`flex items-center gap-2 px-1 py-4 text-sm font-medium ${activeTab === 'personal' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('personal')}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Personal Information
              </button>
              <button className={`flex items-center gap-2 px-1 py-4 text-sm font-medium ${activeTab === 'professional' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('professional')}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Professional Information
              </button>
              <button className={`flex items-center gap-2 px-1 py-4 text-sm font-medium ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('documents')}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Documents
              </button>
              <button className={`flex items-center gap-2 px-1 py-4 text-sm font-medium ${activeTab === 'account' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`} onClick={() => setActiveTab('account')}>
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Account Access
              </button>
            </nav>
          </div>
          <div className="p-8">
            {activeTab === 'personal' && (
              <div className="flex justify-start mb-6">
                <div className="flex flex-col items-center">
                  <div className="w-32 h-32 rounded-lg bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors" onClick={triggerFileInput}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </div>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
              </div>
            )}
            {activeTab === 'personal' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><input type="text" name="firstName" value={personalFormData.firstName} onChange={handlePersonalInputChange} placeholder="First Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><input type="text" name="lastName" value={personalFormData.lastName} onChange={handlePersonalInputChange} placeholder="Last Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><input type="tel" name="mobileNumber" value={personalFormData.mobileNumber} onChange={handlePersonalInputChange} placeholder="Mobile Number" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><input type="email" name="emailAddress" value={personalFormData.emailAddress} onChange={handlePersonalInputChange} placeholder="Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div className="relative"><input type="date" name="dateOfBirth" value={personalFormData.dateOfBirth} onChange={handlePersonalInputChange} placeholder="Date of Birth" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" required /></div>
                <div className="relative"><select name="gender" value={personalFormData.gender} onChange={handlePersonalInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" required><option value="">Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select><svg className="absolute right-3 top-2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                <div className="md:col-span-2"><input type="text" name="address" value={personalFormData.address} onChange={handlePersonalInputChange} placeholder="Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" /></div>
                <div className="relative"><select name="zipCode" value={personalFormData.zipCode} onChange={handlePersonalInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"><option value="">ZIP Code</option><option value="10001">10001</option><option value="90210">90210</option><option value="60601">60601</option></select><svg className="absolute right-3 top-2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            ) : activeTab === 'professional' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><input type="text" name="employeeID" value={professionalFormData.employeeID} onChange={handleProfessionalInputChange} placeholder="Employee ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><input type="text" name="userName" value={professionalFormData.userName} onChange={handleProfessionalInputChange} placeholder="User Name" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><select name="employeeType" value={professionalFormData.employeeType} onChange={handleProfessionalInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" required><option value="">Select Employee Type</option>{employeeTypes.map(type => <option key={type} value={type.toLowerCase()}>{type}</option>)}</select><svg className="absolute right-3 top-2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                <div><input type="email" name="emailAddress" value={professionalFormData.emailAddress} onChange={handleProfessionalInputChange} placeholder="Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><select name="department" value={professionalFormData.department} onChange={handleProfessionalInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" required><option value="">Select Department</option>{departments.map(dept => <option key={dept} value={dept.toLowerCase()}>{dept}</option>)}</select><svg className="absolute right-3 top-2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
                <div><input type="text" name="designation" value={professionalFormData.designation} onChange={handleProfessionalInputChange} placeholder="Enter Designation" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div className="relative"><input type="date" name="joiningDate" value={professionalFormData.joiningDate} onChange={handleProfessionalInputChange} placeholder="Select Joining Date" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10" required /></div>
                <div className="md:col-span-2"><select name="officeLocation" value={professionalFormData.officeLocation} onChange={handleProfessionalInputChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none" required><option value="">Select Office Location</option>{officeLocations.map(location => <option key={location} value={location.toLowerCase()}>{location}</option>)}</select><svg className="absolute right-3 top-2 h-5 w-5 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg></div>
              </div>
            ) : activeTab === 'documents' ? (
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Documents</label>
                  <div className="grid grid-cols-2 md:grid-cols-2 gap-8">
                    {docTitles.map((title, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <span className="text-sm font-medium text-gray-700 mb-2">{title}</span>
                        <div className="h-20 border-2 border-dashed border-purple-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-purple-400 transition-colors" onClick={() => triggerDocInput(index)}>
                          {uploadedDocs[index] ? (
                            <span className="text-sm text-gray-600 truncate">{uploadedDocs[index].name}</span>
                          ) : (
                            <>
                              <svg className="h-10 w-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                              <p className="text-sm text-gray-500 mt-2">Drag & Drop or choose file to upload</p>
                              <p className="text-xs text-gray-400">Supported formats: .jpeg, .pdf</p>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                    {Array.from({ length: 4 }, (_, index) => (
                      <input key={`input-${index}`} type="file" ref={el => { docInputRefs.current[index] = el; }} onChange={handleDocUpload(index)} accept=".jpeg,.pdf" className="hidden" />
                    ))}
                  </div>
                </div>
              </div>
            ) : activeTab === 'account' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><input type="email" name="emailAddress" value={accountAccessFormData.emailAddress} onChange={handleAccountAccessInputChange} placeholder="Enter Email Address" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><input type="text" name="slackID" value={accountAccessFormData.slackID} onChange={handleAccountAccessInputChange} placeholder="Enter Slack ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><input type="text" name="skypeID" value={accountAccessFormData.skypeID} onChange={handleAccountAccessInputChange} placeholder="Enter Skype ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
                <div><input type="text" name="githubID" value={accountAccessFormData.githubID} onChange={handleAccountAccessInputChange} placeholder="Enter Github ID" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" required /></div>
              </div>
            ) : null}
            <div className="flex justify-end gap-6 mt-12 pt-8 border-t border-gray-200">
              <button type="button" onClick={() => router.push('/employees')} className="px-8 py-3 text-lg border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Cancel</button>
              <button type="submit" onClick={handleSubmit} className="px-8 py-3 text-lg bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors">Add</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}