'use client';

import React, { useState, useRef } from 'react';
import { User, Briefcase, FileText, Lock, ChevronRight } from 'lucide-react';

import Header from '@/components/Header';
import PersonalForm from './PersonalForm';
import ProfessionalForm from './ProfessionalForm';
import DocumentUpload from './DocumentUpload';
import AccountAccessForm from './AccountAccessForm';

const steps = [
  { label: 'Personal Information', icon: <User className="w-5 h-5 mr-2" /> },
  { label: 'Professional Information', icon: <Briefcase className="w-5 h-5 mr-2" /> },
  { label: 'Documents', icon: <FileText className="w-5 h-5 mr-2" /> },
  { label: 'Account Access', icon: <Lock className="w-5 h-5 mr-2" /> },
];

function renderNavigationTabs(currentStep: string, setCurrentStep: (step: string) => void) {
  return (
    <div className="flex border-b border-gray-200 mb-8">
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
            className={`flex items-center px-4 py-3 ${
              isActive
                ? 'text-purple-600 border-b-2 border-purple-600 font-medium'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            type="button"
          >
            {step.icon}
            {step.label}
            {index < steps.length - 1 && (
              <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />
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
    <div className="max-w-4xl mx-auto p-6 bg-white">
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
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-100 transition"
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
