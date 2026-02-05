import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from '../HomeScreen';
import { ThemeProvider } from '@shared/theme';

// Mock i18n
jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.noMedicationsScheduled': 'No medications scheduled',
        'home.addFirstMedication': 'Add your first medication to get started',
        'home.addMedication': 'Add Medication',
        'home.viewAll': 'View All',
        'home.viewLess': 'View Less',
        'home.todayLabel': 'Today',
        'home.dateLabel': 'Date',
      };
      return translations[key] || key;
    },
  }),
}));

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
    const { getByText, getByTestId } = renderWithTheme(<HomeScreen />);

    await waitFor(() => {
      // Verifica se o ScrollView est\u00e1 presente
      expect(getByTestId('home-scroll-view')).toBeTruthy();
      // Como n\u00e3o h\u00e1 medicamentos, deve mostrar o empty state
      expect(getByText('No medications scheduled')).toBeTruthy();
    });
  });

  it('should render screen wrapper', async () => {
    const result = renderWithTheme(<HomeScreen />);

    await waitFor(() => {
      expect(result).toBeTruthy();
    });
  });
});
