import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { ParentalScreen } from '@features/parental/presentation/screens/ParentalScreen';
import { getMainTabStackScreenOptions } from './mainTabStackScreenOptions';
import { TabRootHeaderRight } from './TabRootHeaderRight';
import type { ParentalTabParamList } from './types';

const Stack = createNativeStackNavigator<ParentalTabParamList>();

export const ParentalTabNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={getMainTabStackScreenOptions(theme, isDark)}
    >
      <Stack.Screen
        name="ParentalMain"
        component={ParentalScreen}
        options={{
          title: t('tabs.parental'),
          headerBackVisible: false,
          headerRight: () => <TabRootHeaderRight />,
        }}
      />
    </Stack.Navigator>
  );
};
