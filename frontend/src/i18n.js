import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../public/locales/en/translation.json';
import ja from '../public/locales/ja/translation.json';
import ko from '../public/locales/ko/translation.json';
import zhHant from '../public/locales/zh-Hant/translation.json';
import zhHans from '../public/locales/zh-Hans/translation.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ja: { translation: ja },
      ko: { translation: ko },
      'zh-Hant': { translation: zhHant },
      'zh-Hans': { translation: zhHans },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      convertDetectedLanguage: (lng) => {
        if (lng.startsWith('zh-Hant') || lng === 'zh-TW' || lng === 'zh-HK') return 'zh-Hant';
        if (lng.startsWith('zh')) return 'zh-Hans';
        if (lng.startsWith('ko')) return 'ko';
        if (lng.startsWith('ja')) return 'ja';
        return 'en';
      },
    },
  });

export default i18n;
