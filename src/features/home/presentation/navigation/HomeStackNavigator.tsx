import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTranslation } from '@shared/i18n';
import { useTheme } from '@shared/theme';
import { HomeScreen } from '../screens/HomeScreen';
import { AddMedicationScreen } from '../screens/AddMedicationScreen';
import { MedicationDetailScreen } from '../screens/MedicationDetailScreen';
import { Medicine } from '../../domain/entities/Medicine';

export type HomeStackParamList = {
  HomeMain: undefined;
  AddMedication: undefined;
  MedicationDetail: { medicine: Medicine };
};

const Stack = createStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: React.FC = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

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
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddMedication"
        component={AddMedicationScreen}
        options={{
          title: t('home.addMedication'),
          headerBackTitle: t('common.back'),
        }}
      />
      <Stack.Screen
        name="MedicationDetail"
        component={MedicationDetailScreen}
        options={{
          title: t('medicationDetail.title'),
          headerBackTitle: t('common.back'),
        }}
      />
    </Stack.Navigator>
  );
};
