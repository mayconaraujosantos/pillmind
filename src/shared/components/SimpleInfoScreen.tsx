import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { ScreenWrapper } from './ScreenWrapper';

interface SimpleInfoScreenProps {
  titleKey: string;
  subtitleKey: string;
}

export const SimpleInfoScreen: React.FC<SimpleInfoScreenProps> = ({
  titleKey,
  subtitleKey,
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <ScreenWrapper tabContentCanvas>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          {t(titleKey)}
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          {t(subtitleKey)}
        </Text>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
});
