'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Search, MapPin, Plus, Briefcase, X, Trash2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



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


// This is now the ONLY data source for the component.
const LOCAL_STORAGE_KEY = 'hr_board_fake_jobs';

const readFakeJobs = (): ApiJob[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  
  if (!stored) {
    const defaultJobs = [
      { id: 1, jobTitle: "Senior React Developer", jobDescription: "Looking for an experienced React dev.", departmentName: "Developer", location: "New York, USA", salary: 120000, jobType: "Full Time", status: "Active", createdAt: new Date().toISOString(), updatedAt: null },
      { id: 2, jobTitle: "UI/UX Designer", jobDescription: "Create amazing user experiences.", departmentName: "Design", location: "California, USA", salary: 95000, jobType: "Full Time", status: "Active", createdAt: new Date().toISOString(), updatedAt: null },
      { id: 3, jobTitle: "HR Coordinator", jobDescription: "Assist with HR tasks.", departmentName: "HR", location: "Texas, USA", salary: 60000, jobType: "Part Time", status: "Inactive", createdAt: new Date().toISOString(), updatedAt: null },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultJobs));
    return defaultJobs;
  }
  return JSON.parse(stored);
};

const writeFakeJobs = (jobs: ApiJob[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(jobs));
};

const fakeAddJobApi = async (newJobData: Omit<ApiJob, 'id' | 'createdAt' | 'updatedAt'>): Promise<ApiJob> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentJobs = readFakeJobs();
      const nextId = currentJobs.length > 0 ? Math.max(...currentJobs.map(j => j.id)) + 1 : 1;
      const createdJob: ApiJob = {
        ...newJobData,
        id: nextId,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      };
      const updatedJobs = [...currentJobs, createdJob];
      writeFakeJobs(updatedJobs);
      resolve(createdJob);
    }, 300);
  });
};

const fakeDeleteJobApi = async (jobId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const currentJobs = readFakeJobs();
            const initialLength = currentJobs.length;
            const updatedJobs = currentJobs.filter(job => job.id !== jobId);

            if (updatedJobs.length < initialLength) {
                writeFakeJobs(updatedJobs);
                resolve();
            } else {
                reject(new Error("Fake API: Job not found for deletion."));
            }
        }, 300);
    });
};


const JobBoard = () => {
  const { t } = useTranslation()
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

  // Removed token and API_BASE_URL as they are no longer used.

  const departments = [
    t('departments.design', { defaultValue: 'Design' }),
    t('departments.developer', { defaultValue: 'Developer' }),
    t('departments.sales', { defaultValue: 'Sales' }),
    t('departments.hr', { defaultValue: 'HR' }),
    t('departments.marketing', { defaultValue: 'Marketing' }),
    t('departments.finance', { defaultValue: 'Finance' }),
  ]
  const locations = ['California, USA', 'New York, USA', 'Texas, USA', 'Florida, USA']

  // FIX: fetchJobs now uses the fake API exclusively.
  const fetchJobs = useCallback(() => {
    setLoading(true);
    setError(null);

    // Simulate a network delay for a better user experience
    setTimeout(() => {
      try {
        const fakeApiJobs = readFakeJobs();
        const transformedJobs: Job[] = fakeApiJobs.map((job) => ({
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
      } catch (e) {
        const err = e as Error;
        const errorMessage = `Failed to load jobs from storage: ${err.message}`;
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms simulated delay
  }, [t]);


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
      const job = await fakeAddJobApi(payload);
      const jobToAdd = {
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
      const errorMessage = err instanceof Error ? err.message : t('jobBoard.addError', { defaultValue: 'Failed to add job.' });
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  // FIX: handleDeleteJob now only uses the fake API.
  const handleDeleteJob = async () => {
    if (!jobToDelete) return

    try {
      // Always use the fake API for deletion. No more network errors.
      await fakeDeleteJobApi(jobToDelete.id);
      
      // Update UI on success
      setJobs((prev) => prev.filter((j) => j.id !== jobToDelete.id))
      toast.success(t('jobBoard.deleteSuccess', { defaultValue: 'Job deleted successfully!' }))

    } catch (err: unknown) {
      // This will only catch errors from the fake API now (e.g., job not found).
      const errorMessage = err instanceof Error ? err.message : t('jobBoard.deleteError', { defaultValue: 'Failed to delete job.' });
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      // Always close the modal
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