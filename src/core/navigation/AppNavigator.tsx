import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
import { AppointmentsScreen } from '@features/appointments/presentation/screens/AppointmentsScreen';
import { AccountScreen } from '@features/account/presentation/screens/AccountScreen';
import { ParentalScreen } from '@features/parental/presentation/screens/ParentalScreen';
import { NearbyScreen } from '@features/nearby/presentation/screens/NearbyScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
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
