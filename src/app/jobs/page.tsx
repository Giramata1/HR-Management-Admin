'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, MapPin, Plus, Briefcase, X, Bell, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/components/AuthContext'
import Image from 'next/image'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const EmployeeAvatar = ({ src, name }: { src: string; name: string }) => {
  const [imgSrc, setImgSrc] = useState(src)
  return (
    <Image
      src={imgSrc}
      alt={name}
      width={40}
      height={40}
      className="rounded-full w-8 h-8 sm:w-10 sm:h-10 object-cover"
      onError={() =>
        setImgSrc(
          `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6b7280&color=fff&size=40`
        )
      }
    />
  )
}

// Interface for API job data
interface ApiJob {
  id: number
  jobTitle: string
  jobDescription: string
  departmentName: string
  location: string
  salary: number
  jobType: string
  status: string
  createdAt: string
  updatedAt: string | null
}

// Interface for UI job data
interface Job {
  id: number
  title: string
  company: string
  location: string
  salary: string
  period: string
  tags: string[]
  status: string
}

// Interface for API error response
interface ApiErrorResponse {
  message?: string;
  [key: string]: unknown;
}

// --- Fake API Simulation (In-memory + localStorage persistence) ---
const LOCAL_STORAGE_KEY = 'hr_board_fake_jobs';

const getInitialFakeJobs = (): ApiJob[] => {
  if (typeof window !== 'undefined') {
    const storedJobs = localStorage.getItem(LOCAL_STORAGE_KEY);
    return storedJobs ? JSON.parse(storedJobs) : [];
  }
  return [];
};

let fakeJobs: ApiJob[] = getInitialFakeJobs();
let nextFakeJobId = fakeJobs.length > 0 ? Math.max(...fakeJobs.map(job => job.id)) + 1 : 100;

const saveFakeJobs = (jobsToSave: ApiJob[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobsToSave));
  }
};

const fakeAddJobApi = async (newJobData: Omit<ApiJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiJob> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const createdJob: ApiJob = {
        ...newJobData,
        id: nextFakeJobId++,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      fakeJobs.push(createdJob);
      saveFakeJobs(fakeJobs);
      resolve(createdJob);
    }, 500);
  });
};

const fakeDeleteJobApi = async (jobId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const initialLength = fakeJobs.length;
            fakeJobs = fakeJobs.filter(job => job.id !== jobId);
            if (fakeJobs.length < initialLength) {
                saveFakeJobs(fakeJobs);
                resolve();
            } else {
                reject(new Error("Fake API: Job not found for deletion."));
            }
        }, 300);
    });
};
// --- End Fake API Simulation ---

const JobBoard = () => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddJobModal, setShowAddJobModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary: '',
    workType: 'Office',
    jobType: 'Full Time',
    status: 'Active',
  })

  const token = 'eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9IUiIsInN1YiI6ImhybXMuaHJAZ21haWwuY29tIiwiaWF0IjoxNzUzMDMwNzU2LCJleHAiOjE3NTMxMTcxNTZ9.z7ISEpqunWgXMuFY20x8I-QckJ0FuRdfpzJFym-JWi0'
  const API_BASE_URL = 'https://hr-management-system-pmfp.onrender.com/api/jobs'

  const departments = [
    t('departments.design', { defaultValue: 'Design' }),
    t('departments.developer', { defaultValue: 'Developer' }),
    t('departments.sales', { defaultValue: 'Sales' }),
    t('departments.hr', { defaultValue: 'HR' }),
    t('departments.marketing', { defaultValue: 'Marketing' }),
    t('departments.finance', { defaultValue: 'Finance' }),
  ]
  const locations = ['California, USA', 'New York, USA', 'Texas, USA', 'Florida, USA']

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    let fetchedRealJobs: ApiJob[] = []
    let fetchError: string | null = null;

    try {
      const response = await axios.get<ApiJob[]>(API_BASE_URL, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*',
        },
      })
      fetchedRealJobs = response.data;
    } catch (err: unknown) {
      // *** FIX #1: TYPE-SAFE ERROR HANDLING ***
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        console.error('Error fetching jobs:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        })
        fetchError = err.response?.data?.message || t('jobBoard.fetchError', { defaultValue: 'Failed to load jobs' });
      } else if (err instanceof Error) {
        fetchError = err.message;
      } else {
        fetchError = t('jobBoard.fetchError', { defaultValue: 'An unknown error occurred' });
      }
    } finally {
        const combinedApiJobs = [...fetchedRealJobs, ...getInitialFakeJobs()];
        const transformedJobs: Job[] = combinedApiJobs.map((job) => ({
            id: job.id,
            title: job.jobTitle,
            company: job.departmentName,
            location: job.location,
            salary: `$${job.salary.toString()}`,
            period: t('period.month', { defaultValue: 'Month' }),
            tags: [
                job.departmentName,
                job.jobType,
                job.jobType.toLowerCase() === 'remote' ? t('workTypes.remote', { defaultValue: 'Remote' }) : '',
            ].filter(Boolean),
            status: job.status,
        }));
        setJobs(transformedJobs);
        setError(fetchError);
        setLoading(false);
    }
  }, [t, token])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const filterJobs = (status: string) => {
    if (!searchTerm) return jobs.filter((job) => job.status === status)
    return jobs.filter(
      (job) =>
        job.status === status &&
        (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())))
    )
  }

  const JobCard = ({ job, onDeleteRequest }: { job: Job; onDeleteRequest: (job: Job) => void }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow relative">
      <button
        onClick={() => onDeleteRequest(job)}
        className="absolute top-2 right-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
        aria-label={t('jobBoard.delete', { defaultValue: 'Delete Job' })}
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-5 sm:w-6 h-5 sm:h-6 text-gray-600 dark:text-gray-300" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg mb-1">{job.title}</h3>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">{job.company}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, idx) => (
          <span key={idx} className="bg-purple-600 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center text-gray-500 dark:text-gray-400 text-xs sm:text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          {job.location}
        </div>
        <div className="text-right">
          <span className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">{job.salary}</span>
          <span className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm">/{job.period}</span>
        </div>
      </div>
    </div>
  )

  const JobColumn = ({ title, status, dotColor }: { title: string; status: string; dotColor: string }) => (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
          <h2 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">{title}</h2>
        </div>
        <div>
          {loading ? (
            <p className="text-center text-gray-500 dark:text-gray-400">{t('jobBoard.loading', { defaultValue: 'Loading jobs...' })}</p>
          ) : error ? (
            <p className="text-center text-red-500 dark:text-red-400">{error}</p>
          ) : filterJobs(status).length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">{t('jobBoard.noJobs', { defaultValue: 'No jobs found' })}</p>
          ) : (
            filterJobs(status).map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onDeleteRequest={(jobToDelete) => {
                  setJobToDelete(jobToDelete)
                  setShowDeleteConfirmModal(true)
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )

  const handleAddJob = async () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.salary) {
      toast.error(t('jobBoard.validationError', { defaultValue: 'Please fill in all required fields' }))
      return
    }
    try {
      const salaryNumber = parseFloat(newJob.salary.replace('$', '').replace(',', '')) || 0
      if (isNaN(salaryNumber) || salaryNumber <= 0) {
        toast.error(t('jobBoard.invalidSalary', { defaultValue: 'Please enter a valid salary' }))
        return
      }
      const payload = {
        jobTitle: newJob.title,
        jobDescription: newJob.description || 'No description provided',
        departmentName: newJob.company,
        location: newJob.location,
        salary: salaryNumber,
        jobType: newJob.workType,
        status: newJob.status,
      }
      const job: ApiJob = await fakeAddJobApi(payload);
      const jobToAdd: Job = {
        id: job.id,
        title: job.jobTitle,
        company: job.departmentName,
        location: job.location,
        salary: `$${job.salary.toString()}`,
        period: t('period.month', { defaultValue: 'Month' }),
        tags: [
          job.departmentName,
          job.jobType,
          job.jobType.toLowerCase() === 'remote' ? t('workTypes.remote', { defaultValue: 'Remote' }) : '',
        ].filter(Boolean),
        status: job.status,
      }
      setJobs((prev) => [...prev, jobToAdd])
      setShowAddJobModal(false)
      setNewJob({
        title: '',
        description: '',
        company: '',
        location: '',
        salary: '',
        workType: 'Office',
        jobType: 'Full Time',
        status: 'Active',
      })
      toast.success(t('jobBoard.addSuccess', { defaultValue: 'Job added successfully!' }))
    } catch (err: unknown) {
      // *** FIX #2: TYPE-SAFE ERROR HANDLING ***
      let errorMessage = t('jobBoard.addError', { defaultValue: 'Failed to add job.' })
      if (err instanceof Error) {
        errorMessage = err.message
      }
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  const handleDeleteJob = async () => {
    if (!jobToDelete) return

    const isFakeJob = jobToDelete.id >= 100;
    try {
      if (isFakeJob) {
        await fakeDeleteJobApi(jobToDelete.id);
      } else {
        await axios.delete(`${API_BASE_URL}/${jobToDelete.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': '*/*',
          },
        })
      }
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id))
      toast.success(t('jobBoard.deleteSuccess', { defaultValue: 'Job deleted successfully!' }))
      setJobToDelete(null)
      setShowDeleteConfirmModal(false)
    } catch (err: unknown) {
      // *** FIX #3: TYPE-SAFE ERROR HANDLING ***
      let errorMessage = t('jobBoard.deleteError', { defaultValue: 'Failed to delete job.' });
      if (axios.isAxiosError<ApiErrorResponse>(err)) {
        errorMessage = err.response?.data?.message ?? err.message ?? errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      toast.error(errorMessage);
      setJobToDelete(null);
      setShowDeleteConfirmModal(false);
    }
  }

  const handleCancelAddJob = () => {
    setShowAddJobModal(false)
    setNewJob({
      title: '',
      description: '',
      company: '',
      location: '',
      salary: '',
      workType: 'Office',
      jobType: 'Full Time',
      status: 'Active',
    })
  }

  const handleCancelDelete = () => {
    setJobToDelete(null)
    setShowDeleteConfirmModal(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      
      {/* Top Navigation */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-full sm:max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-lg sm:text-2xl font-bold">{t('jobBoard.title', { defaultValue: 'Jobs' })}</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">{t('jobBoard.subtitle', { defaultValue: 'Show All Jobs' })}</p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative w-full sm:w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 sm:w-5 h-4 sm:h-5" />
              <input
                type="text"
                placeholder={t('search.placeholder', { defaultValue: 'Search' })}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t('notifications', { defaultValue: 'Notifications' })}
            >
              <Bell className="w-4 sm:w-6 h-4 sm:h-6" />
            </button>

            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 sm:px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <EmployeeAvatar
                src={user?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=6b7280&color=fff&size=40`}
                name={user?.fullName || 'User'}
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.fullName || 'User'}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role || t('role.hrManager', { defaultValue: 'HR Manager' })}</p>
              </div>
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-full sm:max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div className="relative w-full sm:w-48 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder={t('search.placeholder', { defaultValue: 'Search' })}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddJobModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('jobBoard.addNewJob', { defaultValue: 'Add New Job' })}</span>
          </button>
        </div>
      </div>

      {/* Job columns */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <JobColumn
          title={t('jobBoard.activeJobs', { defaultValue: 'Active Jobs' })}
          status="Active"
          dotColor="bg-yellow-500"
        />
        <div className="w-full md:w-px h-px md:h-auto bg-gray-200 dark:bg-gray-700"></div>
        <JobColumn
          title={t('jobBoard.inactiveJobs', { defaultValue: 'Inactive Jobs' })}
          status="Inactive"
          dotColor="bg-red-500"
        />
        <div className="w-full md:w-px h-px md:h-auto bg-gray-200 dark:bg-gray-700"></div>
        <JobColumn
          title={t('jobBoard.completedJobs', { defaultValue: 'Completed Jobs' })}
          status="Completed"
          dotColor="bg-green-500"
        />
      </div>

      {/* Add New Job Modal */}
      {showAddJobModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 dark:bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{t('jobBoard.addNewJob', { defaultValue: 'Add New Job' })}</h2>
              <button
                onClick={handleCancelAddJob}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={t('jobBoard.close', { defaultValue: 'Close' })}
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Department */}
              <div>
                <label htmlFor="department-select" className="block text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{t('jobBoard.department', { defaultValue: 'Select Department' })}</label>
                <select
                  id="department-select"
                  value={newJob.company}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewJob({ ...newJob, company: e.target.value })}
                  className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="">{t('jobBoard.selectDepartment', { defaultValue: 'Select Department' })}</option>
                  {departments.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Job title */}
              <div>
                <label htmlFor="job-title-input" className="sr-only">{t('jobBoard.jobTitlePlaceholder', { defaultValue: 'Enter Job Title' })}</label>
                <input
                  id="job-title-input"
                  type="text"
                  placeholder={t('jobBoard.jobTitlePlaceholder', { defaultValue: 'Enter Job Title' })}
                  value={newJob.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, title: e.target.value })}
                  className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              {/* Job Description */}
              <div>
                <label htmlFor="job-description-textarea" className="sr-only">{t('jobBoard.descriptionPlaceholder', { defaultValue: 'Enter Job Description' })}</label>
                <textarea
                  id="job-description-textarea"
                  placeholder={t('jobBoard.descriptionPlaceholder', { defaultValue: 'Enter Job Description' })}
                  value={newJob.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewJob({ ...newJob, description: e.target.value })}
                  className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                  rows={4}
                />
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location-select" className="block text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{t('jobBoard.location', { defaultValue: 'Select Location' })}</label>
                <select
                  id="location-select"
                  value={newJob.location}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewJob({ ...newJob, location: e.target.value })}
                  className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                >
                  <option value="">{t('jobBoard.selectLocation', { defaultValue: 'Select Location' })}</option>
                  {locations.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>

              {/* Salary */}
              <div>
                <label htmlFor="salary-input" className="sr-only">{t('jobBoard.salaryPlaceholder', { defaultValue: 'Enter Salary (e.g., $3000)' })}</label>
                <input
                  id="salary-input"
                  type="text"
                  placeholder={t('jobBoard.salaryPlaceholder', { defaultValue: 'Enter Salary (e.g., $3000)' })}
                  value={newJob.salary}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, salary: e.target.value })}
                  className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
                />
              </div>

              {/* Job Type */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{t('jobBoard.jobType', { defaultValue: 'Job Type' })}</label>
                <div className="flex space-x-4">
                  <label htmlFor="job-type-fulltime" className="flex items-center text-xs sm:text-sm dark:text-white">
                    <input
                      id="job-type-fulltime"
                      type="radio"
                      value="Full Time"
                      checked={newJob.jobType === 'Full Time'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, jobType: e.target.value })}
                      className="mr-2"
                    />
                    {t('jobTypes.fullTime', { defaultValue: 'Full Time' })}
                  </label>
                  <label htmlFor="job-type-parttime" className="flex items-center text-xs sm:text-sm dark:text-white">
                    <input
                      id="job-type-parttime"
                      type="radio"
                      value="Part Time"
                      checked={newJob.jobType === 'Part Time'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, jobType: e.target.value })}
                      className="mr-2"
                    />
                    {t('jobTypes.partTime', { defaultValue: 'Part Time' })}
                  </label>
                </div>
              </div>

              {/* Work Type */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{t('jobBoard.workType', { defaultValue: 'Select Type' })}</label>
                <div className="flex space-x-4">
                  <label htmlFor="work-type-office" className="flex items-center text-xs sm:text-sm dark:text-white">
                    <input
                      id="work-type-office"
                      type="radio"
                      value="Office"
                      checked={newJob.workType === 'Office'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, workType: e.target.value })}
                      className="mr-2"
                    />
                    {t('workTypes.office', { defaultValue: 'Office' })}
                  </label>
                  <label htmlFor="work-type-remote" className="flex items-center text-xs sm:text-sm dark:text-white">
                    <input
                      id="work-type-remote"
                      type="radio"
                      value="Remote"
                      checked={newJob.workType === 'Remote'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, workType: e.target.value })}
                      className="mr-2"
                    />
                    {t('workTypes.remote', { defaultValue: 'Remote' })}
                  </label>
                  <label htmlFor="work-type-hybrid" className="flex items-center text-xs sm:text-sm dark:text-white">
                    <input
                      id="work-type-hybrid"
                      type="radio"
                      value="Hybrid"
                      checked={newJob.workType === 'Hybrid'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, workType: e.target.value })}
                      className="mr-2"
                    />
                    {t('workTypes.hybrid', { defaultValue: 'Hybrid' })}
                  </label>
                </div>
              </div>

              {/* Job Status */}
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{t('jobBoard.jobStatus', { defaultValue: 'Job Status' })}</label>
                <div className="flex space-x-4">
                  <label htmlFor="job-status-active" className="flex items-center text-xs sm:text-sm dark:text-white">
                    <input
                      id="job-status-active"
                      type="radio"
                      value="Active"
                      checked={newJob.status === 'Active'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, status: e.target.value })}
                      className="mr-2"
                    />
                    {t('jobBoard.activeJobs', { defaultValue: 'Active' })}
                  </label>
                  <label htmlFor="job-status-inactive" className="flex items-center text-xs sm:text-sm dark:text-white">
                    <input
                      id="job-status-inactive"
                      type="radio"
                      value="Inactive"
                      checked={newJob.status === 'Inactive'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, status: e.target.value })}
                      className="mr-2"
                    />
                    {t('jobBoard.inactiveJobs', { defaultValue: 'Inactive' })}
                  </label>
                  <label htmlFor="job-status-completed" className="flex items-center text-xs sm:text-sm dark:text-white">
                    <input
                      id="job-status-completed"
                      type="radio"
                      value="Completed"
                      checked={newJob.status === 'Completed'}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewJob({ ...newJob, status: e.target.value })}
                      className="mr-2"
                    />
                    {t('jobBoard.completedJobs', { defaultValue: 'Completed' })}
                  </label>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-4 sm:mt-6">
              <button
                onClick={handleCancelAddJob}
                className="flex-1 py-2 sm:py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                {t('jobBoard.cancel', { defaultValue: 'Cancel' })}
              </button>
              <button
                onClick={handleAddJob}
                className="flex-1 py-2 sm:py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
              >
                {t('jobBoard.add', { defaultValue: 'Add' })}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && jobToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 dark:bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-4 text-center">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{t('jobBoard.confirmDeleteTitle', { defaultValue: 'Confirm Deletion' })}</h2>
              <button
                onClick={handleCancelDelete}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={t('jobBoard.close', { defaultValue: 'Close' })}
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              {t('jobBoard.confirmDeleteMessage', {
                defaultValue: 'Are you sure you want to delete the job "{{jobTitle}}"? This action cannot be undone.',
                jobTitle: jobToDelete.title
              })}
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={handleCancelDelete}
                className="flex-1 py-2 sm:py-3 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-sm"
              >
                {t('jobBoard.cancel', { defaultValue: 'Cancel' })}
              </button>
              <button
                onClick={handleDeleteJob}
                className="flex-1 py-2 sm:py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm"
              >
                {t('jobBoard.deleteConfirm', { defaultValue: 'Delete' })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default JobBoard;
