import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { logger } from '@shared/utils/logger';
import { adaptiveSpacing, deviceSize } from '@shared/utils/dimensions';
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
    logger.debug('OnboardingHeader', 'Header hidden (shouldHideSkip)');
    return null;
  }

  return (
    <View style={styles.header}>
      <View style={styles.content}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: adaptiveSpacing.lg,
    paddingBottom: 8,
    alignItems: 'center',
    zIndex: 1,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
  },
  skipButton: {
    paddingHorizontal: adaptiveSpacing.md,
    height: deviceSize(44, 46, 48), // Match LanguageSelector height
    borderRadius: deviceSize(20, 22, 24),
    borderWidth: deviceSize(1.5, 2, 2),
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
    lineHeight: 14 * 1.1, // Moderate line height
  },
});
