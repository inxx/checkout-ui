import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

import koCommon from '../locales/ko/common.json'
import enCommon from '../locales/en/common.json'

const resources = {
  ko: {
    common: koCommon
  },
  en: {
    common: enCommon
  }
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ko',
    ns: ['common'],
    defaultNS: 'common',
    
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng'
    },

    interpolation: {
      escapeValue: false
    }
  })

// HTML lang 속성 동기화
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng
})

export default i18n