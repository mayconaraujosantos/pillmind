import React from 'react';
import { SimpleInfoScreen } from '@shared/components';

export const AppointmentsScreen: React.FC = () => {
  return (
    <SimpleInfoScreen
      titleKey="appointments.title"
      subtitleKey="appointments.subtitle"
    />
  );
};
