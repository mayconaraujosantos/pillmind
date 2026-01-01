import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper } from '@shared/components';
import { useTheme } from '@shared/theme';

export const NearbyScreen: React.FC = () => {
  const { theme } = useTheme();

  return (
    <ScreenWrapper>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Locais Próximos
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          Encontre farmácias e hospitais próximos
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
