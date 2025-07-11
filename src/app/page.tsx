'use client';

import Header from '@/components/Header';
import DashboardCards from '@/components/Dashboardcards';
import AttendanceChart from '@/components/Attendancechart';
import Calendar from '@/components/Calendar';
import AttendanceTable from '@/components/AttendanceTable';

export default function DashboardPage() {
  return (
    <div className="flex-1 p-4 sm:p-5 md:p-6 lg:p-8 overflow-y-auto">
      <Header />

      {/* Top Section: Cards + Chart + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:gap-8 mb-8">
        {/* Left Column: Cards + Chart */}
        <div className="flex flex-col gap-6">
          <DashboardCards />
          <AttendanceChart />
        </div>

        {/* Right Column: Calendar */}
        <div>
          <Calendar />
        </div>
      </div>

      {/* Bottom Section: Attendance Table */}
      <AttendanceTable />
    </div>
  );
}
