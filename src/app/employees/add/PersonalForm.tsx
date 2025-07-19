'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronDown, Calendar, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

// Employee type definition
type Employee = {
  id: number
  name: string
  employeeId: string
  department: string
  designation: string
  type: string
  status: string
  avatar: string
  personalInfo: {
    dateOfBirth: string
    gender: string
    address: string
    city: string
    zipCode: string
    country: string
    maritalStatus: string
    nationality: string
    email: string
    phone: string
  }
  professionalInfo: {
    employeeId: string
    userName: string
    employeeType: string
    emailAddress: string
    department: string
    designation: string
    workingDays: string
    joiningDate: string
    officeLocation: string
  }
}

type PersonalFormData = {
  firstName: string
  lastName: string
  mobileNumber: string
  emailAddress: string
  dateOfBirth: string
  maritalStatus: string
  gender: string
  nationality: string
  address: string
  city: string
  state: string
  zipCode: string
}

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
}

export default function PersonalForm({ profileImage, personalFormData, onCancel, onNext }: Props) {
  const { t } = useTranslation()
  const router = useRouter()
  const [formData, setFormData] = useState(personalFormData || defaultFormData)
  const [uploadedImage, setUploadedImage] = useState(profileImage || null)
  const [errors, setErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear errors when user starts typing
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
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.onerror = () => {
        setErrors(['Failed to read image file.'])
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const validateForm = (): boolean => {
    const requiredFields = ['firstName', 'lastName', 'emailAddress', 'mobileNumber']
    const missingFields = requiredFields.filter((field) => !formData[field as keyof PersonalFormData])
    
    if (missingFields.length > 0) {
      setErrors([`Please fill in all required fields: ${missingFields.join(', ')}`])
      return false
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.emailAddress)) {
      setErrors(['Please enter a valid email address'])
      return false
    }

    setErrors([])
    return true
  }

  const handleNext = () => {
    if (!validateForm()) {
      return
    }

    try {
      const transformedEmployee: Employee = {
        id: Date.now(),
        name: `${formData.firstName} ${formData.lastName}`,
        employeeId: `EMP${(Math.floor(Math.random() * 10000) + 1).toString().padStart(4, '0')}`,
        department: 'Engineering',
        designation: 'Developer',
        type: 'office',
        status: 'active',
        avatar: uploadedImage || 'https://via.placeholder.com/80',
        personalInfo: {
          dateOfBirth: formData.dateOfBirth || '',
          gender: formData.gender || '',
          address: formData.address || '',
          city: formData.city || '',
          zipCode: formData.zipCode || '',
          country: formData.state || '',
          maritalStatus: formData.maritalStatus || '',
          nationality: formData.nationality || '',
          email: formData.emailAddress || '',
          phone: formData.mobileNumber || '',
        },
        professionalInfo: {
          employeeId: `EMP${(Math.floor(Math.random() * 10000) + 1).toString().padStart(4, '0')}`,
          userName: `${formData.firstName.toLowerCase()}.${formData.lastName.toLowerCase()}` || '',
          employeeType: 'office',
          emailAddress: formData.emailAddress || '',
          department: 'Engineering',
          designation: 'Developer',
          workingDays: 'Monday-Friday',
          joiningDate: new Date().toISOString().split('T')[0], // Current date
          officeLocation: 'Head Office',
        },
      }

      console.log('Current formData:', formData)
      console.log('Transformed Employee before saving:', transformedEmployee)

      const existingEmployees = JSON.parse(localStorage.getItem('employees') || '[]')
      const updatedEmployees = [...existingEmployees, transformedEmployee]
      localStorage.setItem('employees', JSON.stringify(updatedEmployees))
      console.log('Saved to localStorage, employees array:', updatedEmployees)

      if (onNext) {
        onNext({ personalFormData: formData, profileImage: uploadedImage })
      } else {
        router.push('/employees')
      }
    } catch (error) {
      console.error('Error saving employee:', error)
      setErrors(['Failed to save employee information. Please try again.'])
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="mb-8" />
      
      {/* Profile Image Upload */}
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

      {/* Form Fields */}
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
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            placeholder={t('emailAddress') || 'Email Address'}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        {/* Date and Marital Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder={t('dateOfBirth') || 'Date of Birth'}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Calendar className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
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
            >
              <option value="" disabled hidden>{t('nationality') || 'Nationality'}</option>
              <option value="rwandan">{t('nationality.rwandan') || 'Rwandan'}</option>
              <option value="kenyan">{t('nationality.kenyan') || 'Kenyan'}</option>
              <option value="ugandan">{t('nationality.ugandan') || 'Ugandan'}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Address */}
        <div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={t('address') || 'Address'}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Location Fields */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>{t('city') || 'City'}</option>
              <option value="kigali">{t('city.kigali') || 'Kigali'}</option>
              <option value="musanze">{t('city.musanze') || 'Musanze'}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>{t('state') || 'State/Province'}</option>
              <option value="kigali city">{t('state.kigaliCity') || 'Kigali City'}</option>
              <option value="northern province">{t('state.northernProvince') || 'Northern Province'}</option>
              <option value="southern province">{t('state.southernProvince') || 'Southern Province'}</option>
              <option value="eastern province">{t('state.easternProvince') || 'Eastern Province'}</option>
              <option value="western province">{t('state.westernProvince') || 'Western Province'}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              name="zipCode"
              value={formData.zipCode}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>{t('zipCode') || 'Zip Code'}</option>
              <option value="00000">00000</option>
              <option value="10001">10001</option>
              <option value="10002">10002</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Error Messages */}
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
        >
          {t('addEmployee.buttons.cancel') || 'Cancel'}
        </button>
        <button
          onClick={handleNext}
          className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {t('addEmployee.buttons.next') || 'Next'}
        </button>
      </div>
    </div>
  )
}