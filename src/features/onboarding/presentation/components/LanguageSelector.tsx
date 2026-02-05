import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { saveLanguagePreference } from '@shared/i18n/i18n.config';
import { getOnboardingColors } from '../constants/onboarding.constants';
import {
  deviceSize,
  adaptiveSpacing,
  adaptiveFontSizes,
} from '@shared/utils/dimensions';

interface Language {
  code: string;
  name: string;
  flag: string;
  nativeName: string;
}

interface LanguageSelectorProps {
  onLanguageChange?: (language: string) => void;
}

const AVAILABLE_LANGUAGES: Language[] = [
  {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)',
    flag: '🇧🇷',
    nativeName: 'PT-BR',
  },
  { code: 'en', name: 'English (US)', flag: '🇺🇸', nativeName: 'EN-US' },
  // Easy to add more languages:
  // { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'ES' },
  // { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'FR' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  onLanguageChange,
}) => {
  const { isDark } = useTheme();
  const { i18n, t } = useTranslation();
  const colors = useMemo(() => getOnboardingColors(isDark), [isDark]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const currentLanguage = i18n.language;
  const selectedLanguage =
    AVAILABLE_LANGUAGES.find((lang) => lang.code === currentLanguage) ||
    AVAILABLE_LANGUAGES[0];

  const handleLanguageChange = async (language: string) => {
    if (language !== currentLanguage) {
      await i18n.changeLanguage(language);
      await saveLanguagePreference(language);
      onLanguageChange?.(language);
    }
    setIsDropdownVisible(false);
  };

  const renderLanguageItem = ({ item }: { item: Language }) => (
    <TouchableOpacity
      style={[
        styles.dropdownItem,
        {
          backgroundColor:
            item.code === currentLanguage
              ? colors.PRIMARY + '10'
              : 'transparent',
          borderBottomColor: colors.TEXT_SECONDARY + '20',
        },
      ]}
      onPress={() => handleLanguageChange(item.code)}
      activeOpacity={0.7}
    >
      <View style={styles.languageInfo}>
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={styles.textContainer}>
          <Text style={[styles.languageName, { color: colors.TEXT_PRIMARY }]}>
            {item.nativeName}
          </Text>
          <Text
            style={[styles.languageSubName, { color: colors.TEXT_SECONDARY }]}
          >
            {item.name}
          </Text>
        </View>
      </View>
      {item.code === currentLanguage && (
        <Ionicons name="checkmark" size={20} color={colors.PRIMARY} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsDropdownVisible(true)}
        style={[
          styles.selectorButton,
          {
            backgroundColor: colors.SKIP_BUTTON_BG,
            borderColor: colors.SKIP_BUTTON_BORDER,
          },
        ]}
        activeOpacity={0.7}
        accessibilityLabel={`Current language: ${selectedLanguage.nativeName}`}
        accessibilityRole="button"
        accessibilityHint="Tap to change language"
      >
        <View style={styles.selectedLanguage}>
          <Text style={styles.selectedFlag}>{selectedLanguage.flag}</Text>
          <Text
            style={[styles.selectedText, { color: colors.TEXT_PRIMARY }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {selectedLanguage.nativeName}
          </Text>
        </View>
        <Ionicons name="chevron-down" size={16} color={colors.TEXT_SECONDARY} />
      </TouchableOpacity>

      <Modal
        visible={isDropdownVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDropdownVisible(false)}
        >
          <View
            style={[
              styles.dropdown,
              {
                backgroundColor: colors.BACKGROUND,
                borderColor: colors.TEXT_SECONDARY + '30',
                shadowColor: colors.TEXT_PRIMARY,
              },
            ]}
          >
            <Text
              style={[styles.dropdownTitle, { color: colors.TEXT_PRIMARY }]}
            >
              {t('common.selectLanguage')}
            </Text>
            <FlatList
              data={AVAILABLE_LANGUAGES}
              renderItem={renderLanguageItem}
              keyExtractor={(item) => item.code}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: adaptiveSpacing.md,
    paddingVertical: 8, // Fixed padding for consistent spacing
    borderRadius: deviceSize(20, 22, 24),
    borderWidth: deviceSize(1.5, 2, 2),
    minWidth: deviceSize(120, 130, 140),
    height: deviceSize(44, 46, 48), // Match skip button height
  },
  selectedLanguage: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'flex-start',
    minWidth: 0,
  },
  selectedFlag: {
    fontSize: adaptiveFontSizes.lg, // Back to larger size
    marginRight: adaptiveSpacing.xs,
    textAlign: 'center',
  },
  selectedText: {
    fontSize: adaptiveFontSizes.sm,
    fontWeight: '500',
    flexShrink: 1, // Allow text to shrink if needed
    lineHeight: adaptiveFontSizes.sm * 1.1, // Moderate line height
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdown: {
    minWidth: deviceSize(280, 320, 360),
    maxHeight: deviceSize(300, 350, 400),
    borderRadius: deviceSize(16, 18, 20),
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },
  dropdownTitle: {
    fontSize: adaptiveFontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
    paddingVertical: adaptiveSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: adaptiveSpacing.md,
    paddingVertical: adaptiveSpacing.md,
    borderBottomWidth: 0.5,
    minHeight: 56, // Adequate height for flags
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: adaptiveFontSizes.lg, // Back to original size
    marginRight: adaptiveSpacing.md,
    textAlign: 'center',
  },
  textContainer: {
    flex: 1,
  },
  languageName: {
    fontSize: adaptiveFontSizes.sm,
    fontWeight: '500',
    marginBottom: 2,
    lineHeight: adaptiveFontSizes.sm * 1.1, // Moderate line height
  },
  languageSubName: {
    fontSize: adaptiveFontSizes.xs,
    fontWeight: '400',
  },
});
