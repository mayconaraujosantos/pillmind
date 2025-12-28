import { useEffect, useState } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SPLASH_SCREEN_CONFIG } from '../constants/splashScreen.constants';

interface UseSplashScreenOptions {
  minimumDisplayTime?: number;
  onFinish?: () => void;
}

// Prevenir que a splash screen nativa seja escondida automaticamente
// Conforme documentação: https://docs.expo.dev/develop/user-interface/splash-screen-and-app-icon/
SplashScreen.preventAutoHideAsync();

export const useSplashScreen = (options: UseSplashScreenOptions = {}) => {
  const {
    minimumDisplayTime = SPLASH_SCREEN_CONFIG.MINIMUM_DISPLAY_TIME,
    onFinish,
  } = options;
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Aqui você pode adicionar inicializações do app:
        // - Carregar fontes
        // - Carregar dados iniciais
        // - Verificar autenticação
        // - Inicializar serviços

        // Simular tempo mínimo de exibição
        await new Promise((resolve) => setTimeout(resolve, minimumDisplayTime));

        setIsAppReady(true);
      } catch (e) {
        console.warn('Error during splash screen preparation:', e);
        setIsAppReady(true);
      } finally {
        setIsSplashReady(true);
      }
    }

    prepare();
  }, [minimumDisplayTime]);

  const hideSplashScreen = async () => {
    if (isSplashReady && isAppReady) {
      try {
        // Esconder a splash screen nativa quando o app estiver pronto
        // Conforme documentação do Expo
        await SplashScreen.hideAsync();
        onFinish?.();
      } catch (e) {
        console.warn('Error hiding splash screen:', e);
        onFinish?.();
      }
    }
  };

  useEffect(() => {
    if (isSplashReady && isAppReady) {
      hideSplashScreen();
    }
  }, [isSplashReady, isAppReady]);

  return {
    isAppReady: isAppReady && isSplashReady,
    isSplashReady,
  };
};
