'use client';

import React, { useState } from 'react';
import { Search, MapPin, Plus, Briefcase, X, Bell } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const JobBoard = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    workType: 'Office',
    jobType: 'Full Time',
    tags: [] as string[],
  });

  const [activeJobs, setActiveJobs] = useState([
    { id: 1, title: t('jobs.uiuxDesigner', { defaultValue: 'UI/UX Designer' }), company: t('departments.design', { defaultValue: 'Design' }), location: 'California, USA', salary: '$3600', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.design', { defaultValue: 'Design' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' }), t('workTypes.remote', { defaultValue: 'Remote' })] },
    { id: 2, title: t('jobs.srUxResearcher', { defaultValue: 'Sr. UX Researcher' }), company: t('departments.design', { defaultValue: 'Design' }), location: 'New York, USA', salary: '$1500', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.design', { defaultValue: 'Design' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' })] },
    { id: 3, title: t('jobs.bdm', { defaultValue: 'BDM' }), company: t('departments.sales', { defaultValue: 'Sales' }), location: 'New York, USA', salary: '$1000', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.sales', { defaultValue: 'Sales' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' })] },
    { id: 4, title: t('jobs.reactJs', { defaultValue: 'React JS' }), company: t('departments.developer', { defaultValue: 'Developer' }), location: 'New York, USA', salary: '$2000', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.developer', { defaultValue: 'Developer' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' })] },
  ]);

  const [inactiveJobs] = useState([
    { id: 5, title: t('jobs.hrExecutive', { defaultValue: 'Hr Executive' }), company: t('departments.hr', { defaultValue: 'HR' }), location: 'California, USA', salary: '$3600', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.hr', { defaultValue: 'HR' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' }), t('workTypes.remote', { defaultValue: 'Remote' })] },
    { id: 6, title: t('jobs.pythonDeveloper', { defaultValue: 'Python Developer' }), company: t('departments.developer', { defaultValue: 'Developer' }), location: 'New York, USA', salary: '$1500', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.developer', { defaultValue: 'Developer' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' })] },
  ]);

  const [completedJobs] = useState([
    { id: 7, title: t('jobs.uiuxDesigner', { defaultValue: 'UI/UX Designer' }), company: t('departments.design', { defaultValue: 'Design' }), location: 'California, USA', salary: '$3600', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.design', { defaultValue: 'Design' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' }), t('workTypes.remote', { defaultValue: 'Remote' })] },
    { id: 8, title: t('jobs.srUxResearcher', { defaultValue: 'Sr. UX Researcher' }), company: t('departments.design', { defaultValue: 'Design' }), location: 'New York, USA', salary: '$1500', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.design', { defaultValue: 'Design' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' })] },
    { id: 9, title: t('jobs.bdm', { defaultValue: 'BDM' }), company: t('departments.sales', { defaultValue: 'Sales' }), location: 'New York, USA', salary: '$1000', period: t('period.month', { defaultValue: 'Month' }), tags: [t('departments.sales', { defaultValue: 'Sales' }), t('jobTypes.fullTime', { defaultValue: 'Full Time' })] },
  ]);

  const departments = [t('departments.design', { defaultValue: 'Design' }), t('departments.developer', { defaultValue: 'Developer' }), t('departments.sales', { defaultValue: 'Sales' }), t('departments.hr', { defaultValue: 'HR' }), t('departments.marketing', { defaultValue: 'Marketing' }), t('departments.finance', { defaultValue: 'Finance' })];
  const locations = ['California, USA', 'New York, USA', 'Texas, USA', 'Florida, USA'];

  type Job = typeof activeJobs[number];

  const filterJobs = (jobs: Job[]) => {
    if (!searchTerm) return jobs;
    return jobs.filter(job =>
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const JobCard = ({ job }: { job: Job }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 mb-4 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
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
  );

  const JobColumn = ({ title, jobs, dotColor }: { title: string; jobs: Job[]; dotColor: string; }) => (
    <div className="flex-1 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="p-4 sm:p-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-6">
          <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
          <h2 className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">{title}</h2>
        </div>
        <div>
          {filterJobs(jobs).map(job => <JobCard key={job.id} job={job} />)}
        </div>
      </div>
    </div>
  );

  const handleAddJob = () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.salary) {
      alert(t('jobBoard.validationError', { defaultValue: 'Please fill in all required fields' }));
      return;
    }
    const jobToAdd = {
      id: Date.now(),
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      salary: newJob.salary,
      period: t('period.month', { defaultValue: 'Month' }),
      tags: [
        newJob.company,
        newJob.jobType,
        newJob.workType === t('workTypes.workFromHome', { defaultValue: 'Work from Home' }) ? t('workTypes.remote', { defaultValue: 'Remote' }) : '',
      ].filter(Boolean),
    };
    setActiveJobs([...activeJobs, jobToAdd]);
    setShowModal(false);
    setNewJob({ title: '', company: '', location: '', salary: '', workType: 'Office', jobType: 'Full Time', tags: [] });
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewJob({ title: '', company: '', location: '', salary: '', workType: 'Office', jobType: 'Full Time', tags: [] });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
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
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>

            <button
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              aria-label={t('notifications', { defaultValue: 'Notifications' })}
            >
              <Bell className="w-4 sm:w-6 h-4 sm:h-6" />
            </button>

            <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-2 sm:px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-200">RA</span>
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t('user.name', { defaultValue: 'Robert Allen' })}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('role.hrManager', { defaultValue: 'HR Manager' })}</p>
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
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t('jobBoard.addNewJob', { defaultValue: 'Add New Job' })}</span>
          </button>
        </div>
      </div>

      {/* Job columns */}
      <div className="flex flex-col md:flex-row min-h-screen">
        <JobColumn title={t('jobBoard.activeJobs', { defaultValue: 'Active Jobs' })} jobs={activeJobs} dotColor="bg-yellow-500" />
        <div className="w-full md:w-px h-px md:h-auto bg-gray-200 dark:bg-gray-700"></div>
        <JobColumn title={t('jobBoard.inactiveJobs', { defaultValue: 'Inactive Jobs' })} jobs={inactiveJobs} dotColor="bg-red-500" />
        <div className="w-full md:w-px h-px md:h-auto bg-gray-200 dark:bg-gray-700"></div>
        <JobColumn title={t('jobBoard.completedJobs', { defaultValue: 'Completed Jobs' })} jobs={completedJobs} dotColor="bg-green-500" />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 dark:bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md mx-4">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">{t('jobBoard.addNewJob', { defaultValue: 'Add New Job' })}</h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label={t('jobBoard.close', { defaultValue: 'Close' })}
              >
                <X className="w-4 sm:w-5 h-4 sm:h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {/* Department */}
              <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{t('jobBoard.department', { defaultValue: 'Select Department' })}</label>
              <select
                value={newJob.company}
                onChange={e => setNewJob({ ...newJob, company: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="">{t('jobBoard.selectDepartment', { defaultValue: 'Select Department' })}</option>
                {departments.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              {/* Job title */}
              <input
                type="text"
                placeholder={t('jobBoard.jobTitlePlaceholder', { defaultValue: 'Enter Job Title' })}
                value={newJob.title}
                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
              />

              {/* Location */}
              <select
                value={newJob.location}
                onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
              >
                <option value="">{t('jobBoard.selectLocation', { defaultValue: 'Select Location' })}</option>
                {locations.map(l => <option key={l} value={l}>{l}</option>)}
              </select>

              {/* Salary */}
              <input
                type="text"
                placeholder={t('jobBoard.salaryPlaceholder', { defaultValue: 'Enter Salary (e.g., $3000)' })}
                value={newJob.salary}
                onChange={e => setNewJob({ ...newJob, salary: e.target.value })}
                className="w-full p-2 sm:p-3 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white text-sm"
              />

              {/* Job Type */}
              <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{t('jobBoard.jobType', { defaultValue: 'Job Type' })}</label>
              <div className="flex space-x-4">
                <label className="flex items-center text-xs sm:text-sm dark:text-white">
                  <input
                    type="radio"
                    value="Full Time"
                    checked={newJob.jobType === 'Full Time'}
                    onChange={e => setNewJob({ ...newJob, jobType: e.target.value })}
                    className="mr-2"
                  />{t('jobTypes.fullTime', { defaultValue: 'Full Time' })}
                </label>
                <label className="flex items-center text-xs sm:text-sm dark:text-white">
                  <input
                    type="radio"
                    value="Part Time"
                    checked={newJob.jobType === 'Part Time'}
                    onChange={e => setNewJob({ ...newJob, jobType: e.target.value })}
                    className="mr-2"
                  />{t('jobTypes.partTime', { defaultValue: 'Part Time' })}
                </label>
              </div>

              {/* Work Type */}
              <label className="block text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-1 sm:mb-2">{t('jobBoard.workType', { defaultValue: 'Select Type' })}</label>
              <div className="flex space-x-4">
                <label className="flex items-center text-xs sm:text-sm dark:text-white">
                  <input
                    type="radio"
                    value="Office"
                    checked={newJob.workType === 'Office'}
                    onChange={e => setNewJob({ ...newJob, workType: e.target.value })}
                    className="mr-2"
                  />{t('workTypes.office', { defaultValue: 'Office' })}
                </label>
                <label className="flex items-center text-xs sm:text-sm dark:text-white">
                  <input
                    type="radio"
                    value="Work from Home"
                    checked={newJob.workType === 'Work from Home'}
                    onChange={e => setNewJob({ ...newJob, workType: e.target.value })}
                    className="mr-2"
                  />{t('workTypes.workFromHome', { defaultValue: 'Work from Home' })}
                </label>
              </div>
            </div>

            <div className="flex space-x-3 mt-4 sm:mt-6">
              <button
                onClick={handleCancel}
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
    </div>
  );
};

export default JobBoard;