import { OnboardingScreen } from '@features/onboarding';
import { FORCE_SHOW_ONBOARDING } from '@features/onboarding/presentation/constants/onboarding.constants';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { useOnboardingStorage } from '@features/onboarding/presentation/hooks/useOnboardingStorage';
import { ThemedStatusBar } from '@shared/components';
import { useTheme } from '@shared/theme';
import { logger } from '@shared/utils';
import { crashReporter } from '@shared/utils/crashReporter';
import { Redirect } from 'expo-router';
import { View } from 'react-native';

export default function OnboardingRoute() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const { hasSeenOnboarding, markOnboardingAsSeen } = useOnboardingStorage();
  const { theme } = useTheme();

  if (isLoading) return null;

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  const shouldShowOnboarding = FORCE_SHOW_ONBOARDING || !hasSeenOnboarding;

  const handleFinish = () => {
    logger.info('App', '✅ Onboarding finished');
    crashReporter.recordUserAction('Onboarding Completed');
    markOnboardingAsSeen();
  };

  const handleSkip = () => {
    logger.info(
      'App',
      '⏭️ User skipped intro carousel (auth shown inside onboarding)'
    );
    crashReporter.recordUserAction('Onboarding Skipped');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ThemedStatusBar />
      <OnboardingScreen
        onFinish={handleFinish}
        onSkip={handleSkip}
        startWithAuth={!shouldShowOnboarding}
      />
    </View>
  );
}
