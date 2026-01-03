import { useEffect } from 'react';
import {
  useFonts as useGoogleFonts,
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
} from '@expo-google-fonts/roboto';

/**
 * Hook para carregar as fontes customizadas do aplicativo
 *
 * Este hook carrega todas as variantes da fonte Roboto necessárias
 * para o sistema de tipografia do PillMind usando @expo-google-fonts.
 *
 * @returns {Object} - Estado de carregamento das fontes
 * @returns {boolean} fontsLoaded - Se as fontes foram carregadas
 * @returns {Error | null} error - Erro durante o carregamento (se houver)
 */
export function useFonts() {
  const [fontsLoaded, error] = useGoogleFonts({
    'Roboto-Regular': Roboto_400Regular,
    'Roboto-Medium': Roboto_500Medium,
    'Roboto-Bold': Roboto_700Bold,
  });

  // If registration fails (e.g., duplicate font on iOS), warn and allow fallback to system fonts
  useEffect(() => {
    if (error) {
      console.warn(
        'Failed to load Roboto fonts, falling back to system fonts.',
        error
      );
    }
  }, [error]);

  return { fontsLoaded: fontsLoaded || Boolean(error), error: error || null };
}

/**
 * INSTRUÇÕES DE USO:
 *
 * 1. Para usar fontes locais (recomendado para produção):
 *    - Baixe os arquivos Roboto .ttf de https://fonts.google.com/specimen/Roboto
 *    - Coloque em assets/fonts/
 *    - Descomente a OPÇÃO 1 acima
 *
 * 2. Para usar @expo-google-fonts (mais fácil):
 *    - Execute: npx expo install @expo-google-fonts/roboto
 *    - Substitua este arquivo por:
 *
 *    import {
 *      useFonts as useGoogleFonts,
 *      Roboto_400Regular,
 *      Roboto_500Medium,
 *      Roboto_700Bold,
 *    } from '@expo-google-fonts/roboto';
 *
 *    export function useFonts() {
 *      const [fontsLoaded] = useGoogleFonts({
 *        'Roboto-Regular': Roboto_400Regular,
 *        'Roboto-Medium': Roboto_500Medium,
 *        'Roboto-Bold': Roboto_700Bold,
 *      });
 *      return { fontsLoaded, error: null };
 *    }
 *
 * 3. Para desenvolvimento (usando fontes do sistema):
 *    - Deixe como está (OPÇÃO 2)
 *    - No Android já terá Roboto
 *    - No iOS usará San Francisco (similar)
 */
