'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown, Plus, Calendar } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

const generateRwandaHolidays = (t: (key: string) => string, locale: string) => {
  const currentYear = new Date().getFullYear();
  const today = new Date();

  const baseHolidays = [
    { month: 0, day: 1, nameKey: "holidays.names.newYearsDay" },
    { month: 3, day: 7, nameKey: "holidays.names.genocideMemorialDay" },
    { month: 4, day: 1, nameKey: "holidays.names.labourDay" },
    { month: 6, day: 1, nameKey: "holidays.names.independenceDay" },
    { month: 6, day: 4, nameKey: "holidays.names.liberationDay" },
    { month: 7, day: 15, nameKey: "holidays.names.assumptionDay" },
    { month: 8, day: 25, nameKey: "holidays.names.umuganuraDay" },
    { month: 10, day: 1, nameKey: "holidays.names.allSaintsDay" },
    { month: 11, day: 25, nameKey: "holidays.names.christmasDay" },
    { month: 11, day: 26, nameKey: "holidays.names.boxingDay" },
  ];

  return baseHolidays.map(h => {
    const dateObj = new Date(currentYear, h.month, h.day);
    return {
      date: dateObj.toLocaleDateString(locale, {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }),
      day: dateObj.toLocaleDateString(locale, { weekday: 'long' }),
      name: t(h.nameKey),
      upcoming: dateObj >= today,
    };
  });
};

export default function HolidayPage() {
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';
  const holidays = generateRwandaHolidays(t, locale);

  const filtered = holidays.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddHoliday = () => {
    setIsModalOpen(false);
    setHolidayName('');
    setHolidayDate('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">{t('holidays.title')}</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{t('holidays.subtitle')}</p>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative w-full sm:w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('holidays.searchPlaceholder')}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
            />
          </div>

          <button
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label={t('notifications.title')}
          >
            <Bell className="h-4 sm:h-5 w-4 sm:w-5" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 rounded-md bg-white dark:bg-gray-800">
            <Image
              src="/avatars/placeholder.png"
              alt={t('holidays.profileName')}
              width={32}
              height={32}
              className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{t('holidays.profileName')}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{t('holidays.profileRole')}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 sm:p-6 border-b dark:border-gray-700 gap-4 sm:gap-0">
          <div className="relative w-full sm:w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('holidays.searchPlaceholder')}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-[#7C3AED] text-white px-3 sm:px-4 py-2 rounded-md hover:bg-purple-700 text-sm"
          >
            <Plus className="h-4 w-4" />
            <span>{t('holidays.addNewHoliday')}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full table-auto text-sm text-gray-700 dark:text-gray-200">
            <thead className="text-left text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
              <tr>
                <th className="px-4 sm:px-6 py-3">{t('holidays.date')}</th>
                <th className="px-4 sm:px-6 py-3">{t('holidays.day')}</th>
                <th className="px-4 sm:px-6 py-3">{t('holidays.holidayName')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('holidays.table.noRecords')}
                  </td>
                </tr>
              ) : (
                filtered.map((holiday, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-4 sm:px-6 py-4 relative">
                      {holiday.upcoming && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-purple-600" />
                      )}
                      <span className="text-sm">{holiday.date}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm">{holiday.day}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm">{holiday.name}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-6 text-sm font-semibold text-gray-900 dark:text-white">
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-purple-600 rounded-full inline-block" />
          <span>{t('holidays.legendUpcoming')}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full inline-block" />
          <span>{t('holidays.legendPast')}</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 sm:px-6 py-6 w-full max-w-xs sm:max-w-md mx-4 shadow-xl">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-5">
              {t('holidays.modalTitle')}
            </h2>

            <input
              type="text"
              value={holidayName}
              onChange={(e) => setHolidayName(e.target.value)}
              placeholder={t('holidays.modalHolidayName')}
              className="w-full mb-4 px-3 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-700 rounded-md text-sm placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />

            <div className="relative mb-4 sm:mb-6">
              <input
                type="text"
                value={holidayDate}
                onChange={(e) => setHolidayDate(e.target.value)}
                placeholder={t('holidays.modalSelectDate')}
                className="w-full px-3 py-2 sm:py-2.5 border border-gray-300 dark:border-gray-700 rounded-md text-sm pr-10 placeholder-gray-400 dark:placeholder-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                onFocus={(e) => {
                  e.target.type = 'date';
                }}
                onBlur={(e) => {
                  if (!e.target.value) {
                    e.target.type = 'text';
                  }
                }}
              />
              <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
            </div>

            <div className="flex justify-between space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-2 sm:py-2.5 text-sm rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {t('holidays.cancel')}
              </button>
              <button
                onClick={handleAddHoliday}
                className="flex-1 py-2 sm:py-2.5 text-sm rounded-md bg-[#7C3AED] text-white hover:bg-purple-700"
              >
                {t('holidays.add')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
