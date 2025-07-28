'use client';

import React, { useState, useCallback } from 'react';

import { User, Briefcase, FileText, Lock, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';


import PersonalForm from './PersonalForm';
import ProfessionalForm from './ProfessionalForm';
import DocumentUpload, { Document } from './DocumentUpload';
import AccountAccessForm from './AccountAccessForm';
import { Employee } from '@/types/employee';


interface SuccessModalProps {
  onClose: () => void;
  title?: string;
  message: string;
  buttonText?: string;
}

const SuccessModal = ({ onClose, title, message, buttonText }: SuccessModalProps) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 text-center max-w-md w-full">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full mx-auto flex items-center justify-center mb-5">
          <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {title || t('successModal.title', 'Success!')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          {message}
        </p>
        <button
          onClick={onClose}
          className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {buttonText || t('successModal.button', 'Done')}
        </button>
      </div>
    </div>
  );
};
// --- End of Modal Component ---

const Header = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{t('addEmployee.title', 'Add New Employee')}</h1>
    </div>
  );
};

export default function AddEmployeePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState('personal');
  
  // State to control the success modal
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const steps = [
    { key: 'personal', label: t('steps.personal', 'Personal Information'), icon: User },
    { key: 'professional', label: t('steps.professional', 'Professional Information'), icon: Briefcase },
    { key: 'documents', label: t('steps.documents', 'Documents'), icon: FileText },
    { key: 'account', label: t('steps.account', 'Account Access'), icon: Lock },
  ];

  // --- State for each form section ---
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [personalFormData, setPersonalFormData] = useState({ firstName: '', lastName: '', mobileNumber: '', email: '', dateOfBirth: '', maritalStatus: '', gender: '', nationality: '', address: '', city: '', state: '', zipCode: '' });
  const [professionalFormData, setProfessionalFormData] = useState({ employeeID: '', userName: '', employeeType: '', emailAddress: '', department: '', designation: '', joiningDate: '', officeLocation: '', workingDays: '5' });
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([]);
  const [accountAccessData, setAccountAccessData] = useState({ slackId: '', skypeId: '', githubId: '' });

  // --- Handlers ---
  const handleCancel = useCallback(() => router.push('/employees'), [router]);

  const handleUploadComplete = (newlyUploadedDoc: Document) => {
    const existingDocIndex = uploadedDocs.findIndex(doc => doc.title === newlyUploadedDoc.title);
    let updatedDocs;
    if (existingDocIndex !== -1) {
      updatedDocs = [...uploadedDocs];
      updatedDocs[existingDocIndex] = newlyUploadedDoc;
    } else {
      updatedDocs = [...uploadedDocs, newlyUploadedDoc];
    }
    setUploadedDocs(updatedDocs);
  };

  const handleSubmit = useCallback(() => {
    console.log('Saving employee data...');
    try {
      const existingEmployees: Employee[] = JSON.parse(localStorage.getItem('employees') || '[]');
      const documentsToSave = uploadedDocs.filter(doc => doc.file).map(doc => ({ title: doc.title, fileName: doc.file!.name, dataUrl: doc.file!.dataUrl }));
      
      const newEmployee: Employee = {
        id: professionalFormData.employeeID || `EMP-${Date.now()}`,
        profileImage: profileImage,
        status: 'active',
        // THIS IS THE FIX: Manually include profileImage before spreading the rest of the form data.
        personalInfo: {
          profileImage: profileImage,
          ...personalFormData,
        },
        professionalInfo: { 
          userName: professionalFormData.userName, 
          employeeType: professionalFormData.employeeType, 
          emailAddress: professionalFormData.emailAddress, 
          department: professionalFormData.department, 
          designation: professionalFormData.designation, 
          workingDays: professionalFormData.workingDays, 
          joiningDate: professionalFormData.joiningDate, 
          officeLocation: professionalFormData.officeLocation 
        },
        documents: documentsToSave,
        accountAccess: { ...accountAccessData },
      };

      const updatedEmployees = [...existingEmployees, newEmployee];
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));

      // Show the modal instead of calling alert()
      setShowSuccessModal(true);

    } catch (error) {
      alert('Failed to save employee. Please try again.');
      console.error("Error saving to localStorage:", error);
    }
  }, [personalFormData, professionalFormData, profileImage, uploadedDocs, accountAccessData]);

  const handleNext = () => {
    const currentIdx = steps.findIndex((s) => s.key === currentStep);
    if (currentIdx < steps.length - 1) {
      setCurrentStep(steps[currentIdx + 1].key);
    } else {
      handleSubmit();
    }
  };
  
  const handleModalClose = () => {
      setShowSuccessModal(false);
      router.push('/employees');
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-900 max-w-5xl mx-auto rounded-lg">
      <Header />
      <div className="flex border-b mb-8 overflow-x-auto">
        {steps.map((step) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium ${currentStep === step.key ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
          >
            <step.icon className="w-5 h-5" />
            {step.label}
          </button>
        ))}
      </div>

      {/* --- Form rendering --- */}
      {currentStep === 'personal' && (
        <PersonalForm
          profileImage={profileImage}
          personalFormData={personalFormData}
          onCancel={handleCancel}
          onNext={({ personalFormData, profileImage }) => {
            setPersonalFormData(personalFormData);
            setProfileImage(profileImage);
            handleNext();
          }}
        />
      )}
      {currentStep === 'professional' && (
        <ProfessionalForm
          formData={professionalFormData}
          handleChange={(e) => setProfessionalFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          employeeTypes={['Full-Time', 'Part-Time', 'Contractor', 'Remote']}
          departments={['Engineering', 'Marketing', 'HR', 'Sales', 'Design']}
          officeLocations={['New York', 'London', 'Kigali', 'Remote']}
          onCancel={handleCancel}
          onNext={handleNext}
        />
      )}
      {currentStep === 'documents' && (
        <div>
          <DocumentUpload
            onUploadComplete={handleUploadComplete}
            docTitles={['Appointment Letter', 'ID Proof', 'Address Proof', 'Previous Experience']}
          />
          <div className="flex justify-end gap-4 mt-6">
            <button onClick={handleCancel} className="px-6 py-2 border rounded-md">{t('buttons.cancel', 'Cancel')}</button>
            <button onClick={handleNext} className="px-6 py-2 bg-purple-600 text-white rounded-md">{t('buttons.next', 'Next')}</button>
          </div>
        </div>
      )}
      {currentStep === 'account' && (
        <AccountAccessForm
          formData={{ ...accountAccessData, emailAddress: professionalFormData.emailAddress }}
          handleChange={(e) => setAccountAccessData((prev) => ({ ...prev, [e.target.name]: e.target.value }))}
          onCancel={handleCancel}
          onSubmit={handleSubmit} 
        />
      )}
      
      {/* Conditionally render the SuccessModal */}
      {showSuccessModal && (
          <SuccessModal 
              onClose={handleModalClose}
              message={`${personalFormData.firstName}'s profile has been created successfully!`}
          />
      )}
    </div>
  );
}
