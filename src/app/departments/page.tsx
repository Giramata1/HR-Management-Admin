'use client';
import dynamic from 'next/dynamic';
import Image from 'next/image'; 

import { useState, useEffect, useCallback } from 'react';
import { Search, ChevronRight, Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Employee } from '@/types/employee'; 

interface Department {
  name: string;
  employees: Employee[];
}

interface DepartmentsData {
  [slug: string]: Department;
}

const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.slice(0, 2).toUpperCase();
};


function DepartmentsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Department | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<Department | null>(null);
  const [updatedDepartmentName, setUpdatedDepartmentName] = useState('');
  const [departmentsData, setDepartmentsData] = useState<DepartmentsData>({});
  const [loading, setLoading] = useState(true);

  const fetchAndProcessData = useCallback(() => {
    setLoading(true);
    try {
      if (typeof window !== 'undefined') {

        const storedEmployees = localStorage.getItem('employees');
        
        const employees: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : [];

        const storedDepartments = localStorage.getItem('departments');
        const departmentNames: string[] = storedDepartments ? JSON.parse(storedDepartments) : [];

        const groupedByDept = employees.reduce((acc, emp) => {
          const dept = emp.professionalInfo.department;
          if (dept) {
            const slug = dept.toLowerCase().replace(/\s+/g, '-');
            if (!acc[slug]) {
              acc[slug] = { name: dept, employees: [] };
            }
            acc[slug].employees.push(emp);
          }
          return acc;
        }, {} as DepartmentsData);

        departmentNames.forEach(deptName => {
            const slug = deptName.toLowerCase().replace(/\s+/g, '-');
            if (!groupedByDept[slug]) {
                groupedByDept[slug] = { name: deptName, employees: [] };
            }
        });

        setDepartmentsData(groupedByDept);
      }
    } catch (error) {
      console.error("Failed to process department data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

 
  const handleAddDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDepartmentName.trim()) {
      const storedDepartments = localStorage.getItem('departments');
      const departmentNames: string[] = storedDepartments ? JSON.parse(storedDepartments) : [];

      if (departmentNames.some(d => d.toLowerCase() === newDepartmentName.trim().toLowerCase())) {
          alert("Department with this name already exists.");
          return;
      }

      const updatedDepartments = [...departmentNames, newDepartmentName.trim()];
      localStorage.setItem('departments', JSON.stringify(updatedDepartments));

      setNewDepartmentName('');
      setShowAddModal(false);
      fetchAndProcessData();
    }
  };

  const handleUpdateClick = (department: Department) => {
    setShowUpdateModal(department);
    setUpdatedDepartmentName(department.name);
  };
  
  const handleUpdateDepartment = (e: React.FormEvent) => {
    e.preventDefault();
    if (showUpdateModal && updatedDepartmentName.trim()) {
      const oldDeptName = showUpdateModal.name;
      const newDeptName = updatedDepartmentName.trim();

      const storedDepartments = localStorage.getItem('departments');
      const departmentNames: string[] = storedDepartments ? JSON.parse(storedDepartments) : [];

      const storedEmployees = localStorage.getItem('employees');
      const employees: Employee[] = storedEmployees ? JSON.parse(storedEmployees) : [];

      if (oldDeptName.toLowerCase() !== newDeptName.toLowerCase() && departmentNames.some(d => d.toLowerCase() === newDeptName.toLowerCase())) {
        alert("Another department with this name already exists.");
        return;
      }

      const updatedDepartmentNames = departmentNames.map(d =>
        d.toLowerCase() === oldDeptName.toLowerCase() ? newDeptName : d
      );
      localStorage.setItem('departments', JSON.stringify(updatedDepartmentNames));

      const updatedEmployees = employees.map(emp => {
        if (emp.professionalInfo.department.toLowerCase() === oldDeptName.toLowerCase()) {
          emp.professionalInfo.department = newDeptName;
        }
        return emp;
      });
      localStorage.setItem('employees', JSON.stringify(updatedEmployees));

      setShowUpdateModal(null);
      setUpdatedDepartmentName('');
      fetchAndProcessData();
    }
  };

  const handleDeleteClick = (department: Department) => {
    if (department.employees.length > 0) {
        alert(`Cannot delete "${department.name}" because it has ${department.employees.length} employee(s) assigned to it. Please reassign them first.`);
        return;
    }
    setShowDeleteConfirm(department);
  };

  const confirmDeleteDepartment = () => {
    if (showDeleteConfirm) {
      const storedDepartments = localStorage.getItem('departments');
      let departmentNames: string[] = storedDepartments ? JSON.parse(storedDepartments) : [];
      
      departmentNames = departmentNames.filter(d => d.toLowerCase() !== showDeleteConfirm.name.toLowerCase());
      localStorage.setItem('departments', JSON.stringify(departmentNames));

      setShowDeleteConfirm(null);
      fetchAndProcessData();
    }
  };


  const filteredDepartments = Object.entries(departmentsData).filter(([dept]) =>
    dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 sm:px-8 py-6">
     
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">{t('allDepartments.title')}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{t('allDepartments.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('header.searchPlaceholder')}
              className="pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-black dark:text-white"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('Add Department')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading departments...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredDepartments.map(([slug, dept]) => (
            <div key={slug} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{dept.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{dept.employees.length} {t('members')}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleUpdateClick(dept)}
                    className="p-2 text-gray-400 hover:text-purple-500"
                    title={`Update ${dept.name}`}
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(dept)}
                    className="p-2 text-gray-400 hover:text-red-500"
                    title={`Delete ${dept.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <Link href={`/departments/${slug}`} className="text-purple-600 text-sm font-medium hover:underline flex items-center">
                    {t('viewAllDepartments')} <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {dept.employees.slice(0, 5).map((employee, idx) => (
                  <div key={idx} className="flex justify-between items-center px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <div className="flex items-center gap-3">
                    
                     
                      {employee.personalInfo.profileImage? (
                        <Image
                          src={employee.personalInfo.profileImage}
                          alt={`Profile of ${employee.personalInfo.firstName}`}
                          width={40}
                          height={40}
                          className="rounded-full object-cover h-10 w-10"
                        />
                      ) : (
                        <div className="rounded-full bg-gray-200 dark:bg-gray-600 h-10 w-10 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-white">
                          {getInitials(employee.personalInfo.firstName + ' ' + employee.personalInfo.lastName)}
                        </div>
                      )}
                     

                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{employee.personalInfo.firstName} {employee.personalInfo.lastName}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{employee.professionalInfo.designation}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-gray-400 h-4 w-4" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Add New Department')}</h2>
            <form onSubmit={handleAddDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department Name</label>
                <input
                  type="text"
                  value={newDepartmentName}
                  onChange={(e) => setNewDepartmentName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  placeholder={t('Enter Department Name')}
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">{t('cancel')}</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">{t('Add')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Update Department</h2>
            <form onSubmit={handleUpdateDepartment} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department Name</label>
                <input
                  type="text"
                  value={updatedDepartmentName}
                  onChange={(e) => setUpdatedDepartmentName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-black dark:text-white p-2 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setShowUpdateModal(null)} className="bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500">Cancel</button>
                <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Confirm Deletion</h2>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Are you sure you want to delete the department &quot;{showDeleteConfirm.name}&quot;? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4 mt-6">
                <button onClick={() => setShowDeleteConfirm(null)} className="px-4 py-2 rounded-md border">Cancel</button>
                <button onClick={confirmDeleteDepartment} className="px-4 py-2 rounded-md bg-red-600 text-white">Delete</button>
              </div>
            </div>
          </div>
      )}
    </div>
  )
}



export default dynamic(() => Promise.resolve(DepartmentsPage), { ssr: false });
