import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shared/theme';
import {
  getOnboardingColors,
  ONBOARDING_TEXTS,
} from '../constants/onboarding.constants';

interface OnboardingHeaderProps {
  onSkip: () => void;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onSkip,
}) => {
  const { isDark } = useTheme();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  return (
    <View style={styles.header}>
      <TouchableOpacity
        onPress={onSkip}
        style={[
          styles.skipButton,
          {
            backgroundColor: colors.SKIP_BUTTON_BG,
            borderColor: colors.SKIP_BUTTON_BORDER,
          },
        ]}
        activeOpacity={0.6}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        accessibilityLabel="Pular onboarding"
        accessibilityRole="button"
        accessibilityHint="Pula a introdução e vai direto para o app"
      >
        <Text style={[styles.skipText, { color: colors.SECONDARY }]}>
          {ONBOARDING_TEXTS.SKIP}
        </Text>
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
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
