import React from 'react';
import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { config } from '@core/config';

export const AboutScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const version = config.app.version ?? '—';
  const site = config.legal.websiteUrl;

  const openSite = async () => {
    if (!site) {
      Alert.alert(t('common.error'), t('account.aboutNoWebsite'));
      return;
    }
    if (await Linking.canOpenURL(site)) {
      await Linking.openURL(site);
    } else {
      Alert.alert(t('common.error'), t('account.aboutNoWebsite'));
    }
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {config.app.name}
      </Text>
      <Text style={[styles.version, { color: theme.colors.textSecondary }]}>
        {t('account.version')}: {version}
      </Text>
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
        {t('account.aboutApp')}
      </Text>
      {site ? (
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => void openSite()}
          activeOpacity={0.85}
        >
          <Text style={styles.buttonText}>{t('account.visitWebsite')}</Text>
        </TouchableOpacity>
      ) : null}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  version: {
    fontSize: 15,
    marginBottom: 20,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
