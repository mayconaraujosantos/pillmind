import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shared/theme';
import { logger } from '@shared/utils/logger';
import { adaptiveSpacing, deviceSize } from '@shared/utils/dimensions';
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

  useEffect(() => {
    logger.debug('OnboardingIndicator', 'Indicator state', {
      currentStep,
      shouldShowIndicator,
      stepsCount: steps.length,
    });
  }, [currentStep, steps.length]);

  if (!shouldShowIndicator) {
    logger.debug('OnboardingIndicator', 'Indicator hidden');
    return null;
  }

  logger.debug('OnboardingIndicator', 'Indicator rendering');
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
    gap: adaptiveSpacing.xs,
    paddingBottom: adaptiveSpacing.xs,
  },
  dot: {
    width: deviceSize(6, 8, 10),
    height: deviceSize(6, 8, 10),
    borderRadius: deviceSize(3, 4, 5),
  },
  activeDot: {
    width: deviceSize(20, 24, 28),
  },
  inactiveDot: {},
});
