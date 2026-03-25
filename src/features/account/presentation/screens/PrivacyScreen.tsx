import React from 'react';
import {
  View,
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

export const PrivacyScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const url = config.legal.privacyPolicyUrl;

  const openPolicy = async () => {
    if (!url) {
      Alert.alert(t('common.error'), t('account.privacyNoLink'));
      return;
    }
    const ok = await Linking.canOpenURL(url);
    if (!ok) {
      Alert.alert(t('common.error'), t('account.privacyNoLink'));
      return;
    }
    await Linking.openURL(url);
  };

  return (
    <ScrollView
      style={[styles.scroll, { backgroundColor: theme.colors.background }]}
      contentContainerStyle={styles.content}
    >
      <Text style={[styles.body, { color: theme.colors.textSecondary }]}>
        {t('account.privacyIntro')}
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: url ? theme.colors.primary : theme.colors.surface,
            borderWidth: url ? 0 : StyleSheet.hairlineWidth,
            borderColor: theme.colors.border,
          },
        ]}
        onPress={() => void openPolicy()}
        activeOpacity={0.85}
      >
        <Text
          style={[
            styles.buttonText,
            { color: url ? '#FFFFFF' : theme.colors.textSecondary },
          ]}
        >
          {t('account.openPrivacyPolicy')}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },
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
    fontSize: 16,
    fontWeight: '600',
  },
});
