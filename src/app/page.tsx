'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import DashboardCards from '@/components/Dashboardcards';
import AttendanceChart from '@/components/Attendancechart';
import Calendar from '@/components/Calendar';
import AttendanceTable from '@/components/AttendanceTable';
import Home from '@/components/LoginForm'; 



export default function DashboardPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedIn === 'true');
  }, []);

  useEffect(() => {
    const handleLogin = () => {
      localStorage.setItem('isLoggedIn', 'true');
      setIsLoggedIn(true);
    };

    window.addEventListener('loginSuccess', handleLogin);

    return () => {
      window.removeEventListener('loginSuccess', handleLogin);
    };
  }, []);


  if (!isLoggedIn) return <Home />;

  return (
    <div className="flex h-screen">
      
      <div className="flex-1 p-5 overflow-y-auto">
        <Header />
        <div className="grid grid-cols-[1fr_300px] gap-8 mb-8">
          <div className="flex flex-col gap-8">
            <DashboardCards />
            <AttendanceChart />
            
          </div>
          <Calendar />
        </div>
        <AttendanceTable />
      </div>
      
    </div>
  );
}
