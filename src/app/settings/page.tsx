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

  // New: Track if i18n is ready (prevents hydration mismatch)
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true);
    } else {
      const handleInitialized = () => setReady(true);
      i18n.on('initialized', handleInitialized);

      // Clean up event listener on unmount
      return () => {
        i18n.off('initialized', handleInitialized);
      };
    }
  }, [i18n]);

  const languageOptions = [
    { label: 'English', value: 'en' },
    { label: 'Français', value: 'fr' },
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
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-white dark:bg-gray-800 dark:text-white border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  );

  if (!ready) {
    // While i18n isn't ready, render nothing to avoid hydration mismatch
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{t('settings.title')}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('settings.subtitle')}
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={t('search.placeholder')}
                className="pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors relative"
              >
                <Bell className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-red-500 rounded-full" />
              </button>

              {showNotifications && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {t('notifications.title')}
                      </h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      <div className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 cursor-pointer">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <Bell className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{t('notifications.newSettings')}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {t('notifications.checkSecurity')}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">{t('notifications.timeAgo')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                      <button
                        className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-2 rounded hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                        onClick={() => setShowNotifications(false)}
                      >
                        {t('notifications.viewAll')}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Image
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e"
                alt="Robert Allen"
                width={32}
                height={32}
                className="rounded-full"
              />
              <div className="text-sm">
                <div className="font-medium">Robert Allen</div>
                <div className="text-gray-500 dark:text-gray-400">{t('role.hrManager')}</div>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{t('appearance.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('appearance.description')}
                </p>
              </div>
              <Dropdown
                value={theme}
                options={[
                  { label: 'Light', value: 'light' },
                  { label: 'Dark', value: 'dark' },
                  { label: 'Auto', value: 'auto' },
                ]}
                onChange={(value) => setTheme(value as 'light' | 'dark' | 'auto')}
              />
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{t('language.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {t('language.description')}
                </p>
              </div>
              <Dropdown value={language} options={languageOptions} onChange={handleLanguageChange} />
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{t('twoFactor.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('twoFactor.description')}</p>
              </div>
              <Toggle enabled={twoFactor} onToggle={() => setTwoFactor(!twoFactor)} />
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{t('mobilePush.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('mobilePush.description')}</p>
              </div>
              <Toggle enabled={mobilePush} onToggle={() => setMobilePush(!mobilePush)} />
            </div>

            <div className="p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{t('desktopNotification.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('desktopNotification.description')}</p>
              </div>
              <Toggle
                enabled={desktopNotification}
                onToggle={() => setDesktopNotification(!desktopNotification)}
              />
            </div>

            <div className="p-6 flex items-center justify-between border-b-0">
              <div>
                <h3 className="text-lg font-medium">{t('emailNotifications.title')}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t('emailNotifications.description')}</p>
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
