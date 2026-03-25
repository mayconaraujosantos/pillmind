import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '@shared/theme';
import { HomeScreen } from '@features/home/presentation/screens/HomeScreen';
import { getMainTabStackScreenOptions } from './mainTabStackScreenOptions';
import type { HomeTabParamList } from './types';

const Stack = createNativeStackNavigator<HomeTabParamList>();

export const HomeTabNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={getMainTabStackScreenOptions(theme, isDark)}
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
