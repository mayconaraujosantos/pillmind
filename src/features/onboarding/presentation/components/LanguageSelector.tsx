import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { saveLanguagePreference } from '@shared/i18n/i18n.config';
import { getOnboardingColors } from '../constants/onboarding.constants';

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
}) => {
  const { isDark } = useTheme();
  const { i18n } = useTranslation();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);

  const currentLanguage = i18n.language;

  const handleLanguageChange = async (language: string) => {
    if (language !== currentLanguage) {
      await i18n.changeLanguage(language);
      await saveLanguagePreference(language);
      onLanguageChange?.(language);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => handleLanguageChange('pt-BR')}
        style={[
          styles.flagButton,
          {
            backgroundColor:
              currentLanguage === 'pt-BR'
                ? colors.PRIMARY + '20'
                : colors.SKIP_BUTTON_BG,
            borderColor:
              currentLanguage === 'pt-BR'
                ? colors.PRIMARY
                : colors.SKIP_BUTTON_BORDER,
          },
        ]}
        activeOpacity={0.7}
        accessibilityLabel="Selecionar Português"
        accessibilityRole="button"
      >
        <Text style={styles.flag}>🇧🇷</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => handleLanguageChange('en')}
        style={[
          styles.flagButton,
          {
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
        <Text style={styles.flag}>🇺🇸</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  flagButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  flag: {
    fontSize: 24,
  },
});
