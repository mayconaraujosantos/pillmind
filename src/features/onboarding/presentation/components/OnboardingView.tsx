import React from 'react';
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingCarousel } from './OnboardingCarousel';
import { OnboardingIndicator } from './OnboardingIndicator';
import { OnboardingFooter } from './OnboardingFooter';
import { ONBOARDING_COLORS } from '../constants/onboarding.constants';

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
  return (
    <View style={styles.container}>
      <StatusBar style="dark" backgroundColor={ONBOARDING_COLORS.BACKGROUND} />
      {Platform.OS === 'android' && (
        <RNStatusBar
          barStyle="dark-content"
          backgroundColor={ONBOARDING_COLORS.BACKGROUND}
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
    backgroundColor: ONBOARDING_COLORS.BACKGROUND,
  },
  indicatorContainer: {
    paddingVertical: 24,
    paddingBottom: 32,
    alignItems: 'center',
  },
});
