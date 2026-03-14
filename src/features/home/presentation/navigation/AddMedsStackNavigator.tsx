import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { AddMedicationScreen } from '../screens/AddMedicationScreen';

export type AddMedsStackParamList = {
  AddMedication: undefined;
};

const Stack = createStackNavigator<AddMedsStackParamList>();

export const AddMedsStackNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.background },
        headerTintColor: theme.colors.text,
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="AddMedication"
        component={AddMedicationScreen}
        options={{ title: t('home.addMedication'), headerShown: false }}
      />
    </Stack.Navigator>
  );
};
