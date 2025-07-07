'use client';

import { useParams } from 'next/navigation';

const departmentData: { [key: string]: { name: string; title: string }[] } = {
  'Design Department': [
    { name: 'Dianne Russell', title: 'Lead UI/UX Designer' },
    { name: 'Arlene McCoy', title: 'Sr UI/UX Designer' },
    { name: 'Cody Fisher', title: 'Sr UI/UX Designer' },
    { name: 'Theresa Webb', title: 'UI/UX Designer' },
    { name: 'Ronald Richards', title: 'UI/UX Designer' },
  ],
  'Sales Department': [
    { name: 'Darrell Steward', title: 'Sr Sales Manager' },
    { name: 'Kristin Watson', title: 'Sr Sales Manager' },
    { name: 'Courtney Henry', title: 'BDM' },
    { name: 'Kathryn Murphy', title: 'BDE' },
    { name: 'Albert Flores', title: 'Sales' },
  ],
  'Project Manager Department': [
    { name: 'Leslie Alexander', title: 'Sr Project Manager' },
    { name: 'Ronald Richards', title: 'Sr Project Manager' },
    { name: 'Savannah Nguyen', title: 'Project Manager' },
    { name: 'Eleanor Pena', title: 'Project Manager' },
    { name: 'Esther Howard', title: 'Project Manager' },
  ],
  'Marketing Department': [
    { name: 'Wade Warren', title: 'Sr Marketing Manager' },
    { name: 'Brooklyn Simmons', title: 'Sr Marketing Manager' },
    { name: 'Kristin Watson', title: 'Marketing Coordinator' },
    { name: 'Jacob Jones', title: 'Marketing Coordinator' },
    { name: 'Cody Fisher', title: 'Marketing' },
  ],
};

const DepartmentPage = () => {
  const params = useParams();
  const departmentName = decodeURIComponent(params.department as string);
  const employees = departmentData[departmentName] || [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">{departmentName}</h1>
      <p className="text-gray-500 mb-6">{employees.length} Members</p>
      <div className="space-y-4">
        {employees.map((employee, index) => (
          <div key={index} className="p-4 bg-white border rounded shadow-sm">
            <h2 className="font-semibold">{employee.name}</h2>
            <p className="text-sm text-gray-500">{employee.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepartmentPage;
