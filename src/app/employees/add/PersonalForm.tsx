'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { ChevronDown, Calendar, User } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/navigation'

// --- TYPE DEFINITIONS ---
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

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 200)); 

    try {
      if (onNext) {
        onNext({ personalFormData: formData, profileImage: uploadedImage })
      } else {
        alert('Form data collected, but no "onNext" action was provided.')
      }

    } catch (error) {
      console.error('An unexpected error occurred in PersonalForm:', error);
      setErrors(['An unexpected error occurred.']);
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="mb-8" />
      <div className="mb-8">
        <div
          className="w-24 h-24 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer"
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

      {/* --- FORM FIELDS --- */}
      <div className="space-y-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder={t('firstName') || 'First Name'} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
          <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder={t('lastName') || 'Last Name'} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input type="text" name="mobileNumber" value={formData.mobileNumber} onChange={handleInputChange} placeholder={t('mobileNumber') || 'Mobile Number'} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
          <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder={t('emailAddress') || 'Email Address'} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
             <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
             <Calendar className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleInputChange} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none" required >
              <option value="" disabled hidden>{t('maritalStatus') || 'Marital Status'}</option>
              <option value="single">{t('single') || 'Single'}</option>
              <option value="married">{t('married') || 'Married'}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 
            FIX: Removed t() translation from the Gender placeholder.
          */}
          <input
            type="text"
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            placeholder="Gender"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg"
            required
          />
          {/* 
            FIX: Removed t() translation from the Nationality placeholder.
          */}
          <input
            type="text"
            name="nationality"
            value={formData.nationality}
            onChange={handleInputChange}
            placeholder="Nationality"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg"
            required
          />
        </div>
        <div>
          <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder={t('address') || 'Address'} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 
            FIX: Removed t() translation from the City placeholder.
          */}
          <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
          {/* 
            FIX: Removed t() translation from the State/Province placeholder.
          */}
          <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State/Province" className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
          <input type="text" name="zipCode" value={formData.zipCode} onChange={handleInputChange} placeholder={t('zipCode') || 'Zip Code'} className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg" required />
        </div>
      </div>

      {errors.length > 0 && (
        <div className="mb-6">
          {errors.map((error, index) => ( <p key={index} className="text-red-600 dark:text-red-400 text-sm mt-2">{error}</p>))}
        </div>
      )}
      
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button onClick={onCancel || (() => router.push('/employees'))} className="px-6 py-3 border rounded-lg" disabled={isSubmitting}>
          {t('addEmployee.buttons.cancel') || 'Cancel'}
        </button>
        <button onClick={handleSubmit} className="px-6 py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50" disabled={isSubmitting}>
          {isSubmitting ? (t('submitting') || 'Submitting...') : (t('addEmployee.buttons.next') || 'Next')}
        </button>
      </div>
    </div>
  )
}

