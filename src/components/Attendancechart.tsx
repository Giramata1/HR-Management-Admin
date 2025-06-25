'use client'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  
} from 'recharts'

const data = [
  { day: 'Mon', Present: 60, Late: 30, Absent: 10 },
  { day: 'Tue', Present: 60, Late: 25, Absent: 15 },
  { day: 'Wed', Present: 45, Late: 35, Absent: 20 },
  { day: 'Thu', Present: 60, Late: 25, Absent: 15 },
  { day: 'Fri', Present: 75, Late: 15, Absent: 10 },
  { day: 'Sat', Present: 45, Late: 40, Absent: 15 },
  { day: 'Sun', Present: 45, Late: 40, Absent: 15 },
]

// Transform data to include gaps between segments
const transformedData = data.map(item => ({
  day: item.day,
  Present: item.Present,
  Gap1: 2, // Small gap
  Late: item.Late,
  Gap2: 2, // Small gap  
  Absent: item.Absent
}))

const AttendanceChart = () => {
  return (
    <div className="bg-white p-10 rounded-xl shadow-sm w-full max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-semibold text-gray-800">Attendance Overview</h3>
        <select className="text-sm border border-gray-300 rounded px-3 py-1">
          <option>Today</option>
        </select>
      </div>
      
      <ResponsiveContainer width="100%" height={360}>
        <BarChart data={transformedData}>
          <XAxis
            dataKey="day"
            tick={{ fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            ticks={[0, 20, 40, 60, 80, 100]}
            tickFormatter={(val) => `${val}%`}
            tick={{ fontSize: 14 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(val, name) => {
              if (name === 'Gap1' || name === 'Gap2') return null;
              return `${val}%`;
            }}
            labelFormatter={(label) => `Day: ${label}`}
          />
          <Bar
            dataKey="Present"
            stackId="a"
            fill="#6366F1"
            radius={[8, 8, 8, 8]}
            barSize={12}
          />
          <Bar
            dataKey="Gap1"
            stackId="a"
            fill="transparent"
            barSize={12}
          />
          <Bar
            dataKey="Late"
            stackId="a"
            fill="#FBBF24"
            radius={[8, 8, 8, 8]}
            barSize={12}
          />
          <Bar
            dataKey="Gap2"
            stackId="a"
            fill="transparent"
            barSize={12}
          />
          <Bar
            dataKey="Absent"
            stackId="a"
            fill="#EF4444"
            radius={[8, 8, 8, 8]}
            barSize={12}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AttendanceChart