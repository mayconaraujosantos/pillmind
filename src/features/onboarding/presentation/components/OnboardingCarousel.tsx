import React, { forwardRef, useMemo } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { OnboardingStepComponent } from './OnboardingStep';
import { getOnboardingSteps } from '../helpers/onboarding-i18n.helper';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingCarouselProps {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  _onCreateAccount?: () => void;
  _onLogin?: () => void;
  onSignUpComplete?: () => void;
  onSignInComplete?: () => void;
  onGoToSignUpFromSignIn?: () => void;
  onGoToSignInFromSignUp?: () => void;
  onFinish?: () => void;
}

export const OnboardingCarousel = forwardRef<
  ScrollView,
  OnboardingCarouselProps
>(
  (
    {
      onScroll,
      _onCreateAccount,
      _onLogin,
      onSignUpComplete,
      onSignInComplete,
      onGoToSignUpFromSignIn,
      onGoToSignInFromSignUp,
      onFinish,
    },
    ref
  ) => {
    const { i18n } = useTranslation();
    // Regenera os steps quando o idioma mudar
    const steps = useMemo(() => getOnboardingSteps(), [i18n.language]);

    return (
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {steps.map((step) => (
          <View key={step.id} style={styles.stepContainer}>
            <OnboardingStepComponent
              step={step}
              onSignUpComplete={onSignUpComplete}
              onSignInComplete={onSignInComplete}
              onGoToSignUpFromSignIn={onGoToSignUpFromSignIn}
              onGoToSignInFromSignUp={onGoToSignInFromSignUp}
              onFinish={onFinish}
            />
          </View>
        ))}
      </ScrollView>
    );
  }
);

OnboardingCarousel.displayName = 'OnboardingCarousel';

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
});
