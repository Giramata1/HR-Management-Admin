'use client';

import React from 'react';

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
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <input
          type="email"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleChange}
          placeholder="Enter Email Address"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"
          required
        />

        <input
          type="text"
          name="slackId"
          value={formData.slackId}
          onChange={handleChange}
          placeholder="Enter Slack ID"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"
        />

        <input
          type="text"
          name="skypeId"
          value={formData.skypeId}
          onChange={handleChange}
          placeholder="Enter Skype ID"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"
        />

        <input
          type="text"
          name="githubId"
          value={formData.githubId}
          onChange={handleChange}
          placeholder="Enter GitHub ID"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 text-gray-700"
        />
      </div>

      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md transition"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-8 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition"
        >
          Add
        </button>
      </div>
    </div>
  );
}
