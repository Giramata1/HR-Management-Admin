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

// Default form data to prevent undefined errors
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
  // Use default values if personalFormData is undefined
  const formData = personalFormData || defaultFormData;
  
  // Fallback function if handleInputChange is not provided
  const safeHandleInputChange = handleInputChange || ((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.warn('handleInputChange function not provided to PersonalForm. Field:', e.target.name, 'Value:', e.target.value);
  });

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Add New Employee</h1>
        <div className="flex items-center text-sm text-gray-500">
          <span>All Employee</span>
          <ChevronRight className="w-4 h-4 mx-2" />
          <span>Add New Employee</span>
        </div>
      </div>

      {/* Navigation Tabs */}
     

      {/* Profile Image */}
      <div className="mb-8">
        <div
          className="w-24 h-24 rounded-xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors"
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
            <User className="h-8 w-8 text-gray-400" />
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={safeHandleInputChange}
            placeholder="First Name"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
        </div>
        
        <div>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={safeHandleInputChange}
            placeholder="Last Name"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
        </div>

        <div>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={safeHandleInputChange}
            placeholder="Mobile Number"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
        </div>

        <div>
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={safeHandleInputChange}
            placeholder="Email Address"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
        </div>

        <div className="relative">
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={safeHandleInputChange}
            placeholder="Date of Birth"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
          <Calendar className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={safeHandleInputChange}
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          >
            <option value="" className="text-gray-400">Marital Status</option>
            <option value="single">Single</option>
            <option value="married">Married</option>
          </select>
          <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            name="gender"
            value={formData.gender}
            onChange={safeHandleInputChange}
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          >
            <option value="" className="text-gray-400">Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            name="nationality"
            value={formData.nationality}
            onChange={safeHandleInputChange}
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          >
            <option value="" className="text-gray-400">Nationality</option>
            <option value="rwandan">Rwandan</option>
            <option value="kenyan">Kenyan</option>
            <option value="ugandan">Ugandan</option>
          </select>
          <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="md:col-span-2">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={safeHandleInputChange}
            placeholder="Address"
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          />
        </div>

        <div className="relative">
          <select
            name="city"
            value={formData.city}
            onChange={safeHandleInputChange}
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          >
            <option value="" className="text-gray-400">City</option>
            <option value="kigali">Kigali</option>
            <option value="musanze">Musanze</option>
          </select>
          <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            name="state"
            value={formData.state}
            onChange={safeHandleInputChange}
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          >
            <option value="" className="text-gray-400">State</option>
            <option value="kigali-city">Kigali City</option>
            <option value="northern">Northern Province</option>
            <option value="southern">Southern Province</option>
            <option value="eastern">Eastern Province</option>
            <option value="western">Western Province</option>
          </select>
          <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            name="zipCode"
            value={formData.zipCode}
            onChange={safeHandleInputChange}
            className="w-full px-4 py-4 bg-gray-50 border-0 rounded-lg appearance-none text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white"
          >
            <option value="" className="text-gray-400">ZIP Code</option>
            <option value="00000">00000</option>
            <option value="10001">10001</option>
            <option value="10002">10002</option>
          </select>
          <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
        <button
          onClick={onCancel || (() => console.warn('onCancel function not provided'))}
          className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Cancel
        </button>
        <button
          onClick={onNext || (() => console.warn('onNext function not provided'))}
          className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Next
        </button>
      </div>
    </div>
  );
}