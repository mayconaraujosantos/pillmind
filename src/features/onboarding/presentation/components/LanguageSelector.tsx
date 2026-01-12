import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { saveLanguagePreference } from '@shared/i18n/i18n.config';
import { getOnboardingColors } from '../constants/onboarding.constants';
import { ResponsiveContainer, ResponsiveText, useResponsive, useResponsiveSpacing } from '@shared/responsive';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
}) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);
  const { wp, hp, rf, isSmallDevice, isTablet } = useResponsive();
  const spacing = useResponsiveSpacing();

  const currentLanguage = i18n.language;

  const handleLanguageChange = async (language: string) => {
    if (language !== currentLanguage) {
      await i18n.changeLanguage(language);
      await saveLanguagePreference(language);
      onLanguageChange?.(language);
    }
  };

  return (
    <ResponsiveContainer 
      variant="padded" 
      paddingVertical="md"
      style={styles.container}
    >
      <TouchableOpacity
        onPress={() => handleLanguageChange('pt-BR')}
        style={[
          {
            width: isTablet ? 60 : isSmallDevice ? 40 : 48,
            height: isTablet ? 60 : isSmallDevice ? 40 : 48,
            borderRadius: isTablet ? 30 : isSmallDevice ? 20 : 24,
            borderWidth: isTablet ? 3 : 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              currentLanguage === 'pt-BR'
                ? colors.PRIMARY + '20'
                : colors.SKIP_BUTTON_BG,
            borderColor:
              currentLanguage === 'pt-BR'
                ? colors.PRIMARY
                : colors.SKIP_BUTTON_BORDER,
            marginRight: spacing.pad('sm'),
          },
        ]}
        activeOpacity={0.7}
        accessibilityLabel="Selecionar Português"
        accessibilityRole="button"
      >
        <ResponsiveText style={{ fontSize: rf(24) }}>🇧🇷</ResponsiveText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleLanguageChange('en')}
        style={[
          {
            width: isTablet ? 60 : isSmallDevice ? 40 : 48,
            height: isTablet ? 60 : isSmallDevice ? 40 : 48,
            borderRadius: isTablet ? 30 : isSmallDevice ? 20 : 24,
            borderWidth: isTablet ? 3 : 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:
              currentLanguage === 'en'
                ? colors.PRIMARY + '20'
                : colors.SKIP_BUTTON_BG,
            borderColor:
              currentLanguage === 'en'
                ? colors.PRIMARY
                : colors.SKIP_BUTTON_BORDER,
          },
        ]}
        activeOpacity={0.7}
        accessibilityLabel="Select English"
        accessibilityRole="button"
      >
        <ResponsiveText style={{ fontSize: rf(24) }}>🇺🇸</ResponsiveText>
      </TouchableOpacity>
    </ResponsiveContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
