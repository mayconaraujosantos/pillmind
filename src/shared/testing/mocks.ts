/**
 * Common mocks for testing
 * Import these in your test files to avoid repetition
 */

/**
 * Create a mock useAuth hook
 */
export const createMockUseAuth = (overrides = {}) => ({
  logout: jest.fn(() => ({ success: true })),
  signIn: jest.fn(),
  signUp: jest.fn(),
  loading: false,
  error: null,
  ...overrides,
});

/**
 * Create a mock useTranslation hook
 */
export const createMockUseTranslation = (
  translations: Record<string, string> = {}
) => {
  const defaultTranslations: Record<string, string> = {
    'account.title': 'Profile',
    'account.user': 'User',
    'account.email': 'usuario@pillmind.com',
    'account.appearance': 'Appearance',
    'account.settings': 'Settings',
    'account.notifications': 'Notifications',
    'account.privacy': 'Privacy',
    'account.about': 'About',
    'account.debugTheme': '🐛 Debug: View theme detection',
    ...translations,
  };

  return {
    useTranslation: jest.fn(() => ({
      t: (key: string) => defaultTranslations[key] || key,
      i18n: { language: 'en' },
    })),
  };
};

/**
 * Create a mock useOnboardingScroll hook
 */
export const createMockUseOnboardingScroll = (overrides = {}) => ({
  currentStep: 0,
  handleScroll: jest.fn(),
  ...overrides,
});

/**
 * Create a mock useSplashScreen hook
 */
export const createMockUseSplashScreen = (overrides = {}) => ({
  isReady: false,
  error: null,
  ...overrides,
});

/**
 * Create a mock useHomeData hook
 */
export const createMockUseHomeData = (overrides = {}) => ({
  isLoading: false,
  error: null,
  todayMedications: [],
  upcomingMedications: [],
  completedMedications: [],
  ...overrides,
});

/**
 * Mock setup for navigation (React Navigation)
 */
export const mockNavigationSetup = () => {
  const mockNavigate = jest.fn();
  const mockGoBack = jest.fn();
  const mockPush = jest.fn();

  return {
    mockNavigate,
    mockGoBack,
    mockPush,
    navigationMock: {
      navigate: mockNavigate,
      goBack: mockGoBack,
      push: mockPush,
    },
  };
};

/**
 * Setup common screen mocks for navigation testing
 */
export const setupScreenMocks = () => {
  jest.mock('@features/home/presentation/screens/HomeScreen', () => ({
    HomeScreen: () => null,
  }));

  jest.mock('@features/account/navigation/AccountNavigator', () => ({
    AccountNavigator: () => null,
  }));

  jest.mock('@features/nearby/presentation/screens/NearbyScreen', () => ({
    NearbyScreen: () => null,
  }));

  jest.mock('@features/parental/presentation/screens/ParentalScreen', () => ({
    ParentalScreen: () => null,
  }));
};

/**
 * Create a mock authentication response
 */
export const createMockAuthResponse = (overrides = {}) => ({
  user: {
    id: '123',
    name: 'Test User',
    email: 'test@example.com',
  },
  token: 'mock-jwt-token',
  ...overrides,
});

/**
 * Create a mock error
 */
export const createMockError = (
  message = 'Test Error',
  code = 'TEST_ERROR'
) => ({
  message,
  code,
});
