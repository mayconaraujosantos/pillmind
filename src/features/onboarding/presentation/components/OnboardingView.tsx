import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@shared/theme';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingCarousel } from './OnboardingCarousel';
import { OnboardingIndicator } from './OnboardingIndicator';
import { OnboardingFooter } from './OnboardingFooter';
import { getOnboardingColors } from '../constants/onboarding.constants';

interface OnboardingViewProps {
  currentStep: number;
  totalSteps: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onSkip: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({
  currentStep,
  totalSteps,
  onScroll,
  onSkip,
  onSignIn,
  onSignUp,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <StatusBar
        style={isDark ? 'light' : 'dark'}
        backgroundColor={colors.BACKGROUND}
      />
      {Platform.OS === 'android' && (
        <RNStatusBar
          barStyle={isDark ? 'light-content' : 'dark-content'}
          backgroundColor={colors.BACKGROUND}
          translucent={false}
          hidden={false}
        />
      )}

      <OnboardingHeader onSkip={onSkip} />

      <OnboardingCarousel onScroll={onScroll} />

      <View style={styles.indicatorContainer}>
        <OnboardingIndicator
          totalSteps={totalSteps}
          currentStep={currentStep}
        />
      </View>

      <OnboardingFooter onSignIn={onSignIn} onSignUp={onSignUp} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicatorContainer: {
    paddingVertical: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
});
