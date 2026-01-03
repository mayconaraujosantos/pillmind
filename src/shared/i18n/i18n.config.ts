import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import ptBR from './locales/pt-BR.json';

const LANGUAGE_STORAGE_KEY = '@pillmind:language';

const resources = {
  en: { translation: en },
  'pt-BR': { translation: ptBR },
};

// Função para obter o idioma salvo ou usar o do dispositivo
const getInitialLanguage = async (): Promise<string> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (savedLanguage) {
      return savedLanguage;
    }
    // Se não houver idioma salvo, usa o do dispositivo
    const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'en';
    return deviceLanguage;
  } catch (error) {
    console.error('Error loading language:', error);
    return 'en';
  }
};

// Função para salvar a escolha do idioma
export const saveLanguagePreference = async (language: string) => {
  try {
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch (error) {
    console.error('Error saving language:', error);
  }
};

const i18nInstance = i18n.createInstance();

// Inicializa com o idioma do dispositivo primeiro, depois atualiza se houver um salvo
const deviceLanguage = Localization.getLocales()[0]?.languageTag || 'en';

i18nInstance.use(initReactI18next).init({
  resources,
  lng: deviceLanguage,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

// Carrega o idioma salvo após a inicialização
void getInitialLanguage().then((language) => {
  if (language !== i18nInstance.language) {
    void i18nInstance.changeLanguage(language);
  }
});

export default i18nInstance;
