import React from 'react';
import { Alert, Appearance } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { AccountScreen } from '../AccountScreen';

const mockLogout = jest.fn();
const mockAuthLogout = jest.fn();

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        background: '#fff',
        text: '#000',
        textSecondary: '#666',
        surface: '#f4f4f4',
        border: '#ddd',
        primary: '#0f0',
        error: '#f00',
        info: '#00f',
      },
    },
    isDark: false,
    themeMode: 'light',
  }),
}));

jest.mock('@features/onboarding/presentation/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: { name: 'User', email: 'user@example.com' },
    logout: mockAuthLogout,
  }),
}));

jest.mock('@features/onboarding/presentation/hooks/useAuth', () => ({
  useAuth: () => ({
    logout: mockLogout,
  }),
}));

jest.mock('@shared/components', () => ({
  ThemeSelector: () => null,
}));

describe('AccountScreen logout', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('light');
    mockLogout.mockReset();
    mockAuthLogout.mockReset();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('logs out successfully', async () => {
    mockLogout.mockReturnValue({ success: true });

    const { getByText } = render(<AccountScreen />);

    fireEvent.press(getByText('common.logout'));

    const [[, , buttons]] = (Alert.alert as jest.Mock).mock.calls;
    const confirmButton = buttons?.find(
      (btn: { style?: string }) => btn.style === 'destructive'
    );

    await act(async () => {
      await confirmButton.onPress();
    });

    await waitFor(() => {
      expect(mockAuthLogout).toHaveBeenCalled();
    });
  });

  it('shows alert when logout fails', async () => {
    mockLogout.mockReturnValue({ success: false, error: 'fail' });

    const { getByText } = render(<AccountScreen />);

    fireEvent.press(getByText('common.logout'));

    const [[, , buttons]] = (Alert.alert as jest.Mock).mock.calls;
    const confirmButton = buttons?.find(
      (btn: { style?: string }) => btn.style === 'destructive'
    );

    await act(async () => {
      await confirmButton.onPress();
    });

    expect(Alert.alert).toHaveBeenCalledWith(
      'common.error',
      'account.logoutFailed'
    );
  });
});
