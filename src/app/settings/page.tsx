'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Bell, ChevronDown } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

interface ToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

interface DropdownProps {
  value: string;
  options: { label: string; value: string }[];
  onChange: (value: string) => void;
}

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const [language, setLanguage] = useState(i18n.language);
  const [twoFactor, setTwoFactor] = useState(true);
  const [mobilePush, setMobilePush] = useState(true);
  const [desktopNotification, setDesktopNotification] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      const handleInitialized = () => setReady(true);
      i18n.on('initialized', handleInitialized);
      return () => {
        i18n.off('initialized', handleInitialized);
      };
    }
  }, [i18n]);

  const languageOptions = [
    { label: t('language.english', { defaultValue: 'English' }), value: 'en' },
    { label: t('language.french', { defaultValue: 'Français' }), value: 'fr' },
  ];

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    localStorage.setItem('i18nextLng', value);
  };

  const Toggle = ({ enabled, onToggle }: ToggleProps) => (
    <div
      className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors ${
        enabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
      }`}
      onClick={onToggle}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </div>
  );

  const Dropdown = ({ value, options, onChange }: DropdownProps) => (
    <div className="relative w-full sm:w-48">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  if (!ready) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-lg sm:text-2xl font-semibold">{t('settings.title', { defaultValue: 'Settings' })}</h1>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.subtitle', { defaultValue: 'Manage your preferences' })}
            </p>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            <div className="relative w-full sm:w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder={t('search.placeholder', { defaultValue: 'Search' })}
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm w-full"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
                aria-label={t('notifications.title', { defaultValue: 'Notifications' })}
              >
                <Bell className="h-4 sm:h-5 w-4 sm:w-5 text-gray-500 dark:text-gray-300" />
                <span className="absolute -top-0.5 -right-0.5 h-2 sm:h-3 w-2 sm:w-3 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-full sm:w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 sm:p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                        {t('notifications.title', { defaultValue: 'Notifications' })}
                      </h3>
                    </div>
                    <div className="max-h-64 sm:max-h-96 overflow-y-auto">
                      <div className="p-3 sm:p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bell className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{t('notifications.newSettings', { defaultValue: 'New settings available' })}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {t('notifications.checkSecurity', { defaultValue: 'Check your security settings to stay protected.' })}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{t('notifications.timeAgo', { defaultValue: '2 hours ago' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 sm:p-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        onClick={() => setShowNotifications(false)}
                      >
                        {t('notifications.viewAll', { defaultValue: 'View all notifications' })}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 border border-gray-200 dark:border-gray-700 px-2 sm:px-3 py-2 rounded-md bg-white dark:bg-gray-800">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt={t('user.name', { defaultValue: 'Robert Allen' })}
                width={32}
                height={32}
                className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
              />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t('user.name', { defaultValue: 'Robert Allen' })}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{t('role.hrManager', { defaultValue: 'HR Manager' })}</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="max-w-full sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">{t('appearance.title', { defaultValue: 'Appearance' })}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('appearance.description', { defaultValue: 'Customize how the app looks' })}
                </p>
              </div>
              <Dropdown
                value={theme}
                options={[
                  { label: t('appearance.light', { defaultValue: 'Light' }), value: 'light' },
                  { label: t('appearance.dark', { defaultValue: 'Dark' }), value: 'dark' },
                  { label: t('appearance.auto', { defaultValue: 'Auto' }), value: 'auto' },
                ]}
                onChange={(value) => setTheme(value as 'light' | 'dark' | 'auto')}
              />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">{t('language.title', { defaultValue: 'Language' })}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('language.description', { defaultValue: 'Choose your preferred language' })}
                </p>
              </div>
              <Dropdown value={language} options={languageOptions} onChange={handleLanguageChange} />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">{t('twoFactor.title', { defaultValue: 'Two-Factor Authentication' })}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('twoFactor.description', { defaultValue: 'Enhance your account security' })}
                </p>
              </div>
              <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">{t('mobilePush.title', { defaultValue: 'Mobile Push Notifications' })}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('mobilePush.description', { defaultValue: 'Receive notifications on your mobile device' })}
                </p>
              </div>
              <Toggle enabled={mobilePush} onToggle={() => setMobilePush(!mobilePush)} />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">{t('desktopNotification.title', { defaultValue: 'Desktop Notifications' })}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('desktopNotification.description', { defaultValue: 'Receive notifications on your desktop' })}
                </p>
              </div>
              <Toggle
                enabled={desktopNotification}
                onToggle={() => setDesktopNotification(!desktopNotification)}
              />
            </div>

            <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 border-b-0">
              <div>
                <h3 className="text-base sm:text-lg font-medium">{t('emailNotifications.title', { defaultValue: 'Email Notifications' })}</h3>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('emailNotifications.description', { defaultValue: 'Receive notifications via email' })}
                </p>
              </div>
              <Toggle
                enabled={emailNotifications}
                onToggle={() => setEmailNotifications(!emailNotifications)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;