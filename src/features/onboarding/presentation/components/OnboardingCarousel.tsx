import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { OnboardingStepComponent } from './OnboardingStep';
import { ONBOARDING_STEPS } from '../constants/onboarding.constants';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingCarouselProps {
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export const OnboardingCarousel: React.FC<OnboardingCarouselProps> = ({
  onScroll,
}) => {
  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={onScroll}
      scrollEventThrottle={16}
      style={styles.scrollView}
    >
      {ONBOARDING_STEPS.map((step) => (
        <View key={step.id} style={styles.stepContainer}>
          <OnboardingStepComponent step={step} />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
});
