import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { NearbyScreen } from '@features/nearby/presentation/screens/NearbyScreen';
import { getMainTabStackScreenOptions } from './mainTabStackScreenOptions';
import { TabRootHeaderRight } from './TabRootHeaderRight';
import type { NearbyTabParamList } from './types';

const Stack = createNativeStackNavigator<NearbyTabParamList>();

export const NearbyTabNavigator: React.FC = () => {
  const { theme, isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={getMainTabStackScreenOptions(theme, isDark)}
    >
      <Stack.Screen
        name="NearbyMain"
        component={NearbyScreen}
        options={{
          title: t('tabs.nearby'),
          headerBackVisible: false,
          headerRight: () => <TabRootHeaderRight />,
        }}
      />
    </Stack.Navigator>
  );
};
