import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
import { AppointmentsScreen } from '@features/appointments/presentation/screens/AppointmentsScreen';
import { AccountScreen } from '@features/account/presentation/screens/AccountScreen';
import { ParentalScreen } from '@features/parental/presentation/screens/ParentalScreen';
import { NearbyScreen } from '@features/nearby/presentation/screens/NearbyScreen';
import { Header } from '@shared/components/Header';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: keyof typeof Ionicons.glyphMap;

            if (route.name === 'HomeTab') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'AppointmentsTab') {
              iconName = focused ? 'calendar' : 'calendar-outline';
            } else if (route.name === 'AccountTab') {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === 'ParentalTab') {
              iconName = focused ? 'shield' : 'shield-outline';
            } else if (route.name === 'NearbyTab') {
              iconName = focused ? 'location' : 'location-outline';
            } else {
              iconName = 'help-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#007AFF',
          tabBarInactiveTintColor: '#8E8E93',
          headerShown: true,
          header: () => <Header />,
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
