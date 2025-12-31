import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
  ONBOARDING_COLORS,
  ONBOARDING_TEXTS,
} from '../constants/onboarding.constants';

interface OnboardingHeaderProps {
  onSkip: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onSkip,
}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onSkip}
        style={styles.skipButton}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Pular onboarding"
        accessibilityRole="button"
        accessibilityHint="Pula a introdução e vai direto para o app"
      >
        <Text style={styles.skipText}>{ONBOARDING_TEXTS.SKIP}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 8,
    alignItems: 'flex-end',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  skipButton: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(142, 142, 147, 0.25)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  skipText: {
    fontSize: 14,
    color: ONBOARDING_COLORS.SECONDARY,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
