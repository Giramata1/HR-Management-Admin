import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import en from './locales/en.json'
import fr from './locales/fr.json'

const resources = {
  en: { translation: en },
  fr: { translation: fr },
}

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector) // Only runs in browser
    .use(initReactI18next)
    .init({
      resources,
      fallbackLng: 'en',
      interpolation: { escapeValue: false },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
      react: {
        useSuspense: false,
      },
    })
}

export default i18n
