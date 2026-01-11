import React, { useMemo, useRef, forwardRef, useEffect } from 'react';
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
import { adaptiveSpacing, deviceSize } from '@shared/utils/dimensions';
import { logger } from '@shared/utils/logger';
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

    useEffect(() => {
      logger.debug('OnboardingView', 'OnboardingView mounted', {
        currentStep,
        totalSteps,
        isDark,
      });
    }, []);

    const handleNext = () => {
      logger.debug('OnboardingView', 'Next button pressed');
      const nextPosition = (currentStep + 1) * SCREEN_WIDTH;
      if (scrollViewRef && 'current' in scrollViewRef) {
        scrollViewRef.current?.scrollTo({
          x: nextPosition,
          animated: true,
        });
      }
    };

    // Scroll sempre habilitado - apenas 3 telas no carousel
    const scrollEnabled = true;

    logger.debug('OnboardingView', 'Rendering OnboardingView', {
      backgroundColor: colors.BACKGROUND,
      isDark,
    });

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
          scrollEnabled={scrollEnabled}
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
    paddingVertical: adaptiveSpacing.md,
    alignItems: 'center',
    minHeight: deviceSize(60, 70, 80),
  },
});
