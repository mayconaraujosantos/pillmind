import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppointmentsScreen } from '../AppointmentsScreen';
import { ThemeProvider } from '@shared/theme';

describe('AppointmentsScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render correctly', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <AppointmentsScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Appointments')).toBeTruthy();
    });
  });
});
