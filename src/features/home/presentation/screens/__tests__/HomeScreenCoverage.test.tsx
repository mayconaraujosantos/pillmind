import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from '../HomeScreen';
import { ThemeProvider } from '@shared/theme';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: jest.fn(),
    getParent: () => ({ navigate: jest.fn() }),
  }),
  useFocusEffect: (cb: () => void) => {
    cb();
  },
}));

// Mock i18n (referência estável de `t` para useMemo no HomeScreen)
jest.mock('@shared/i18n', () => {
  const coverageTranslations: Record<string, string> = {
    'common.error': 'Error',
    'common.retry': 'Retry',
    'common.ok': 'OK',
    'home.noMedicationsScheduled': 'No medications scheduled',
    'home.addFirstMedication': 'Add your first medication to get started',
    'home.addMedication': 'Add Medication',
    'home.viewAll': 'View All',
    'home.viewLess': 'View Less',
    'home.todayLabel': 'Today',
    'home.dateLabel': 'Date',
    'home.greetingHi': 'Hello',
    'home.greetingMorning': 'Good morning',
    'home.greetingAfternoon': 'Good afternoon',
    'home.greetingEvening': 'Good evening',
    'home.heroSubtitle': 'Your overview',
    'home.notificationBadgeA11y': 'Badge',
    'home.yourMedications': 'Your Medications',
    'home.loadingMedications': 'Loading…',
    'home.refreshingMedications': 'Refreshing…',
    'account.user': 'User',
    'account.notificationsComingSoon': 'Soon',
    'home.notificationsA11y': 'Notifications',
    'home.openProfileA11y': 'Profile',
    'home.searchPlaceholder': 'Search reminder',
    'home.searchPlaceholderDots': 'Search...',
    'home.quickStatScheduled': 'Scheduled today',
    'home.quickStatNextDose': 'Next dose',
    'home.quickStatAdherence': 'Adherence',
    'home.quickStatNoNextDose': 'No time',
    'home.quickStatPastDay': '—',
    'home.hydrationLikeTitle': 'Reminder consistency',
    'home.thisWeekLabel': 'This week',
    'home.markAsTaken': 'Mark next as taken',
    'home.dosesShort': 'Doses',
    'home.markDoseCta': 'Log dose',
    'home.addDoseQuickA11y': 'Quick add',
    'home.cardStatMenuA11y': 'Menu',
    'home.statCardMenuTitle': 'Soon',
    'home.statCardMenuMessage': 'Later',
    'home.dailyTargetTitle': 'Daily target',
    'home.dailyTargetSubtitle': 'Track doses',
    'home.viewModeToday': 'Today',
    'home.viewModeWeek': 'Week',
    'home.viewModeMonth': 'Month',
    'home.calendarPrevWeekA11y': 'Previous week',
    'home.calendarNextWeekA11y': 'Next week',
    'home.noFixedAlarmTimes': 'No fixed times',
    'home.scheduleSectionEyebrow': 'Schedule',
    'home.todayPlanEyebrow': 'Today',
    'home.addMedicineShort': 'Add',
    'home.editMedication': 'Edit',
    'home.pickAnotherDay': 'Pick another day',
    'home.deleteMedicationTitle': 'Remove',
    'home.deleteMedicationMessage': 'Remove {{name}}?',
    'home.deleteMedication': 'Delete',
    'home.medicineRowMenuA11y': 'Menu',
    'home.markDoseCheckboxA11y': 'Mark dose',
    'home.quickAddDoseTitle': 'Dose',
    'home.quickAddDoseMessage': 'Soon',
    'common.cancel': 'Cancel',
  };

  const coverageT = (key: string, opts?: Record<string, number | string>) => {
    if (key === 'home.dailyTargetDoseLine') {
      const taken = opts?.taken ?? 0;
      const total = opts?.total ?? 1;
      return `${taken} of ${total} doses today`;
    }
    return coverageTranslations[key] || key;
  };

  return {
    useTranslation: () => ({
      i18n: { language: 'en' },
      ready: true,
      t: coverageT,
    }),
  };
});

jest.mock('@features/onboarding', () => ({
  useOnboardingStorage: () => ({
    resetOnboarding: jest.fn(),
  }),
}));

jest.mock('@features/onboarding/presentation/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    displayPictureUrl: undefined,
    token: 'token',
    login: jest.fn(),
    logout: jest.fn(),
  }),
}));

const mockRefresh = jest.fn();
const mockSyncMedicines = jest.fn();
const mockDeleteMedicine = jest.fn();

const mockUseHomeMedicines = jest.fn();
jest.mock('../../hooks/useHomeMedicines', () => ({
  useHomeMedicines: () => mockUseHomeMedicines(),
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('HomeScreen - Coverage Tests', () => {
  beforeEach(() => {
    mockRefresh.mockClear();
    mockSyncMedicines.mockClear();
    mockDeleteMedicine.mockClear();
    mockUseHomeMedicines.mockReset();
    mockUseHomeMedicines.mockReturnValue({
      medicines: [],
      loading: false,
      refreshing: false,
      error: null,
      refetch: jest.fn(),
      refresh: mockRefresh,
      syncMedicines: mockSyncMedicines,
      createMedicine: jest.fn(),
      updateMedicine: jest.fn(),
      deleteMedicine: mockDeleteMedicine,
    });
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('automatic');
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(10);
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should surface API error via alert', async () => {
    mockUseHomeMedicines.mockImplementation(() => ({
      medicines: [],
      loading: false,
      refreshing: false,
      error: 'Network error',
      refetch: jest.fn(),
      refresh: mockRefresh,
      syncMedicines: mockSyncMedicines,
      createMedicine: jest.fn(),
      updateMedicine: jest.fn(),
      deleteMedicine: mockDeleteMedicine,
    }));

    renderWithTheme(<HomeScreen />);

    await waitFor(
      () => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Error',
          'Network error',
          expect.any(Array)
        );
      },
      { timeout: 5000 }
    );
  });

  it('should handle medicines list with view toggle', async () => {
    // Test with many medicines to trigger "View All" functionality
    const medicines = Array.from({ length: 7 }, (_, i) => ({
      id: `med-${i}`,
      name: `Medicine ${i}`,
      dosage: '1mg',
      frequency: 'once-a-day',
      times: [] as string[],
      startDate: new Date('2024-01-01'),
    }));

    mockUseHomeMedicines.mockReturnValue({
      medicines,
      loading: false,
      refreshing: false,
      error: null,
      refetch: jest.fn(),
      refresh: mockRefresh,
      syncMedicines: mockSyncMedicines,
      createMedicine: jest.fn(),
      updateMedicine: jest.fn(),
      deleteMedicine: mockDeleteMedicine,
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
    mockUseHomeMedicines.mockReturnValue({
      medicines: [],
      loading: true,
      refreshing: false,
      error: null,
      refetch: jest.fn(),
      refresh: mockRefresh,
      syncMedicines: mockSyncMedicines,
      createMedicine: jest.fn(),
      updateMedicine: jest.fn(),
      deleteMedicine: mockDeleteMedicine,
    });

    // Should not throw an error during rendering in loading state
    expect(() => {
      renderWithTheme(<HomeScreen />);
    }).not.toThrow();
  });

  it('should render with refreshing state', async () => {
    mockUseHomeMedicines.mockReturnValue({
      medicines: [],
      loading: false,
      refreshing: true,
      error: null,
      refetch: jest.fn(),
      refresh: mockRefresh,
      syncMedicines: mockSyncMedicines,
      createMedicine: jest.fn(),
      updateMedicine: jest.fn(),
      deleteMedicine: mockDeleteMedicine,
    });

    const { getByText } = renderWithTheme(<HomeScreen />);

    // Component should render without errors when refreshing
    await waitFor(() => {
      expect(getByText('No medications scheduled')).toBeTruthy();
    });
  });
});
