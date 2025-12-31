import React, { createContext, useEffect, useState, ReactNode } from 'react';
import { useColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, ThemeMode, ThemeContextType } from './types';
import { lightColors, darkColors, commonTheme } from './colors';

const THEME_STORAGE_KEY = '@pillmind:theme_mode';

const createTheme = (isDark: boolean): Theme => ({
  colors: isDark ? darkColors : lightColors,
  ...commonTheme,
});

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('automatic');
  const [isReady, setIsReady] = useState(false);
  const [detectedTheme, setDetectedTheme] = useState<'light' | 'dark'>('light');

  // Força detecção inicial e monitora mudanças
  useEffect(() => {
    // Tenta múltiplas formas de detectar o tema
    const detectTheme = () => {
      const appearanceScheme = Appearance.getColorScheme();
      const hookScheme = systemColorScheme;

      console.log('🔍 Detecção de tema:');
      console.log('  - Appearance.getColorScheme():', appearanceScheme);
      console.log('  - useColorScheme():', hookScheme);

      // Prioriza Appearance.getColorScheme() que é mais confiável
      const finalTheme = appearanceScheme || hookScheme || 'light';
      console.log('  - Tema final detectado:', finalTheme);

      setDetectedTheme(finalTheme === 'dark' ? 'dark' : 'light');
    };

    // Detecta imediatamente
    detectTheme();

    // Listener para mudanças
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      console.log('📱 Sistema mudou para:', colorScheme);
      const newTheme = colorScheme || 'light';
      setDetectedTheme(newTheme === 'dark' ? 'dark' : 'light');
    });

    return () => subscription.remove();
  }, [systemColorScheme]);

  // Determina se deve usar tema dark baseado no modo selecionado
  const isDark =
    themeMode === 'automatic' ? detectedTheme === 'dark' : themeMode === 'dark';

  const theme = createTheme(isDark);

  // Log final do estado
  useEffect(() => {
    console.log('🎨 Estado do tema:');
    console.log('  - Modo selecionado:', themeMode);
    console.log('  - Tema detectado do sistema:', detectedTheme);
    console.log('  - Aplicando tema:', isDark ? 'DARK' : 'LIGHT');
  }, [themeMode, detectedTheme, isDark]);

  // Carrega o tema salvo ao iniciar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['automatic', 'light', 'dark'].includes(savedTheme)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        setIsReady(true);
      }
    };

    loadTheme();
  }, []);

  // Salva o tema quando muda
  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  // Toggle entre light e dark (não afeta automatic)
  const toggleTheme = () => {
    if (themeMode === 'automatic') {
      setThemeMode(isDark ? 'light' : 'dark');
    } else {
      setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    }
  };

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        isDark,
        setThemeMode,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
