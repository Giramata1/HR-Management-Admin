import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import your JSON files directly or load them however you do
import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
