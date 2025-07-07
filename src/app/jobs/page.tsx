'use client';
import React, { useState } from 'react';
import { Search, MapPin, Plus, Briefcase, X, Bell } from 'lucide-react';

const JobBoard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    workType: 'Office',
    jobType: 'Full Time',
    tags: []
  });

  const [activeJobs, setActiveJobs] = useState([
    {
      id: 1,
      title: 'UI/UX Designer',
      company: 'Design',
      location: 'California, USA',
      salary: '$3600',
      period: 'Month',
      tags: ['Design', 'Full Time', 'Remote']
    },
    {
      id: 2,
      title: 'Sr. UX Researcher',
      company: 'Design',
      location: 'New York, USA',
      salary: '$1500',
      period: 'Month',
      tags: ['Design', 'Full Time']
    },
    {
      id: 3,
      title: 'BDM',
      company: 'Sales',
      location: 'New York, USA',
      salary: '$1000',
      period: 'Month',
      tags: ['Sales', 'Full Time']
    },
    {
      id: 4,
      title: 'React JS',
      company: 'Developer',
      location: 'New York, USA',
      salary: '$2000',
      period: 'Month',
      tags: ['Developer', 'Full Time']
    }
  ]);

  const [inactiveJobs] = useState([
    {
      id: 5,
      title: 'Hr Executive',
      company: 'HR',
      location: 'California, USA',
      salary: '$3600',
      period: 'Month',
      tags: ['HR', 'Full Time', 'Remote']
    },
    {
      id: 6,
      title: 'Python Developer',
      company: 'Developer',
      location: 'New York, USA',
      salary: '$1500',
      period: 'Month',
      tags: ['Developer', 'Full Time']
    }
  ]);

  const [completedJobs] = useState([
    {
      id: 7,
      title: 'UI/UX Designer',
      company: 'Design',
      location: 'California, USA',
      salary: '$3600',
      period: 'Month',
      tags: ['Design', 'Full Time', 'Remote']
    },
    {
      id: 8,
      title: 'Sr. UX Researcher',
      company: 'Design',
      location: 'New York, USA',
      salary: '$1500',
      period: 'Month',
      tags: ['Design', 'Full Time']
    },
    {
      id: 9,
      title: 'BDM',
      company: 'Sales',
      location: 'New York, USA',
      salary: '$1000',
      period: 'Month',
      tags: ['Sales', 'Full Time']
    }
  ]);

  const departments = ['Design', 'Developer', 'Sales', 'HR', 'Marketing', 'Finance'];
  const locations = ['California, USA', 'New York, USA', 'Texas, USA', 'Florida, USA'];

  type Job = {
    id: number;
    title: string;
    company: string;
    location: string;
    salary: string;
    period: string;
    tags: string[];
  };

  
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
    <div className="bg-white rounded-lg p-6 mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4 mb-4">
        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-6 h-6 text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{job.title}</h3>
          <p className="text-gray-500 text-sm">{job.company}</p>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {job.tags.map((tag, index) => (
          <span
            key={index}
            className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center text-gray-500 text-sm">
          <MapPin className="w-4 h-4 mr-2" />
          {job.location}
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-gray-900">{job.salary}</span>
          <span className="text-gray-500 text-sm">/{job.period}</span>
        </div>
      </div>
    </div>
  );

  type JobColumnProps = {
    title: string;
    jobs: Job[];
    dotColor: string;
  };

  const JobColumn = ({ title, jobs, dotColor }: JobColumnProps) => (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className={`w-3 h-3 rounded-full ${dotColor}`}></div>
          <h2 className="font-semibold text-gray-900 text-lg">{title}</h2>
        </div>
        <div>
          {filterJobs(jobs).map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </div>
  );

  const handleAddJob = () => {
    if (!newJob.title || !newJob.company || !newJob.location || !newJob.salary) {
      alert('Please fill in all required fields');
      return;
    }

    const jobToAdd = {
      id: Date.now(),
      title: newJob.title,
      company: newJob.company,
      location: newJob.location,
      salary: newJob.salary,
      period: 'Month',
      tags: [newJob.company, newJob.jobType, newJob.workType === 'Work from Home' ? 'Remote' : '']
        .filter(tag => tag !== '')
    };

    setActiveJobs([...activeJobs, jobToAdd]);
    setShowModal(false);
    setNewJob({
      title: '',
      company: '',
      location: '',
      salary: '',
      workType: 'Office',
      jobType: 'Full Time',
      tags: []
    });
  };

  const handleCancel = () => {
    setShowModal(false);
    setNewJob({
      title: '',
      company: '',
      location: '',
      salary: '',
      workType: 'Office',
      jobType: 'Full Time',
      tags: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <div className=" px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
            <p className="text-sm text-gray-500">Show All Jobs</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Top Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            
           
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-6 h-6" />
            </button>
            
         
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">RA</span>
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">Robert Allen</p>
                <p className="text-xs text-gray-500">HR Manager</p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 bg-white text-sm w-80"
            />
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Job</span>
          </button>
        </div>
      </div>

      
      <div className="flex min-h-screen">
        <JobColumn 
          title="Active Jobs" 
          jobs={activeJobs} 
          dotColor="bg-yellow-500" 
        />
        <div className="w-px bg-gray-200"></div>
        <JobColumn 
          title="Inactive Jobs" 
          jobs={inactiveJobs} 
          dotColor="bg-red-500" 
        />
        <div className="w-px bg-gray-200"></div>
        <JobColumn 
          title="Completed Jobs" 
          jobs={completedJobs} 
          dotColor="bg-green-500" 
        />
      </div>

      
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Add New Job</h2>
              <button 
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
             
              <div>
                <label className="block text-sm text-gray-600 mb-2">Select Department</label>
                <select
                  value={newJob.company}
                  onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>

           
              <div>
                <input
                  type="text"
                  placeholder="Enter Job Title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

             
              <div>
                <select
                  value={newJob.location}
                  onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

            
              <div>
                <input
                  type="text"
                  placeholder="Enter Salary (e.g., $3000)"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({...newJob, salary: e.target.value})}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

             
              <div>
                <label className="block text-sm text-gray-600 mb-2">Job Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Full Time"
                      checked={newJob.jobType === 'Full Time'}
                      onChange={(e) => setNewJob({...newJob, jobType: e.target.value})}
                      className="mr-2"
                    />
                    <span className="text-sm">Full Time</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Part Time"
                      checked={newJob.jobType === 'Part Time'}
                      onChange={(e) => setNewJob({...newJob, jobType: e.target.value})}
                      className="mr-2"
                    />
                    <span className="text-sm">Part Time</span>
                  </label>
                </div>
              </div>

             
              <div>
                <label className="block text-sm text-gray-600 mb-2">Select Type</label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Office"
                      checked={newJob.workType === 'Office'}
                      onChange={(e) => setNewJob({...newJob, workType: e.target.value})}
                      className="mr-2"
                    />
                    <span className="text-sm">Office</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="Work from Home"
                      checked={newJob.workType === 'Work from Home'}
                      onChange={(e) => setNewJob({...newJob, workType: e.target.value})}
                      className="mr-2"
                    />
                    <span className="text-sm">Work from Home</span>
                  </label>
                </div>
              </div>
            </div>

            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={handleCancel}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddJob}
                className="flex-1 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;