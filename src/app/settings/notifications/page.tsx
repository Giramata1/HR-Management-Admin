'use client';


import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Bell, ChevronDown, User, Lock } from 'lucide-react';

interface NotificationItem {
  id: string;
  type: 'user' | 'system' | 'job' | 'feedback' | 'security';
  title: string;
  message: string;
  time: string;
  avatar?: string;
  icon?: React.ReactNode;
  iconBg?: string;
}

const Notifications = () => {
  const [notifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'user',
      title: 'Leave Request',
      message: '@Robert Fox has applied for leave',
      time: 'Just Now',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '2',
      type: 'system',
      title: 'Check In Issue',
      message: '@Alexa shared a message regarding check in issue',
      time: '11:16 AM'
    },
    {
      id: '3',
      type: 'job',
      title: 'Applied job for "Sales Manager" Position',
      message: '@shane Watson has applied for job',
      time: '09:00 AM',
      icon: <User className="h-4 w-4 text-purple-600" />,
      iconBg: 'bg-purple-100'
    },
    {
      id: '4',
      type: 'feedback',
      title: 'Robert Fox has share his feedback',
      message: '"It was an amazing experience with your organisation"',
      time: 'Yesterday',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
      id: '5',
      type: 'security',
      title: 'Password Update successfully',
      message: 'Your password has been updated successfully',
      time: 'Yesterday',
      icon: <Lock className="h-4 w-4 text-purple-600" />,
      iconBg: 'bg-purple-100'
    }
  ]);

  const NotificationCard = ({ notification }: { notification: NotificationItem }) => (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 transition-colors">
      {/* Avatar or Icon */}
      <div className="flex-shrink-0">
        {notification.avatar ? (
          <Image
            src={notification.avatar}
            alt=""
            width={40}
            height={40}
            className="rounded-full"
          />
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notification.iconBg}`}>
            {notification.icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 mb-1">
              {notification.title}
            </h4>
            <p className="text-sm text-gray-500">
              {notification.message}
            </p>
          </div>
          <span className="text-xs text-gray-400 ml-4 flex-shrink-0">
            {notification.time}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
            <p className="text-sm text-gray-500 mt-1">All Notifications</p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            {/* Notification Bell */}
            <Bell className="h-5 w-5 text-gray-500" />
            
            {/* User Profile */}
            <div className="flex items-center space-x-2">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt="Robert Allen"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="text-sm">
                <div className="font-medium text-gray-900">Robert Allen</div>
                <div className="text-gray-500">HR Manager</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200">
            {notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;