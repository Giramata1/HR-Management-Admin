'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  Building2,
  Calendar,
  DollarSign,
  Briefcase,
  UserPlus,
  Leaf,
  Gift,
  Settings,
  LayoutDashboard,
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: Users, label: 'All Employees', href: '/employees' },
  { icon: Building2, label: 'All Departments', href: '/departments' },
  { icon: Calendar, label: 'Attendance', href: '/attendance' },
  { icon: DollarSign, label: 'Payroll', href: '/payroll' },
  { icon: Briefcase, label: 'Jobs', href: '/jobs' },
  { icon: UserPlus, label: 'Candidates', href: '/candidates' },
  { icon: Leaf, label: 'Leaves', href: '/leaves' },
  { icon: Gift, label: 'Holidays', href: '/holidays' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">∞</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">HRMS</span>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const isActive = pathname === item.href;

            return (
              <li key={index}>
                <Link href={item.href}>
                  <div
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                      isActive
                        ? 'text-white bg-purple-600 hover:bg-purple-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon size={20} className="mr-3" />
                    {item.label}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
