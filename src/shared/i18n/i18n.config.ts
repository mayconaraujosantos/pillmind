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

const SUPPORTED_LANGUAGES = ['en', 'pt-BR'] as const;
type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const isSupportedLanguage = (
  language: string | null | undefined
): language is SupportedLanguage => {
  return (
    !!language && SUPPORTED_LANGUAGES.includes(language as SupportedLanguage)
  );
};

// Função para obter o idioma salvo ou usar o do dispositivo
const getInitialLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (isSupportedLanguage(savedLanguage)) {
      return savedLanguage;
    }
    // Se não houver idioma salvo, usa o do dispositivo
    const deviceLanguage = Localization.getLocales()[0]?.languageTag;
    if (isSupportedLanguage(deviceLanguage)) {
      return deviceLanguage;
    }

    return 'en';
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

// Inicialização síncrona inicial com idioma padrão ou do dispositivo
const deviceLanguage = Localization.getLocales()[0]?.languageTag;
const initialLanguage: SupportedLanguage = isSupportedLanguage(deviceLanguage)
  ? deviceLanguage
  : 'en';

// Inicializa o i18n com configurações básicas de forma síncrona
i18nInstance.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: 'en',
  compatibilityJSON: 'v4',
  interpolation: {
    escapeValue: false,
  },
});

// Função de inicialização assíncrona completa
const initializeI18n = async (): Promise<typeof i18nInstance> => {
  try {
    const language = await getInitialLanguage();
    if (language !== i18nInstance.language) {
      await i18nInstance.changeLanguage(language);
    }
  } catch (error) {
    console.error('Error in i18n initialization:', error);
  }
  return i18nInstance;
};

// Cria a promessa de inicialização que inicia automaticamente
// NOSONAR - Inicialização automática necessária para carregar preferências de idioma
const initI18nPromise = initializeI18n();

// Exporta a promessa para quem quiser aguardar a inicialização completa
export const i18nInitialized = initI18nPromise;

// Exporta a instância síncrona para compatibilidade
// NOTA: Esta instância já está inicializada com o idioma do dispositivo (ou 'en')
// e será atualizada automaticamente para o idioma salvo quando a promessa resolver
export default i18nInstance;
