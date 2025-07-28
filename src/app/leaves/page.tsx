'use client'

import React, { useState, useEffect, useCallback } from 'react'
import {
  Loader2, 
  Search,
  // Bell and ChevronDown are removed as they were part of the old header
  CheckCircle,
  XCircle,
  Clock,
  Pencil,
  Trash2,
  AlertTriangle,
 
} from 'lucide-react'
// Image import is removed as EmployeeAvatar component is no longer needed here
// import Image from 'next/image'

// --- Type Definitions ---
type LeaveRecord = {
  id: string;
  employeeId: string;
  date: string;
  type: string;
  duration: 'FullDay' | 'HalfDay';
  days: number;
  employeeName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
};

// The local User type is no longer needed for this component
/*
type User = {
  fullName: string
  role: string
  profileImage?: string
}
*/

// --- Hooks for Data Management ---

// The local useAuth hook is no longer needed as the global header handles user info
/*
const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loggedInUser: User = { fullName: 'HR Admin', role: 'HR Manager' };
    setUser(loggedInUser);
  }, []);

  return { user };
};
*/

const useLeave = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllLeaves = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const storedData = localStorage.getItem('allLeaveRequests');
      if (storedData) {
        try {
          const parsedData: LeaveRecord[] = JSON.parse(storedData);
          const sanitizedData = parsedData.map(rec => ({...rec, status: rec.status.toLowerCase() as LeaveRecord['status']}));
          setLeaveRecords(sanitizedData.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
        } catch (error) {
          console.error("Failed to parse leave records from localStorage", error);
          setLeaveRecords([]);
        }
      } else {
          setLeaveRecords([]);
      }
      setLoading(false);
    }, 500);
  }, []);

  useEffect(() => {
    fetchAllLeaves();
  }, [fetchAllLeaves]);

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    const updatedRecords = leaveRecords.map(r => r.id === id ? { ...r, status } : r);
    localStorage.setItem('allLeaveRequests', JSON.stringify(updatedRecords));
    setLeaveRecords(updatedRecords);
  };

  const deleteLeaveRecord = (id: string) => {
    const updatedRecords = leaveRecords.filter(r => r.id !== id);
    localStorage.setItem('allLeaveRequests', JSON.stringify(updatedRecords));
    setLeaveRecords(updatedRecords);
  };

  const updateLeaveRecord = (updatedRecord: LeaveRecord) => {
    const updatedRecords = leaveRecords.map(r => r.id === updatedRecord.id ? updatedRecord : r);
    localStorage.setItem('allLeaveRequests', JSON.stringify(updatedRecords));
    setLeaveRecords(updatedRecords);
  };

  return { leaveRecords, loading, updateLeaveStatus, deleteLeaveRecord, updateLeaveRecord };
};

// The local EmployeeAvatar component is no longer needed.
/*
const EmployeeAvatar = ({ src, name }: { src?: string; name: string }) => {
  // ... component implementation
}
*/

const LeaveManagementPage = () => {
  // The local `user` state from the old useAuth hook is removed.
  const { leaveRecords, loading, updateLeaveStatus, deleteLeaveRecord, updateLeaveRecord } = useLeave()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const [editingRecord, setEditingRecord] = useState<LeaveRecord | null>(null)
  const [recordToDelete, setRecordToDelete] = useState<LeaveRecord | null>(null)

  

  const themeClasses = {
    bg: isDarkMode ? 'bg-gray-900' : 'bg-gray-50',
    cardBg: isDarkMode ? 'bg-gray-800' : 'bg-white',
    text: isDarkMode ? 'text-white' : 'text-gray-900',
    textSecondary: isDarkMode ? 'text-gray-300' : 'text-gray-600',
    textMuted: isDarkMode ? 'text-gray-400' : 'text-gray-500',
    border: isDarkMode ? 'border-gray-700' : 'border-gray-200',
    hover: isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50',
    tableBg: isDarkMode ? 'bg-gray-700' : 'bg-gray-50',
    input: isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300',
  }

  const getStatusBadge = (status: LeaveRecord['status']) => {
    const base = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold'
    switch (status) {
      case 'pending': return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400`
      case 'approved': return `${base} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400`
      case 'rejected': return `${base} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400`
      default: return base
    }
  }

  const getStatusIcon = (status: LeaveRecord['status']) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  const filteredData = leaveRecords.filter((item) =>
    Object.values(item).join(' ').toLowerCase().includes(searchQuery.toLowerCase())
  )

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (document.documentElement.classList.contains('dark') || (!('theme' in localStorage) && prefersDark)) {
        setIsDarkMode(true);
    } else {
        setIsDarkMode(false);
    }
  }, [])

  const handleEdit = (record: LeaveRecord) => setEditingRecord(record)

  const handleUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (editingRecord) {
      updateLeaveRecord(editingRecord)
      setEditingRecord(null)
    }
  }

  const confirmDelete = () => {
    if (recordToDelete) {
      deleteLeaveRecord(recordToDelete.id);
      setRecordToDelete(null);
    }
  }
  
  // Since `user` is removed, isHR is hardcoded to true to maintain existing functionality.
  // In a real app, this would come from a global context.
  const isHR = true;

  return (
    <div className={`${themeClasses.bg} min-h-screen`}>
      {/* The entire <header> section has been removed from this file. */}
      {/* The global Header in RootLayout.tsx renders the title, search, and user info. */}

      <main className="px-6 py-8 lg:px-10">
        <div className={`${themeClasses.cardBg} rounded-xl shadow-lg overflow-hidden`}>
          <div className="p-4 border-b ${themeClasses.border}">
            <div className="relative max-w-md">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${themeClasses.textMuted}`} />
              <input
                type="text"
                placeholder="Search by employee, reason, type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-11 pr-4 py-3 border rounded-full text-sm ${themeClasses.input}`}
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${themeClasses.border}`}>
              <thead className={`${themeClasses.tableBg}`}>
                <tr>
                  {['DATE', 'TYPE', 'DURATION', 'DAYS', 'EMPLOYEE', 'REASON', 'STATUS', 'ACTIONS']
                    .map((heading) => (
                      <th key={heading} className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>{heading}</th>
                    ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${themeClasses.border}`}>
                {loading ? (
                    <tr><td colSpan={8} className="text-center py-10"><Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500"/></td></tr>
                ) : filteredData.length > 0 ? filteredData.map((item) => (
                  <tr key={item.id} className={`${themeClasses.hover}`}>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.text}`}>{new Date(item.date).toLocaleDateString()}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.textSecondary}`}>{item.type}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.textSecondary}`}>{item.duration}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.text}`}>{item.days}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium ${themeClasses.text}`}>{item.employeeName}</td>
                    <td className={`px-6 py-5 text-sm ${themeClasses.textSecondary} max-w-xs truncate`} title={item.reason}>{item.reason}</td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className={getStatusBadge(item.status)}>
                        {getStatusIcon(item.status)}
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      {isHR && (
                        <div className="flex items-center gap-3">
                          {item.status === 'pending' && (
                            <>
                              <button onClick={() => updateLeaveStatus(item.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700 font-semibold">Approve</button>
                              <button onClick={() => updateLeaveStatus(item.id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700 font-semibold">Reject</button>
                            </>
                          )}
                          <button onClick={() => handleEdit(item)} className={`p-2 ${themeClasses.textSecondary} hover:text-blue-500`} title="Edit Reason"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => setRecordToDelete(item)} className={`p-2 ${themeClasses.textSecondary} hover:text-red-500`} title="Delete Record"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                )) : (
                    <tr><td colSpan={8} className={`text-center py-10 ${themeClasses.textSecondary}`}>No leave records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${themeClasses.cardBg} p-8 rounded-lg shadow-xl w-full max-w-md`}>
            <h2 className={`text-xl font-semibold mb-6 ${themeClasses.text}`}>Edit Leave Record</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${themeClasses.textSecondary}`}>Reason</label>
                <textarea
                  rows={4}
                  value={editingRecord.reason}
                  onChange={(e) => setEditingRecord(prev => prev ? { ...prev, reason: e.target.value } : null)}
                  className={`w-full p-2.5 border rounded-md ${themeClasses.input}`}
                />
              </div>
              <div className="flex justify-end gap-4 mt-8">
                <button type="button" onClick={() => setEditingRecord(null)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className={`${themeClasses.cardBg} p-8 rounded-lg shadow-xl w-full max-w-sm text-center`}>
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h3 className={`text-lg font-semibold mt-4 ${themeClasses.text}`}>Delete Leave Record</h3>
            <p className={`mt-2 text-sm ${themeClasses.textSecondary}`}>Are you sure you want to delete this record? This action cannot be undone.</p>
            <div className="flex justify-center gap-4 mt-8">
              <button type="button" onClick={() => setRecordToDelete(null)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">Cancel</button>
              <button type="button" onClick={confirmDelete} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveManagementPage;