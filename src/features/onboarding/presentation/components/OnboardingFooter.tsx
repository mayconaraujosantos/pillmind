import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { getOnboardingColors } from '../constants/onboarding.constants';

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
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={onSignUp}
            style={[
              styles.button,
              styles.createButton,
              {
                backgroundColor: colors.PRIMARY,
                shadowColor: colors.PRIMARY,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: colors.BUTTON_TEXT }]}>
              {t('onboarding.buttons.createAccount')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onSignIn}
            style={[
              styles.button,
              styles.loginButton,
              { borderColor: colors.PRIMARY },
            ]}
          >
            <Text style={[styles.buttonText, { color: colors.PRIMARY }]}>
              {t('onboarding.buttons.login')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.footer}>
      <View style={styles.buttonContainerNext}>
        <TouchableOpacity
          onPress={handleNextPress}
          style={[
            styles.button,
            styles.nextButton,
            {
              backgroundColor: colors.PRIMARY,
              shadowColor: colors.PRIMARY,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.BUTTON_TEXT }]}>
            {t('common.next')}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  buttonContainerNext: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  button: {
    flex: 1,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  // Estilo base para texto dos botões
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  signUpButton: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  createButton: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  loginButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
  nextButton: {
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
