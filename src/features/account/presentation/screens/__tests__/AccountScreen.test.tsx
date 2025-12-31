import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountScreen } from '../AccountScreen';
import { ThemeProvider } from '@shared/theme';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('react-native', () => ({
  ...jest.requireActual('react-native'),
  useColorScheme: jest.fn(() => 'light'),
}));

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
      expect(getByText('Perfil')).toBeTruthy();
    });

    expect(getByText('Usuário')).toBeTruthy();
    expect(getByText('usuario@pillmind.com')).toBeTruthy();
  });

  it('should render theme selector section', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <AccountScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Aparência')).toBeTruthy();
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
      expect(getByText('Configurações')).toBeTruthy();
    });

    expect(getByText('Notificações')).toBeTruthy();
    expect(getByText('Privacidade')).toBeTruthy();
    expect(getByText('Sobre')).toBeTruthy();
  });

  it('should render logout button', async () => {
    const { getByText } = render(
      <ThemeProvider>
        <AccountScreen />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('Sair')).toBeTruthy();
    });
  });
});
