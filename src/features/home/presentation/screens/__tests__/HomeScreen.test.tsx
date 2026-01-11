import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from '../HomeScreen';
import { ThemeProvider } from '@shared/theme';

jest.mock('@features/onboarding', () => ({
  useOnboardingStorage: () => ({
    resetOnboarding: jest.fn(),
  }),
}));

jest.mock('@features/onboarding/presentation/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { id: '1', email: 'test@example.com' },
    token: 'token',
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

jest.mock('../../hooks/useHomeData', () => ({
  useHomeData: jest.fn(() => ({
    medicines: [],
    loading: false,
    refreshing: false,
    error: null,
    refetch: jest.fn(),
    refresh: jest.fn(),
  })),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('HomeScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render home screen with welcome message', async () => {
    const { getByText } = renderWithTheme(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('PillMind Home')).toBeTruthy();
      expect(getByText('Welcome to your medication assistant!')).toBeTruthy();
    });
  });

  it('should render screen wrapper', async () => {
    const result = renderWithTheme(<HomeScreen />);

    await waitFor(() => {
      expect(result).toBeTruthy();
    });
  });
});
