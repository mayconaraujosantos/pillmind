import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { COMMON_STYLES } from '@shared/constants/styles';
import { adaptiveSpacing } from '@shared/utils/dimensions';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  greeting?: string;
  subtitle?: string;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  userAvatar,
  greeting,
  subtitle,
  onNotificationPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme, isDark: _isDark } = useTheme();

  const displayName = userName || t('account.user');
  const titleText = greeting || t('home.hello', { name: displayName });
  const subtitleText = subtitle || t('home.welcomeShort');

  const dynamicStyles = {
    avatar: {
      ...styles.avatar,
      backgroundColor: theme.colors.surface,
    },
    avatarText: {
      ...styles.avatarText,
      color: theme.colors.primary,
    },
    userName: {
      ...styles.userName,
      color: theme.colors.text,
    },
    userSubtitle: {
      ...styles.userSubtitle,
      color: theme.colors.textSecondary,
    },
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 0),
          backgroundColor: theme.colors.background,
          borderBottomColor: 'transparent',
        },
      ]}
    >
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.userSection}
          onPress={onProfilePress}
          activeOpacity={0.7}
        >
          <View style={dynamicStyles.avatar}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatarImage} />
            ) : (
              <Text style={dynamicStyles.avatarText}>
                {displayName.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <View>
            <Text style={dynamicStyles.userName}>{titleText}</Text>
            <Text style={dynamicStyles.userSubtitle}>{subtitleText}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.notificationButton,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={onNotificationPress}
          activeOpacity={0.7}
        >
          <Ionicons
            name="notifications-outline"
            size={24}
            color={theme.colors.text}
          />
          {/* Badge de notificação pode ser adicionado aqui */}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: adaptiveSpacing.lg,
    paddingBottom: adaptiveSpacing.md,
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: COMMON_STYLES.padding.horizontal.small,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: COMMON_STYLES.fontWeight.bold,
  },
  userName: {
    fontSize: 18,
    fontWeight: COMMON_STYLES.fontWeight.semibold,
  },
  userSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
});
