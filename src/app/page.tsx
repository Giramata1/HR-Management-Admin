'use client';

import Sidebar from '@/components/Sidebar'; 
import Header from '@/components/Header';
import DashboardCards from '@/components/Dashboardcards';
import AttendanceChart from '@/components/Attendancechart';
import Calendar from '@/components/Calendar';
import AttendanceTable from '@/components/AttendanceTable';



export default function DashboardPage() {
  return (
    <div className="flex h-screen">
      
      <Sidebar />

     
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
