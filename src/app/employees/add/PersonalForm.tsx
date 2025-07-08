'use client';
import React from 'react';
import Image from 'next/image';
import { ChevronDown, Calendar, User } from 'lucide-react';

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
     
      <div className="mb-8">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        </div>
      </div>

     
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

      
      <div className="space-y-6 mb-8">
        {/* First row - First Name and Last Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="First Name"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Second row - Mobile Number and Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            placeholder="Email Address"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Third row - Date of Birth and Marital Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          <div className="relative">
            <select
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>Marital Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Fourth row - Gender and Nationality */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
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
              <option value="" disabled hidden>Nationality</option>
              <option value="rwandan">Rwandan</option>
              <option value="kenyan">Kenyan</option>
              <option value="ugandan">Ugandan</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Fifth row - Address (full width) */}
        <div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Address"
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Sixth row - City, State, ZIP Code on same line */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>City</option>
              <option value="kigali">Kigali</option>
              <option value="musanze">Musanze</option>
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
              <option value="" disabled hidden>State</option>
              <option value="kigali city">Kigali City</option>
              <option value="northern province">Northern Province</option>
              <option value="southern province">Southern Province</option>
              <option value="eastern province">Eastern Province</option>
              <option value="western province">Western Province</option>
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
              <option value="" disabled hidden>ZIP Code</option>
              <option value="00000">00000</option>
              <option value="10001">10001</option>
              <option value="10002">10002</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

     
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