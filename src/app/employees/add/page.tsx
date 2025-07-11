'use client';

import React, { useState, useRef } from 'react';
import { User, Briefcase, FileText, Lock, ChevronRight, Search, Bell, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

import PersonalForm from './PersonalForm';
import ProfessionalForm from './ProfessionalForm';
import DocumentUpload from './DocumentUpload';
import AccountAccessForm from './AccountAccessForm';

const Header: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const handleAllEmployeeClick = () => {
    router.push('/employees');
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 sm:py-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">
            {t('addEmployee.title')}
          </h1>
          <div className="flex items-center text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            <span
              onClick={handleAllEmployeeClick}
              className="hover:text-gray-800 dark:hover:text-gray-200 cursor-pointer"
            >
              {t('addEmployee.allEmployees')}
            </span>
            <span className="mx-2">›</span>
            <span className="text-gray-800 dark:text-gray-200">{t('addEmployee.title')}</span>
          </div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative w-full sm:w-64 md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('addEmployee.search')}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg p-2">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
              alt="profile"
              width={32}
              height={32}
              className="rounded-full object-cover sm:w-10 sm:h-10"
            />
            <div className="hidden sm:block text-right">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {t('addEmployee.profileName')}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {t('addEmployee.profileRole')}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 dark:text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function AddEmployeePage() {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState('personal');

  const steps = [
    { key: 'personal', label: t('addEmployee.steps.personal'), icon: <User className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> },
    { key: 'professional', label: t('addEmployee.steps.professional'), icon: <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> },
    { key: 'step3', label: t('addEmployee.steps.documents'), icon: <FileText className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> },
    { key: 'step4', label: t('addEmployee.steps.account'), icon: <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> },
  ];

  const renderNavigationTabs = () => (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 sm:mb-8 overflow-x-auto">
      {steps.map((step, index) => (
        <button
          key={step.key}
          onClick={() => setCurrentStep(step.key)}
          className={`flex items-center px-3 py-2 sm:px-4 sm:py-3 whitespace-nowrap text-xs sm:text-sm ${
            currentStep === step.key
              ? 'text-purple-600 border-b-2 border-purple-600 font-medium dark:text-purple-400'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-white'
          }`}
        >
          {step.icon}
          <span className="hidden sm:inline">{step.label}</span>
          <span className="sm:hidden">{step.label.charAt(0)}</span>
          {index < steps.length - 1 && (
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-gray-400 dark:text-gray-500" />
          )}
        </button>
      ))}
    </div>
  );

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

  const handlePersonalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => setProfileImage(event.target?.result as string,);
      reader.readAsDataURL(file);
    }
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

  const handleProfessionalInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfessionalFormData((prev) => ({ ...prev, [name]: value }));
  };

  const [uploadedDocs, setUploadedDocs] = useState<(File | null)[]>([null, null, null, null]);
  const docInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const docTitles = t('addEmployee.docTitles', { returnObjects: true }) as string[];

  const handleDocUpload = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDocs((prev) => {
        const updated = [...prev];
        updated[index] = file;
        return updated;
      });
    }
  };

  const triggerDocInput = (index: number) => docInputRefs.current[index]?.click();

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

  const handleSubmit = () => {
    console.log('Form Submitted:', { personalFormData, professionalFormData, uploadedDocs, accountAccessData });
    alert('Form submitted successfully!');
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-full sm:max-w-4xl mx-auto">
      <Header />
      {renderNavigationTabs()}

      <div className="max-w-full sm:max-w-3xl md:max-w-4xl mx-auto">
        {currentStep === 'personal' && (
          <PersonalForm
            profileImage={profileImage}
            personalFormData={personalFormData}
            handleInputChange={handlePersonalInputChange}
            triggerFileInput={triggerFileInput}
            fileInputRef={fileInputRef}
            handleImageUpload={handleImageUpload}
            onCancel={() =>
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
              })
            }
            onNext={() => setCurrentStep('professional')}
          />
        )}

        {currentStep === 'professional' && (
          <ProfessionalForm
            formData={professionalFormData}
            handleChange={handleProfessionalInputChange}
            employeeTypes={['Full-Time', 'Part-Time', 'Contractor']}
            departments={['Engineering', 'Marketing', 'HR', 'Sales']}
            officeLocations={['New York', 'London', 'Kigali']}
            onCancel={() => setCurrentStep('personal')}
            onNext={() => setCurrentStep('step3')}
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
            <div className="flex flex-col sm:flex-row justify-end gap-4 mt-4 sm:mt-6">
              <button
                onClick={() => setCurrentStep('professional')}
                className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                {t('addEmployee.buttons.cancel')}
              </button>
              <button
                onClick={() => setCurrentStep('step4')}
                className="px-4 py-2 sm:px-6 sm:py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
              >
                {t('addEmployee.buttons.next')}
              </button>
            </div>
          </div>
        )}

        {currentStep === 'step4' && (
          <AccountAccessForm
            formData={accountAccessData}
            handleChange={handleAccountAccessChange}
            onCancel={() => setCurrentStep('step3')}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}