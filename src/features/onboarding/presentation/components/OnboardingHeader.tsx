import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import {
  getOnboardingColors,
  ONBOARDING_STEPS,
} from '../constants/onboarding.constants';
import { LanguageSelector } from './LanguageSelector';

interface OnboardingHeaderProps {
  onSkip: () => void;
  currentStep?: number;
  _totalSteps?: number;
}

export const OnboardingHeader: React.FC<OnboardingHeaderProps> = ({
  onSkip,
  currentStep = 0,
  _totalSteps = ONBOARDING_STEPS.length,
}) => {
  const { isDark } = useTheme();
  const { t } = useTranslation();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  // Oculta o botão Skip a partir do step 2
  // Mostrar apenas nos steps 0 e 1
  const shouldHideSkip = currentStep >= 2;

  if (shouldHideSkip) {
    return null;
  }

  return (
    <View style={styles.header}>
      <LanguageSelector />
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
          {t('common.skip')}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
