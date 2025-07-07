'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';

interface Employee {
  name: string;
  title: string;
  type: string;
  time: string;
  status: 'On Time' | 'Late';
}

const employees: Employee[] = [
  { name: 'Leasie Watson', title: 'Team Lead - Design', type: 'Office', time: '09:27 AM', status: 'On Time' },
  { name: 'Darlene Robertson', title: 'Web Designer', type: 'Office', time: '09:15 AM', status: 'Late' },
  { name: 'Jacob Jones', title: 'Medical Assistant', type: 'Remote', time: '09:24 AM', status: 'Late' },
  { name: 'Kathryn Murphy', title: 'Marketing Coordinator', type: 'Office', time: '09:10 AM', status: 'On Time' },
  { name: 'Leslie Alexander', title: 'Data Analyst', type: 'Office', time: '09:15 AM', status: 'On Time' },
  { name: 'Ronald Richards', title: 'Phyton Developer', type: 'Remote', time: '09:29 AM', status: 'On Time' },
  { name: 'Guy Hawkins', title: 'UI/UX Design', type: 'Remote', time: '09:29 AM', status: 'On Time' },
  { name: 'Albert Flores', title: 'React JS', type: 'Remote', time: '09:29 AM', status: 'On Time' },
  { name: 'Savannah Nguyen', title: 'IOS Developer', type: 'Remote', time: '10:50 AM', status: 'Late' },
  { name: 'Jenny Wilson', title: 'React JS Developer', type: 'Remote', time: '11:30 AM', status: 'Late' },
];

const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();

export default function AttendancePage() {
  const [search, setSearch] = useState('');

  const filtered = employees.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen text-gray-900 px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold">Attendance</h1>
          <p className="text-sm text-gray-500">All Employee Attendance</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-md text-sm w-72 bg-gray-50"
            />
          </div>

          <button className="p-2 rounded-full border border-gray-200">
            <Bell className="h-5 w-5 text-gray-500" />
          </button>

          <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
              RA
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium">Robert Allen</p>
              <p className="text-xs text-gray-500">HR Manager</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-lg shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute top-2.5 left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm w-full"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Employee Name</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Designation</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Check In Time</th>
                <th className="px-6 py-3 text-left font-medium text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((emp, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-semibold text-gray-700">
                      {getInitials(emp.name)}
                    </div>
                    {emp.name}
                  </td>
                  <td className="px-6 py-3">{emp.title}</td>
                  <td className="px-6 py-3">{emp.type}</td>
                  <td className="px-6 py-3">{emp.time}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                        emp.status === 'On Time'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-500'
                      }`}
                    >
                      {emp.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center px-6 py-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <select className="border rounded px-2 py-1 text-sm">
              <option>10</option>
              <option>20</option>
              <option>50</option>
            </select>
          </div>
          <p>Showing 1 to 10 out of 60 records</p>
          <div className="flex items-center gap-1">
            <button className="px-2 py-1 rounded hover:bg-gray-100">&lt;</button>
            <button className="px-2 py-1 rounded bg-purple-100 text-purple-600">1</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100">2</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100">3</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100">4</button>
            <button className="px-2 py-1 rounded hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
