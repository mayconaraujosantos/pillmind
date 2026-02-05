import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
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

const mockRefetch = jest.fn();
const mockRefresh = jest.fn();

// Mock useHomeData with additional scenarios
const mockUseHomeData = jest.fn();
jest.mock('../../hooks/useHomeData', () => ({
  useHomeData: () => mockUseHomeData(),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('HomeScreen - Coverage Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
  });

  it('should render with error state', async () => {
    mockUseHomeData.mockReturnValue({
      medicines: [],
      loading: false,
      refreshing: false,
      error: 'Network error',
      refetch: mockRefetch,
      refresh: mockRefresh,
    });

    const { getByText } = renderWithTheme(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('No medications scheduled')).toBeTruthy();
    });
  });

  it('should handle medicines list with view toggle', async () => {
    // Test with many medicines to trigger "View All" functionality
    const medicines = Array.from({ length: 7 }, (_, i) => ({
      id: `med-${i}`,
      name: `Medicine ${i}`,
      dosage: '1mg',
      schedule: [],
    }));

    mockUseHomeData.mockReturnValue({
      medicines,
      loading: false,
      refreshing: false,
      error: null,
      refetch: mockRefetch,
      refresh: mockRefresh,
    });

    const { getByText } = renderWithTheme(<HomeScreen />);

    await waitFor(() => {
      expect(getByText('Medicine 0')).toBeTruthy();
      expect(getByText('View All')).toBeTruthy();
    });

    // Test toggle functionality
    fireEvent.press(getByText('View All'));

    await waitFor(() => {
      expect(getByText('View Less')).toBeTruthy();
    });
  });

  it('should render in loading state', () => {
    mockUseHomeData.mockReturnValue({
      medicines: [],
      loading: true,
      refreshing: false,
      error: null,
      refetch: mockRefetch,
      refresh: mockRefresh,
    });

    // Should not throw an error during rendering in loading state
    expect(() => {
      renderWithTheme(<HomeScreen />);
    }).not.toThrow();
  });

  it('should render with refreshing state', async () => {
    mockUseHomeData.mockReturnValue({
      medicines: [],
      loading: false,
      refreshing: true,
      error: null,
      refetch: mockRefetch,
      refresh: mockRefresh,
    });

    const { getByText } = renderWithTheme(<HomeScreen />);

    // Component should render without errors when refreshing
    await waitFor(() => {
      expect(getByText('No medications scheduled')).toBeTruthy();
    });
  });
});
