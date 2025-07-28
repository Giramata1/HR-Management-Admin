'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Search, Bell, ChevronDown, User, Lock, Briefcase, MessageSquare, Send } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// --- IMPORTANT: API Configuration ---
// This token will expire. You must replace it with a valid token from your authentication system.
const API_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiSFIiLCJzdWIiOiJocm1zLmhyQGdtYWlsLmNvbSIsImlhdCI6MTc1MzM0MTc2MywiZXhwIjoxNzU2MzY1NzYzfQ.iaOSsbzXNRW3ZBX12aD-Z9BxadBSftpFUekugRHZmEQ';
const API_BASE_URL = 'https://hr-management-system-pmfp.onrender.com/api/notifications';

// --- TYPE DEFINITIONS ---
interface ApiNotification {
  id: number;
  message: string;
  timestamp: string;
  recipient: {
    id: number;
    fullName: string;
  };
}

interface NotificationItem {
  id: string;
  type: 'user' | 'system' | 'job' | 'feedback' | 'security' | 'default';
  title: string;
  message: string;
  time: string;
  icon?: React.ReactNode;
  iconBg?: string;
}

const Notifications = () => {
  // --- STATE MANAGEMENT ---
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- UTILITY FUNCTIONS (MEMOIZED) ---
  const formatTime = useCallback((timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  const getNotificationDetails = useCallback((message: string): { type: NotificationItem['type'], icon: React.ReactNode, iconBg: string, title: string } => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes('leave')) return { type: 'user', icon: <User className="h-4 w-4 text-blue-600" />, iconBg: 'bg-blue-100', title: t('notifications.leaveRequest.title', { defaultValue: 'Leave Request' }) };
    if (lowerCaseMessage.includes('job')) return { type: 'job', icon: <Briefcase className="h-4 w-4 text-green-600" />, iconBg: 'bg-green-100', title: t('notifications.jobApplication.titleAlt', { defaultValue: 'Job Application' }) };
    if (lowerCaseMessage.includes('feedback')) return { type: 'feedback', icon: <MessageSquare className="h-4 w-4 text-indigo-600" />, iconBg: 'bg-indigo-100', title: t('notifications.feedback.titleAlt', { defaultValue: 'New Feedback' }) };
    if (lowerCaseMessage.includes('password')) return { type: 'security', icon: <Lock className="h-4 w-4 text-red-600" />, iconBg: 'bg-red-100', title: t('notifications.passwordUpdate.title', { defaultValue: 'Password Update' }) };
    return { type: 'default', icon: <Bell className="h-4 w-4 text-gray-600" />, iconBg: 'bg-gray-100', title: t('notifications.systemUpdate.title', { defaultValue: 'System Notification' }) };
  }, [t]);

  // --- API FUNCTIONS ---
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/all`, {
        headers: { 'Authorization': API_TOKEN }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch notifications. Is your token valid?`);
      }
      
      const rawBody = await response.text();
      // Handle potentially malformed JSON from the API
      const jsonEndIndex = rawBody.lastIndexOf('}]');
      const jsonString = jsonEndIndex === -1 ? rawBody : rawBody.substring(0, jsonEndIndex + 2);
      
      const apiData: ApiNotification[] = JSON.parse(jsonString);
      const formatted = apiData.map(item => {
        const { type, icon, iconBg, title } = getNotificationDetails(item.message);
        return {
          id: item.id.toString(),
          type,
          title,
          message: item.message,
          time: formatTime(item.timestamp),
          icon,
          iconBg,
        };
      }).sort((a, b) => b.id.localeCompare(a.id)); // Sort by ID descending (most recent)
      
      setNotifications(formatted);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  }, [formatTime, getNotificationDetails]);

  const addNotification = async (message: string) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/new`, {
        method: 'POST',
        headers: {
          'Authorization': API_TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, employeeId: 2 }),
      });

      if (!response.ok) {
         const errorBody = await response.text();
         throw new Error(`Error ${response.status}: Failed to send notification. Server says: ${errorBody}`);
      }
      
      setNewMessage('');
      await fetchNotifications(); // Refresh list on success
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred during submission.');
       console.error("Submit Error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- EFFECTS ---
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
  
  // --- EVENT HANDLERS ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      addNotification(newMessage);
    }
  };
  
  // --- RENDER LOGIC ---
  const NotificationCard = ({ notification }: { notification: NotificationItem }) => (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${notification.iconBg}`}>
        {notification.icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900 dark:text-white">{notification.title}</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{notification.message}</p>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-4 flex-shrink-0">{notification.time}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{t('notifications.title', { defaultValue: 'Notifications' })}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('notifications.subtitle', { defaultValue: 'All Notifications' })}</p>
          </div>
          <div className="flex items-center space-x-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input type="text" placeholder={t('search.placeholder', { defaultValue: 'Search' })} className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg w-full text-sm"/>
              </div>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"><Bell className="h-5 w-5 text-gray-500 dark:text-gray-300" /></button>
              <div className="flex items-center space-x-3">
                  <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User" width={40} height={40} className="rounded-full" />
                  <div>
                      <p className="text-sm font-medium">{t('user.name', { defaultValue: 'Robert Allen' })}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{t('role.hrManager', { defaultValue: 'HR Manager' })}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-8">
          <form onSubmit={handleSubmit} className="p-6">
            <h3 className="text-lg font-medium mb-4">{t('notifications.addNew', { defaultValue: 'Send a New Notification' })}</h3>
            <div className="flex items-center gap-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={t('notifications.messagePlaceholder', { defaultValue: 'Enter message for employee #2...' })}
                className="flex-grow bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                disabled={isSubmitting}
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !newMessage.trim()}
              >
                <Send className="h-4 w-4" />
                <span>{isSubmitting ? t('buttons.sending', { defaultValue: 'Sending...' }) : t('buttons.send', { defaultValue: 'Send' })}</span>
              </button>
            </div>
          </form>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading && <p className="p-6 text-center text-gray-500">{t('notifications.loading', { defaultValue: 'Loading...' })}</p>}
            
            {error && <p className="p-6 text-center text-red-500">{error}</p>}

            {!loading && !error && notifications.length === 0 && (
              <p className="p-6 text-center text-gray-500">{t('notifications.noRecords', { defaultValue: 'No notifications found.' })}</p>
            )}

            {!loading && !error && notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notifications;