import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
import { AppointmentsScreen } from '@features/appointments/presentation/screens/AppointmentsScreen';
import { AccountScreen } from '@features/account/presentation/screens/AccountScreen';
import { ParentalScreen } from '@features/parental/presentation/screens/ParentalScreen';
import { NearbyScreen } from '@features/nearby/presentation/screens/NearbyScreen';
import { Header } from '@shared/components/Header';
import { TabBarIcon } from './components/TabBarIcon';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

const renderHeader = () => <Header />;

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
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: renderTabBarIcon(route.name),
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: true,
          header: renderHeader,
          headerStyle: {
            backgroundColor: '#FFF',
          },
        })}
      >
        <Tab.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{ title: 'Home' }}
        />
        <Tab.Screen
          name="AppointmentsTab"
          component={AppointmentsScreen}
          options={{ title: 'Appointments' }}
        />
        <Tab.Screen
          name="AccountTab"
          component={AccountScreen}
          options={{ title: 'Account' }}
        />
        <Tab.Screen
          name="ParentalTab"
          component={ParentalScreen}
          options={{ title: 'Parental' }}
        />
        <Tab.Screen
          name="NearbyTab"
          component={NearbyScreen}
          options={{ title: 'Nearby' }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};
