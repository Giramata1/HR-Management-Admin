'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  formData: {
    emailAddress: string;
    slackId: string;
    skypeId: string;
    githubId: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export default function AccountAccess({ formData, handleChange, onCancel, onSubmit }: Props) {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
        <input
          type="email"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleChange}
          placeholder={t('accountAccess.emailPlaceholder')}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 placeholder-gray-400 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          required
        />

        <input
          type="text"
          name="slackId"
          value={formData.slackId}
          onChange={handleChange}
          placeholder={t('accountAccess.slackPlaceholder')}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 placeholder-gray-400 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <input
          type="text"
          name="skypeId"
          value={formData.skypeId}
          onChange={handleChange}
          placeholder={t('accountAccess.skypePlaceholder')}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 placeholder-gray-400 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />

        <input
          type="text"
          name="githubId"
          value={formData.githubId}
          onChange={handleChange}
          placeholder={t('accountAccess.githubPlaceholder')}
          className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 placeholder-gray-400 text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
      </div>

      
      <div className="flex flex-col sm:flex-row justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-md transition w-full sm:w-auto"
        >
          {t('accountAccess.back')}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition w-full sm:w-auto"
        >
          {t('accountAccess.add')}
        </button>
      </div>
    </div>
  );
}