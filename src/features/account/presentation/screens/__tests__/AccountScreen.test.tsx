import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AccountScreen } from '../AccountScreen';
import { ThemeProvider } from '@shared/theme';
import { AuthProvider } from '@features/onboarding/presentation/contexts/AuthContext';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
    back: jest.fn(),
  }),
}));

jest.mock('expo-image-picker', () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  requestCameraPermissionsAsync: jest.fn(() =>
    Promise.resolve({ status: 'granted' })
  ),
  launchImageLibraryAsync: jest.fn(() =>
    Promise.resolve({ canceled: true, assets: [] })
  ),
  launchCameraAsync: jest.fn(() =>
    Promise.resolve({ canceled: true, assets: [] })
  ),
}));

jest.mock('@features/onboarding/domain/services/auth.service', () => ({
  authService: {
    getProfile: jest.fn(() =>
      Promise.resolve({ success: false, error: { status: 500 } })
    ),
    uploadProfilePicture: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: '1',
          name: 'User',
          email: 'u@u.com',
          pictureUrl: 'https://example.com/p.jpg',
        },
      })
    ),
    deleteProfilePicture: jest.fn(() =>
      Promise.resolve({
        success: true,
        data: {
          id: '1',
          name: 'User',
          email: 'u@u.com',
          pictureUrl: null,
        },
      })
    ),
  },
}));

jest.mock('@features/onboarding/domain/services/oauth.service', () => ({
  oauthService: {
    signInWithGoogle: jest.fn(),
    isSignedIn: jest.fn(() => Promise.resolve(false)),
    signOutGoogle: jest.fn(),
  },
}));

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
  const translations: Record<string, string> = {
    'account.user': 'User',
    'account.email': 'usuario@pillmind.com',
    'account.editProfile': 'Edit profile',
    'account.appearance': 'Appearance',
    'account.settings': 'Settings',
    'account.notifications': 'Notifications',
    'account.privacy': 'Privacy',
    'account.about': 'About',
    'account.debugTheme': '🐛 Debug: View theme detection',
    'account.addAnotherAccount': 'Add another account',
    'account.addAccountComingSoon': 'Coming soon',
    'common.logout': 'Logout',
    'common.cancel': 'Cancel',
    'common.error': 'Error',
  };
  return {
    useTranslation: () => ({
      t: (key: string) => translations[key] || key,
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
    (AsyncStorage.getItem as jest.Mock).mockImplementation((key: string) => {
      if (key === '@pillmind_auth') {
        return Promise.resolve(
          JSON.stringify({
            user: {
              id: '1',
              name: 'User',
              email: 'usuario@pillmind.com',
            },
            token: 'test-token',
          })
        );
      }
      return Promise.resolve('automatic');
    });
  });

  it('should render profile row with user and email', async () => {
    const { findByTestId, getByText } = renderWithLocalProviders(
      <AccountScreen />
    );

    await findByTestId('account-profile-row', {}, { timeout: 3000 });
    expect(getByText('User')).toBeTruthy();
    expect(getByText('usuario@pillmind.com')).toBeTruthy();
  });

  it('should render theme selector section', async () => {
    const { findByTestId, getByTestId } = renderWithLocalProviders(
      <AccountScreen />
    );

    await findByTestId('account-profile-row', {}, { timeout: 3000 });
    expect(getByTestId('theme-option-automatic')).toBeTruthy();
    expect(getByTestId('theme-option-light')).toBeTruthy();
    expect(getByTestId('theme-option-dark')).toBeTruthy();
  });

  it('should render settings options', async () => {
    const { getByText, findByTestId } = renderWithLocalProviders(
      <AccountScreen />
    );

    await findByTestId('account-profile-row', {}, { timeout: 3000 });

    expect(getByText('Settings')).toBeTruthy();
    expect(getByText('Notifications')).toBeTruthy();
    expect(getByText('Privacy')).toBeTruthy();
    expect(getByText('About')).toBeTruthy();
  });

  it('should render logout button', async () => {
    const { findByText, findByTestId } = renderWithLocalProviders(
      <AccountScreen />
    );

    await findByTestId('account-profile-row', {}, { timeout: 3000 });

    const logoutButton = await findByText('Logout', {}, { timeout: 3000 });
    expect(logoutButton).toBeTruthy();
  });

  it('should trigger debug alert with theme info', async () => {
    const originalAlert: typeof globalThis.alert = globalThis.alert;
    const alertMock = jest.fn();
    globalThis.alert = alertMock;

    const { findByText, findByTestId } = renderWithLocalProviders(
      <AccountScreen />
    );

    await findByTestId('account-profile-row', {}, { timeout: 3000 });

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

  it('navigates to EditProfile when profile row is pressed', async () => {
    const { findByTestId } = renderWithLocalProviders(<AccountScreen />);

    await findByTestId('account-profile-row', {}, { timeout: 3000 });

    await act(async () => {
      fireEvent.press(await findByTestId('account-profile-row'));
    });

    expect(mockPush).toHaveBeenCalledWith('/(tabs)/account/edit-profile');
  });
});
