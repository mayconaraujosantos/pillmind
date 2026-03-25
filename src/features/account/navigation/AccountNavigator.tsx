import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { AccountScreen } from '../presentation/screens/AccountScreen';
import { EditProfileScreen } from '../presentation/screens/EditProfileScreen';
import { NotificationsSettingsScreen } from '../presentation/screens/NotificationsSettingsScreen';
import { PrivacyScreen } from '../presentation/screens/PrivacyScreen';
import { AboutScreen } from '../presentation/screens/AboutScreen';
import type { AccountStackParamList } from './types';
import { getAppHeaderChrome } from '@core/navigation/appHeaderChrome';

const Stack = createNativeStackNavigator<AccountStackParamList>();

export const AccountNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  const accountCanvasBg = isDark ? theme.colors.background : '#F8F8F8';

  return (
    <Stack.Navigator
      screenOptions={getAppHeaderChrome({
        theme,
        isDark,
        contentBackgroundColor: accountCanvasBg,
      })}
    >
      <Stack.Screen
        name="AccountHome"
        component={AccountScreen}
        options={{ title: t('account.title'), headerBackVisible: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: t('account.editProfile') }}
      />
      <Stack.Screen
        name="NotificationsSettings"
        component={NotificationsSettingsScreen}
        options={{ title: t('account.notifications') }}
      />
      <Stack.Screen
        name="Privacy"
        component={PrivacyScreen}
        options={{ title: t('account.privacy') }}
      />
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{ title: t('account.about') }}
      />
    </Stack.Navigator>
  );
};
