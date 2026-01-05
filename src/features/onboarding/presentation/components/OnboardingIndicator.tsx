import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shared/theme';
import {
  getOnboardingColors,
  ONBOARDING_STEPS,
} from '../constants/onboarding.constants';

interface OnboardingIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  totalSteps: _totalSteps,
  currentStep,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  // Mostrar apenas os 3 primeiros dots (telas de onboarding)
  // Desaparecer quando chegar nos formulários (step 3+)
  const INDICATOR_STEPS = 3;
  const shouldShowIndicator = currentStep < INDICATOR_STEPS;

  const steps = useMemo(() => ONBOARDING_STEPS.slice(0, INDICATOR_STEPS), []);

  if (!shouldShowIndicator) {
    return null;
  }

  return (
    <View style={styles.container}>
      {steps.map((step, index) => (
        <View
          key={step.id}
          style={[
            styles.dot,
            index === currentStep
              ? [styles.activeDot, { backgroundColor: colors.INDICATOR_ACTIVE }]
              : [
                  styles.inactiveDot,
                  { backgroundColor: colors.INDICATOR_INACTIVE },
                ],
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
  },
  inactiveDot: {},
});
