import React, { useState, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View } from 'react-native';
import { AppNavigator } from '@core/navigation/AppNavigator';
import { SplashScreenComponent } from '@features/splash_screen';
import { OnboardingScreen } from '@features/onboarding';
import {
  AuthProvider,
  useAuthContext,
} from '@features/onboarding/presentation/contexts/AuthContext';
import { useOnboardingStorage } from '@features/onboarding/presentation/hooks/useOnboardingStorage';
import { FORCE_SHOW_ONBOARDING } from '@features/onboarding/presentation/constants/onboarding.constants';
import { configureGoogleSignIn } from '@features/onboarding/domain/services/oauth.service';
import { ThemeProvider } from '@shared/theme';
import { ThemedStatusBar, DebugConsole } from '@shared/components';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { useFonts } from '@shared/hooks';
import { logger } from '@shared/utils/logger';
import { logDeviceInfo } from '@shared/utils/dimensions';
import '@shared/i18n';

// TODO: Mover para variável de ambiente (.env)
const GOOGLE_WEB_CLIENT_ID =
  process.env.GOOGLE_WEB_CLIENT_ID ||
  'YOUR_GOOGLE_WEB_CLIENT_ID_HERE.apps.googleusercontent.com';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const { fontsLoaded } = useFonts();
  const {
    hasSeenOnboarding,
    isLoading: isLoadingOnboarding,
    markOnboardingAsSeen,
  } = useOnboardingStorage();

  // Configurar Google Sign-In ao iniciar o app
  useEffect(() => {
    try {
      configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID);
    } catch (error) {
      logger.error('App', '❌ Failed to configure Google Sign-In', { error });
    }
  }, []);

  const handleSplashFinish = () => {
    setIsAppReady(true);
  };

  const handleOnboardingFinish = () => {
    logger.info('App', '✅ Onboarding finished');
    markOnboardingAsSeen();
  };

  const handleOnboardingSkip = () => {
    logger.info('App', '⏭️ Onboarding skipped');
    markOnboardingAsSeen();
  };

  // Log app initialization
  logger.info('App', 'Application started');
  logDeviceInfo();

  // Aguardar carregamento das fontes
  if (!fontsLoaded) {
    logger.debug('App', 'Waiting for fonts to load...');
    // No iOS, retornar null pode causar problemas, então retornamos um componente vazio com SafeAreaProvider
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <SafeAreaProvider>
            <ThemedStatusBar />
          </SafeAreaProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  if (!isAppReady) {
    logger.debug('App', 'Showing splash screen');
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <SafeAreaProvider>
            <ThemedStatusBar />
            <SplashScreenComponent onFinish={handleSplashFinish} />
          </SafeAreaProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  // Aguardar carregar o estado do AsyncStorage antes de decidir se mostra onboarding
  if (isLoadingOnboarding) {
    logger.debug('App', 'Loading onboarding state from storage');
    return (
      <ErrorBoundary>
        <ThemeProvider>
          <SafeAreaProvider>
            <ThemedStatusBar />
          </SafeAreaProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  // Se FORCE_SHOW_ONBOARDING for true, sempre mostrar onboarding (útil para desenvolvimento/testes)
  // Em produção, definir FORCE_SHOW_ONBOARDING como false
  const shouldShowOnboarding = FORCE_SHOW_ONBOARDING || !hasSeenOnboarding;

  logger.debug(
    'App',
    `Onboarding state: shouldShow=${shouldShowOnboarding}, hasSeenOnboarding=${hasSeenOnboarding}, FORCE=${FORCE_SHOW_ONBOARDING}`
  );

  // Sempre renderizar AuthProvider primeiro para verificar autenticação
  // Isso permite que usuários autenticados pulem o onboarding mesmo se FORCE_SHOW_ONBOARDING for true
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <AppContentWithOnboarding
              shouldShowOnboarding={shouldShowOnboarding}
              onOnboardingFinish={handleOnboardingFinish}
              onOnboardingSkip={handleOnboardingSkip}
            />
          </AuthProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Componente que tem acesso ao AuthContext e decide o que mostrar
const AppContentWithOnboarding: React.FC<{
  shouldShowOnboarding: boolean;
  onOnboardingFinish: () => void;
  onOnboardingSkip: () => void;
}> = ({ shouldShowOnboarding, onOnboardingFinish, onOnboardingSkip }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Aguardar carregamento da autenticação
  if (isLoading) {
    return <ThemedStatusBar />;
  }

  // Se usuário estiver autenticado, ir direto para o app (pular onboarding)
  if (isAuthenticated) {
    logger.info('App', '🔐 User authenticated, rendering main app');
    return (
      <>
        <ThemedStatusBar />
        <AppNavigator />
        <DebugConsole />
      </>
    );
  }

  // Usuário não autenticado - mostrar onboarding se necessário
  if (shouldShowOnboarding) {
    logger.info('App', '📋 Rendering OnboardingScreen');
    const content = (
      <>
        <ThemedStatusBar />
        <OnboardingScreen
          onFinish={onOnboardingFinish}
          onSkip={onOnboardingSkip}
        />
      </>
    );

    // No iOS, envolver em View para garantir renderização correta
    if (Platform.OS === 'ios') {
      return <View style={{ flex: 1 }}>{content}</View>;
    }

    return <>{content}</>;
  }

  // Usuário já viu onboarding mas não está autenticado - mostrar tela de login
  // Permite que o usuário complete o fluxo de autenticação
  // Quando autenticado, o componente será re-renderizado e mostrará o AppNavigator
  logger.info('App', '📋 User has seen onboarding, showing login/signup');
  const content = (
    <>
      <ThemedStatusBar />
      <OnboardingScreen
        onFinish={onOnboardingFinish}
        onSkip={onOnboardingSkip}
      />
    </>
  );

  // No iOS, envolver em View para garantir renderização correta
  if (Platform.OS === 'ios') {
    return <View style={{ flex: 1 }}>{content}</View>;
  }

  return <>{content}</>;
};
