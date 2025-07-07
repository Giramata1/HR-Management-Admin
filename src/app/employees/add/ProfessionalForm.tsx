

import React from 'react';

type ProfessionalFormData = {
  employeeID: string;
  userName: string;
  employeeType: string;
  emailAddress: string;
  department: string;
  designation: string;
  joiningDate: string;
  officeLocation: string;
};

type Props = {
  formData: ProfessionalFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  employeeTypes: string[];
  departments: string[];
  officeLocations: string[];
  onCancel?: () => void;
  onNext?: () => void;
};

export default function ProfessionalForm({
  formData,
  handleChange,
  employeeTypes,
  departments,
  officeLocations,
  onCancel,
  onNext,
}: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext?.();
  };

  const inputClass =
    'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all';

  const selectClass =
    'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <input
          type="text"
          name="employeeID"
          value={formData.employeeID}
          onChange={handleChange}
          placeholder="Employee ID"
          className={inputClass}
          required
        />

        <input
          type="text"
          name="userName"
          value={formData.userName}
          onChange={handleChange}
          placeholder="User Name"
          className={inputClass}
          required
        />

        <select
          name="employeeType"
          value={formData.employeeType}
          onChange={handleChange}
          className={selectClass}
          required
        >
          <option value="">Select Employee Type</option>
          {employeeTypes.map((type) => (
            <option key={type} value={type.toLowerCase()}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="email"
          name="emailAddress"
          value={formData.emailAddress}
          onChange={handleChange}
          placeholder="Email Address"
          className={inputClass}
          required
        />

        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className={selectClass}
          required
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept.toLowerCase()}>
              {dept}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          placeholder="Enter Designation"
          className={inputClass}
          required
        />

        <input
          type="date"
          name="joiningDate"
          value={formData.joiningDate}
          onChange={handleChange}
          placeholder="Select Joining Date"
          className={inputClass}
          required
        />

        <div className="md:col-span-2">
          <select
            name="officeLocation"
            value={formData.officeLocation}
            onChange={handleChange}
            className={selectClass}
            required
          >
            <option value="">Select Office Location</option>
            {officeLocations.map((loc) => (
              <option key={loc} value={loc.toLowerCase()}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        )}
        {onNext && (
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Next
          </button>
        )}
      </div>
    </form>
  );
}
