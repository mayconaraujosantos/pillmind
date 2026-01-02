import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shared/theme';
import {
  getOnboardingColors,
  ONBOARDING_TEXTS,
} from '../constants/onboarding.constants';

interface OnboardingFooterProps {
  onSignIn: () => void;
  onSignUp: () => void;
}

export const OnboardingFooter: React.FC<OnboardingFooterProps> = ({
  onSignIn,
  onSignUp,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  return (
    <View style={styles.footer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onSignIn}
          style={[
            styles.button,
            styles.signInButton,
            { borderColor: colors.PRIMARY },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.PRIMARY }]}>
            {ONBOARDING_TEXTS.SIGN_IN}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSignUp}
          style={[
            styles.button,
            styles.signUpButton,
            {
              backgroundColor: colors.PRIMARY,
              shadowColor: colors.PRIMARY,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.BUTTON_TEXT }]}>
            {ONBOARDING_TEXTS.SIGN_UP}
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
});
