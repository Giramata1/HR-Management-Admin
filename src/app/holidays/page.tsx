'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, Plus, Calendar } from 'lucide-react';
import Image from 'next/image';

const generateRwandaHolidays = () => {
  const currentYear = new Date().getFullYear();
  const today = new Date();

  const baseHolidays = [
    { month: 0, day: 1, name: "New Year's Day" },
    { month: 3, day: 7, name: 'Genocide Against the Tutsi Memorial Day' },
    { month: 4, day: 1, name: 'Labour Day' },
    { month: 6, day: 1, name: 'Independence Day' },
    { month: 6, day: 4, name: 'Liberation Day' },
    { month: 7, day: 15, name: 'Assumption Day' },
    { month: 8, day: 25, name: 'Umuganura Day' },
    { month: 10, day: 1, name: 'All Saints Day' },
    { month: 11, day: 25, name: 'Christmas Day' },
    { month: 11, day: 26, name: 'Boxing Day' },
  ];

  return baseHolidays.map(h => {
    const dateObj = new Date(currentYear, h.month, h.day);
    return {
      date: dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }),
      day: dateObj.toLocaleDateString('en-US', { weekday: 'long' }),
      name: h.name,
      upcoming: dateObj >= today,
    };
  });
};

export default function HolidayPage() {
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const holidays = generateRwandaHolidays();

  const filtered = holidays.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddHoliday = () => {
    setIsModalOpen(false);
    setHolidayName('');
    setHolidayDate('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6 relative text-gray-900 dark:text-white">
      <div className="transition-all duration-300">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-semibold">Holidays</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              All Holidays lists
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <Bell className="h-5 w-5" />
            </button>

            <div className="flex items-center space-x-3 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-md bg-white dark:bg-gray-800">
              <Image
                src="/avatars/placeholder.png"
                alt="Robert Allen"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Robert Allen</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">HR Manager</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>

        {/* Holiday Table */}
        <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-[#7C3AED] text-white px-4 py-2 rounded-md hover:bg-purple-700"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Holiday</span>
            </button>
          </div>

          <table className="w-full table-auto text-sm text-gray-700 dark:text-gray-200">
            <thead className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Day</th>
                <th className="px-6 py-3">Holiday Name</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((holiday, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700">
                  <td className="px-6 py-4 relative">
                    {holiday.upcoming && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-purple-600" />
                    )}
                    {holiday.date}
                  </td>
                  <td className="px-6 py-4">{holiday.day}</td>
                  <td className="px-6 py-4">{holiday.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 flex space-x-6 text-sm font-semibold text-gray-900 dark:text-white">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-purple-600 rounded-full inline-block" />
            <span>Upcoming</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full inline-block" />
            <span>Past Holidays</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl px-6 py-6 w-[320px] shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-5">Add New Holiday</h2>

            <input
              type="text"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              placeholder="Holiday Name"
              className="w-full mb-4 px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-md text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />

            <div className="relative mb-6">
              <input
                type="text"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                placeholder="Select Date"
                className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-700 rounded-md text-sm pr-10 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                onFocus={(e) => {
                  e.target.type = 'date';
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = 'text';
                  }
                }}
              />
              <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-12 py-2 text-sm rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHoliday}
                className="px-12 py-2 text-sm rounded-md bg-[#7C3AED] text-white hover:bg-purple-700"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
