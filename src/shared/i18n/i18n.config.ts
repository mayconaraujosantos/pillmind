import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
};

// Detecta o idioma do dispositivo
const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'en';

const i18nInstance = i18n.createInstance();

i18nInstance.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

export default i18nInstance;
