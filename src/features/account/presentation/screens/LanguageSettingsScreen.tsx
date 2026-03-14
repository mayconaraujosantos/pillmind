import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { saveLanguagePreference } from '@shared/i18n/i18n.config';
import { logger } from '@shared/utils/logger';

export const LanguageSettingsScreen: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const [isSaving, setIsSaving] = React.useState(false);

  const languageOptions = [
    {
      code: 'en',
      label: t('language.english') || 'English',
      subtitle: 'EN-US',
    },
    {
      code: 'pt-BR',
      label: t('language.portuguese') || 'Português (Brasil)',
      subtitle: 'PT-BR',
    },
  ] as const;

  const handleLanguageChange = async (
    language: (typeof languageOptions)[number]['code']
  ) => {
    if (language === i18n.language) {
      return;
    }

    setIsSaving(true);
    try {
      await i18n.changeLanguage(language);
      await saveLanguagePreference(language);
      logger.info('LanguageSettingsScreen', '✅ Language updated', {
        language,
      });
    } catch (error) {
      logger.error('LanguageSettingsScreen', '❌ Failed to update language', {
        error,
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        {t('account.languageSubtitle') || 'Select your preferred app language.'}
      </Text>

      {languageOptions.map((option) => {
        const isSelected = i18n.language === option.code;
        return (
          <TouchableOpacity
            key={option.code}
            style={[
              styles.option,
              {
                backgroundColor: theme.colors.surface,
                borderColor: isSelected
                  ? theme.colors.primary
                  : theme.colors.border,
                opacity: isSaving ? 0.7 : 1,
              },
            ]}
            onPress={() => void handleLanguageChange(option.code)}
            activeOpacity={0.75}
            disabled={isSaving}
            testID={`language-option-${option.code}`}
          >
            <View>
              <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                {option.label}
              </Text>
              <Text
                style={[
                  styles.optionSubtitle,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {option.subtitle}
              </Text>
            </View>
            {isSelected ? (
              <Text
                style={[styles.selectedBadge, { color: theme.colors.primary }]}
              >
                ✓
              </Text>
            ) : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  description: {
    fontSize: 14,
    marginBottom: 16,
  },
  option: {
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  optionSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  selectedBadge: {
    fontSize: 20,
    fontWeight: '700',
  },
});
