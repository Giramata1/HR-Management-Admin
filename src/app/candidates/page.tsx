
'use client'

import { useState } from 'react'
import { Search, Bell, ChevronDown } from 'lucide-react'
import Image from 'next/image'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/components/AuthContext'

const candidates = [
  { name: 'Leasie Watson', title: 'UI/UX Designer', date: 'July 14, 2023', email: 'leasie.w@demo.com', phone: '(629) 555-0129', status: 'Selected' },
  { name: 'Floyd Miles', title: 'Sales Manager', date: 'July 14, 2023', email: 'floyd.m@demo.com', phone: '(217) 555-0113', status: 'In Process' },
  { name: 'Theresa Webb', title: 'Sr. UX Designer', date: 'July 14, 2023', email: 'theresa.w@demo.com', phone: '(219) 555-0114', status: 'In Process' },
  { name: 'Darlene Robertson', title: 'Sr. Python Developer', date: 'July 14, 2023', email: 'darlene.r@demo.com', phone: '(505) 555-0125', status: 'In Process' },
  { name: 'Esther Howard', title: 'BDE', date: 'July 14, 2023', email: 'esther.h@demo.com', phone: '(405) 555-0128', status: 'Rejected' },
  { name: 'Darrell Steward', title: 'HR Executive', date: 'July 14, 2023', email: 'darrell.s@demo.com', phone: '(603) 555-0123', status: 'Rejected' },
  { name: 'Ronald Richards', title: 'Project Manager', date: 'July 14, 2023', email: 'ronald.r@demo.com', phone: '(480) 555-0103', status: 'Selected' },
  { name: 'Jacob Jones', title: 'Business Analyst', date: 'July 14, 2023', email: 'jacob.j@demo.com', phone: '(208) 555-0112', status: 'Selected' },
  { name: 'Cameron Williamson', title: 'Sr. UI/UX Lead', date: 'July 14, 2023', email: 'cameron.w@demo.com', phone: '(671) 555-0110', status: 'In Process' },
  { name: 'Bessie Cooper', title: 'BDM', date: 'July 14, 2023', email: 'bessie.c@demo.com', phone: '(225) 555-0118', status: 'Rejected' },
]

// Component for rendering avatars with fallback
const EmployeeAvatar = ({ src, name, size }: { src: string; name: string; size: number }) => {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
      src={imgSrc}
      alt={name}
      width={size}
      height={size}
      className={`rounded-full ${size === 36 ? 'w-8 h-8 sm:w-9 sm:h-9' : 'w-8 h-8 sm:w-10 sm:h-10'} object-cover`}
      onError={() =>
        setImgSrc(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=${size}`
        )
      }
    />
  )
}

export default function CandidateList() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredCandidates = candidates.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage)

  const statusColor = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'text-green-600 bg-green-100 dark:bg-green-800 dark:text-green-300'
      case 'In Process':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-800 dark:text-yellow-300'
      case 'Rejected':
        return 'text-red-600 bg-red-100 dark:bg-red-800 dark:text-red-300'
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  // Format job title key for i18n lookup
  const getJobTranslationKey = (title: string) =>
    title.toLowerCase().replace(/[^\w]/g, '')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4 sm:gap-0">
        <div>
          <h1 className="text-lg sm:text-xl font-semibold">{t('candidates.title', { defaultValue: 'Candidates' })}</h1>
          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{t('candidates.subtitle', { defaultValue: 'List of all candidates' })}</p>
        </div>

        <div className="flex items-center space-x-3 sm:space-x-4">
          <div className="relative w-full sm:w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('search.placeholder', { defaultValue: 'Search' })}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-full"
            />
          </div>

          <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200" aria-label={t('notifications.title')}>
            <Bell className="h-4 sm:h-5 w-4 sm:w-5" />
          </button>

          <div className="flex items-center space-x-2 sm:space-x-3 border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 rounded-md bg-white dark:bg-gray-800">
            <EmployeeAvatar
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6b7280&color=fff&size=40`}
              name={user?.fullName || 'User'}
              size={40}
            />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || t('candidates.hrManager', { defaultValue: 'HR Manager' })}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg border-gray-200 dark:border-gray-700">
        <table className="min-w-[640px] w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-300">
            <tr>
              <th className="px-4 sm:px-6 py-3"><input type="checkbox" /></th>
              <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.name')}</th>
              <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.appliedFor')}</th>
              <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.appliedDate')}</th>
              <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.email')}</th>
              <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.phone')}</th>
              <th className="px-4 sm:px-6 py-3 text-left">{t('candidates.table.status')}</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
            {paginatedCandidates.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-4">{t('candidates.table.noRecords')}</td>
              </tr>
            ) : (
              paginatedCandidates.map((c, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-4 sm:px-6 py-3"><input type="checkbox" /></td>
                  <td className="px-4 sm:px-6 py-3 flex items-center space-x-3">
                    <EmployeeAvatar
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.name)}&background=6b7280&color=fff&size=36`}
                      name={c.name}
                      size={36}
                    />
                    <span>{c.name}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    {t(`jobs.${getJobTranslationKey(c.title)}`, { defaultValue: c.title })}
                  </td>
                  <td className="px-4 sm:px-6 py-3">{c.date}</td>
                  <td className="px-4 sm:px-6 py-3">{c.email}</td>
                  <td className="px-4 sm:px-6 py-3">{c.phone}</td>
                  <td className="px-4 sm:px-6 py-3">
                    <span className={`px-2 py-1 rounded-full font-medium text-xs sm:text-sm ${statusColor(c.status)}`}>
                      {t(`status.${c.status.replace(' ', '').toLowerCase()}`, { defaultValue: c.status })}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 text-sm">
        <div className="flex items-center space-x-2">
          <span>{t('candidates.pagination.showing')}</span>
          <select
            onChange={(e) => { setItemsPerPage(parseInt(e.target.value)); setCurrentPage(1); }}
            className="border rounded px-2 py-1 bg-white dark:bg-gray-800 dark:text-white"
          >
            <option value="10">10</option>
            <option value="20">20</option>
          </select>
          <span>
            {t('candidates.pagination.recordsInfo', {
              start: startIndex + 1,
              end: Math.min(startIndex + itemsPerPage, filteredCandidates.length),
              total: filteredCandidates.length,
            })}
          </span>
        </div>
        <div className="flex items-center space-x-1 flex-wrap">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}>{'<'}</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}>{'>'}</button>
        </div>
      </div>
    </div>
  )
}
