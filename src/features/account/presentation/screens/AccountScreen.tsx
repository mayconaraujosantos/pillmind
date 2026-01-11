import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Appearance,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { ThemeSelector } from '@shared/components';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { useAuth } from '@features/onboarding/presentation/hooks/useAuth';
import { logger } from '@shared/utils/logger';

export const AccountScreen: React.FC = () => {
  const { theme, isDark, themeMode } = useTheme();
  const { t } = useTranslation();
  const authContext = useAuthContext();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleDebugTheme = () => {
    const systemTheme = Appearance.getColorScheme();
    console.log('🐛 DEBUG MANUAL:');
    console.log('  - Sistema:', systemTheme);
    console.log('  - Modo app:', themeMode);
    console.log('  - isDark:', isDark);
    alert(`Sistema: ${systemTheme}\nModo: ${themeMode}\nisDark: ${isDark}`);
  };

  const handleLogout = async () => {
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
          onPress: async () => {
            setIsLoggingOut(true);
            try {
              logger.info('AccountScreen', '🚪 Initiating logout');
              const result = logout();
              if (result.success) {
                await authContext.logout();
                logger.info(
                  'AccountScreen',
                  '✅ Logout completed - navigating to login'
                );
                // Não precisa de Alert - a navegação automática para login é suficiente
              } else {
                logger.warn('AccountScreen', '⚠️ Logout failed', result.error);
                Alert.alert(
                  t('common.error') || 'Error',
                  t('account.logoutFailed') || 'Failed to logout'
                );
              }
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
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.text }]}>
        {t('account.title')}
      </Text>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.avatarContainer}>
            <View
              style={[styles.avatar, { backgroundColor: theme.colors.primary }]}
            >
              <Text style={styles.avatarText}>
                {authContext.user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          </View>
          <Text style={[styles.userName, { color: theme.colors.text }]}>
            {authContext.user?.name || t('account.user') || 'User'}
          </Text>
          <Text
            style={[styles.userEmail, { color: theme.colors.textSecondary }]}
          >
            {authContext.user?.email ||
              t('account.email') ||
              'email@example.com'}
          </Text>
        </View>

        {/* Theme Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('account.appearance')}
          </Text>
          <ThemeSelector />

          {/* Debug Button */}
          <TouchableOpacity
            style={[
              styles.debugButton,
              {
                backgroundColor: theme.colors.info,
                marginTop: 16,
              },
            ]}
            onPress={handleDebugTheme}
          >
            <Text style={styles.debugButtonText}>
              {t('account.debugTheme')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Settings Options */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('account.settings')}
          </Text>

          <TouchableOpacity
            style={[
              styles.optionItem,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {t('account.notifications')}
            </Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionItem,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {t('account.privacy')}
            </Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.optionItem,
              {
                backgroundColor: theme.colors.surface,
                borderBottomColor: theme.colors.border,
              },
            ]}
            activeOpacity={0.7}
          >
            <Text style={[styles.optionText, { color: theme.colors.text }]}>
              {t('account.about')}
            </Text>
            <Text style={styles.optionArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.logoutButton,
              { backgroundColor: theme.colors.error },
            ]}
            activeOpacity={0.7}
            onPress={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.logoutText}>{t('common.logout')}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: '700',
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    borderBottomWidth: 1,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  optionArrow: {
    fontSize: 24,
    color: '#999',
    fontWeight: '300',
  },
  logoutButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  debugButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
