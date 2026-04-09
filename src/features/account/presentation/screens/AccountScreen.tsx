import { Ionicons } from '@expo/vector-icons';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { useAuth } from '@features/onboarding/presentation/hooks/useAuth';
import { ThemeSelector } from '@shared/components';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { logger } from '@shared/utils/logger';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Appearance,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export const AccountScreen: React.FC = () => {
  const { theme, isDark, themeMode } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const authContext = useAuthContext();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const displayPictureUrl = authContext.displayPictureUrl;

  const settingsOptions: {
    key: string;
    label: string;
    icon: React.ComponentProps<typeof Ionicons>['name'];
    onPress: () => void;
  }[] = [
    {
      key: 'notifications',
      label: t('account.notifications'),
      icon: 'notifications-outline',
      onPress: () => router.push('/(tabs)/account/notifications'),
    },
    {
      key: 'privacy',
      label: t('account.privacy'),
      icon: 'shield-checkmark-outline',
      onPress: () => router.push('/(tabs)/account/privacy'),
    },
    {
      key: 'about',
      label: t('account.about'),
      icon: 'information-circle-outline',
      onPress: () => router.push('/(tabs)/account/about'),
    },
  ];

  const pageBackground = theme.colors.background;

  const cardStyle = React.useMemo(
    () => ({
      backgroundColor: theme.colors.surface,
      borderRadius: 22,
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: isDark ? 'rgba(255,255,255,0.08)' : theme.colors.border,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: isDark ? 0.25 : 0.04,
          shadowRadius: 10,
        },
        android: {
          elevation: 1,
        },
        default: {},
      }),
    }),
    [isDark, theme.colors.surface, theme.colors.border]
  );

  const handleDebugTheme = () => {
    const systemTheme = Appearance.getColorScheme();
    console.log('🐛 DEBUG MANUAL:');
    console.log('  - Sistema:', systemTheme);
    console.log('  - Modo app:', themeMode);
    console.log('  - isDark:', isDark);
    alert(`Sistema: ${systemTheme}\nModo: ${themeMode}\nisDark: ${isDark}`);
  };

  const handleAddAccountPress = () => {
    Alert.alert(
      t('account.addAnotherAccount'),
      t('account.addAccountComingSoon')
    );
  };

  const handleLogout = () => {
    logger.info('AccountScreen', '📤 Logout button pressed');
    Alert.alert(
      t('common.logout'),
      t('account.logoutConfirm') || 'Are you sure you want to logout?',
      [
        {
          text: t('common.cancel') || 'Cancel',
          onPress: () => logger.debug('AccountScreen', 'Logout cancelled'),
          style: 'cancel',
        },
        {
          text: t('common.logout') || 'Logout',
          onPress: () => {
            void (async () => {
              setIsLoggingOut(true);
              try {
                logger.info('AccountScreen', '🚪 Initiating logout');
                logout();
                await authContext.logout();
                logger.info(
                  'AccountScreen',
                  '✅ Logout completed - navigating to login'
                );
              } catch (err) {
                logger.error(
                  'AccountScreen',
                  '❌ Logout error',
                  { error: err instanceof Error ? err.message : String(err) },
                  err instanceof Error ? err : undefined
                );
                Alert.alert(
                  t('common.error') || 'Error',
                  t('account.logoutError') || 'An error occurred during logout'
                );
              } finally {
                setIsLoggingOut(false);
              }
            })();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const initial = (
    authContext.user?.name?.trim()?.charAt(0) || t('account.user').charAt(0)
  ).toUpperCase();

  const rowDivider = {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: pageBackground }]}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, cardStyle]}>
          <TouchableOpacity
            style={styles.accountRow}
            onPress={() => router.push('/(tabs)/account/edit-profile')}
            activeOpacity={0.65}
            disabled={!authContext.user?.id}
            testID="account-profile-row"
            accessibilityRole="button"
            accessibilityLabel={t('account.editProfile')}
          >
            <View
              style={[
                styles.avatarSmall,
                { backgroundColor: theme.colors.primary },
              ]}
            >
              {displayPictureUrl ? (
                <Image
                  key={displayPictureUrl}
                  source={{ uri: displayPictureUrl }}
                  style={styles.avatarSmallImage}
                  resizeMode="cover"
                  accessibilityIgnoresInvertColors
                  onError={(e) => {
                    logger.warn(
                      'AccountScreen',
                      'Profile image failed to load',
                      {
                        uri: displayPictureUrl,
                        error: e.nativeEvent?.error,
                      }
                    );
                  }}
                />
              ) : (
                <Text style={styles.avatarSmallText}>{initial}</Text>
              )}
            </View>
            <View style={styles.accountRowMain}>
              <Text
                style={[styles.accountName, { color: theme.colors.text }]}
                numberOfLines={1}
              >
                {authContext.user?.name || t('account.user')}
              </Text>
              <Text
                style={[
                  styles.accountEmail,
                  { color: theme.colors.textSecondary },
                ]}
                numberOfLines={1}
              >
                {authContext.user?.email || t('account.email')}
              </Text>
              {authContext.user?.emailVerified ? (
                <View style={styles.verifiedInline}>
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={theme.colors.primary}
                  />
                  <Text
                    style={[
                      styles.verifiedInlineText,
                      { color: theme.colors.primary },
                    ]}
                  >
                    {t('account.emailVerifiedBadge')}
                  </Text>
                </View>
              ) : null}
              {authContext.user?.dateOfBirth ? (
                <Text
                  style={[
                    styles.metaSmall,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {t('account.dateOfBirth')}: {authContext.user.dateOfBirth}
                </Text>
              ) : null}
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={theme.colors.textSecondary}
            />
          </TouchableOpacity>

          <View style={rowDivider} />

          <TouchableOpacity
            style={styles.addAccountRow}
            onPress={handleAddAccountPress}
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityLabel={t('account.addAnotherAccount')}
          >
            <View
              style={[
                styles.addAccountIcon,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                },
              ]}
            >
              <Ionicons
                name="add"
                size={22}
                color={theme.colors.textSecondary}
              />
            </View>
            <Text
              style={[styles.addAccountLabel, { color: theme.colors.text }]}
            >
              {t('account.addAnotherAccount')}
            </Text>
          </TouchableOpacity>
        </View>

        <Text
          style={[styles.blockLabel, { color: theme.colors.textSecondary }]}
        >
          {t('account.appearance')}
        </Text>
        <View style={[styles.card, cardStyle, styles.cardPadding]}>
          <ThemeSelector nestedInCard />
          {__DEV__ ? (
            <TouchableOpacity
              style={[
                styles.debugButton,
                { backgroundColor: theme.colors.info, marginTop: 8 },
              ]}
              onPress={handleDebugTheme}
            >
              <Text style={styles.debugButtonText}>
                {t('account.debugTheme')}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <Text
          style={[styles.blockLabel, { color: theme.colors.textSecondary }]}
        >
          {t('account.settings')}
        </Text>
        <View style={[styles.card, cardStyle, styles.settingsCard]}>
          {settingsOptions.map((option, index) => (
            <TouchableOpacity
              key={option.key}
              style={[
                styles.settingsRow,
                index > 0 && {
                  borderTopWidth: StyleSheet.hairlineWidth,
                  borderTopColor: isDark
                    ? 'rgba(255,255,255,0.08)'
                    : 'rgba(0,0,0,0.06)',
                },
              ]}
              activeOpacity={0.65}
              onPress={option.onPress}
            >
              <View style={styles.settingsRowLeft}>
                <View
                  style={[
                    styles.settingsIconWrap,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255,255,255,0.06)'
                        : 'rgba(0,0,0,0.04)',
                    },
                  ]}
                >
                  <Ionicons
                    name={option.icon}
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <Text
                  style={[
                    styles.settingsRowLabel,
                    { color: theme.colors.text },
                  ]}
                >
                  {option.label}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              borderColor: theme.colors.error,
              backgroundColor: isDark
                ? 'rgba(255, 59, 48, 0.12)'
                : 'rgba(255, 59, 48, 0.08)',
            },
          ]}
          activeOpacity={0.75}
          onPress={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <ActivityIndicator color={theme.colors.error} />
          ) : (
            <>
              <Ionicons
                name="log-out-outline"
                size={22}
                color={theme.colors.error}
                style={styles.logoutIcon}
              />
              <Text style={[styles.logoutText, { color: theme.colors.error }]}>
                {t('common.logout')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  blockLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
    marginBottom: 10,
    marginLeft: 4,
    marginTop: 4,
  },
  card: {
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardPadding: {
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 18,
  },
  settingsCard: {
    paddingVertical: 4,
  },
  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
  },
  avatarSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarSmallImage: {
    width: '100%',
    height: '100%',
  },
  avatarSmallText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  accountRowMain: {
    flex: 1,
    marginLeft: 14,
    marginRight: 8,
    minWidth: 0,
  },
  accountName: {
    fontSize: 17,
    fontWeight: '600',
  },
  accountEmail: {
    fontSize: 14,
    marginTop: 2,
  },
  verifiedInline: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  verifiedInlineText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  metaSmall: {
    fontSize: 12,
    marginTop: 4,
  },
  addAccountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  addAccountIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAccountLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginLeft: 14,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  settingsRowLabel: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
  },
  debugButton: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
});
