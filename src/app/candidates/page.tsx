'use client';

import { useState } from 'react';
import { Search, Bell, ChevronDown } from 'lucide-react';
import Image from 'next/image';

const candidates = [
  {
    name: 'Leasie Watson',
    title: 'UI/UX Designer',
    date: 'July 14, 2023',
    email: 'leasie.w@demo.com',
    phone: '(629) 555-0129',
    status: 'Selected',
  },
  {
    name: 'Floyd Miles',
    title: 'Sales Manager',
    date: 'July 14, 2023',
    email: 'floyd.m@demo.com',
    phone: '(217) 555-0113',
    status: 'In Process',
  },
  {
    name: 'Theresa Webb',
    title: 'Sr. UX Designer',
    date: 'July 14, 2023',
    email: 'theresa.w@demo.com',
    phone: '(219) 555-0114',
    status: 'In Process',
  },
  {
    name: 'Darlene Robertson',
    title: 'Sr. Python Developer',
    date: 'July 14, 2023',
    email: 'darlene.r@demo.com',
    phone: '(505) 555-0125',
    status: 'In Process',
  },
  {
    name: 'Esther Howard',
    title: 'BDE',
    date: 'July 14, 2023',
    email: 'esther.h@demo.com',
    phone: '(405) 555-0128',
    status: 'Rejected',
  },
  {
    name: 'Darrell Steward',
    title: 'HR Executive',
    date: 'July 14, 2023',
    email: 'darrell.s@demo.com',
    phone: '(603) 555-0123',
    status: 'Rejected',
  },
  {
    name: 'Ronald Richards',
    title: 'Project Manager',
    date: 'July 14, 2023',
    email: 'ronald.r@demo.com',
    phone: '(480) 555-0103',
    status: 'Selected',
  },
  {
    name: 'Jacob Jones',
    title: 'Business Analyst',
    date: 'July 14, 2023',
    email: 'jacob.j@demo.com',
    phone: '(208) 555-0112',
    status: 'Selected',
  },
  {
    name: 'Cameron Williamson',
    title: 'Sr. UI/UX Lead',
    date: 'July 14, 2023',
    email: 'cameron.w@demo.com',
    phone: '(671) 555-0110',
    status: 'In Process',
  },
  {
    name: 'Bessie Cooper',
    title: 'BDM',
    date: 'July 14, 2023',
    email: 'bessie.c@demo.com',
    phone: '(225) 555-0118',
    status: 'Rejected',
  },
];

export default function CandidateList() {
  const [search, setSearch] = useState('');

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300';
      case 'In Process':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300';
      case 'Rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 p-6 text-gray-900 dark:text-white">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-semibold">Candidates</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Show All Candidates</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
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

      <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" className="h-4 w-4" />
              </th>
              <th className="px-4 py-3 text-left">Candidate Name</th>
              <th className="px-4 py-3 text-left">Applied For</th>
              <th className="px-4 py-3 text-left">Applied Date</th>
              <th className="px-4 py-3 text-left">Email Address</th>
              <th className="px-4 py-3 text-left">Mobile Number</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {filteredCandidates.map((c, idx) => (
              <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="px-4 py-3">
                  <input type="checkbox" className="h-4 w-4" />
                </td>
                <td className="px-4 py-3 flex items-center space-x-3">
                  <Image
                    src="/avatars/placeholder.png"
                    alt={c.name}
                    width={36}
                    height={36}
                    className="rounded-full"
                  />
                  <span>{c.name}</span>
                </td>
                <td className="px-4 py-3">{c.title}</td>
                <td className="px-4 py-3">{c.date}</td>
                <td className="px-4 py-3">{c.email}</td>
                <td className="px-4 py-3">{c.phone}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full font-medium ${statusColor(c.status)}`}>
                    {c.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-2">
          <span>Showing</span>
          <select className="border border-gray-300 dark:border-gray-700 rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white">
            <option>10</option>
            <option>20</option>
          </select>
          <span>Showing 1 to 10 out of 60 records</span>
        </div>
        <div className="flex items-center space-x-1">
          <button className="px-2 py-1 border rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">{'<'}</button>
          <button className="px-3 py-1 border rounded bg-purple-600 text-white">1</button>
          <button className="px-2 py-1 border rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">2</button>
          <button className="px-2 py-1 border rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">3</button>
          <button className="px-2 py-1 border rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">4</button>
          <button className="px-2 py-1 border rounded hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800">{'>'}</button>
        </div>
      </div>
    </div>
  );
}
