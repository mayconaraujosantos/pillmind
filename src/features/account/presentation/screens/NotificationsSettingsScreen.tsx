import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';

export const NotificationsSettingsScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
        {t('account.notificationsIntro')}
      </Text>
      <Text style={[styles.coming, { color: theme.colors.text }]}>
        {t('account.notificationsComingSoon')}
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  coming: {
    fontSize: 15,
    fontWeight: '600',
  },
});
