import React, { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@core/navigation/AppNavigator';
import { SplashScreenComponent } from '@features/splash_screen';
import { OnboardingScreen } from '@features/onboarding';
import { useOnboardingStorage } from '@features/onboarding/presentation/hooks/useOnboardingStorage';
import { FORCE_SHOW_ONBOARDING } from '@features/onboarding/presentation/constants/onboarding.constants';
import { ThemeProvider } from '@shared/theme';
import { ThemedStatusBar } from '@shared/components';
import { useFonts } from '@shared/hooks';
import '@shared/i18n';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
  const { fontsLoaded } = useFonts();
  const {
    hasSeenOnboarding,
    isLoading: isLoadingOnboarding,
    markOnboardingAsSeen,
  } = useOnboardingStorage();

  const handleSplashFinish = () => {
    setIsAppReady(true);
  };

  const handleOnboardingFinish = () => {
    markOnboardingAsSeen();
  };

  const handleOnboardingSkip = () => {
    markOnboardingAsSeen();
  };

  // Aguardar carregamento das fontes
  if (!fontsLoaded) {
    return null; // Ou um loading screen
  }

  if (!isAppReady) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemedStatusBar />
          <SplashScreenComponent onFinish={handleSplashFinish} />
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  // Aguardar carregar o estado do AsyncStorage antes de decidir se mostra onboarding
  if (isLoadingOnboarding) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemedStatusBar />
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  // Se FORCE_SHOW_ONBOARDING for true, sempre mostrar onboarding (útil para desenvolvimento/testes)
  // Em produção, definir FORCE_SHOW_ONBOARDING como false
  const shouldShowOnboarding = FORCE_SHOW_ONBOARDING || !hasSeenOnboarding;

  if (shouldShowOnboarding) {
    return (
      <ThemeProvider>
        <SafeAreaProvider>
          <ThemedStatusBar />
          <OnboardingScreen
            onFinish={handleOnboardingFinish}
            onSkip={handleOnboardingSkip}
          />
        </SafeAreaProvider>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <ThemedStatusBar />
        <AppNavigator />
      </SafeAreaProvider>
    </ThemeProvider>
  );
}
