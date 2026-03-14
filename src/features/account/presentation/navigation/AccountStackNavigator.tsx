import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AccountScreen } from '../screens/AccountScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ThemeSettingsScreen } from '../screens/ThemeSettingsScreen';
import { LanguageSettingsScreen } from '../screens/LanguageSettingsScreen';
import { PrivacySecurityScreen } from '../screens/PrivacySecurityScreen';
import { useTheme } from '@shared/theme';
import { useTranslation } from '@shared/i18n';

export type AccountStackParamList = {
  AccountMain: undefined;
  EditProfile: undefined;
  ThemeSettings: undefined;
  LanguageSettings: undefined;
  PrivacySecurity: undefined;
};

const Stack = createStackNavigator<AccountStackParamList>();

export const AccountStackNavigator: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background,
        },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="AccountMain"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{
          title: t('account.editProfile'),
          headerBackTitle: t('common.back'),
        }}
      />
      <Stack.Screen
        name="ThemeSettings"
        component={ThemeSettingsScreen}
        options={{
          title: t('account.appearance'),
          headerBackTitle: t('common.back'),
        }}
      />
      <Stack.Screen
        name="LanguageSettings"
        component={LanguageSettingsScreen}
        options={{
          title: t('account.language'),
          headerBackTitle: t('common.back'),
        }}
      />
      <Stack.Screen
        name="PrivacySecurity"
        component={PrivacySecurityScreen}
        options={{
          title: t('account.privacySecurity'),
          headerBackTitle: t('common.back'),
        }}
      />
    </Stack.Navigator>
  );
};
