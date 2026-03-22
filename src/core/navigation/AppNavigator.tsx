import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { useAuthContext } from '@features/onboarding/presentation/contexts/AuthContext';
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
import { AppointmentsScreen } from '@features/appointments/presentation/screens/AppointmentsScreen';
import { AccountScreen } from '@features/account/presentation/screens/AccountScreen';
import { ParentalScreen } from '@features/parental/presentation/screens/ParentalScreen';
import { NearbyScreen } from '@features/nearby/presentation/screens/NearbyScreen';
import { Header } from '@shared/components/Header';
import { TabBarIcon } from './components/TabBarIcon';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

type AppNavigatorHeaderProps = {
  userName?: string;
  userAvatar?: string;
  onProfilePress: () => void;
};

const AppNavigatorHeader: React.FC<AppNavigatorHeaderProps> = ({
  userName,
  userAvatar,
  onProfilePress,
}) => (
  <Header
    userName={userName}
    userAvatar={userAvatar}
    onProfilePress={onProfilePress}
  />
);

const renderTabBarIcon =
  (routeName: keyof TabParamList) =>
  ({
    focused,
    color,
    size,
  }: {
    focused: boolean;
    color: string;
    size: number;
  }) =>
    (
      <TabBarIcon
        routeName={routeName}
        focused={focused}
        color={color}
        size={size}
      />
    );

export const AppNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme, isDark: _isDark } = useTheme();
  const authContext = useAuthContext();

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route, navigation }) => ({
          tabBarIcon: renderTabBarIcon(route.name),
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSecondary,
          tabBarStyle: {
            backgroundColor: theme.colors.background,
            borderTopColor: theme.colors.border,
          },
          headerShown: true,
          header: () => (
            <AppNavigatorHeader
              userName={authContext.user?.name}
              userAvatar={authContext.displayPictureUrl}
              onProfilePress={() => navigation.navigate('AccountTab')}
            />
          ),
          headerStyle: {
            backgroundColor: theme.colors.background,
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{ title: t('tabs.home') }}
        />
        <Tab.Screen
          name="AppointmentsTab"
          component={AppointmentsScreen}
          options={{ title: t('tabs.appointments') }}
        />
        <Tab.Screen
          name="AccountTab"
          component={AccountScreen}
          options={{ title: t('tabs.account') }}
        />
        <Tab.Screen
          name="ParentalTab"
          component={ParentalScreen}
          options={{ title: t('tabs.parental') }}
        />
        <Tab.Screen
          name="NearbyTab"
          component={NearbyScreen}
          options={{ title: t('tabs.nearby') }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
