import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import App from '../App';
const globalWithSplash = globalThis as typeof globalThis & {
  __splashAutoFinish?: boolean;
};

jest.mock('@shared/i18n', () => ({}));

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('@shared/theme', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

jest.mock('@shared/components', () => {
  const { Text } = require('react-native');
  return {
    ThemedStatusBar: () => <Text>status-bar</Text>,
  };
});

jest.mock('@core/navigation/AppNavigator', () => {
  const { Text } = require('react-native');
  return {
    AppNavigator: () => <Text>app-navigator</Text>,
  };
});

jest.mock('@features/splash_screen', () => {
  const { Text } = require('react-native');
  return {
    SplashScreenComponent: ({ onFinish }: { onFinish: () => void }) => {
      React.useEffect(() => {
        if (globalWithSplash.__splashAutoFinish) {
          onFinish?.();
        }
      }, [onFinish]);
      return <Text>splash-screen</Text>;
    },
  };
});

const setSplashAutoFinish = (value: boolean) => {
  globalWithSplash.__splashAutoFinish = value;
};

jest.mock(
  '@features/onboarding/presentation/hooks/useOnboardingStorage',
  () => ({
    useOnboardingStorage: jest.fn(),
  })
);

jest.mock('@features/onboarding', () => {
  const { Text } = require('react-native');
  return {
    OnboardingScreen: ({
      onFinish,
      onSkip,
    }: {
      onFinish: () => void;
      onSkip: () => void;
    }) => (
      <>
        <Text>onboarding-screen</Text>
        <Text testID="finish" onPress={onFinish}>
          finish
        </Text>
        <Text testID="skip" onPress={onSkip}>
          skip
        </Text>
      </>
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

const mockUseFonts = jest.requireMock('@shared/hooks').useFonts as jest.Mock;
const mockUseOnboardingStorage = jest.requireMock(
  '@features/onboarding/presentation/hooks/useOnboardingStorage'
).useOnboardingStorage as jest.Mock;

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setSplashAutoFinish(false);
  });

  it('renders nothing when fonts are not loaded', () => {
    mockUseFonts.mockReturnValue({ fontsLoaded: false });
    mockUseOnboardingStorage.mockReturnValue({
      hasSeenOnboarding: false,
      isLoading: false,
      markOnboardingAsSeen: jest.fn(),
    });

    const { toJSON } = render(<App />);

    expect(toJSON()).toBeNull();
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
