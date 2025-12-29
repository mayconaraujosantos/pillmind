import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  ONBOARDING_COLORS,
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
  return (
    <View style={styles.footer}>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={onSignIn}
          style={[styles.button, styles.signInButton]}
        >
          <Text style={styles.signInButtonText}>
            {ONBOARDING_TEXTS.SIGN_IN}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onSignUp}
          style={[styles.button, styles.signUpButton]}
        >
          <Text style={styles.signUpButtonText}>
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
  signInButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: ONBOARDING_COLORS.PRIMARY,
  },
  signInButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: ONBOARDING_COLORS.PRIMARY,
    letterSpacing: 0.5,
  },
  signUpButton: {
    backgroundColor: ONBOARDING_COLORS.PRIMARY,
    shadowColor: ONBOARDING_COLORS.PRIMARY,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  signUpButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: ONBOARDING_COLORS.BUTTON_TEXT,
    letterSpacing: 0.5,
  },
});
