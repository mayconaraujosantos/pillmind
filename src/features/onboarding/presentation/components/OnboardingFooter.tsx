import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@shared/theme';
import { spacing } from '@shared/theme/spacing';
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
        <View style={styles.buttonRow}>
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
            borderColor={colors.PRIMARY}
            textColor={colors.PRIMARY}
            backgroundColor={colors.BACKGROUND}
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
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
    paddingTop: spacing.none,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  singleButtonContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  button: {
    flex: 1,
  },
});
