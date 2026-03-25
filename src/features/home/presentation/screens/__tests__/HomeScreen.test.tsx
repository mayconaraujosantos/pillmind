import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HomeScreen } from '../HomeScreen';
import { ThemeProvider } from '@shared/theme';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    getParent: () => ({ navigate: jest.fn() }),
  }),
}));

// Mock i18n
jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    i18n: { language: 'en' },
    ready: true,
    t: (key: string, opts?: Record<string, number | string>) => {
      if (key === 'home.dailyTargetDoseLine') {
        const taken = opts?.taken ?? 0;
        const total = opts?.total ?? 1;
        return `${taken} of ${total} doses today`;
      }
      const translations: Record<string, string> = {
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
    user: { id: '1', name: 'Test User', email: 'test@example.com' },
    displayPictureUrl: undefined,
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
    jest.spyOn(Date.prototype, 'getHours').mockReturnValue(10);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render home screen with welcome message', async () => {
    const { getByText, getByTestId } = renderWithTheme(<HomeScreen />);

    await waitFor(() => {
      expect(getByTestId('home-greeting-hero')).toBeTruthy();
      expect(getByText('Test User')).toBeTruthy();
      expect(getByText('Good morning')).toBeTruthy();
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
