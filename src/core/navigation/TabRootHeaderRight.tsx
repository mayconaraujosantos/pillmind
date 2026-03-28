import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import React from 'react';
import { Platform, Pressable, StyleSheet, View } from 'react-native';

const HIT = 44;

/**
 * Ações no canto superior direito (estilo toolbar: ícone sem caixa, área de toque 44pt).
 */
export const TabRootHeaderRight: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();

  const ripple =
    Platform.OS === 'android'
      ? { color: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)' }
      : undefined;

  const openProfile = () => {
    navigation.getParent()?.navigate('AccountTab');
  };

  const onNotifications = () => {
    navigation.getParent()?.navigate(
      'AccountTab' as never,
      { screen: 'NotificationsSettings' } as never
    );
  };

  return (
    <View style={styles.row}>
      <Pressable
        android_ripple={ripple}
        style={({ pressed }) => [
          styles.hit,
          pressed && {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)',
          },
        ]}
        onPress={onNotifications}
        accessibilityRole="button"
        accessibilityLabel={t('home.notificationsA11y')}
      >
        <Ionicons
          name="notifications-outline"
          size={24}
          color={theme.colors.text}
        />
      </Pressable>
      <Pressable
        android_ripple={ripple}
        style={({ pressed }) => [
          styles.hit,
          pressed && {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.08)'
              : 'rgba(0,0,0,0.05)',
          },
        ]}
        onPress={openProfile}
        accessibilityRole="button"
        accessibilityLabel={t('home.openProfileA11y')}
      >
        <Ionicons name="person-outline" size={24} color={theme.colors.text} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 2,
  },
  hit: {
    width: HIT,
    height: HIT,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: HIT / 2,
  },
});
