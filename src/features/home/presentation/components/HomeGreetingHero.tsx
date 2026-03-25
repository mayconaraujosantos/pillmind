import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { logger } from '@shared/utils/logger';

const AVATAR = 52;
const ICON_CIRCLE = 46;

function timeGreetingKey(): string {
  const h = new Date().getHours();
  if (h < 12) {
    return 'home.greetingMorning';
  }
  if (h < 18) {
    return 'home.greetingAfternoon';
  }
  return 'home.greetingEvening';
}

/**
 * Topo estilo apps de saúde de referência: avatar + saudação contextual + nome, sino com badge.
 */
export const HomeGreetingHero: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();
  const navigation = useNavigation();
  const auth = useAuthContext();

  const displayName = auth.user?.name?.trim() || t('account.user');
  const initial = displayName.charAt(0).toUpperCase();
  const pictureUrl = auth.displayPictureUrl;

  const openAccount = () => {
    navigation.getParent()?.navigate('AccountTab');
  };

  const onNotifications = () => {
    Alert.alert(
      t('home.notificationsA11y'),
      t('account.notificationsComingSoon')
    );
  };

  const chipBg = isDark ? theme.colors.surface : '#FFFFFF';
  const chipShadow = Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.06,
      shadowRadius: 8,
    },
    android: { elevation: 2 },
    default: {},
  });

  return (
    <View
      style={[styles.outer, { paddingTop: Math.max(insets.top, 8) }]}
      testID="home-greeting-hero"
    >
      <View style={styles.row}>
        <Pressable
          onPress={openAccount}
          style={({ pressed }) => [pressed && { opacity: 0.88 }]}
          accessibilityRole="button"
          accessibilityLabel={t('home.openProfileA11y')}
        >
          <View style={[styles.avatarChip, chipBgStyle(chipBg), chipShadow]}>
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            >
              {pictureUrl ? (
                <Image
                  source={{ uri: pictureUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                  onError={(e) => {
                    logger.warn('HomeGreetingHero', 'Avatar failed', {
                      uri: pictureUrl,
                      error: e.nativeEvent?.error,
                    });
                  }}
                />
              ) : (
                <Text style={styles.avatarLetter}>{initial}</Text>
              )}
            </View>
          </View>
        </Pressable>

        <View style={styles.textBlock}>
          <Text
            style={[styles.greetingLine, { color: theme.colors.textSecondary }]}
          >
            {t(timeGreetingKey())}
          </Text>
          <Text
            style={[styles.name, { color: theme.colors.text }]}
            numberOfLines={1}
            accessibilityRole="header"
          >
            {displayName}
          </Text>
        </View>

        <Pressable
          onPress={onNotifications}
          style={({ pressed }) => [pressed && { opacity: 0.88 }]}
          accessibilityRole="button"
          accessibilityLabel={t('home.notificationsA11y')}
          hitSlop={8}
        >
          <View style={[styles.bellCircle, chipBgStyle(chipBg), chipShadow]}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color={theme.colors.text}
            />
            <View
              style={[styles.badge, { borderColor: chipBg }]}
              accessibilityLabel={t('home.notificationBadgeA11y')}
            />
          </View>
        </Pressable>
      </View>
    </View>
  );
};

function chipBgStyle(bg: string) {
  return { backgroundColor: bg };
}

const styles = StyleSheet.create({
  outer: {
    marginBottom: 8,
    paddingHorizontal: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarChip: {
    width: AVATAR + 8,
    height: AVATAR + 8,
    borderRadius: (AVATAR + 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarLetter: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  textBlock: {
    flex: 1,
    minWidth: 0,
    paddingRight: 10,
  },
  greetingLine: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
    letterSpacing: 0.15,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  bellCircle: {
    width: ICON_CIRCLE,
    height: ICON_CIRCLE,
    borderRadius: ICON_CIRCLE / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: '#FF3B30',
    borderWidth: 2,
  },
});
