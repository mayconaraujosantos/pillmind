import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountScreen } from '../AccountScreen';
import { ThemeProvider } from '@shared/theme';
import { AuthProvider } from '@features/onboarding/presentation/contexts/AuthContext';

jest.mock('@features/onboarding/presentation/hooks/useAuth', () => ({
  useAuth: jest.fn(() => ({
    logout: jest.fn(() => ({ success: true })),
    signIn: jest.fn(),
    signUp: jest.fn(),
    loading: false,
    error: null,
  })),
}));

jest.mock('@shared/i18n', () => {
  const translations = {
    'account.title': 'Profile',
    'account.user': 'User',
    'account.email': 'usuario@pillmind.com',
    'account.appearance': 'Appearance',
    'account.settings': 'Settings',
    'account.notifications': 'Notifications',
    'account.privacy': 'Privacy',
    'account.about': 'About',
    'account.debugTheme': '🐛 Debug: View theme detection',
    'common.logout': 'Logout',
    'common.cancel': 'Cancel',
    'common.error': 'Error',
  };
  return {
    useTranslation: () => ({
      t: (key: keyof typeof translations) => translations[key] || key,
      i18n: { language: 'en' },
    }),
  };
});

const renderWithLocalProviders = (component: React.ReactElement) => {
  return render(
    <ThemeProvider>
      <AuthProvider>{component}</AuthProvider>
    </ThemeProvider>
  );
};

describe('AccountScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render user profile section', async () => {
    const { findByText, getByText } = renderWithLocalProviders(
      <AccountScreen />
    );

    // Aguardar o AuthContext carregar e o componente renderizar
    const profileTitle = await findByText('Profile', {}, { timeout: 3000 });

    expect(profileTitle).toBeTruthy();
    expect(getByText('User')).toBeTruthy();
    expect(getByText('usuario@pillmind.com')).toBeTruthy();
  });

  it('should render theme selector section', async () => {
    const { getAllByText, findByText, getByTestId } = renderWithLocalProviders(
      <AccountScreen />
    );

    // Aguardar renderização
    await findByText('Profile', {}, { timeout: 3000 });

    // Há dois elementos "Appearance": título da seção e título do ThemeSelector
    // O ThemeSelector usa "Aparência" hardcoded, mas o AccountScreen usa t('account.appearance') que é "Appearance"
    expect(getAllByText('Appearance').length).toBeGreaterThan(0);

    // O ThemeSelector agora usa i18n, então vamos verificar se os testIDs estão presentes
    expect(getByTestId('theme-option-automatic')).toBeTruthy();
    expect(getByTestId('theme-option-light')).toBeTruthy();
    expect(getByTestId('theme-option-dark')).toBeTruthy();
  });

  it('should render settings options', async () => {
    const { getByText, findByText } = renderWithLocalProviders(
      <AccountScreen />
    );

    // Aguardar renderização
    await findByText('Profile', {}, { timeout: 3000 });

    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Privacy')).toBeTruthy();
    expect(getByText('About')).toBeTruthy();
  });

  it('should render logout button', async () => {
    const { findByText } = renderWithLocalProviders(<AccountScreen />);

    // Aguardar renderização
    await findByText('Profile', {}, { timeout: 3000 });

    const logoutButton = await findByText('Logout', {}, { timeout: 3000 });
    expect(logoutButton).toBeTruthy();
  });

  it('should trigger debug alert with theme info', async () => {
    const originalAlert: typeof globalThis.alert = globalThis.alert;
    const alertMock = jest.fn();
    globalThis.alert = alertMock;

    const { findByText } = renderWithLocalProviders(<AccountScreen />);

    // Aguardar renderização
    await findByText('Profile', {}, { timeout: 3000 });

    const debugButton = await findByText(
      '🐛 Debug: View theme detection',
      {},
      { timeout: 3000 }
    );

    await act(async () => {
      fireEvent.press(debugButton);
    });

    expect(alertMock).toHaveBeenCalled();

    globalThis.alert = originalAlert ?? (() => undefined);
  });
});
