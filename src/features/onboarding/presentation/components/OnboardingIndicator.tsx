import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shared/theme';
import { getOnboardingColors } from '../constants/onboarding.constants';

interface OnboardingIndicatorProps {
  totalSteps: number;
  currentStep: number;
}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = ({
  totalSteps,
  currentStep,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
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
