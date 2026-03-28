import { AppNavigator } from '@core/navigation/AppNavigator';
import { initializeMedicineReminderNotifications } from '@core/services/medicineReminderNotifications';
import { OnboardingScreen } from '@features/onboarding';
import { configureGoogleSignIn } from '@features/onboarding/domain/services/oauth.service';
import { FORCE_SHOW_ONBOARDING } from '@features/onboarding/presentation/constants/onboarding.constants';
import {
  AuthProvider,
  useAuthContext,
} from '@features/onboarding/presentation/contexts/AuthContext';
import { useOnboardingStorage } from '@features/onboarding/presentation/hooks/useOnboardingStorage';
import { SplashScreenComponent } from '@features/splash_screen';
import { ThemedStatusBar } from '@shared/components';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { useFonts } from '@shared/hooks';
import '@shared/i18n';
import { ThemeProvider, useTheme } from '@shared/theme';
import { logDeviceInfo, logger } from '@shared/utils';
import { crashReporter } from '@shared/utils/crashReporter';
import type { ErrorInfo } from 'react';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Google OAuth2 Client IDs
const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  'YOUR_GOOGLE_WEB_CLIENT_ID_HERE.apps.googleusercontent.com';

const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  'YOUR_GOOGLE_IOS_CLIENT_ID_HERE.apps.googleusercontent.com';

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
    logger.info('App', '🚀 App initializing');
    crashReporter.recordUserAction('App Started', { 
      platform: Platform.OS, 
      version: Platform.Version 
    });

    try {
      logger.debug('App', '🔑 Configuring Google Sign-In', {
        webClientId: GOOGLE_WEB_CLIENT_ID ? 'defined' : 'undefined',
        iosClientId: GOOGLE_IOS_CLIENT_ID ? 'defined' : 'undefined'
      });
      configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID);
      void initializeMedicineReminderNotifications();
      logger.info('App', '✅ Google Sign-In configured successfully');
    } catch (error) {
      logger.error('App', '❌ Failed to configure Google Sign-In', { error });
    }
  }, []);

  const handleSplashFinish = () => {
    logger.info('App', '🚀 Splash screen finished');
    crashReporter.recordUserAction('Splash Finished');
    setIsAppReady(true);
  };

  const handleOnboardingFinish = () => {
    logger.info('App', '✅ Onboarding finished');
    crashReporter.recordUserAction('Onboarding Completed');
    markOnboardingAsSeen();
  };

  const handleOnboardingSkip = () => {
    logger.info(
      'App',
      '⏭️ User skipped intro carousel (auth shown inside onboarding)'
    );
    crashReporter.recordUserAction('Onboarding Skipped');
  };

  const handleAppError = (error: Error, errorInfo: ErrorInfo) => {
    logger.error('App', '💥 Top-level app error', { 
      error: error.message,
      errorInfo 
    }, error);
    crashReporter.reportCrash(error, 'Top-level App Error', true);
  };

  // Log app initialization
  logger.info('App', 'Application started');
  logDeviceInfo();

  // Aguardar carregamento das fontes
  if (!fontsLoaded) {
    logger.debug('App', 'Waiting for fonts to load...');
    // No iOS, retornar null pode causar problemas, então retornamos um componente vazio com SafeAreaProvider
    return (
      <ErrorBoundary onError={handleAppError}>
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
      <ErrorBoundary onError={handleAppError}>
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
      <ErrorBoundary onError={handleAppError}>
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
    <ErrorBoundary onError={handleAppError}>
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
  const { theme } = useTheme();

  // Aguardar carregamento da autenticação
  if (isLoading) {
    return <ThemedStatusBar />;
  }

  // Se usuário estiver autenticado, ir direto para o app (pular onboarding)
  if (isAuthenticated) {
    logger.info('App', '🔐 User authenticated, rendering main app');
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ThemedStatusBar />
        <AppNavigator />
      </View>
    );
  }

  // Usuário não autenticado - mostrar onboarding se necessário
  if (shouldShowOnboarding) {
    logger.info('App', '📋 Rendering OnboardingScreen');
    const content = (
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <ThemedStatusBar />
        <OnboardingScreen
          onFinish={onOnboardingFinish}
          onSkip={onOnboardingSkip}
          startWithAuth={false}
        />
      </View>
    );

    // No iOS, envolver em View para garantir renderização correta
    if (Platform.OS === 'ios') {
      return content;
    }

    return content;
  }

  // Usuário já viu onboarding mas não está autenticado - mostrar tela de login
  // Permite que o usuário complete o fluxo de autenticação
  // Quando autenticado, o componente será re-renderizado e mostrará o AppNavigator
  logger.info('App', '📋 User has seen onboarding, showing login/signup');
  const content = (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ThemedStatusBar />
      <OnboardingScreen
        onFinish={onOnboardingFinish}
        onSkip={onOnboardingSkip}
        startWithAuth
      />
    </View>
  );

  // No iOS, envolver em View para garantir renderização correta
  if (Platform.OS === 'ios') {
    return content;
  }

  return content;
};
