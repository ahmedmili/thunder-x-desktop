import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en.json';
import frTranslation from './locales/fr.json';
import arTranslation from './locales/ar.json';
interface LanguageDetectorInterface {
  type: 'languageDetector';
  async: boolean;
  detect: (cb: (lng: string) => void) => void;
  init: () => void;
  cacheUserLanguage: (lng: string) => void;
}

const defaultLanguage = 'fr';

if (typeof window !== 'undefined') {
  // Code to execute when window is defined
}

const languageDetector: LanguageDetectorInterface = {

  type: 'languageDetector',
  async: true,
  detect: (cb) => {
    const storedLanguage = (typeof window !== 'undefined') ? localStorage.getItem('i18nextLng') : false;
    const userLanguage = storedLanguage || defaultLanguage;
    cb(userLanguage);
  },
  init: () => { },
  cacheUserLanguage: (lng) => {
    (typeof window !== 'undefined') && localStorage.setItem('i18nextLng', lng);
  },
};

i18n
  // .use(LanguageDetector)
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslation,
      },
      fr: {
        translation: frTranslation,
      },
      ar: {
        translation: arTranslation,
      },
    },
    fallbackLng: defaultLanguage,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
