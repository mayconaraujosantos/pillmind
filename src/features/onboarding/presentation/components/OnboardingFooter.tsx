import React, { useMemo, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shared/theme';
import { logger } from '@shared/utils/logger';
import { adaptiveSpacing, deviceSize } from '@shared/utils/dimensions';
import { useTranslation } from '@shared/i18n';
import { getOnboardingColors } from '../constants/onboarding.constants';
import { OnboardingPrimaryButton } from './OnboardingPrimaryButton';
import { OnboardingSecondaryButton } from './OnboardingSecondaryButton';

interface OnboardingFooterProps {
  currentStep: number;
  onSignIn?: () => void;
  onSignUp?: () => void;
  onNext?: () => void;
  _onScroll?: () => void;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  currentStep,
  onSignIn,
  onSignUp,
  onNext,
  _onScroll,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  useEffect(() => {
    logger.debug('OnboardingFooter', 'Footer mounted', { currentStep });
  }, [currentStep]);

  logger.debug('OnboardingFooter', 'Footer rendering', { currentStep });

  // Step 0-1: Mostrar "Next"
  // Step 2 (último info): Mostrar "Create an account" e "Login"
  // Step 3-5: Não mostrar footer (SignUp, SignIn, Success)
  const shouldShowFooter = currentStep < 3;
  const isLastInfoScreen = currentStep === 2;

  if (!shouldShowFooter) {
    return null;
  }

  const handleNextPress = () => {
    onNext?.();
  };

  if (isLastInfoScreen) {
    return (
      <View style={styles.footer}>
        <View style={styles.buttonColumn}>
          <OnboardingPrimaryButton
            label={t('onboarding.buttons.createAccount')}
            onPress={onSignUp}
            backgroundColor={colors.PRIMARY}
            textColor={colors.BUTTON_TEXT}
            shadowColor={colors.PRIMARY}
            style={styles.button}
          />

          <OnboardingSecondaryButton
            label={t('onboarding.buttons.login')}
            onPress={onSignIn}
            textColor={colors.BUTTON_TEXT}
            backgroundColor={colors.PRIMARY}
            style={styles.button}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.footer}>
      <View style={styles.singleButtonContainer}>
        <OnboardingPrimaryButton
          label={t('common.next')}
          onPress={handleNextPress}
          backgroundColor={colors.PRIMARY}
          textColor={colors.BUTTON_TEXT}
          shadowColor={colors.PRIMARY}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: adaptiveSpacing.lg,
    paddingBottom: deviceSize(24, 32, 40),
    paddingTop: 0,
    marginTop: -20,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonColumn: {
    width: '100%',
    gap: 16,
  },
  singleButtonContainer: {
    flexDirection: 'row',
    gap: adaptiveSpacing.sm,
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
});
