import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';

jest.mock('@shared/i18n', () => ({}));

type SplashGlobal = typeof globalThis & { __splashAutoFinish?: boolean };

const getSplashGlobal = (): SplashGlobal => globalThis as SplashGlobal;

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@shared/theme', () => {
  const React = require('react');
  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
  };
});

jest.mock('@shared/components', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    ThemedStatusBar: () => React.createElement(Text, null, 'status-bar'),
    DebugConsole: () => null,
  };
});

jest.mock('@core/navigation/AppNavigator', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    AppNavigator: () => React.createElement(Text, null, 'app-navigator'),
  };
});

jest.mock('@features/splash_screen', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    SplashScreenComponent: ({ onFinish }: { onFinish: () => void }) => {
      React.useEffect(() => {
        if (getSplashGlobal().__splashAutoFinish) {
          onFinish?.();
        }
      }, [onFinish]);
      return React.createElement(Text, null, 'splash-screen');
    },
  };
});

const setSplashAutoFinish = (value: boolean) => {
  getSplashGlobal().__splashAutoFinish = value;
};

jest.mock(
  '@features/onboarding/presentation/hooks/useOnboardingStorage',
  () => ({
    useOnboardingStorage: jest.fn(),
  })
);

jest.mock('@features/onboarding', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    OnboardingScreen: ({
      onFinish,
      onSkip,
    }: {
      onFinish: () => void;
      onSkip: () => void;
    }) =>
      React.createElement(
        React.Fragment,
        null,
        React.createElement(Text, null, 'onboarding-screen'),
        React.createElement(
          Text,
          { testID: 'finish', onPress: onFinish },
          'finish'
        ),
        React.createElement(Text, { testID: 'skip', onPress: onSkip }, 'skip')
      ),
  };
});

jest.mock(
  '@features/onboarding/presentation/constants/onboarding.constants',
  () => ({
    FORCE_SHOW_ONBOARDING: false,
  })
);

jest.mock('@shared/hooks', () => ({
  useFonts: jest.fn(),
}));

jest.mock('@features/onboarding/presentation/contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) =>
    require('react').createElement(require('react').Fragment, null, children),
  useAuthContext: jest.fn(),
}));

const mockUseFonts = jest.requireMock('@shared/hooks').useFonts as jest.Mock;
const mockUseOnboardingStorage = jest.requireMock(
  '@features/onboarding/presentation/hooks/useOnboardingStorage'
).useOnboardingStorage as jest.Mock;
const mockUseAuthContext = jest.requireMock(
  '@features/onboarding/presentation/contexts/AuthContext'
).useAuthContext as jest.Mock;

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setSplashAutoFinish(false);
    // Default mock for AuthContext
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      token: null,
      login: jest.fn(),
      logout: jest.fn(),
    });
  });

  it('renders status bar when fonts are not loaded', () => {
    mockUseFonts.mockReturnValue({ fontsLoaded: false });
    mockUseOnboardingStorage.mockReturnValue({
      hasSeenOnboarding: false,
      isLoading: false,
      markOnboardingAsSeen: jest.fn(),
    });

    const { getByText } = render(<App />);

    expect(getByText('status-bar')).toBeTruthy();
  });

  it('shows splash screen before app is ready', () => {
    mockUseFonts.mockReturnValue({ fontsLoaded: true });
    mockUseOnboardingStorage.mockReturnValue({
      hasSeenOnboarding: false,
      isLoading: false,
      markOnboardingAsSeen: jest.fn(),
    });
    setSplashAutoFinish(false);

    const { getByText } = render(<App />);

    expect(getByText('splash-screen')).toBeTruthy();
  });

  it('shows loading state while onboarding storage is loading', async () => {
    mockUseFonts.mockReturnValue({ fontsLoaded: true });
    mockUseOnboardingStorage.mockReturnValue({
      hasSeenOnboarding: false,
      isLoading: true,
      markOnboardingAsSeen: jest.fn(),
    });
    setSplashAutoFinish(true);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('status-bar')).toBeTruthy();
    });
  });

  it('renders onboarding when user has not seen it', async () => {
    const markOnboardingAsSeen = jest.fn();
    mockUseFonts.mockReturnValue({ fontsLoaded: true });
    mockUseOnboardingStorage.mockReturnValue({
      hasSeenOnboarding: false,
      isLoading: false,
      markOnboardingAsSeen,
    });
    setSplashAutoFinish(true);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('onboarding-screen')).toBeTruthy();
    });
  });

  it('renders app navigator when onboarding is completed', async () => {
    mockUseFonts.mockReturnValue({ fontsLoaded: true });
    mockUseOnboardingStorage.mockReturnValue({
      hasSeenOnboarding: true,
      isLoading: false,
      markOnboardingAsSeen: jest.fn(),
    });
    mockUseAuthContext.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
      user: { id: '1', email: 'test@example.com' },
      token: 'token',
      login: jest.fn(),
      logout: jest.fn(),
    });
    setSplashAutoFinish(true);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('app-navigator')).toBeTruthy();
    });
  });

  it('marks onboarding as seen when finishing onboarding', async () => {
    const markOnboardingAsSeen = jest.fn();
    mockUseFonts.mockReturnValue({ fontsLoaded: true });
    mockUseOnboardingStorage.mockReturnValue({
      hasSeenOnboarding: false,
      isLoading: false,
      markOnboardingAsSeen,
    });
    setSplashAutoFinish(true);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('onboarding-screen')).toBeTruthy();
    });

    getByText('finish').props.onPress();

    expect(markOnboardingAsSeen).toHaveBeenCalled();
  });

  it('marks onboarding as seen when skipping onboarding', async () => {
    const markOnboardingAsSeen = jest.fn();
    mockUseFonts.mockReturnValue({ fontsLoaded: true });
    mockUseOnboardingStorage.mockReturnValue({
      hasSeenOnboarding: false,
      isLoading: false,
      markOnboardingAsSeen,
    });
    setSplashAutoFinish(true);

    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(getByText('onboarding-screen')).toBeTruthy();
    });

    getByText('skip').props.onPress();

    expect(markOnboardingAsSeen).toHaveBeenCalled();
  });
});
