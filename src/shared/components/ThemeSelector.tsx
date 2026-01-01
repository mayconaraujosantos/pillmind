import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useTheme, ThemeMode } from '@shared/theme';

const THEME_OPTIONS: Array<{
  value: ThemeMode;
  label: string;
  description: string;
}> = [
  {
    value: 'automatic',
    label: 'Automático',
    description: 'Segue a configuração do sistema',
  },
  {
    value: 'light',
    label: 'Claro',
    description: 'Sempre usa o tema claro',
  },
  {
    value: 'dark',
    label: 'Escuro',
    description: 'Sempre usa o tema escuro',
  },
];

export const ThemeSelector: React.FC = () => {
  const { theme, themeMode, setThemeMode } = useTheme();

  return (
    <View style={styles.container}>
      <Text
        style={[styles.title, { color: theme.colors.text }]}
        testID="theme-selector-title"
      >
        Aparência
      </Text>

      <ScrollView style={styles.optionsContainer}>
        {THEME_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
              },
              themeMode === option.value && {
                borderColor: theme.colors.primary,
                borderWidth: 2,
              },
            ]}
            onPress={() => setThemeMode(option.value)}
            activeOpacity={0.7}
            testID={`theme-option-${option.value}`}
          >
            <View style={styles.optionContent}>
              <Text
                style={[
                  styles.optionLabel,
                  { color: theme.colors.text },
                  themeMode === option.value && styles.optionLabelSelected,
                ]}
              >
                {option.label}
              </Text>
              <Text
                style={[
                  styles.optionDescription,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {option.description}
              </Text>
            </View>

            {themeMode === option.value && (
              <View
                style={[
                  styles.checkmark,
                  { backgroundColor: theme.colors.primary },
                ]}
                testID={`theme-checkmark-${option.value}`}
              >
                <Text style={styles.checkmarkText}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  optionContent: {
    flex: 1,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionLabelSelected: {
    fontWeight: '700',
  },
  optionDescription: {
    fontSize: 14,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
