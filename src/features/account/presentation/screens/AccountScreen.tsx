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
  Image,
  type AlertButton,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { ThemeSelector } from '@shared/components';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { useAuth } from '@features/onboarding/presentation/hooks/useAuth';
import { authService } from '@features/onboarding/domain/services/auth.service';
import { logger } from '@shared/utils/logger';

const pickerOptions: ImagePicker.ImagePickerOptions = {
  mediaTypes: ['images'],
  allowsEditing: true,
  aspect: [1, 1],
  quality: 0.85,
};

export const AccountScreen: React.FC = () => {
  const { theme, isDark, themeMode } = useTheme();
  const { t } = useTranslation();
  const authContext = useAuthContext();
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);

  const displayPictureUrl = authContext.displayPictureUrl;

  const settingsOptions = [
    {
      key: 'notifications',
      label: t('account.notifications'),
    },
    {
      key: 'privacy',
      label: t('account.privacy'),
    },
    {
      key: 'about',
      label: t('account.about'),
    },
  ];

  const handleDebugTheme = () => {
    const systemTheme = Appearance.getColorScheme();
    console.log('🐛 DEBUG MANUAL:');
    console.log('  - Sistema:', systemTheme);
    console.log('  - Modo app:', themeMode);
    console.log('  - isDark:', isDark);
    alert(`Sistema: ${systemTheme}\nModo: ${themeMode}\nisDark: ${isDark}`);
  };

  const uploadPickedAsset = React.useCallback(
    async (asset: ImagePicker.ImagePickerAsset) => {
      const uri = asset.uri;
      const mimeType = asset.mimeType ?? 'image/jpeg';
      const ext =
        mimeType === 'image/png'
          ? 'png'
          : mimeType === 'image/webp'
          ? 'webp'
          : 'jpg';
      const token = authContext.token;
      if (!token) {
        return;
      }
      setUploadingPhoto(true);
      try {
        const res = await authService.uploadProfilePicture(
          uri,
          token,
          mimeType,
          `profile.${ext}`
        );
        if (res.success && res.data) {
          await authContext.applyServerUser(res.data);
        } else {
          Alert.alert(
            t('common.error'),
            res.error?.message || t('account.uploadPhotoFailed')
          );
        }
      } finally {
        setUploadingPhoto(false);
      }
    },
    [authContext, t]
  );

  const pickFromLibrary = React.useCallback(async () => {
    if (!authContext.user?.id) {
      return;
    }
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('account.photoPermissionDenied'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync(pickerOptions);
      if (!result.canceled && result.assets[0]) {
        await uploadPickedAsset(result.assets[0]);
      }
    } catch (err) {
      logger.error(
        'AccountScreen',
        'Photo library error',
        { error: err instanceof Error ? err.message : String(err) },
        err instanceof Error ? err : undefined
      );
      Alert.alert(t('common.error'), t('account.photoPickerError'));
    }
  }, [authContext.user?.id, t, uploadPickedAsset]);

  const takePhoto = React.useCallback(async () => {
    if (!authContext.user?.id) {
      return;
    }
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('common.error'), t('account.photoPermissionDenied'));
        return;
      }
      const result = await ImagePicker.launchCameraAsync(pickerOptions);
      if (!result.canceled && result.assets[0]) {
        await uploadPickedAsset(result.assets[0]);
      }
    } catch (err) {
      logger.error(
        'AccountScreen',
        'Camera error',
        { error: err instanceof Error ? err.message : String(err) },
        err instanceof Error ? err : undefined
      );
      Alert.alert(t('common.error'), t('account.photoPickerError'));
    }
  }, [authContext.user?.id, t, uploadPickedAsset]);

  const removePhoto = React.useCallback(async () => {
    const hasServerPicture =
      typeof authContext.user?.pictureUrl === 'string' &&
      authContext.user.pictureUrl.length > 0;
    if (hasServerPicture && authContext.token) {
      setUploadingPhoto(true);
      try {
        const res = await authService.deleteProfilePicture(authContext.token);
        if (res.success && res.data) {
          await authContext.applyServerUser(res.data);
        } else {
          Alert.alert(
            t('common.error'),
            res.error?.message || t('account.uploadPhotoFailed')
          );
        }
      } finally {
        setUploadingPhoto(false);
      }
    } else {
      await authContext.setProfilePhotoUri(null);
    }
  }, [authContext, t]);

  const openPhotoOptions = React.useCallback(() => {
    if (!authContext.user?.id) {
      return;
    }
    const buttons: AlertButton[] = [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('account.chooseFromLibrary'),
        onPress: () => {
          void pickFromLibrary();
        },
      },
      {
        text: t('account.takePhoto'),
        onPress: () => {
          void takePhoto();
        },
      },
    ];
    if (displayPictureUrl) {
      buttons.push({
        text: t('account.removePhoto'),
        style: 'destructive',
        onPress: () => {
          void removePhoto();
        },
      });
    }
    Alert.alert(t('account.changePhotoTitle'), undefined, buttons);
  }, [displayPictureUrl, pickFromLibrary, takePhoto, removePhoto, t]);

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

  const initial = (
    authContext.user?.name?.trim()?.charAt(0) || t('account.user').charAt(0)
  ).toUpperCase();

  return (
    <View
      style={[styles.wrapper, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.screenTitle, { color: theme.colors.text }]}>
        {t('account.title')}
      </Text>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View
          style={[styles.section, { backgroundColor: theme.colors.surface }]}
        >
          <View style={styles.avatarBlock}>
            <TouchableOpacity
              style={styles.avatarTouchable}
              onPress={openPhotoOptions}
              activeOpacity={0.85}
              disabled={!authContext.user?.id || uploadingPhoto}
              testID="account-change-photo-button"
              accessibilityRole="button"
              accessibilityLabel={t('account.changePhoto')}
            >
              <View
                style={[
                  styles.avatar,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                {displayPictureUrl ? (
                  <Image
                    key={displayPictureUrl}
                    source={{ uri: displayPictureUrl }}
                    style={styles.avatarImage}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                  />
                ) : (
                  <Text style={styles.avatarText}>{initial}</Text>
                )}
              </View>
              <View
                style={[
                  styles.avatarEditBadge,
                  { backgroundColor: theme.colors.primary },
                ]}
              >
                {uploadingPhoto ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Ionicons name="camera" size={16} color="#FFFFFF" />
                )}
              </View>
            </TouchableOpacity>
            <Text
              style={[styles.changePhotoHint, { color: theme.colors.primary }]}
            >
              {uploadingPhoto
                ? t('account.uploadingPhoto')
                : t('account.changePhoto')}
            </Text>
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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('account.appearance')}
          </Text>
          <ThemeSelector />

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

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            {t('account.settings')}
          </Text>
          {settingsOptions.map((option) => (
            <TouchableOpacity
              key={option.key}
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
                {option.label}
              </Text>
              <Text style={styles.optionArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

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
  avatarBlock: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarTouchable: {
    position: 'relative',
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  changePhotoHint: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
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
