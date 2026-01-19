/*
 * ThemeProvider com suporte para Expo Go e Development Build
 *
 * LIMITAÇÕES CONHECIDAS:
 *
 * 🟢 DEVELOPMENT BUILD:
 * - Appearance.getColorScheme() funciona perfeitamente
 * - addChangeListener funciona para mudanças em tempo real
 * - Detecção automática de tema funciona 100%
 *
 * 🟡 EXPO GO:
 * - Appearance.getColorScheme() pode não funcionar
 * - addChangeListener pode falhar
 * - useColorScheme hook ainda funciona
 * - Mudanças de tema podem não ser detectadas em tempo real
 * - Funcionalidade básica de tema funciona, mas com limitações
 *
 * ESTRATÉGIA DE FALLBACK:
 * 1. Prioriza useColorScheme (funciona em ambos)
 * 2. Tenta Appearance.getColorScheme() como backup
 * 3. Usa try/catch para evitar crashes no Expo Go
 * 4. Fallback seguro para tema 'light' se tudo falhar
 */

import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useColorScheme, Appearance, Platform } from 'react-native';
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
  const [themeMode, setThemeMode] = useState<ThemeMode>('automatic');
  const [isReady, setIsReady] = useState(false);

  // Função robusta para detectar o tema do sistema (funciona em Expo Go e Development Build)
  const detectSystemTheme = useCallback((): 'light' | 'dark' => {
    let detectedScheme: string | null | undefined;
    let detectionMethod = 'unknown';

    // Estratégia específica para iOS (simulator e device)
    if (Platform.OS === 'ios') {
      try {
        // Para iOS, primeiro tenta Appearance.getColorScheme()
        const appearanceScheme = Appearance.getColorScheme();
        const hookScheme = systemColorScheme;

        // Se ambos concordam, usa o resultado
        if (appearanceScheme && hookScheme && appearanceScheme === hookScheme) {
          detectedScheme = appearanceScheme;
          detectionMethod = 'iOS-concordância';
        }
        // Se apenas um funciona, usa ele
        else if (appearanceScheme) {
          detectedScheme = appearanceScheme;
          detectionMethod = 'iOS-Appearance';
        } else if (hookScheme) {
          detectedScheme = hookScheme;
          detectionMethod = 'iOS-useColorScheme';
        }
        // Fallback específico para iOS
        else {
          detectedScheme = 'light';
          detectionMethod = 'iOS-fallback';
        }
      } catch (error) {
        console.warn(`[ThemeProvider] Erro na detecção iOS:`, error);
        detectedScheme = systemColorScheme || 'light';
        detectionMethod = 'iOS-erro';
      }
    }
    // Estratégia para Android e outras plataformas
    else {
      if (systemColorScheme) {
        detectedScheme = systemColorScheme;
        detectionMethod = 'useColorScheme';
      } else {
        try {
          detectedScheme = Appearance.getColorScheme();
          detectionMethod = 'Appearance';
        } catch (error) {
          console.warn(
            `[ThemeProvider] Appearance.getColorScheme() falhou:`,
            error
          );
          detectedScheme = 'light';
          detectionMethod = 'fallback';
        }
      }
    }

    const finalTheme = detectedScheme === 'dark' ? 'dark' : 'light';

    // Log detalhado para debug
    console.log(`[ThemeProvider] Detecção de tema:`);
    console.log(`  - Plataforma: ${Platform.OS}`);
    console.log(`  - Método usado: ${detectionMethod}`);
    console.log(`  - useColorScheme: ${systemColorScheme}`);
    console.log(
      `  - Appearance API: ${(() => {
        try {
          return Appearance.getColorScheme();
        } catch {
          return 'não disponível';
        }
      })()}`
    );
    console.log(`  - Tema final: ${finalTheme}`);

    return finalTheme;
  }, [systemColorScheme]);

  const [detectedTheme, setDetectedTheme] = useState<'light' | 'dark'>(() =>
    detectSystemTheme()
  );

  // Monitora mudanças no tema do sistema (com fallback para Expo Go e re-detecção para iOS)
  useEffect(() => {
    // Atualiza o tema detectado quando o sistema muda
    setDetectedTheme(detectSystemTheme());

    // Tenta adicionar listener para mudanças no tema do sistema
    // Pode falhar no Expo Go, então usamos try/catch
    let subscription: ReturnType<typeof Appearance.addChangeListener> | null =
      null;

    try {
      subscription = Appearance.addChangeListener(({ colorScheme }) => {
        const newTheme = colorScheme === 'dark' ? 'dark' : 'light';
        setDetectedTheme(newTheme);
        console.log(`[ThemeProvider] Sistema mudou para: ${newTheme}`);
      });
      console.log(
        `[ThemeProvider] Listener de mudança de tema ativo (Development Build)`
      );
    } catch (error) {
      console.warn(
        `[ThemeProvider] addChangeListener falhou (provavelmente Expo Go):`,
        error
      );
      console.log(
        `[ThemeProvider] Usando apenas useColorScheme para detectar mudanças`
      );
    }

    // Re-detecção específica para iOS após um delay (problema de timing no simulator)
    let timeoutId: NodeJS.Timeout;
    if (Platform.OS === 'ios') {
      timeoutId = setTimeout(() => {
        const reDetectedTheme = detectSystemTheme();
        console.log(`[ThemeProvider] 🔄 Re-detecção iOS: ${reDetectedTheme}`);
        setDetectedTheme(reDetectedTheme);
      }, 100); // 100ms de delay para permitir que o iOS termine a inicialização
    }

    return () => {
      if (subscription?.remove) {
        subscription.remove();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [detectSystemTheme, systemColorScheme]);

  // Determina se deve usar tema dark baseado no modo selecionado
  const isDark =
    themeMode === 'automatic' ? detectedTheme === 'dark' : themeMode === 'dark';

  const theme = createTheme(isDark);

  // Debug log com informações sobre o ambiente e iOS específico
  useEffect(() => {
    const environment = (() => {
      try {
        // Se Appearance.getColorScheme() funcionar, provavelmente é Development Build
        Appearance.getColorScheme();
        return 'Development Build';
      } catch {
        return 'Expo Go';
      }
    })();

    console.log(`[ThemeProvider] Ambiente detectado: ${environment}`);
    console.log(
      `[ThemeProvider] Modo: ${themeMode}, Sistema: ${detectedTheme}, isDark: ${isDark}`
    );

    // Debug específico para iOS
    if (Platform.OS === 'ios') {
      console.log(`[ThemeProvider] 🍎 iOS Debug:`);
      console.log(`  - Simulator/Device: ${__DEV__ ? 'Simulator' : 'Device'}`);
      console.log(`  - useColorScheme(): ${systemColorScheme}`);
      console.log(
        `  - Appearance.getColorScheme(): ${(() => {
          try {
            return Appearance.getColorScheme();
          } catch {
            return 'erro';
          }
        })()}`
      );
      console.log(`  - Tema final aplicado: ${isDark ? 'dark' : 'light'}`);

      // AVISO específico para iOS Simulator
      if (
        __DEV__ &&
        systemColorScheme === 'light' &&
        detectedTheme === 'light'
      ) {
        console.log(
          `[ThemeProvider] ⚠️  ATENÇÃO: iOS Simulator pode não sincronizar com macOS theme!`
        );
        console.log(
          `[ThemeProvider] 💡 SOLUÇÃO: Configure Dark Mode diretamente no iOS Simulator:`
        );
        console.log(
          `[ThemeProvider]    Settings > Display & Brightness > Dark`
        );
        console.log(
          `[ThemeProvider] 🧪 TESTE: Mude para modo 'dark' manual no app para testar`
        );
      }

      // Força uma re-verificação se houver inconsistência
      if (systemColorScheme && systemColorScheme !== detectedTheme) {
        console.log(
          `[ThemeProvider] ⚠️  iOS inconsistência detectada! Hook: ${systemColorScheme}, Detectado: ${detectedTheme}`
        );
        // Re-força a detecção
        setTimeout(() => {
          setDetectedTheme(detectSystemTheme());
        }, 50);
      }
    }
  }, [themeMode, detectedTheme, isDark, systemColorScheme, detectSystemTheme]);

  // Carrega o tema salvo ao iniciar
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['automatic', 'light', 'dark'].includes(savedTheme)) {
          setThemeMode(savedTheme as ThemeMode);
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
  const saveThemeMode = useCallback((mode: ThemeMode) => {
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
      .then(() => {
        setThemeMode(mode);
      })
      .catch((error) => {
        console.error('Error saving theme:', error);
      });
  }, []);

  // Toggle entre light e dark (não afeta automatic)
  const toggleTheme = useCallback(() => {
    if (themeMode === 'automatic') {
      setThemeMode(isDark ? 'light' : 'dark');
    } else {
      setThemeMode(themeMode === 'light' ? 'dark' : 'light');
    }
  }, [themeMode, isDark, setThemeMode]);

  const contextValue = useMemo(
    () => ({
      theme,
      themeMode,
      isDark,
      setThemeMode: saveThemeMode,
      toggleTheme,
    }),
    [theme, themeMode, isDark, saveThemeMode, toggleTheme]
  );

  if (!isReady) {
    return null;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};
