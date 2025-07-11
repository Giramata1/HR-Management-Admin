'use client';

import React from 'react';
import Image from 'next/image';
import { ChevronDown, Calendar, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const formData = personalFormData || defaultFormData;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow">
      <div className="mb-8" />
      <div className="mb-8">
        <div
          className="w-24 h-24 rounded-xl bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          onClick={triggerFileInput}
        >
          {profileImage ? (
            <Image
              src={profileImage}
              alt={t('addEmployee.profileName')} // Using profile name as alt text
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder={t('firstName')}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder={t('lastName')}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder={t('mobileNumber')}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <input
            type="email"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            placeholder={t('emailAddress')}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              placeholder={t('dateOfBirth')}
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
              <option value="" disabled hidden>{t('maritalStatus')}</option>
              <option value="single">{t('single')}</option>
              <option value="married">{t('married')}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>{t('gender.male')}</option> {/* Using male as placeholder */}
              <option value="male">{t('gender.male')}</option>
              <option value="female">{t('gender.female')}</option>
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
              <option value="" disabled hidden>{t('nationality.rwandan')}</option> {/* Using rwandan as placeholder */}
              <option value="rwandan">{t('nationality.rwandan')}</option>
              <option value="kenyan">{t('nationality.kenyan')}</option>
              <option value="ugandan">{t('nationality.ugandan')}</option>
            </select>
            <ChevronDown className="absolute right-4 top-4 h-5 w-5 text-gray-400 dark:text-gray-500 pointer-events-none" />
          </div>
        </div>
        <div>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder={t('address')}
            className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="relative">
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800 border-0 rounded-lg appearance-none text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="" disabled hidden>{t('city.kigali')}</option> {/* Using kigali as placeholder */}
              <option value="kigali">{t('city.kigali')}</option>
              <option value="musanze">{t('city.musanze')}</option>
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
              <option value="" disabled hidden>{t('state.kigaliCity')}</option> {/* Using kigaliCity as placeholder */}
              <option value="kigali city">{t('state.kigaliCity')}</option>
              <option value="northern province">{t('state.northernProvince')}</option>
              <option value="southern province">{t('state.southernProvince')}</option>
              <option value="eastern province">{t('state.easternProvince')}</option>
              <option value="western province">{t('state.westernProvince')}</option>
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
              <option value="" disabled hidden>{t('zipCode')}</option>
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
          {t('addEmployee.buttons.cancel')}
        </button>
        <button
          onClick={onNext}
          className="px-6 py-3 text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          {t('addEmployee.buttons.next')}
        </button>
      </div>
    </div>
  );
}