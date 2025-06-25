'use client';

import {
  Users,
  ClipboardList,
  BarChart2,
  Folder
} from 'lucide-react';

interface MetricCard {
  title: string
  value: string
  change: string
  isPositive: boolean
  date: string
  iconBg: string
  icon: React.ReactNode
}

const metrics: MetricCard[] = [
  {
    title: 'Total Employee',
    value: '560',
    change: '12%',
    isPositive: true,
    date: 'Update: July 16, 2023',
    iconBg: 'bg-blue-50 text-blue-600',
    icon: <Users className="w-5 h-5" />
  },
  {
    title: 'Total Applicant',
    value: '1050',
    change: '5%',
    isPositive: true,
    date: 'Update: July 16, 2023',
    iconBg: 'bg-green-50 text-green-600',
    icon: <ClipboardList className="w-5 h-5" />
  },
  {
    title: 'Today Attendance',
    value: '470',
    change: '8%',
    isPositive: false,
    date: 'Update: July 16, 2023',
    iconBg: 'bg-red-50 text-red-600',
    icon: <BarChart2 className="w-5 h-5" />
  },
  {
    title: 'Total Projects',
    value: '250',
    change: '12%',
    isPositive: true,
    date: 'Update: July 16, 2023',
    iconBg: 'bg-purple-50 text-purple-600',
    icon: <Folder className="w-5 h-5" />
  }
];

export default function DashboardCards() {
  return (
    <div className="grid grid-cols-2 gap-6 max-w-4xl">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          {/* Header with icon and title */}
          <div className="flex items-center mb-6">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${metric.iconBg}`}>
              {metric.icon}
            </div>
            <div className="text-sm text-gray-600 font-medium">{metric.title}</div>
          </div>
          
          {/* Main content area with value and percentage */}
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl font-bold text-gray-900">{metric.value}</div>
            <div className={`flex items-center text-sm font-medium px-3 py-1 rounded-full ${
              metric.isPositive 
                ? 'bg-green-100 text-green-600' 
                : 'bg-red-100 text-red-600'
            }`}>
              <span className="mr-1">
                {metric.isPositive ? '▲' : '▼'}
              </span>
              {metric.change}
            </div>
          </div>
          
          {/* Update date with separator line */}
          <div className="border-t border-gray-100 pt-3">
            <div className="text-xs text-gray-400">{metric.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}