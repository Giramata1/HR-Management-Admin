'use client'

import React, { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useTranslation } from 'react-i18next'
// The useAuth import is no longer needed since we are not using the 'user' object here.
// import { useAuth } from '@/components/AuthContext' 

interface ToggleProps {
  enabled: boolean
  onToggle: () => void
}

interface DropdownProps {
  value: string
  options: { label: string; value: string }[]
  onChange: (value: string) => void
}

const Settings = () => {
  const { theme, setTheme } = useTheme()
  const { t, i18n } = useTranslation()
  // FIXED: The 'user' constant has been removed as it is no longer used in this component.
  // const { user } = useAuth()

  const [language, setLanguage] = useState(i18n.language)
  const [twoFactor, setTwoFactor] = useState(true)
  const [mobilePush, setMobilePush] = useState(true)
  const [desktopNotification, setDesktopNotification] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (i18n.isInitialized) {
      setReady(true)
    } else {
      const handleInitialized = () => setReady(true)
      i18n.on('initialized', handleInitialized)
      return () => {
        i18n.off('initialized', handleInitialized)
      }
    }
  }, [i18n])

  const languageOptions = [
    { label: t('language.english', { defaultValue: 'English' }), value: 'en' },
    { label: t('language.french', { defaultValue: 'Français' }), value: 'fr' },
  ]

  const handleLanguageChange = (value: string) => {
    setLanguage(value)
    i18n.changeLanguage(value)
    localStorage.setItem('i18nextLng', value)
  }

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
  )

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
  )

  if (!ready) {
    return null
  }

  return (
    <div>
      {/* Settings Sections */}
      <div className="max-w-full sm:max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
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
  )
}

export default Settings;