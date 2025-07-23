'use client'

import React, { useState, useCallback } from 'react'
import { User, Briefcase, FileText, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useTranslation } from 'react-i18next'

// Import your form components
import PersonalForm from './PersonalForm'
import ProfessionalForm from './ProfessionalForm'
import DocumentUpload, { Document } from './DocumentUpload'
import AccountAccessForm from './AccountAccessForm'

// Simplified Header
// FIX: The header now uses the translation function
const Header = () => {
  const { t } = useTranslation();
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold">{t('addEmployee.title', 'Add New Employee')}</h1>
    </div>
  )
}

// --- TYPE DEFINITIONS ---
type LocalEmployee = {
  id: number
  employeeId?: string
  firstName?: string
  lastName?: string
  fullName?: string
  email?: string
  mobileNumber?: string
  department?: string
  designation?: string
  employeeType?: string
  status?: string
  profileImage?: string
  documents?: { title: string; fileName: string; dataUrl: string; }[]
}

export default function AddEmployeePage() {
  const { t } = useTranslation() // This 't' is now used for the step labels
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState('personal')

  // FIX: Step labels now use the translation function 't'
  const steps = [
    { key: 'personal', label: t('steps.personal', 'Personal Information'), icon: User },
    { key: 'professional', label: t('steps.professional', 'Professional Information'), icon: Briefcase },
    { key: 'documents', label: t('steps.documents', 'Documents'), icon: FileText },
    { key: 'account', label: t('steps.account', 'Account Access'), icon: Lock },
  ]

  // --- STATE MANAGEMENT ---
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const [personalFormData, setPersonalFormData] = useState({
    firstName: '', lastName: '', mobileNumber: '', email: '', dateOfBirth: '',
    maritalStatus: '', gender: '', nationality: '', address: '', city: '',
    state: '', zipCode: '',
  })
  const [professionalFormData, setProfessionalFormData] = useState({
    employeeID: '', userName: '', employeeType: '', emailAddress: '', department: '',
    designation: '', joiningDate: '', officeLocation: '',
  })
  const [uploadedDocs, setUploadedDocs] = useState<Document[]>([])
  const [accountAccessData, setAccountAccessData] = useState({
    slackId: '', skypeId: '', githubId: '',
  })

  // --- HANDLER FUNCTIONS ---
  const handleCancel = useCallback(() => router.push('/employees'), [router])

  const handleUploadComplete = (newlyUploadedDoc: Document) => {
    const existingDocIndex = uploadedDocs.findIndex(
      doc => doc.title === newlyUploadedDoc.title
    );
    const updatedDocs = [...uploadedDocs];
    if (existingDocIndex !== -1) {
      updatedDocs[existingDocIndex] = newlyUploadedDoc;
    } else {
      updatedDocs.push(newlyUploadedDoc);
    }
    setUploadedDocs(updatedDocs);
  };

  const handleSubmit = useCallback(() => {
    const existingEmployees: LocalEmployee[] = JSON.parse(
      localStorage.getItem('employees') || '[]'
    )
    const documentsToSave = uploadedDocs
      .filter(doc => doc.file)
      .map(doc => ({
        title: doc.title,
        fileName: doc.file!.name,
        dataUrl: doc.file!.dataUrl
    }));

    const newEmployee: LocalEmployee = {
      id: Date.now(),
      employeeId: professionalFormData.employeeID,
      firstName: personalFormData.firstName,
      lastName: personalFormData.lastName,
      fullName: `${personalFormData.firstName} ${personalFormData.lastName}`.trim(),
      email: professionalFormData.emailAddress || personalFormData.email,
      mobileNumber: personalFormData.mobileNumber,
      department: professionalFormData.department,
      designation: professionalFormData.designation,
      employeeType: professionalFormData.officeLocation === 'Remote' ? 'remote' : 'permanent',
      status: 'active',
      profileImage: profileImage || undefined,
      documents: documentsToSave,
    }

    const updatedEmployees = [...existingEmployees, newEmployee]
    localStorage.setItem('employees', JSON.stringify(updatedEmployees))
    alert(t('alerts.employeeAdded', 'Employee added successfully!'))
    router.push('/employees')
  }, [personalFormData, professionalFormData, profileImage, uploadedDocs, router, t]) // Added 't' to dependency array

  const handleNext = () => {
    const currentIdx = steps.findIndex((s) => s.key === currentStep)
    if (currentIdx < steps.length - 1) {
      setCurrentStep(steps[currentIdx + 1].key)
    } else {
      handleSubmit()
    }
  }

  // --- RENDER LOGIC ---
  return (
    <div className="p-6 bg-white dark:bg-gray-900 max-w-5xl mx-auto rounded-lg">
      <Header />
      <div className="flex border-b mb-8 overflow-x-auto">
        {steps.map((step) => (
          <button
            key={step.key}
            onClick={() => setCurrentStep(step.key)}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 text-sm font-medium ${
              currentStep === step.key
                ? 'text-purple-600 border-b-2 border-purple-600'
                : 'text-gray-500'
            }`}
          >
            <step.icon className="w-5 h-5" />
            {step.label}
          </button>
        ))}
      </div>

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
          handleChange={(e) =>
            setProfessionalFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          employeeTypes={['Full-Time', 'Part-Time', 'Contractor']}
          departments={['Engineering', 'Marketing', 'HR', 'Sales']}
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
            <button onClick={handleCancel} className="px-6 py-2 border rounded-md">
              {t('buttons.cancel', 'Cancel')}
            </button>
            <button onClick={handleNext} className="px-6 py-2 bg-purple-600 text-white rounded-md">
              {t('buttons.next', 'Next')}
            </button>
          </div>
        </div>
      )}
      {currentStep === 'account' && (
        <AccountAccessForm
          formData={{ ...accountAccessData, emailAddress: professionalFormData.emailAddress }}
          handleChange={(e) =>
            setAccountAccessData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          onCancel={handleCancel}
          onSubmit={handleSubmit} 
        />
      )}
    </div>
  )
}