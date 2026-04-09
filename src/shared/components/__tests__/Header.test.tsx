import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from '../Header';
import { ThemeProvider } from '@shared/theme';

// Lightweight theme mock to avoid async ThemeProvider side effects in tests
jest.mock('@shared/theme', () => {
  const React = require('react');
  const mockTheme = {
    colors: {
      primary: '#000',
      text: '#000',
      textSecondary: '#666',
      background: '#fff',
      border: '#ccc',
      surface: '#f5f5f5',
      placeholder: '#999',
      error: '#f00',
    },
  };

  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useTheme: () => ({
      theme: mockTheme,
      isDark: false,
      setThemeMode: jest.fn(),
      toggleTheme: jest.fn(),
    }),
  };
});

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, options?: { name?: string }) => {
      const translations: Record<string, string> = {
        'account.user': 'Usuário',
        'home.hello': `Olá, ${options?.name || 'Usuário'}`,
        'home.welcomeShort': 'Bem-vindo de volta!',
        'home.openProfileA11y': 'Abrir perfil',
        'home.notificationsA11y': 'Notificações',
      };
      return translations[key] || key;
    },
    i18n: { language: 'pt-BR' },
  }),
}));

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }: { name: string }) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(
      View,
      { testID: `icon-${name}` },
      React.createElement(Text, null, name)
    );
  },
}));

describe('Header', () => {
  const renderWithProviders = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('should render with default userName', () => {
    const { getByText } = renderWithProviders(<Header />);

    // Verifica se o displayName padrão 'Usuário' é renderizado no avatar
    expect(getByText('U')).toBeTruthy();
    // Verifica se o texto traduzido com o nome padrão aparece
    expect(getByText('Olá, Usuário')).toBeTruthy();
  });

  it('should render with custom userName', () => {
    const { getByText } = renderWithProviders(<Header userName="John Doe" />);

    // Verifica se a inicial é renderizada no avatar
    expect(getByText('J')).toBeTruthy();
    // Verifica se o texto traduzido com o nome personalizado aparece
    expect(getByText('Olá, John Doe')).toBeTruthy();
  });

  it('should render avatar with first letter of userName', () => {
    const { getByText } = renderWithProviders(<Header userName="John" />);

    expect(getByText('J')).toBeTruthy();
  });

  it('should render avatar when userAvatar is provided', () => {
    const { getByText } = renderWithProviders(
      <Header userName="John" userAvatar="avatar-url" />
    );

    // Quando userAvatar é fornecido, o componente renderiza uma imagem em vez do texto
    // Vamos verificar se o nome do usuário aparece no texto traduzido
    expect(getByText('Olá, John')).toBeTruthy();
  });

  it('should call onProfilePress when user section is pressed', () => {
    const onProfilePress = jest.fn();
    const { getByText } = renderWithProviders(
      <Header userName="John" onProfilePress={onProfilePress} />
    );

    // Pressiona o texto traduzido que contém o nome
    fireEvent.press(getByText('Olá, John'));
    expect(onProfilePress).toHaveBeenCalledTimes(1);
  });

  it('should call onNotificationPress when notification button is pressed', () => {
    const onNotificationPress = jest.fn();
    const { getByLabelText } = renderWithProviders(
      <Header onNotificationPress={onNotificationPress} />
    );

    fireEvent.press(getByLabelText('Notificações'));
    expect(onNotificationPress).toHaveBeenCalledTimes(1);
  });

  it('should render notification icon', () => {
    const { getByTestId } = renderWithProviders(<Header />);

    expect(getByTestId('icon-notifications-outline')).toBeTruthy();
  });
});
