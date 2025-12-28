import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ONBOARDING_COLORS } from '../constants/onboarding.constants';

interface OnboardingIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  totalSteps,
  currentStep,
}) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            index === currentStep ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    width: 24,
    backgroundColor: ONBOARDING_COLORS.INDICATOR_ACTIVE,
  },
  inactiveDot: {
    backgroundColor: ONBOARDING_COLORS.INDICATOR_INACTIVE,
  },
});
