'use client'

import React, { useState, useEffect } from 'react'
import {
  Search,
  Bell,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react'
import Image from 'next/image'


type User = {
  fullName: string
  role: string
  profileImage?: string
}

type LeaveRecord = {
  id: string;
  date: string;
  type: string;
  duration: string;
  days: number;
  employee: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
};



const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = () => {
     
      const loggedInUser: User = { fullName: 'Hr', role: 'HR Manager' };
      
      setUser(loggedInUser);
      setLoading(false);
    };

    const timer = setTimeout(fetchUser, 1000);
    return () => clearTimeout(timer);
  }, []);

  return { user, loading };
};


const useLeave = () => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([
    { id: '1', date: '2025-07-28', type: 'Annual Leave', duration: 'Full Day', days: 1, employee: 'Jane Smith', reason: 'Vacation', status: 'pending' },
    { id: '2', date: '2025-07-29', type: 'Sick Leave', duration: 'Full Day', days: 1, employee: 'Mark Johnson', reason: 'Flu', status: 'approved' },
    { id: '3', date: '2025-08-01', type: 'Personal Leave', duration: 'Half Day', days: 0.5, employee: 'Lucy Chen', reason: 'Appointment', status: 'rejected' },
    { id: '4', date: '2025-08-05', type: 'Annual Leave', duration: 'Full Day', days: 1, employee: 'Robert Brown', reason: 'Family event', status: 'approved' },
  ]);

  const updateLeaveStatus = (id: string, status: 'approved' | 'rejected') => {
    setLeaveRecords(records => records.map(r => r.id === id ? { ...r, status } : r));
  };

  const deleteLeaveRecord = (id: string) => {
    setLeaveRecords(records => records.filter(r => r.id !== id));
  };

  const updateLeaveRecord = (updatedRecord: LeaveRecord) => {
    setLeaveRecords(records => records.map(r => r.id === updatedRecord.id ? updatedRecord : r));
  };

  return { leaveRecords, updateLeaveStatus, deleteLeaveRecord, updateLeaveRecord };
};


const EmployeeAvatar = ({ src, name }: { src: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(src)
  useEffect(() => { setImgSrc(src) }, [src]);
  return (
    <Image
      src={imgSrc}
      alt={name}
      width={40}
      height={40}
      className="rounded-full w-10 h-10 object-cover"
      onError={() => {
        setImgSrc(`https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=40`)
      }}
    />
  )
}

const LeaveManagementPage = () => {
  const { user, loading } = useAuth()
  const { leaveRecords, updateLeaveStatus, deleteLeaveRecord, updateLeaveRecord } = useLeave()
  const [searchQuery, setSearchQuery] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false)
  
  const [editingRecord, setEditingRecord] = useState<LeaveRecord | null>(null)
  const [recordToDelete, setRecordToDelete] = useState<LeaveRecord | null>(null)

  const userAvatarUrl = user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6b7280&color=fff&size=40`;

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
    setIsDarkMode(document.documentElement.classList.contains('dark'))
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

  const isHR = user?.role === 'HR Manager'

  return (
    <div className={`${themeClasses.bg} min-h-screen`}>
      <header className={`${themeClasses.cardBg} shadow-sm border-b ${themeClasses.border}`}>
      
        <div className="px-6 py-5 lg:px-10">
          <div className="flex items-center justify-between">
            <h1 className={`text-2xl font-semibold ${themeClasses.text}`}>Leaves</h1>
            <div className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className={`absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 ${themeClasses.textMuted}`} />
                <input
                  type="text"
                  placeholder="Search leaves..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full pl-11 pr-4 py-3 border rounded-full text-sm ${themeClasses.input}`}
                />
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button className={`p-2 ${themeClasses.textMuted}`}><Bell className="h-6 w-6" /></button>
              <div className={`flex items-center space-x-3 p-2`}>
                {loading ? (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 animate-pulse" />
                ) : (
                  <EmployeeAvatar src={userAvatarUrl} name={user?.fullName || 'User'} />
                )}
                <div className="flex flex-col">
                  {loading ? (
                     <div className='space-y-2'>
                        <div className="h-4 w-24 rounded bg-gray-300 dark:bg-gray-600 animate-pulse" />
                        <div className="h-3 w-16 rounded bg-gray-300 dark:bg-gray-600 animate-pulse" />
                     </div>
                  ) : (
                    <>
                      <span className={`text-sm font-semibold ${themeClasses.text}`}>{user?.fullName}</span>
                      <span className={`text-xs ${themeClasses.textMuted}`}>{user?.role}</span>
                    </>
                  )}
                </div>
                <ChevronDown className={`h-4 w-4 ${themeClasses.textMuted}`} />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-6 py-8 lg:px-10">
        <div className={`${themeClasses.cardBg} rounded-xl shadow-lg overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className={`min-w-full divide-y ${themeClasses.border}`}>
              <thead className={`${themeClasses.tableBg}`}>
                <tr>
                  {['Date', 'Type', 'Duration', 'Days', 'Employee', 'Reason', 'Status', 'Actions']
                    .map((heading) => (
                      <th key={heading} className={`px-6 py-4 text-left text-xs font-semibold ${themeClasses.textMuted} uppercase tracking-wider`}>{heading}</th>
                    ))}
                </tr>
              </thead>
              <tbody className={`divide-y ${themeClasses.border}`}>
                {filteredData.map((item) => (
                  <tr key={item.id} className={`${themeClasses.hover}`}>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.text}`}>{item.date}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.textSecondary}`}>{item.type}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.textSecondary}`}>{item.duration}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.text}`}>{item.days}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm font-medium ${themeClasses.text}`}>{item.employee}</td>
                    <td className={`px-6 py-5 whitespace-nowrap text-sm ${themeClasses.textSecondary}`}>{item.reason}</td>
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
                              <button onClick={() => updateLeaveStatus(item.id, 'approved')} className="bg-green-600 text-white px-3 py-1 rounded-md text-xs hover:bg-green-700">Approve</button>
                              <button onClick={() => updateLeaveStatus(item.id, 'rejected')} className="bg-red-600 text-white px-3 py-1 rounded-md text-xs hover:bg-red-700">Reject</button>
                            </>
                          )}
                          <button onClick={() => handleEdit(item)} className={`p-2 ${themeClasses.textSecondary} hover:text-blue-500`}>
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setRecordToDelete(item)} className={`p-2 ${themeClasses.textSecondary} hover:text-red-500`}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

    
      {editingRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`${themeClasses.cardBg} p-8 rounded-lg shadow-xl w-full max-w-md`}>
            <h2 className={`text-xl font-semibold mb-6 ${themeClasses.text}`}>Edit Leave Record</h2>
            <form onSubmit={handleUpdate}>
              <div className="mb-4">
                <label className={`block text-sm font-medium mb-2 ${themeClasses.textSecondary}`}>Reason</label>
                <input
                  type="text"
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

     
      {recordToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`${themeClasses.cardBg} p-8 rounded-lg shadow-xl w-full max-w-sm text-center`}>
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" aria-hidden="true" />
            </div>
            <h3 className={`text-lg font-semibold mt-4 ${themeClasses.text}`}>Delete Leave Record</h3>
            <p className={`mt-2 text-sm ${themeClasses.textSecondary}`}>
              Are you sure you want to delete this record? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4 mt-8">
              <button type="button" onClick={() => setRecordToDelete(null)} className="px-4 py-2 rounded-md text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-100 dark:hover:bg-gray-500">
                Cancel
              </button>
              <button type="button" onClick={confirmDelete} className="px-4 py-2 rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveManagementPage;
