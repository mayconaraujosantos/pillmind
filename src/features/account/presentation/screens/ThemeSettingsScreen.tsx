import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@shared/theme';
import { ThemeSelector } from '@shared/components';

export const ThemeSettingsScreen: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.content}>
        <ThemeSelector />

        {/* Preview Section */}
        <View style={styles.previewSection}>
          <Text
            style={[styles.previewTitle, { color: theme.colors.text }]}
            testID="preview-title"
          >
            Pré-visualização
          </Text>

          <View
            style={[
              styles.previewCard,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <Text style={[styles.cardTitle, { color: theme.colors.text }]}>
              Título do Card
            </Text>
            <Text
              style={[
                styles.cardDescription,
                { color: theme.colors.textSecondary },
              ]}
            >
              Descrição do card com texto secundário
            </Text>

            <View style={styles.colorGrid}>
              <View style={styles.colorRow}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: theme.colors.primary },
                  ]}
                />
                <Text style={[styles.colorLabel, { color: theme.colors.text }]}>
                  Primary
                </Text>
              </View>

              <View style={styles.colorRow}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: theme.colors.secondary },
                  ]}
                />
                <Text style={[styles.colorLabel, { color: theme.colors.text }]}>
                  Secondary
                </Text>
              </View>

              <View style={styles.colorRow}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: theme.colors.success },
                  ]}
                />
                <Text style={[styles.colorLabel, { color: theme.colors.text }]}>
                  Success
                </Text>
              </View>

              <View style={styles.colorRow}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: theme.colors.error },
                  ]}
                />
                <Text style={[styles.colorLabel, { color: theme.colors.text }]}>
                  Error
                </Text>
              </View>

              <View style={styles.colorRow}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: theme.colors.warning },
                  ]}
                />
                <Text style={[styles.colorLabel, { color: theme.colors.text }]}>
                  Warning
                </Text>
              </View>

              <View style={styles.colorRow}>
                <View
                  style={[
                    styles.colorBox,
                    { backgroundColor: theme.colors.info },
                  ]}
                />
                <Text style={[styles.colorLabel, { color: theme.colors.text }]}>
                  Info
                </Text>
              </View>
            </View>
          </View>

          <Text
            style={[styles.modeInfo, { color: theme.colors.textSecondary }]}
            testID="mode-info"
          >
            Modo atual: {isDark ? 'Escuro' : 'Claro'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  previewSection: {
    marginTop: 32,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  previewCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  colorGrid: {
    gap: 12,
  },
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  colorBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  colorLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  modeInfo: {
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
