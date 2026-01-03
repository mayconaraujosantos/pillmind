import React, { useMemo, useRef, forwardRef } from 'react';
import {
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Platform,
  StatusBar as RNStatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@shared/theme';
import { OnboardingHeader } from './OnboardingHeader';
import { OnboardingCarousel } from './OnboardingCarousel';
import { OnboardingIndicator } from './OnboardingIndicator';
import { OnboardingFooter } from './OnboardingFooter';
import { getOnboardingColors } from '../constants/onboarding.constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingViewProps {
  currentStep: number;
  totalSteps: number;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  onSkip: () => void;
  onCreateAccount?: () => void;
  onLogin?: () => void;
  onSignUpComplete?: () => void;
  onSignInComplete?: () => void;
  onFinish?: () => void;
}

export const OnboardingView = forwardRef<ScrollView, OnboardingViewProps>(
  (
    {
      currentStep,
      totalSteps,
      onScroll,
      onSkip,
      onCreateAccount,
      onLogin,
      onSignUpComplete,
      onSignInComplete,
      onFinish,
    },
    ref
  ) => {
    const { isDark } = useTheme();
    const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);
    const localRef = useRef<ScrollView>(null);
    const scrollViewRef = ref || localRef;

    const handleNext = () => {
      const nextPosition = (currentStep + 1) * SCREEN_WIDTH;
      if (scrollViewRef && 'current' in scrollViewRef) {
        scrollViewRef.current?.scrollTo({
          x: nextPosition,
          animated: true,
        });
      }
    };

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

        <OnboardingHeader
          onSkip={onSkip}
          currentStep={currentStep}
          _totalSteps={totalSteps}
        />

        <OnboardingCarousel
          ref={scrollViewRef}
          onScroll={onScroll}
          _onCreateAccount={onCreateAccount}
          _onLogin={onLogin}
          onSignUpComplete={onSignUpComplete}
          onSignInComplete={onSignInComplete}
          onGoToSignUpFromSignIn={onCreateAccount}
          onGoToSignInFromSignUp={onLogin}
          onFinish={onFinish}
        />

        <View style={styles.indicatorContainer}>
          <OnboardingIndicator
            totalSteps={totalSteps}
            currentStep={currentStep}
          />
        </View>

        <OnboardingFooter
          currentStep={currentStep}
          onSignIn={onLogin}
          onSignUp={onCreateAccount}
          onNext={handleNext}
        />
      </View>
    );
  }
);

OnboardingView.displayName = 'OnboardingView';
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
