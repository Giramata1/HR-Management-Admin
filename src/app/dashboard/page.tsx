'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Import your dashboard-specific components
import DashboardCards from '@/components/Dashboardcards';
import AttendanceChart from '@/components/Attendancechart';
import Calendar from '@/components/Calendar';
import AttendanceTable from '@/components/AttendanceTable';

export default function DashboardPage() {
  const router = useRouter();
  
  // State to manage rendering after the client-side auth check is complete
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // This effect runs only on the client side after the component mounts
    const token = localStorage.getItem('token');

    if (!token) {
      // If there's no token, redirect the user to the login page.
      router.push('/loginForm');
    } else {
      // If a token exists, the user is authenticated.
      // Allow the component to render its content.
      setIsAuthenticated(true);
    }
  }, [router]);

  // While the authentication check is running, render nothing (or a loading spinner).
  // This prevents a brief "flash" of the dashboard before a potential redirect.
  if (!isAuthenticated) {
    return null; 
  }

  // The Header component is correctly removed from this page,
  // as it is now rendered automatically by your global RootLayout.tsx file.
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top Section: Dashboard Cards + Attendance Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 lg:gap-8 mb-8">
        
        {/* Left Column */}
        <div className="flex flex-col gap-6">
          <DashboardCards />
          <AttendanceChart />
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-[320px]">
          <Calendar />
        </div>
      </div>

      {/* Bottom Section: Attendance Table */}
      <AttendanceTable />
    </div>
  );
}