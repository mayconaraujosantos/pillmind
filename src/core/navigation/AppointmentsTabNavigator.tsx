import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { AppointmentsScreen } from '@features/appointments/presentation/screens/AppointmentsScreen';
import { getMainTabStackScreenOptions } from './mainTabStackScreenOptions';
import { TabRootHeaderRight } from './TabRootHeaderRight';
import type { AppointmentsTabParamList } from './types';

const Stack = createNativeStackNavigator<AppointmentsTabParamList>();

export const AppointmentsTabNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={getMainTabStackScreenOptions(theme, isDark)}
    >
      <Stack.Screen
        name="AppointmentsMain"
        component={AppointmentsScreen}
        options={{
          title: t('tabs.appointments'),
          headerBackVisible: false,
          headerRight: () => <TabRootHeaderRight />,
        }}
      />
    </Stack.Navigator>
  );
};
