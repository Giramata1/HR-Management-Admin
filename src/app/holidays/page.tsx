'use client';

import { useEffect, useState } from 'react';
// Bell and ChevronDown icons, which were part of the old header, are removed.
// Image component is also removed as it's no longer needed in this file.
import { Search, Plus, Calendar, Edit2, Trash2, X } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

// --- Type Definitions ---
interface Holiday {
  id: number;
  name: string;
  date: string;
  day: string;
  upcoming: boolean;
  isCustom?: boolean;
  isDeleted?: boolean;
}

// The local 'User' interface is no longer needed here.
/*
interface User {
  fullName: string;
  role: string;
  avatar?: string;
}
*/

// --- Hooks ---

// The local 'useAuth' hook is no longer needed as the global header handles user info.
/*
const useAuth = (): { user: User | null } => {
  // ... implementation
};
*/

// --- API Simulation ---
const fakeAPI = {
  getHolidays: (): Holiday[] => {
    try {
      const stored = localStorage.getItem('allHolidays');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading holidays from localStorage:', error);
      return [];
    }
  },

  saveHolidays: (holidays: Holiday[]) => {
    try {
      localStorage.setItem('allHolidays', JSON.stringify(holidays));
    } catch (error) {
      console.error('Error saving holidays to localStorage:', error);
    }
  },

  addOrUpdateHoliday: (holiday: Holiday) => {
    const holidays = fakeAPI.getHolidays();
    const existingIndex = holidays.findIndex(h => h.id === holiday.id);
    
    if (existingIndex >= 0) {
      holidays[existingIndex] = holiday;
    } else {
      holidays.push(holiday);
    }
    
    fakeAPI.saveHolidays(holidays);
    return holidays;
  },

  deleteHoliday: (id: number) => {
    const holidays = fakeAPI.getHolidays();
    const holidayIndex = holidays.findIndex(h => h.id === id);
    
    if (holidayIndex >= 0) {
      const holiday = holidays[holidayIndex];
      if (holiday.isCustom) {
        holidays.splice(holidayIndex, 1);
      } else {
        holidays[holidayIndex].isDeleted = true;
      }
      fakeAPI.saveHolidays(holidays);
    }
    
    return holidays;
  }
};

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

  return baseHolidays.map((h, index) => {
    const dateObj = new Date(currentYear, h.month, h.day);
    return {
      id: index + 1,
      date: dateObj.toLocaleDateString(locale, {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }),
      day: dateObj.toLocaleDateString(locale, { weekday: 'long' }),
      name: t(h.nameKey),
      upcoming: dateObj >= today,
      isCustom: false,
      isDeleted: false,
    };
  });
};

// --- Components ---

const Toast: React.FC<{ message: string; onClose: () => void }> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
      <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 max-w-sm">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        <span className="text-sm font-medium">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto p-1 hover:bg-green-700 rounded-full transition-colors"
          aria-label={useTranslation().t('close', { defaultValue: 'Close toast' })}
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const ConfirmModal: React.FC<{
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ message, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" aria-modal="true" role="dialog">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t('holidays.confirmDeleteTitle', { defaultValue: 'Confirm Deletion' })}
          </h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
            aria-label={t('cancel', { defaultValue: 'Cancel' })}
          >
            {t('cancel', { defaultValue: 'Cancel' })}
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium"
            aria-label={t('delete', { defaultValue: 'Delete' })}
          >
            {t('delete', { defaultValue: 'Delete' })}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function HolidayPage() {
  const { t, i18n } = useTranslation();
  // The `user` constant from the local useAuth hook is removed.
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editHolidayId, setEditHolidayId] = useState<number | null>(null);
  const [holidayName, setHolidayName] = useState('');
  const [holidayDate, setHolidayDate] = useState('');
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [toast, setToast] = useState<{ message: string; key: number } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ id: number; message: string } | null>(null);

  const locale = i18n.language === 'fr' ? 'fr-FR' : 'en-US';

  useEffect(() => {
    const baseHolidays = generateRwandaHolidays(t, locale);
    const storedHolidays = fakeAPI.getHolidays();
    
    const mergedHolidays = baseHolidays.map(baseHoliday => {
      const stored = storedHolidays.find(h => h.id === baseHoliday.id);
      return stored || baseHoliday;
    });

    const customHolidays = storedHolidays.filter(h => h.isCustom);
    const allHolidays = [...mergedHolidays, ...customHolidays];

    setHolidays(allHolidays);

    if (storedHolidays.length === 0) {
      fakeAPI.saveHolidays(allHolidays);
    }
  }, [t, locale]);

  const showToast = (message: string) => {
    setToast({ message, key: Date.now() });
  };

  const closeToast = () => {
    setToast(null);
  };

  const handleAddOrUpdateHoliday = () => {
    if (!holidayName || !holidayDate) {
      showToast(t('holidays.requiredFields', { defaultValue: 'Holiday name and date are required' }));
      return;
    }

    const dateObj = new Date(holidayDate);
    if (isNaN(dateObj.getTime())) {
      showToast(t('holidays.invalidDate', { defaultValue: 'Invalid date format' }));
      return;
    }

    const holidayData = {
      id: editHolidayId || Date.now(), 
      name: holidayName,
      date: dateObj.toLocaleDateString(locale, {
        month: 'long',
        day: '2-digit',
        year: 'numeric',
      }),
      day: dateObj.toLocaleDateString(locale, { weekday: 'long' }),
      upcoming: dateObj >= new Date(),
      isCustom: editHolidayId ? holidays.find(h => h.id === editHolidayId)?.isCustom || false : true,
      isDeleted: false,
    };

    const updatedHolidays = fakeAPI.addOrUpdateHoliday(holidayData);
    setHolidays(updatedHolidays);

    if (editHolidayId) {
      showToast(t('holidays.updated', { defaultValue: `Holiday updated successfully: ${holidayName}` }));
    } else {
      showToast(t('holidays.added', { defaultValue: `Holiday added successfully: ${holidayName}` }));
    }

    setHolidayName('');
    setHolidayDate('');
    setEditHolidayId(null);
    setIsModalOpen(false);
  };

  const handleEditHoliday = (holiday: Holiday) => {
    setHolidayName(holiday.name);
    try {
      const dateObj = new Date(holiday.date);
      setHolidayDate(dateObj.toISOString().split('T')[0]);
    } catch (error) {
      console.error('Error parsing holiday date for edit:', error);
      showToast(t('holidays.invalidDate', { defaultValue: 'Invalid date format' }));
      return;
    }
    setEditHolidayId(holiday.id);
    setIsModalOpen(true);
  };

  const handleDeleteHoliday = (id: number) => {
    const holiday = holidays.find(h => h.id === id);
    if (holiday) {
      setConfirmDelete({
        id,
        message: t('holidays.confirmDelete', {
          defaultValue: `Are you sure you want to delete ${holiday.name}?`,
          name: holiday.name,
        }),
      });
    }
  };

  const confirmDeleteAction = () => {
    if (!confirmDelete) return;
    const updatedHolidays = fakeAPI.deleteHoliday(confirmDelete.id);
    setHolidays(updatedHolidays);
    showToast(t('holidays.deleted', { defaultValue: 'Holiday deleted successfully' }));
    setConfirmDelete(null);
  };

  const cancelDelete = () => {
    setConfirmDelete(null);
  };

  const filteredHolidays = holidays
    .filter(h => !h.isDeleted)
    .filter(h => h.name.toLowerCase().includes(search.toLowerCase()));

  return (
    // The main container no longer needs padding or background classes.
    <div>
      {/* The entire local header section has been removed from this file. */}
      {/* Your global Header in RootLayout.tsx renders the title, search, and user info. */}

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
            onClick={() => {
              setHolidayName('');
              setHolidayDate('');
              setEditHolidayId(null);
              setIsModalOpen(true);
            }}
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
                <th className="px-4 sm:px-6 py-3">{t('holidays.actions', { defaultValue: 'Actions' })}</th>
              </tr>
            </thead>
            <tbody>
              {filteredHolidays.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 sm:px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    {t('holidays.table.noRecords')}
                  </td>
                </tr>
              ) : (
                filteredHolidays.map((holiday, index) => (
                  <tr key={`${holiday.id}-${index}`} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b dark:border-gray-700">
                    <td className="px-4 sm:px-6 py-4 relative">
                      {holiday.upcoming && (
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1 h-6 rounded-full bg-purple-600" />
                      )}
                      <span className="text-sm">{holiday.date}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 text-sm">{holiday.day}</td>
                    <td className="px-4 sm:px-6 py-4 text-sm">{holiday.name}</td>
                    <td className="px-4 sm:px-6 py-4 flex space-x-2">
                      <button
                        onClick={() => handleEditHoliday(holiday)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        aria-label={t('holidays.edit', { defaultValue: 'Edit' })}
                      >
                        <Edit2 className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => handleDeleteHoliday(holiday.id)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        aria-label={t('holidays.delete', { defaultValue: 'Delete' })}
                      >
                        <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 sm:px-6 py-6 w-full max-w-xs sm:max-w-md mx-4 shadow-xl">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white mb-4 sm:mb-5">
              {editHolidayId ? t('holidays.editHoliday', { defaultValue: 'Edit Holiday' }) : t('holidays.modalTitle')}
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
                onClick={() => {
                  setIsModalOpen(false);
                  setHolidayName('');
                  setHolidayDate('');
                  setEditHolidayId(null);
                }}
                className="flex-1 py-2 sm:py-2.5 text-sm rounded-md bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {t('holidays.cancel')}
              </button>
              <button
                onClick={handleAddOrUpdateHoliday}
                className="flex-1 py-2 sm:py-2.5 text-sm rounded-md bg-[#7C3AED] text-white hover:bg-purple-700"
              >
                {editHolidayId ? t('holidays.update', { defaultValue: 'Update' }) : t('holidays.add')}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          onClose={closeToast}
          key={toast.key}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          message={confirmDelete.message}
          onConfirm={confirmDeleteAction}
          onCancel={cancelDelete}
        />
      )}
    </div>
  );
}