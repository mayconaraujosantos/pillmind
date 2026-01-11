import React, { forwardRef, useMemo, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { logger } from '@shared/utils/logger';
import { OnboardingStepComponent } from './OnboardingStep';
import { getOnboardingSteps } from '../helpers/onboarding-i18n.helper';
import { deviceSize, hp, SCREEN_HEIGHT } from '@shared/utils/dimensions';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Altura adaptativa baseada na razão de aspecto da tela
// Aumentada para acomodar imagem + título + descrição
const aspectRatio = SCREEN_HEIGHT / SCREEN_WIDTH;
const CAROUSEL_HEIGHT =
  aspectRatio > 2
    ? hp(deviceSize(58, 62, 65)) // Telas longas (aspect ratio > 2)
    : hp(deviceSize(55, 58, 62)); // Telas normais

interface OnboardingCarouselProps {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  scrollEnabled?: boolean;
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
      scrollEnabled = true,
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
    // Regenera os steps quando o idioma mudar (apenas 3 telas info)
    const steps = useMemo(() => getOnboardingSteps(), [i18n.language]);

    useEffect(() => {
      logger.debug('OnboardingCarousel', 'Carousel mounted', {
        stepsCount: steps.length,
        carouselHeight: CAROUSEL_HEIGHT,
        screenWidth: SCREEN_WIDTH,
      });
    }, [steps.length]);

    logger.debug('OnboardingCarousel', 'Rendering carousel', {
      stepsCount: steps.length,
      scrollEnabled,
    });

    return (
      <ScrollView
        ref={ref}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
        scrollEnabled={scrollEnabled}
        style={styles.scrollView}
        contentContainerStyle={styles.content}
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
    flex: 0,
    height: CAROUSEL_HEIGHT,
  },
  content: {
    alignItems: 'center',
  },
  stepContainer: {
    width: SCREEN_WIDTH,
    flex: 0,
  },
});
