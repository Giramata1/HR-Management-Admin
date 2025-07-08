'use client';

import React, { useState, useRef } from 'react';
import { User, Briefcase, FileText, Lock, ChevronRight, Search, Bell, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image'; // Import next/image

import PersonalForm from './PersonalForm';
import ProfessionalForm from './ProfessionalForm';
import DocumentUpload from './DocumentUpload';
import AccountAccessForm from './AccountAccessForm';

// Header Component
const Header: React.FC = () => {
  const router = useRouter();

  const handleAllEmployeeClick = () => {
    router.push('/employees');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 mb-6">
      <div className="flex items-center justify-between">
        {/* Left side - Title and Breadcrumbs */}
        <div>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
            Add New Employee
          </h1>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span 
              className="hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
              onClick={handleAllEmployeeClick}
            >
              All Employee
            </span>
            <span className="mx-2">›</span>
            <span className="text-gray-800 dark:text-gray-200">
              Add New Employee
            </span>
          </div>
        </div>

        {/* Right side - Search, Notifications, Profile */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-80 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <button className="relative p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Robert Allen"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <div className="text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Robert Allen
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                HR Manager
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

const steps = [
  { label: 'Personal Information', icon: <User className="w-5 h-5 mr-2" /> },
  { label: 'Professional Information', icon: <Briefcase className="w-5 h-5 mr-2" /> },
  { label: 'Documents', icon: <FileText className="w-5 h-5 mr-2" /> },
  { label: 'Account Access', icon: <Lock className="w-5 h-5 mr-2" /> },
];

function renderNavigationTabs(currentStep: string, setCurrentStep: (step: string) => void) {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8 overflow-x-auto">
      {steps.map((step, index) => {
        const stepKey =
          index === 0 ? 'personal' :
          index === 1 ? 'professional' :
          index === 2 ? 'step3' :
          'step4';

        const isActive = currentStep === stepKey;

        return (
          <button
            key={step.label}
            onClick={() => setCurrentStep(stepKey)}
            className={`flex items-center px-4 py-3 whitespace-nowrap ${
              isActive
                ? 'text-purple-600 border-b-2 border-purple-600 font-medium dark:text-purple-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
            }`}
            type="button"
          >
            {step.icon}
            {step.label}
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400 dark:text-gray-500" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default function AddEmployeePage() {
  const [currentStep, setCurrentStep] = useState('personal');

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [personalFormData, setPersonalFormData] = useState({
    firstName: '',
    lastName: '',
    mobileNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    maritalStatus: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const handlePersonalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setPersonalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

  const handlePersonalCancel = () => {
    setPersonalFormData({
      firstName: '',
      lastName: '',
      mobileNumber: '',
      emailAddress: '',
      dateOfBirth: '',
      maritalStatus: '',
      gender: '',
      nationality: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
    });
    setProfileImage(null);
  };

  const handlePersonalNext = () => {
    setCurrentStep('professional');
  };

  const [professionalFormData, setProfessionalFormData] = useState({
    employeeID: '',
    userName: '',
    employeeType: '',
    emailAddress: '',
    department: '',
    designation: '',
    joiningDate: '',
    officeLocation: '',
  });

  const employeeTypes = ['Full-Time', 'Part-Time', 'Contractor'];
  const departments = ['Engineering', 'Marketing', 'HR', 'Sales'];
  const officeLocations = ['New York', 'London', 'Kigali'];

  const handleProfessionalInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProfessionalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfessionalCancel = () => {
    setProfessionalFormData({
      employeeID: '',
      userName: '',
      employeeType: '',
      emailAddress: '',
      department: '',
      designation: '',
      joiningDate: '',
      officeLocation: '',
    });
    setCurrentStep('personal');
  };

  const handleProfessionalNext = () => {
    setCurrentStep('step3');
  };

  const docInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [uploadedDocs, setUploadedDocs] = useState<(File | null)[]>([null, null, null, null]);

  const docTitles = [
    'Upload Appointment Letter',
    'Upload Salary Slips',
    'Upload Reliving Letter',
    'Upload Experience Letter',
  ];

  const handleDocUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocs(prev => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  const triggerDocInput = (index: number) => {
    docInputRefs.current[index]?.click();
  };

  const handleDocumentsCancel = () => {
    setUploadedDocs([null, null, null, null]);
    setCurrentStep('professional');
  };

  const handleDocumentsNext = () => {
    setCurrentStep('step4');
  };

  const [accountAccessData, setAccountAccessData] = useState({
    emailAddress: '',
    slackId: '',
    skypeId: '',
    githubId: '',
  });

  const handleAccountAccessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAccountAccessData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAccountAccessCancel = () => {
    setAccountAccessData({
      emailAddress: '',
      slackId: '',
      skypeId: '',
      githubId: '',
    });
    setCurrentStep('step3');
  };

  const handleSubmit = () => {
    console.log('Form Submitted:', {
      personalFormData,
      professionalFormData,
      uploadedDocs,
      accountAccessData,
    });
    alert('Form submitted successfully!');
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />
      {renderNavigationTabs(currentStep, setCurrentStep)}

      {currentStep === 'personal' && (
        <PersonalForm
          profileImage={profileImage}
          personalFormData={personalFormData}
          handleInputChange={handlePersonalInputChange}
          triggerFileInput={triggerFileInput}
          fileInputRef={fileInputRef}
          handleImageUpload={handleImageUpload}
          onCancel={handlePersonalCancel}
          onNext={handlePersonalNext}
        />
      )}

      {currentStep === 'professional' && (
        <ProfessionalForm
          formData={professionalFormData}
          handleChange={handleProfessionalInputChange}
          employeeTypes={employeeTypes}
          departments={departments}
          officeLocations={officeLocations}
          onCancel={handleProfessionalCancel}
          onNext={handleProfessionalNext}
        />
      )}

      {currentStep === 'step3' && (
        <div>
          <DocumentUpload
            docTitles={docTitles}
            uploadedDocs={uploadedDocs}
            docInputRefs={docInputRefs}
            handleDocUpload={handleDocUpload}
            triggerDocInput={triggerDocInput}
          />
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={handleDocumentsCancel}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDocumentsNext}
              className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {currentStep === 'step4' && (
        <AccountAccessForm
          formData={accountAccessData}
          handleChange={handleAccountAccessChange}
          onCancel={handleAccountAccessCancel}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}