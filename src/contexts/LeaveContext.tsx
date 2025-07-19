import React, { createContext, useContext, useState, ReactNode } from 'react'

export type LeaveRecord = {
  id: number
  date: string
  duration: string
  days: string
  employee: string
  manager: string
  status: 'pending' | 'approved' | 'rejected'
  reason: string
  type: string
}

type LeaveContextType = {
  leaveRecords: LeaveRecord[]
  addLeave: (leave: Omit<LeaveRecord, 'id'>) => void
  updateLeaveStatus: (id: number, status: 'approved' | 'rejected') => void
  getLeavesByEmployee: (employeeName: string) => LeaveRecord[]
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined)

export const LeaveProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([
    {
      id: 1,
      date: 'July 01, 2025',
      duration: 'July 01 - July 02',
      days: '2 Days',
      employee: 'John Smith',
      manager: 'Mark Williams',
      status: 'pending',
      reason: 'Family event',
      type: 'Casual Leave',
    },
    {
      id: 2,
      date: 'April 05, 2023',
      duration: 'April 06 - April 10',
      days: '4 Days',
      employee: 'Sarah Johnson',
      manager: 'Mark Williams',
      status: 'approved',
      reason: 'Vacation',
      type: 'Annual Leave',
    },
    {
      id: 3,
      date: 'March 12, 2023',
      duration: 'March 14 - March 16',
      days: '2 Days',
      employee: 'Mike Davis',
      manager: 'Mark Williams',
      status: 'approved',
      reason: 'Medical appointment',
      type: 'Sick Leave',
    },
    {
      id: 4,
      date: 'February 01, 2023',
      duration: 'February 02 - February 10',
      days: '8 Days',
      employee: 'Emily Brown',
      manager: 'Mark Williams',
      status: 'approved',
      reason: 'Personal travel',
      type: 'Annual Leave',
    },
    {
      id: 5,
      date: 'January 01, 2023',
      duration: 'January 16 - January 19',
      days: '3 Days',
      employee: 'David Wilson',
      manager: 'Mark Williams',
      status: 'rejected',
      reason: 'Insufficient notice',
      type: 'Casual Leave',
    },
  ])

  const addLeave = (leave: Omit<LeaveRecord, 'id'>) => {
    const newLeave: LeaveRecord = {
      ...leave,
      id: Math.max(...leaveRecords.map(l => l.id), 0) + 1,
    }
    setLeaveRecords((prev) => [...prev, newLeave])
  }

  const updateLeaveStatus = (id: number, status: 'approved' | 'rejected') => {
    setLeaveRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, status } : record
      )
    )
  }

  const getLeavesByEmployee = (employeeName: string) => {
    return leaveRecords.filter(record => record.employee === employeeName)
  }

  return (
    <LeaveContext.Provider value={{ 
      leaveRecords, 
      addLeave, 
      updateLeaveStatus, 
      getLeavesByEmployee 
    }}>
      {children}
    </LeaveContext.Provider>
  )
}

export const useLeave = () => {
  const context = useContext(LeaveContext)
  if (!context) {
    throw new Error('useLeave must be used within a LeaveProvider')
  }
  return context
}