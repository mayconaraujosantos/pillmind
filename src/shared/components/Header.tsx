import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { COMMON_STYLES } from '@shared/constants/styles';

interface HeaderProps {
  userName?: string;
  userAvatar?: string;
  onNotificationPress?: () => void;
  onProfilePress?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  userName = 'Usuário',
  userAvatar: _userAvatar,
  onNotificationPress,
  onProfilePress,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: Math.max(insets.top, 0) }]}>
      <TouchableOpacity
        style={styles.userSection}
        onPress={onProfilePress}
        activeOpacity={0.7}
      >
        <View style={styles.avatar}>
          {/* TODO: Adicionar Image quando userAvatar for fornecido */}
          <Text style={styles.avatarText}>
            {userName.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{userName}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.notificationButton}
        onPress={onNotificationPress}
        activeOpacity={0.7}
      >
        <Ionicons name="notifications-outline" size={24} color="#000" />
        {/* Badge de notificação pode ser adicionado aqui */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: COMMON_STYLES.padding.horizontal.medium,
    paddingVertical: COMMON_STYLES.padding.vertical.medium,
    backgroundColor: COMMON_STYLES.colors.background.white,
    borderBottomWidth: 1,
    borderBottomColor: COMMON_STYLES.colors.border.light,
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
    backgroundColor: COMMON_STYLES.colors.background.light,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: COMMON_STYLES.padding.horizontal.small,
  },
  avatarText: {
    fontSize: COMMON_STYLES.fontSize.large,
    fontWeight: COMMON_STYLES.fontWeight.bold,
    color: COMMON_STYLES.colors.primary,
  },
  userName: {
    fontSize: COMMON_STYLES.fontSize.large,
    fontWeight: COMMON_STYLES.fontWeight.semibold,
    color: COMMON_STYLES.colors.text.primary,
  },
  notificationButton: {
    padding: COMMON_STYLES.padding.vertical.small,
  },
});
