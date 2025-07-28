'use client';

import { Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next'; // No changes here

// --- Interfaces ---
interface Employee {
  id: number;
  name: string;
  title: string;
  type: string;
  time: string;
  status: 'On Time' | 'Late';
}

interface AttendanceRecord {
  employeeName: string;
  designation: string;
  workType: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: 'OnTime' | 'Late';
}

interface NewAttendanceRecord {
    employeeName: string;
    designation: string;
    workType: string;
    date: string;
    checkIn: string;
    checkOut: string;
    status: 'OnTime' | 'Late';
}

// --- API Configuration ---
const API_BASE_URL = 'https://hr-management-system-pmfp.onrender.com/api/attendance';
const AUTH_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiSFIiLCJzdWIiOiJocm1zLmhyQGdtYWlsLmNvbSIsImlhdCI6MTc1MzE4ODkxNywiZXhwIjoxNzU2MjEyOTE3fQ.7yScLczcXGmzUeR8wRLd8gyZylZuiiNGIcniPvOKO0g';

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export default function AttendancePage() {
  // CORRECTED: 'i18n' has been removed as it is no longer used in this component.
  const { t } = useTranslation();

  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [editEmployeeId, setEditEmployeeId] = useState<number | null>(null);
  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    type: '',
    time: '',
    status: 'On Time' as 'On Time' | 'Late',
  });

  const fetchAttendanceData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_BASE_URL, {
        headers: { 'accept': '*/*', 'Authorization': `Bearer ${AUTH_TOKEN}` },
      });
      if (!response.ok) throw new Error(`API Error: ${response.status} ${response.statusText}`);

      const apiData: AttendanceRecord[] = await response.json();
      const transformedApiData: Employee[] = apiData.map((record, index) => ({
        id: index + 1,
        name: record.employeeName,
        title: record.designation,
        type: record.workType,
        time: new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: record.status === 'OnTime' ? 'On Time' : 'Late',
      }));

      const localRecordsRaw = localStorage.getItem('newAttendanceRecords');
      let combinedData = [...transformedApiData];
      if (localRecordsRaw) {
        const localRecords: NewAttendanceRecord[] = JSON.parse(localRecordsRaw);
        const transformedLocalData: Employee[] = localRecords.map((record, index) => ({
          id: transformedApiData.length + index + 1,
          name: record.employeeName,
          title: record.designation,
          type: record.workType,
          time: new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: record.status === 'OnTime' ? 'On Time' : 'Late',
        }));
        combinedData = [...transformedLocalData.reverse(), ...transformedApiData];
      }
      setEmployeeList(combinedData);
    } catch (err) {
      const fetchError = err as Error;
      setError(fetchError.message);
      console.error("Failed to fetch attendance data:", fetchError);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const filtered = employeeList.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEmployees = filtered.slice(startIndex, startIndex + itemsPerPage);

  const statusMap: Record<string, string> = { 'On Time': 'onTime', 'Late': 'late' };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddOrUpdate = () => {
    if (editEmployeeId) {
      setEmployeeList((prev) =>
        prev.map((emp) =>
          emp.id === editEmployeeId ? { ...emp, ...formData, id: editEmployeeId } : emp
        )
      );
    } else {
        const newRecord: Employee = { ...formData, id: Date.now() }; 
        setEmployeeList((prev) => [newRecord, ...prev]);
    }
    setFormData({ name: '', title: '', type: '', time: '', status: 'On Time' });
    setEditEmployeeId(null);
    setShowModal(false);
  };

  const handleEdit = (employee: Employee) => {
    setFormData({
      name: employee.name,
      title: employee.title,
      type: employee.type,
      time: employee.time,
      status: employee.status,
    });
    setEditEmployeeId(employee.id);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setEmployeeList((prev) => prev.filter((emp) => emp.id !== id));
  };

  if (loading) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  if (error) {
    return <div className="flex h-full items-center justify-center text-red-500">Error: {error}</div>;
  }

  return (
    <div>
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-sm">
        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('search.placeholder') || 'Search by name or title...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm w-full bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={() => {
              setEditEmployeeId(null);
              setFormData({ name: '', title: '', type: '', time: '', status: 'On Time' });
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            {t('attendance.add', 'Add Attendance')}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b dark:border-gray-600">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('attendanceTable.name')}</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('attendanceTable.designation')}</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('attendanceTable.type')}</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('attendanceTable.checkIn')}</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('attendanceTable.status')}</th>
                <th className="px-4 sm:px-6 py-3 text-left font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center font-semibold text-gray-700 dark:text-white text-xs">
                                {getInitials(emp.name)}
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{emp.name}</span>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{emp.title}</td>
                      <td className="px-4 sm:px-6 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{emp.type}</td>
                      <td className="px-4 sm:px-6 py-3 text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{emp.time}</td>
                      <td className="px-4 sm:px-6 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${emp.status === 'On Time' ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'}`}>
                            {t(`attendanceTable.${statusMap[emp.status]}`) || emp.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 flex gap-2 whitespace-nowrap">
                        <button onClick={() => handleEdit(emp)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Edit"><Edit2 className="h-4 w-4 text-gray-500 dark:text-gray-300" /></button>
                        <button onClick={() => handleDelete(emp.id)} className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600" aria-label="Delete"><Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-300" /></button>
                      </td>
                    </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 sm:px-6 py-4 text-center text-gray-500 dark:text-gray-400">{t('attendanceTable.noRecords', 'No attendance records found.')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 py-4 text-sm text-gray-500 dark:text-gray-400 gap-4 sm:gap-0">
          <div className="flex items-center gap-2">
            <span>{t('pagination.showing', 'Showing')}</span>
            <select
              className="border rounded px-2 py-1 text-sm dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
              onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
              value={itemsPerPage}
            >
              <option value="10">10</option><option value="20">20</option><option value="50">50</option>
            </select>
          </div>
          <p>
            {t('pagination.results', { start: filtered.length > 0 ? startIndex + 1 : 0, end: Math.min(startIndex + itemsPerPage, filtered.length), total: filtered.length })}
          </p>
          <div className="flex items-center gap-1 flex-wrap">
            <button className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}>{'<'}</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i} className={`px-3 py-1 rounded-md text-sm ${currentPage === i + 1 ? 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300' : 'hover:bg-gray-100 dark:hover:bg-gray-700'}`} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
            ))}
            <button className="px-2 py-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>{'>'}</button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md mx-auto shadow-lg">
            <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">{editEmployeeId ? 'Edit Attendance' : 'Add Attendance'}</h2>
            <div className="space-y-3">
              <input name="name" placeholder="Employee Name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500" />
              <input name="title" placeholder="Designation" value={formData.title} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500" />
              <input name="type" placeholder="Work Type" value={formData.type} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500" />
              <input type="time" name="time" placeholder="Check In Time" value={formData.time} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500" />
              <select name="status" value={formData.status} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-purple-500">
                <option value="On Time">On Time</option><option value="Late">Late</option>
              </select>
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-sm rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
              <button onClick={handleAddOrUpdate} className="px-4 py-2 bg-purple-600 text-white text-sm rounded-md hover:bg-purple-700">{editEmployeeId ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}