import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
// import Backend from 'i18next-http-backend';

import fr from './assets/locales/fr/translation.json'
import en from './assets/locales/en/translation.json'

i18n
  // .use(Backend)
  .use(initReactI18next)
  // for all options: https://www.i18next.com/overview/configuration-options
  // .languages = ['fr', 'en']
  .init({
    resources: {
      en: {
        translation: en
      },
      fr: {
        translation: fr
      },
    },
    fallbackLng: 'fr',
    debug: true,
    lng: 'fr',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;