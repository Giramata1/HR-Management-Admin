'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronDown, Calendar, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'
// REMOVED: No longer need axios for this fake implementation
// import axios from 'axios'

// --- TYPE DEFINITIONS ---

// The data structure for the form itself
type PersonalFormData = {
  firstName: string
  lastName: string
  mobileNumber: string
  email: string
  dateOfBirth: string
  maritalStatus: string
  gender: string
  nationality: string
  address: string
  city: string
  state: string
  zipCode: string
}

// A simple Employee type to store in our fake database (localStorage)
type Employee = {
  id: string
  profileImage: string | null
  personalInfo: PersonalFormData
  status: 'active' | 'inactive'
}

// --- FAKE API using localStorage (Embedded in this file) ---

const fakeApi = {
  /**
   * Retrieves all employees from the browser's localStorage.
   */
  getEmployees: (): Employee[] => {
    // Using a try-catch block is safe practice for localStorage parsing
    try {
      const storedEmployees = localStorage.getItem('employees');
      return storedEmployees ? JSON.parse(storedEmployees) : [];
    } catch (error) {
      console.error("Failed to parse employees from localStorage:", error);
      return []; // Return empty array on failure
    }
  },

  /**
   * Adds a new employee to localStorage.
   * Simulates a network delay to show the "Submitting..." state.
   */
  addEmployee: async (formData: PersonalFormData, profileImage: string | null): Promise<Employee> => {
    console.log("FAKE API: Simulating adding a new employee...");
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1-second delay

    const employees = fakeApi.getEmployees();

    const newEmployee: Employee = {
      id: `EMP-${Date.now()}`, // Create a simple unique ID
      personalInfo: formData,
      profileImage: profileImage,
      status: 'active', // Set a default status
    };

    const updatedEmployees = [...employees, newEmployee];
    localStorage.setItem('employees', JSON.stringify(updatedEmployees));

    console.log("FAKE API: Employee successfully saved to localStorage.", newEmployee);
    return newEmployee;
  }
};

// --- COMPONENT PROPS & DEFAULTS ---

type Props = {
  profileImage?: string | null
  personalFormData?: PersonalFormData
  onCancel?: () => void
  onNext?: (data: {
    personalFormData: PersonalFormData
    profileImage: string | null
  }) => void
}

const defaultFormData: PersonalFormData = {
  firstName: '', lastName: '', mobileNumber: '', email: '',
  dateOfBirth: '', maritalStatus: '', gender: '', nationality: '',
  address: '', city: '', state: '', zipCode: '',
}

// --- MAIN COMPONENT ---

export default function PersonalForm({ profileImage, personalFormData, onCancel, onNext }: Props) {
  const { t } = useTranslation()
  const router = useRouter()

  const [formData, setFormData] = useState<PersonalFormData>(personalFormData || defaultFormData)
  const [uploadedImage, setUploadedImage] = useState(profileImage || null)
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors.length > 0) {
      setErrors([])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrors(['Invalid file type. Please upload an image.'])
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => setUploadedImage(reader.result as string)
      reader.onerror = () => setErrors(['Failed to read image file.'])
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const validateForm = (): boolean => {
    const requiredFields: (keyof PersonalFormData)[] = ['firstName', 'lastName', 'email', 'mobileNumber', 'dateOfBirth', 'gender', 'nationality', 'maritalStatus', 'address', 'city', 'state', 'zipCode']
    const missingFields = requiredFields.filter((field) => !formData[field])

    if (missingFields.length > 0) {
      setErrors([`Please fill in all required fields: ${missingFields.map(field => t(field) || field).join(', ')}`])
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrors(['Please enter a valid email address'])
      return false
    }

    setErrors([])
    return true
  }

  // --- MODIFIED FUNCTION TO USE THE FAKE API ---
  const handleSubmit = async () => {
    if (!validateForm()) {
      return // Stop submission if validation fails
    }

    setIsSubmitting(true)
    try {
      console.log("Submitting data to the FAKE API (localStorage):", formData);

      // Call the fake API instead of axios
      await fakeApi.addEmployee(formData, uploadedImage);

      console.log('Form data successfully saved to localStorage.');

      if (onNext) {
        onNext({ personalFormData: formData, profileImage: uploadedImage })
      } else {
        alert('Personal information submitted successfully!')
        router.push('/employees'); // Redirect to the employee list
      }

    } catch (error) {
      // This is unlikely to fail with localStorage unless storage is full or disabled
      console.error('Error submitting form to FAKE API:', error);
      setErrors(['An unexpected error occurred while saving locally.']);
    } finally {
      setIsSubmitting(false) // Reset submitting state
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="mb-8" />

      {/* Profile Image Upload Section */}
      <div className="mb-8">
        <div
          className="w-24 h-24 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          onClick={triggerFileInput}
        >
          {uploadedImage ? (
            <Image
              src={uploadedImage}
              alt={t('addEmployee.profileName') || 'Profile'}
              className="w-full h-full object-cover rounded-xl"
              width={96}
              height={96}
            />
          ) : (
            <User className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          )}
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageUpload}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Form Fields Section (No changes needed here) */}
      <div className="space-y-6 mb-8">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder={t('firstName') || 'First Name'}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder={t('lastName') || 'Last Name'}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder={t('mobileNumber') || 'Mobile Number'}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder={t('emailAddress') || 'Email Address'}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Date of Birth and Marital Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder={t('dateOfBirth') || 'Date of Birth'}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
            <Calendar className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled hidden>{t('maritalStatus') || 'Marital Status'}</option>
              <option value="single">{t('single') || 'Single'}</option>
              <option value="married">{t('married') || 'Married'}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Gender and Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled hidden>{t('gender') || 'Gender'}</option>
              <option value="male">{t('gender.male') || 'Male'}</option>
              <option value="female">{t('gender.female') || 'Female'}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="" disabled hidden>{t('nationality') || 'Nationality'}</option>
              <option value="Rwandan">{t('nationality.rwandan') || 'Rwandan'}</option>
              <option value="Kenyan">{t('nationality.kenyan') || 'Kenyan'}</option>
              <option value="Ugandan">{t('nationality.ugandan') || 'Ugandan'}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Address Field */}
        <div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={t('address') || 'Address'}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder={t('city') || 'City'}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder={t('state') || 'State/Province'}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div className="relative">
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              placeholder={t('zipCode') || 'Zip Code'}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>
      </div>


      {/* Error Messages Display */}
      {errors.length > 0 && (
        <div className="mb-6">
          {errors.map((error, index) => (
            <p key={index} className="text-red-600 dark:text-red-400 text-sm mt-2">
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCancel || (() => router.push('/employees'))}
          className="px-6 py-3 text-gray-700 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isSubmitting}
        >
          {t('addEmployee.buttons.cancel') || 'Cancel'}
        </button>
        <button
          onClick={handleSubmit}
          className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? (t('submitting') || 'Submitting...') : (t('addEmployee.buttons.next') || 'Next')}
        </button>
      </div>
    </div>
  )
}