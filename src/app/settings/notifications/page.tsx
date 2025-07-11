'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Bell, ChevronDown, User, Lock } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  const [notifications] = useState<NotificationItem[]>([
    {
      id: '1',
      type: 'user',
      title: t('notifications.leaveRequest.title', { defaultValue: 'Leave Request' }),
      message: t('notifications.leaveRequest.message', { defaultValue: '@Robert Fox has applied for leave' }),
      time: t('notifications.time.justNow', { defaultValue: 'Just Now' }),
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: '2',
      type: 'system',
      title: t('notifications.checkInIssue.title', { defaultValue: 'Check In Issue' }),
      message: t('notifications.checkInIssue.message', { defaultValue: '@Alexa shared a message regarding check in issue' }),
      time: t('notifications.time.at1116', { defaultValue: '11:16 AM' }),
    },
    {
      id: '3',
      type: 'job',
      title: t('notifications.jobApplication.title', { defaultValue: 'Applied job for "Sales Manager" Position' }),
      message: t('notifications.jobApplication.message', { defaultValue: '@Shane Watson has applied for job' }),
      time: t('notifications.time.at0900', { defaultValue: '09:00 AM' }),
      icon: <User className="h-4 w-4 text-purple-600" />,
      iconBg: 'bg-purple-100 dark:bg-purple-900',
    },
    {
      id: '4',
      type: 'feedback',
      title: t('notifications.feedback.title', { defaultValue: 'Robert Fox has shared his feedback' }),
      message: t('notifications.feedback.message', { defaultValue: '"It was an amazing experience with your organisation"' }),
      time: t('notifications.time.yesterday', { defaultValue: 'Yesterday' }),
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
    {
      id: '5',
      type: 'security',
      title: t('notifications.passwordUpdate.title', { defaultValue: 'Password Update Successfully' }),
      message: t('notifications.passwordUpdate.message', { defaultValue: 'Your password has been updated successfully' }),
      time: t('notifications.time.yesterday', { defaultValue: 'Yesterday' }),
      icon: <Lock className="h-4 w-4 text-purple-600" />,
      iconBg: 'bg-purple-100 dark:bg-purple-900',
    },
  ]);

  const NotificationCard = ({ notification }: { notification: NotificationItem }) => (
    <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
      {/* Avatar or Icon */}
      <div className="flex-shrink-0">
        {notification.avatar ? (
          <Image
            src={notification.avatar}
            alt={notification.title}
            width={40}
            height={40}
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
          />
        ) : (
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${notification.iconBg}`}>
            {notification.icon}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              {notification.title}
            </h4>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {notification.message}
            </p>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-3 sm:ml-4 flex-shrink-0">
            {notification.time}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {t('notifications.title', { defaultValue: 'Notifications' })}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('notifications.subtitle', { defaultValue: 'All Notifications' })}
            </p>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Search */}
            <div className="relative w-full sm:w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={t('search.placeholder', { defaultValue: 'Search' })}
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm w-full"
              />
            </div>

            {/* Notification Bell */}
            <button
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              aria-label={t('notifications.bell', { defaultValue: 'Notifications' })}
            >
              <Bell className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500 dark:text-gray-300" />
            </button>

            {/* User Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3 border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 rounded-md bg-white dark:bg-gray-800">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt={t('user.name', { defaultValue: 'Robert Allen' })}
                width={32}
                height={32}
                className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {t('user.name', { defaultValue: 'Robert Allen' })}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('role.hrManager', { defaultValue: 'HR Manager' })}
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Content */}
      <div className="max-w-full sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.length === 0 ? (
              <div className="p-4 sm:p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                {t('notifications.noRecords', { defaultValue: 'No notifications found' })}
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationCard key={notification.id} notification={notification} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;