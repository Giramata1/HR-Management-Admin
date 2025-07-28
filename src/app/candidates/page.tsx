'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
// The 'Bell' and 'ChevronDown' icons, used only in the old header, have been removed.
import { Search, Plus, Pencil, Trash2, X, CheckCircle, XCircle, Info } from 'lucide-react'; 
import { useTranslation } from 'react-i18next';

// --- Interface Definitions (No changes) ---
interface Candidate {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  cv_url: string;
  job_id: number;
  status: 'Applied' | 'Interviewed' | 'Hired' | 'Rejected' | 'In Process' | 'Selected';
  applyDate: string;
  updatedAt: string;
  createdAt?: string;
  isFake?: boolean; 
}

interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
}

// The local 'User' interface is no longer needed as the global Header handles user display.
/*
interface User {
  name: string;
  role: string;
  initials: string;
}
*/

// --- Fake API Simulation (No changes) ---
const LOCAL_STORAGE_CANDIDATES_KEY = 'hr_board_fake_candidates';

const getInitialFakeCandidates = (): Candidate[] => {
  if (typeof window !== 'undefined') {
    const storedCandidates = localStorage.getItem(LOCAL_STORAGE_CANDIDATES_KEY);
    return storedCandidates ? JSON.parse(storedCandidates) : [];
  }
  return [];
};

const saveFakeCandidates = (candidatesToSave: Candidate[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_CANDIDATES_KEY, JSON.stringify(candidatesToSave));
  }
};

let fakeCandidates: Candidate[] = getInitialFakeCandidates();
let nextFakeCandidateId = fakeCandidates.length > 0 ? Math.max(...fakeCandidates.map(c => c.id)) + 1 : 1000;

const fakeAddCandidateApi = async (newCandidateData: Omit<Candidate, 'id' | 'updatedAt' | 'createdAt' | 'isFake'>): Promise<Candidate> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const createdCandidate: Candidate = {
        ...newCandidateData,
        id: nextFakeCandidateId++,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isFake: true,
      };
      fakeCandidates.push(createdCandidate);
      saveFakeCandidates(fakeCandidates);
      resolve(createdCandidate);
    }, 500);
  });
};

const fakeUpdateCandidateApi = async (updatedCandidateData: Candidate): Promise<Candidate> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = fakeCandidates.findIndex(c => c.id === updatedCandidateData.id);
      if (index !== -1) {
        fakeCandidates[index] = { ...updatedCandidateData, updatedAt: new Date().toISOString() };
        saveFakeCandidates(fakeCandidates);
        resolve(fakeCandidates[index]);
      } else {
        reject(new Error("Candidate not found for update."));
      }
    }, 500);
  });
};

const fakeDeleteCandidateApi = async (candidateId: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const initialLength = fakeCandidates.length;
      fakeCandidates = fakeCandidates.filter(c => c.id !== candidateId);
      if (fakeCandidates.length < initialLength) {
        saveFakeCandidates(fakeCandidates);
        resolve();
      } else {
        reject(new Error("Candidate not found for deletion."));
      }
    }, 300);
  });
};

const getInitials = (name: string): string => {
    if (!name) return '';
    return name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();
};

const CandidateList = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCandidateId, setEditCandidateId] = useState<number | null>(null);
  const [candidateList, setCandidateList] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [candidateToDelete, setCandidateToDelete] = useState<Candidate | null>(null);
  
  // The local `loggedInUser` state, which was only for the old header, is removed.
  // const [loggedInUser, setLoggedInUser] = useState<User | null>(null);

  const [formData, setFormData] = useState<
    Omit<Candidate, 'id' | 'updatedAt' | 'createdAt' | 'isFake'> & { applyDate: string }
  >({
    name: '',
    email: '',
    phoneNumber: '',
    cv_url: '',
    job_id: 0,
    status: 'Applied',
    applyDate: new Date().toISOString().split('T')[0],
  });

  
  const API_BASE_URL = 'https://hr-management-system-pmfp.onrender.com/api/candidates';
  const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiSFIiLCJzdWIiOiJocm1zLmhyQGdtYWlsLmNvbSIsImlhdCI6MTc1MzE4ODkxNywiZXhwIjoxNzU2MjEyOTE3fQ.7yScLczcXGmzUeR8wRLd8gyZylZuiiNGIcniPvOKO0g';

  // The local `decodeToken` function, only for the old header, is removed.
  /*
  const decodeToken = (token: string): { name: string; role: string } => {
    // ... implementation
  };
  */

  const showNotification = useCallback((message: string, type: Notification['type']) => {
    setNotification({ message, type });
    const timer = setTimeout(() => {
      setNotification(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const formatDateForDisplay = (isoDateString: string) => {
    try {
      if (!isoDateString) return 'N/A';
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) {
        const [year, month, day] = isoDateString.split('-').map(Number);
        if (year && month && day) {
          const newDate = new Date(year, month - 1, day);
          if (!isNaN(newDate.getTime())) return newDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      console.error("Error formatting date:", isoDateString, e);
      return 'Invalid Date';
    }
  };

  const fetchCandidates = useCallback(async () => {
    setLoading(true);
    setError(null); 
    let fetchedRealCandidates: Candidate[] = [];

    try {
      const response = await fetch(API_BASE_URL, {
        method: 'GET',
        headers: {
          'accept': '*/*',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error('Authentication failed or forbidden. Please check your token and ensure it is valid.');
        }
        const errorBody = await response.json();
        throw new Error(`Error: ${response.status} ${response.statusText} - ${errorBody.message || JSON.stringify(errorBody)}`);
      }

      fetchedRealCandidates = await response.json();
      fetchedRealCandidates = fetchedRealCandidates.map(c => ({ ...c, isFake: false }));

    } catch (err: unknown) {
      const error = err as Error;
      console.error("Failed to fetch candidates from API:", error);
      showNotification(t('candidates.fetchError', {
        defaultValue: `Failed to load candidates from the server: ${error.message}`
      }), 'error');
    } finally {
      const combinedCandidates = [...fetchedRealCandidates, ...getInitialFakeCandidates()];
      setCandidateList(combinedCandidates);
      setLoading(false);
    }
  }, [AUTH_TOKEN, t, showNotification]);

  
  useEffect(() => {
    fetchCandidates();
    // The logic to set the local `loggedInUser` state is removed.
  }, [fetchCandidates]);

  const filteredCandidates = useMemo(() => {
    return candidateList.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.cv_url.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, candidateList]);

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  const statusColor = (status: Candidate['status']) => {
    switch (status) {
      case 'Hired':
      case 'Selected':
        return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300';
      case 'Interviewed':
      case 'In Process':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-800 dark:text-blue-300';
      case 'Applied':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300';
      case 'Rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'job_id' ? Number(value) : value,
    }));
  };

  const openModal = (candidate?: Candidate) => {
    if (candidate) {
      setFormData({
        name: candidate.name,
        email: candidate.email,
        phoneNumber: candidate.phoneNumber,
        cv_url: candidate.cv_url,
        job_id: candidate.job_id,
        status: candidate.status,
        applyDate: candidate.applyDate.split('T')[0],
      });
      setEditCandidateId(candidate.id);
    } else {
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        cv_url: '',
        job_id: 0,
        status: 'Applied',
        applyDate: new Date().toISOString().split('T')[0],
      });
      setEditCandidateId(null);
    }
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setEditCandidateId(null);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
      cv_url: '',
      job_id: 0,
      status: 'Applied',
      applyDate: new Date().toISOString().split('T')[0],
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isNaN(formData.job_id) || formData.job_id <= 0) {
      showNotification(t('candidates.validation.jobIdInvalid', { defaultValue: 'Job ID must be a positive number.' }), 'error');
      setLoading(false);
      return;
    }

    const payload = { ...formData };

    try {
      if (editCandidateId) {
        const existingCandidate = candidateList.find(c => c.id === editCandidateId);
        if (existingCandidate?.isFake) {
          await fakeUpdateCandidateApi({ ...existingCandidate, ...payload, updatedAt: new Date().toISOString() });
          showNotification(t('candidates.updateSuccess', { defaultValue: 'Candidate details updated successfully!' }), 'success');
        } else {
          console.warn("Real API update not fully implemented. Simulating client-side update for server-managed candidate.");
          setCandidateList((prev) =>
            prev.map((candidate) =>
              candidate.id === editCandidateId
                ? { ...candidate, ...payload, updatedAt: new Date().toISOString() }
                : candidate
            )
          );
          showNotification(t('candidates.updateSuccess', { defaultValue: 'Candidate details updated successfully!' }), 'success');
        }
      } else {
        await fakeAddCandidateApi(payload);
        showNotification(t('candidates.addSuccess', { defaultValue: 'New candidate added successfully!' }), 'success');
      }

      fetchCandidates();
      closeModal();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error submitting form:", error);
      showNotification(`Failed to save candidate: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (candidate: Candidate) => {
    setCandidateToDelete(candidate);
    setShowDeleteConfirmModal(true);
  };

  const cancelDelete = () => {
    setCandidateToDelete(null);
    setShowDeleteConfirmModal(false);
  };

  const handleDelete = async () => {
    if (!candidateToDelete) return;

    setLoading(true);
    setError(null);

    try {
      if (candidateToDelete.isFake) {
        await fakeDeleteCandidateApi(candidateToDelete.id);
        showNotification(t('candidates.deleteSuccess', { defaultValue: 'Candidate record deleted successfully!' }), 'success');
      } else {
        const response = await fetch(`${API_BASE_URL}/${candidateToDelete.id}`, {
          method: 'DELETE',
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${AUTH_TOKEN}`,
          },
        });

        if (!response.ok) {
          const errorBody = await response.json();
          throw new Error(`Delete failed: ${response.status} ${response.statusText} - ${errorBody.message || JSON.stringify(errorBody)}`);
        }
        showNotification(t('candidates.deleteSuccess', { defaultValue: 'Candidate record deleted successfully!' }), 'success');
      }

      fetchCandidates();
      cancelDelete();
    } catch (err: unknown) {
      const error = err as Error;
      console.error("Error deleting candidate:", error);
      showNotification(t('candidates.deleteError', { defaultValue: `Failed to delete candidate: ${error.message}` }), 'error');
    } finally {
      setLoading(false);
    }
  };

  // The loading condition is simplified as `loggedInUser` is no longer tracked here.
  if (loading && candidateList.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        Loading...
      </div>
    );
  }

  if (error && !notification) {
    return (
      <div className="flex items-center justify-center h-full text-red-600">
        {error}
      </div>
    );
  }

  return (
    // The outer div no longer needs padding or background color classes, as the RootLayout handles this.
    <div>
      {notification && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 p-4 rounded-lg shadow-lg flex items-center space-x-3 z-50
          ${notification.type === 'success' ? 'bg-green-500 text-white' : ''}
          ${notification.type === 'error' ? 'bg-red-500 text-white' : ''}
          ${notification.type === 'info' ? 'bg-blue-500 text-white' : ''}
        `}>
          {notification.type === 'success' && <CheckCircle className="h-5 w-5" />}
          {notification.type === 'error' && <XCircle className="h-5 w-5" />}
          {notification.type === 'info' && <Info className="h-5 w-5" />}
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="ml-auto">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* The entire local header div has been removed from here. */}
      {/* Your global Header in RootLayout.tsx now displays the title and user profile. */}

      <div className="border rounded-lg border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className="relative w-full sm:w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('search.placeholder', { defaultValue: 'Search' })}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full"
            />
          </div>
          <button
            onClick={() => openModal()}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
            <span>{t('candidates.addNew', { defaultValue: 'Add New Candidate' })}</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-[640px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
              <tr>
                <th className="px-4 sm:px-6 py-3"><input type="checkbox" /></th>
                <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.name')}</th>
                <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.email')}</th>
                <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.phone')}</th>
                <th className="px-4 sm:px-6 py-3 text-left">CV URL</th>
                <th className="px-4 sm:px-6 py-3 text-left">Job ID</th>
                <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.appliedDate')}</th>
                <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.status')}</th>
                <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.actions', { defaultValue: 'Actions' })}</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedCandidates.length === 0 && !loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {t('candidates.table.noRecords')}
                  </td>
                </tr>
              ) : (
                paginatedCandidates.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                    <td className="px-4 sm:px-6 py-3"><input type="checkbox" /></td>
                    <td className="px-4 sm:px-6 py-3 flex items-center space-x-3">
                      <div className="rounded-full w-8 h-8 sm:w-9 sm:h-9 bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-800 dark:text-gray-200 font-semibold">
                        {getInitials(c.name)}
                      </div>
                      <span>{c.name}</span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">{c.email}</td>
                    <td className="px-4 sm:px-6 py-3">{c.phoneNumber}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <a href={c.cv_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        View CV
                      </a>
                    </td>
                    <td className="px-4 sm:px-6 py-3">{c.job_id}</td>
                    <td className="px-4 sm:px-6 py-3">{formatDateForDisplay(c.applyDate)}</td>
                    <td className="px-4 sm:px-6 py-3">
                      <span className={`px-2 py-1 rounded-full font-medium text-xs sm:text-sm ${statusColor(c.status)}`}>
                        {t(`status.${c.status.toLowerCase().replace(' ', '')}`, { defaultValue: c.status })}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 flex space-x-2">
                      <button
                        onClick={() => openModal(c)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        aria-label="Edit"
                        disabled={loading}
                      >
                        <Pencil className="h-4 w-4 text-gray-500 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => confirmDelete(c)}
                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                        aria-label="Delete"
                        disabled={loading}
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

      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <span>{t('candidates.pagination.showing')}</span>
          <select
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white"
            disabled={loading}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
          <span>
            {t('candidates.pagination.recordsInfo', {
              start: filteredCandidates.length > 0 ? startIndex + 1 : 0,
              end: Math.min(startIndex + itemsPerPage, filteredCandidates.length),
              total: filteredCandidates.length,
            })}
          </span>
        </div>
        <div className="flex items-center space-x-1 flex-wrap">
          <button
            disabled={currentPage === 1 || loading}
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {'<'}
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-2 py-1 rounded ${
                currentPage === i + 1
                  ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              disabled={loading}
            >
              {i + 1}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages || loading}
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
          >
            {'>'}
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-modal="true" role="dialog">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close modal"
              disabled={loading}
            >
              <X className="h-6 w-6" />
            </button>
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editCandidateId ? t('candidates.edit', { defaultValue: 'Edit Candidate' }) : t('candidates.addNew', { defaultValue: 'Add New Candidate' })}
            </h2>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                <input
                  type="text"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., (123) 456-7890"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="cv_url" className="block text-sm font-medium text-gray-700 dark:text-gray-300">CV URL</label>
                <input
                  type="url"
                  id="cv_url"
                  name="cv_url"
                  value={formData.cv_url}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., https://example.com/my-cv.pdf"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="job_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job ID</label>
                <input
                  type="number"
                  id="job_id"
                  name="job_id"
                  value={formData.job_id}
                  onChange={handleInputChange}
                  required
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="applyDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Applied Date</label>
                <input
                  type="date"
                  id="applyDate"
                  name="applyDate"
                  value={formData.applyDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                  disabled={loading}
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Hired">Hired</option>
                  <option value="Rejected">Rejected</option>
                  <option value="In Process">In Process</option>
                  <option value="Selected">Selected</option>
                </select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-purple-600 text-white hover:bg-purple-700"
                  disabled={loading}
                >
                  {loading ? (editCandidateId ? 'Updating...' : 'Adding...') : (editCandidateId ? t('candidates.update', { defaultValue: 'Update' }) : t('candidates.add', { defaultValue: 'Add' }))}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirmModal && candidateToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" aria-modal="true" role="dialog">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-sm p-6 relative text-center">
            <button
              onClick={cancelDelete}
              className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
              aria-label="Close"
              disabled={loading}
            >
              <X className="h-6 w-6" />
            </button>
            <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
              {t('candidates.confirmDeleteTitle', { defaultValue: 'Confirm Deletion' })}
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t('candidates.confirmDeleteMessage', {
                defaultValue: `Are you sure you want to permanently delete the record for "${candidateToDelete.name}"? This action cannot be undone.`,
                candidateName: candidateToDelete.name
              })}
            </p>
            <div className="flex justify-center space-x-4">
              <button
                type="button"
                onClick={cancelDelete}
                className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600"
                disabled={loading}
              >
                {t('candidates.cancel', { defaultValue: 'Cancel' })}
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                disabled={loading}
              >
                {loading ? 'Deleting...' : t('candidates.deleteConfirm', { defaultValue: 'Delete' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
 
export default CandidateList;