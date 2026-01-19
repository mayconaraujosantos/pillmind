import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { COMMON_STYLES } from '@shared/constants/styles';
import { adaptiveSpacing } from '@shared/utils/dimensions';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName,
  userAvatar: _userAvatar,
  onNotificationPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { theme, isDark: _isDark } = useTheme();

  const displayName = userName || t('account.user');

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
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 0),
          backgroundColor: theme.colors.background,
          borderBottomColor: theme.colors.border,
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
            {/* TODO: Adicionar Image quando userAvatar for fornecido */}
            <Text style={dynamicStyles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text style={dynamicStyles.userName}>{displayName}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notificationButton}
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
    paddingVertical: COMMON_STYLES.padding.vertical.medium,
    borderBottomWidth: 1,
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
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: COMMON_STYLES.padding.horizontal.small,
  },
  avatarText: {
    fontSize: COMMON_STYLES.fontSize.large,
    fontWeight: COMMON_STYLES.fontWeight.bold,
  },
  userName: {
    fontSize: COMMON_STYLES.fontSize.large,
    fontWeight: COMMON_STYLES.fontWeight.semibold,
  },
  notificationButton: {
    padding: COMMON_STYLES.padding.vertical.small,
  },
});
