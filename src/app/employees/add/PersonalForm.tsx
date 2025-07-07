'use client';
import React from 'react';
import Image from 'next/image';
import { ChevronDown, Calendar, User, ChevronRight } from 'lucide-react';

type Props = {
  profileImage: string | null;
  personalFormData: {
    firstName: string;
    lastName: string;
    mobileNumber: string;
    emailAddress: string;
    dateOfBirth: string;
    maritalStatus: string;
    gender: string;
    nationality: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  triggerFileInput: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onNext: () => void;
};

const defaultFormData = {
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
};

export default function PersonalForm({
  profileImage,
  personalFormData,
  handleInputChange,
  triggerFileInput,
  fileInputRef,
  handleImageUpload,
  onCancel,
  onNext,
}: Props) {
  const formData = personalFormData || defaultFormData;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">Add New Employee</h1>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <span>All Employee</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Add New Employee</span>
        </div>
      </div>

      {/* Profile Image Upload */}
      <div className="mb-8">
        <div
          className="w-24 h-24 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          onClick={triggerFileInput}
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt="Profile"
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

      {/* Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {[
          { name: 'firstName', placeholder: 'First Name' },
          { name: 'lastName', placeholder: 'Last Name' },
          { name: 'mobileNumber', placeholder: 'Mobile Number' },
          { name: 'emailAddress', placeholder: 'Email Address', type: 'email' },
        ].map(({ name, placeholder, type = 'text' }) => (
          <input
            key={name}
            type={type}
            name={name}
            value={formData[name as keyof typeof formData]}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        ))}

        {/* Date of Birth */}
        <div className="relative">
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleInputChange}
            placeholder="Date of Birth"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Calendar className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
        </div>

        {/* Dropdowns */}
        {[
          { name: 'maritalStatus', options: ['Single', 'Married'] },
          { name: 'gender', options: ['Male', 'Female'] },
          { name: 'nationality', options: ['Rwandan', 'Kenyan', 'Ugandan'] },
          { name: 'city', options: ['Kigali', 'Musanze'] },
          { name: 'state', options: ['Kigali City', 'Northern Province', 'Southern Province', 'Eastern Province', 'Western Province'] },
          { name: 'zipCode', options: ['00000', '10001', '10002'] },
        ].map(({ name, options }) => (
          <div className="relative" key={name}>
            <select
              name={name}
              value={formData[name as keyof typeof formData]}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>{name.replace(/([A-Z])/g, ' $1')}</option>
              {options.map((opt) => (
                <option key={opt.toLowerCase()} value={opt.toLowerCase()}>{opt}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        ))}

        {/* Address (Full Width) */}
        <div className="md:col-span-2">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={onCancel}
          className="px-6 py-3 text-gray-700 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}
