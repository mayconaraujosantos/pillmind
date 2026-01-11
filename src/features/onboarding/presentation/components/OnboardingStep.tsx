import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import {
  adaptiveSpacing,
  adaptiveFontSizes,
  deviceSize,
} from '@shared/utils/dimensions';
import { useTheme } from '@shared/theme';
import { logger } from '@shared/utils/logger';
import {
  OnboardingStep as OnboardingStepType,
  getOnboardingColors,
} from '../constants/onboarding.constants';
import { OnboardingSignUp } from './OnboardingSignUp';
import { OnboardingSignIn } from './OnboardingSignIn';
import { OnboardingSuccess } from './OnboardingSuccess';
import { OnboardingImage } from './OnboardingImage';

interface OnboardingStepProps {
  step: OnboardingStepType;
  onSignUpComplete?: () => void;
  onSignInComplete?: () => void;
  onGoToSignUpFromSignIn?: () => void;
  onGoToSignInFromSignUp?: () => void;
  onFinish?: () => void;
}

export const OnboardingStepComponent: React.FC<OnboardingStepProps> = ({
  step,
  onSignUpComplete,
  onSignInComplete,
  onGoToSignUpFromSignIn,
  onGoToSignInFromSignUp,
  onFinish,
}) => {
  // Hooks devem ser chamados no topo, antes de qualquer return
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  useEffect(() => {
    logger.debug('OnboardingStepComponent', 'Step component mounted', {
      stepId: step.id,
      stepTitle: step.title,
    });
  }, [step.id]);

  // Se for uma tela de signup, renderiza o componente de signup
  if (step.type === 'signup') {
    return (
      <OnboardingSignUp
        onSignUpComplete={onSignUpComplete}
        onGoToSignIn={onGoToSignInFromSignUp}
      />
    );
  }

  // Se for uma tela de signin, renderiza o componente de signin
  if (step.type === 'signin') {
    return (
      <OnboardingSignIn
        onSignInComplete={onSignInComplete}
        onGoToSignUp={onGoToSignUpFromSignIn}
      />
    );
  }

  // Se for uma tela de success, renderiza o componente de success
  if (step.type === 'success') {
    return <OnboardingSuccess onFinish={onFinish} />;
  }

  // Renderiza a tela informativa padrão
  const shouldShowImage = step.image !== undefined && step.image !== null;

  logger.debug('OnboardingStepComponent', 'Rendering step', {
    stepId: step.id,
    stepTitle: step.title,
    shouldShowImage,
    type: step.type,
  });

  return (
    <View style={styles.container}>
      {shouldShowImage && <OnboardingImage imageUrl={step.image!} />}
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
          {step.title}
        </Text>
        <Text style={[styles.description, { color: colors.TEXT_SECONDARY }]}>
          {step.description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: adaptiveSpacing.lg,
    paddingBottom: adaptiveSpacing.xs,
    paddingTop: adaptiveSpacing.sm,
  },
  textContainer: {
    width: '100%',
    paddingHorizontal: adaptiveSpacing.lg,
    alignItems: 'center',
    paddingTop: adaptiveSpacing.xs,
    paddingBottom: adaptiveSpacing.sm,
    minHeight: deviceSize(100, 120, 140),
  },
  title: {
    fontSize: adaptiveFontSizes.xl,
    fontWeight: '800',
    marginBottom: adaptiveSpacing.sm,
    textAlign: 'center',
    letterSpacing: 0.3,
    lineHeight: deviceSize(28, 32, 36),
    width: '100%',
  },
  description: {
    fontSize: adaptiveFontSizes.md,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: deviceSize(22, 24, 26),
    width: '100%',
    paddingHorizontal: adaptiveSpacing.xs,
  },
});
