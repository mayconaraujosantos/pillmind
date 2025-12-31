import React, { useState } from 'react';
import { Platform, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from '@core/navigation/AppNavigator';
import { SplashScreenComponent } from '@features/splash_screen';
import { OnboardingScreen } from '@features/onboarding';
import { useOnboardingStorage } from '@features/onboarding/presentation/hooks/useOnboardingStorage';
import { FORCE_SHOW_ONBOARDING } from '@features/onboarding/presentation/constants/onboarding.constants';

export default function App() {
  const [isAppReady, setIsAppReady] = useState(false);
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

  if (!isAppReady) {
    return (
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {Platform.OS === 'android' && (
          <RNStatusBar
            barStyle="dark-content"
            backgroundColor="#ffffff"
            translucent={false}
          />
        )}
        <SplashScreenComponent onFinish={handleSplashFinish} />
      </SafeAreaProvider>
    );
  }

  // Aguardar carregar o estado do AsyncStorage antes de decidir se mostra onboarding
  if (isLoadingOnboarding) {
    return (
      <SafeAreaProvider>
        <StatusBar style="auto" />
        {Platform.OS === 'android' && (
          <RNStatusBar
            barStyle="dark-content"
            backgroundColor="#ffffff"
            translucent={false}
          />
        )}
      </SafeAreaProvider>
    );
  }

  // Se FORCE_SHOW_ONBOARDING for true, sempre mostrar onboarding (útil para desenvolvimento/testes)
  // Em produção, definir FORCE_SHOW_ONBOARDING como false
  const shouldShowOnboarding = FORCE_SHOW_ONBOARDING || !hasSeenOnboarding;

  if (shouldShowOnboarding) {
    return (
      <SafeAreaProvider>
        <OnboardingScreen
          onFinish={handleOnboardingFinish}
          onSkip={handleOnboardingSkip}
        />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {Platform.OS === 'android' && (
        <RNStatusBar
          barStyle="dark-content"
          backgroundColor="#ffffff"
          translucent={false}
        />
      )}
      <AppNavigator />
    </SafeAreaProvider>
  );
}
