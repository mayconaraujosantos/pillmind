import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountScreen } from '../AccountScreen';
import { ThemeProvider } from '@shared/theme';

describe('AccountScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render user profile section', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <AccountScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Profile')).toBeTruthy();
    });

    expect(getByText('User')).toBeTruthy();
    expect(getByText('usuario@pillmind.com')).toBeTruthy();
  });

  it('should render theme selector section', async () => {
    const { getByText, getAllByText } = render(
      <ThemeProvider>
        <AccountScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      // Há dois elementos "Aparência": título da seção e título do ThemeSelector
      expect(getAllByText('Aparência').length).toBeGreaterThan(0);
    });

    expect(getByText('Automático')).toBeTruthy();
    expect(getByText('Claro')).toBeTruthy();
    expect(getByText('Escuro')).toBeTruthy();
  });

  it('should render settings options', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <AccountScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Settings')).toBeTruthy();
    });

    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Privacy')).toBeTruthy();
    expect(getByText('About')).toBeTruthy();
  });

  it('should render logout button', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <AccountScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Logout')).toBeTruthy();
    });
  });
});
