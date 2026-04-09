import { initializeMedicineReminderNotifications } from '@core/services/medicineReminderNotifications';
import { configureGoogleSignIn } from '@features/onboarding/domain/services/oauth.service';
import { AuthProvider } from '@features/onboarding/presentation/contexts/AuthContext';
import { useOnboardingStorage } from '@features/onboarding/presentation/hooks/useOnboardingStorage';
import { SplashScreenComponent } from '@features/splash_screen';
import { ThemedStatusBar } from '@shared/components';
import { ErrorBoundary } from '@shared/components/ErrorBoundary';
import { useFonts } from '@shared/hooks';
import '@shared/i18n';
import { ThemeProvider } from '@shared/theme';
import { logDeviceInfo, logger } from '@shared/utils';
import { crashReporter } from '@shared/utils/crashReporter';
import { Stack } from 'expo-router';
import type { ErrorInfo } from 'react';
import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ||
  'YOUR_GOOGLE_WEB_CLIENT_ID_HERE.apps.googleusercontent.com';

const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ||
  'YOUR_GOOGLE_IOS_CLIENT_ID_HERE.apps.googleusercontent.com';

export default function RootLayout() {
  const [isAppReady, setIsAppReady] = useState(false);
  const { fontsLoaded } = useFonts();
  const { isLoading: isLoadingOnboarding } = useOnboardingStorage();

  logger.info('App', 'Application started');
  logDeviceInfo();

  useEffect(() => {
    logger.info('App', '🚀 App initializing');
    crashReporter.recordUserAction('App Started', {
      platform: Platform.OS,
      version: Platform.Version,
    });
    try {
      logger.debug('App', '🔑 Configuring Google Sign-In');
      configureGoogleSignIn(GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID);
      void initializeMedicineReminderNotifications();
      logger.info('App', '✅ Google Sign-In configured successfully');
    } catch (error) {
      logger.error('App', '❌ Failed to configure Google Sign-In', { error });
    }
  }, []);

  const handleAppError = (error: Error, errorInfo: ErrorInfo) => {
    logger.error(
      'App',
      '💥 Top-level app error',
      { error: error.message, errorInfo },
      error
    );
    crashReporter.reportCrash(error, 'Top-level App Error', true);
  };

  if (!fontsLoaded || isLoadingOnboarding) {
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
    return (
      <ErrorBoundary onError={handleAppError}>
        <ThemeProvider>
          <SafeAreaProvider>
            <ThemedStatusBar />
            <SplashScreenComponent
              onFinish={() => {
                logger.info('App', '🚀 Splash screen finished');
                crashReporter.recordUserAction('Splash Finished');
                setIsAppReady(true);
              }}
            />
          </SafeAreaProvider>
        </ThemeProvider>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary onError={handleAppError}>
      <ThemeProvider>
        <SafeAreaProvider>
          <AuthProvider>
            <ThemedStatusBar />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="(auth)" />
              <Stack.Screen
                name="medicine-form"
                options={{ headerShown: true }}
              />
              <Stack.Screen name="schedule" />
            </Stack>
          </AuthProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
