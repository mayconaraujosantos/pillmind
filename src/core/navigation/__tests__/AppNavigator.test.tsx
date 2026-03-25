import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';
import { AppNavigator } from '../AppNavigator';
import { ThemeProvider } from '@shared/theme';

const mockTabNavigate = jest.fn();

// Mock AuthContext
jest.mock('@features/onboarding/presentation/contexts/AuthContext', () => ({
  useAuthContext: () => ({
    user: { name: 'Test User', email: 'test@example.com' },
    displayPictureUrl: undefined,
    setProfilePhotoUri: jest.fn(),
    applyServerUser: jest.fn(),
    isAuthenticated: true,
    isLoading: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    signInWithGoogle: jest.fn(),
  }),
}));

// Lightweight theme mock to avoid async ThemeProvider side effects in tests
jest.mock('@shared/theme', () => {
  const React = require('react');
  const mockTheme = {
    colors: {
      primary: '#000',
      text: '#000',
      textSecondary: '#666',
      background: '#fff',
      border: '#ccc',
      surface: '#f5f5f5',
      placeholder: '#999',
      error: '#f00',
    },
  };

  return {
    ThemeProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement(React.Fragment, null, children),
    useTheme: () => ({
      theme: mockTheme,
      isDark: false,
      setThemeMode: jest.fn(),
      toggleTheme: jest.fn(),
    }),
  };
});

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

// Mock dependencies
jest.mock('@react-navigation/native', () => ({
  NavigationContainer: ({ children }: { children: unknown }) => children,
}));

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  return {
    createBottomTabNavigator: () => ({
      Navigator: ({
        children,
        screenOptions,
      }: {
        children: unknown;
        screenOptions?: (args: {
          route: { name: string };
          navigation: { navigate: (...a: unknown[]) => void };
        }) => Record<string, unknown>;
      }) => {
        if (typeof screenOptions === 'function') {
          screenOptions({
            route: { name: 'HomeTab' },
            navigation: { navigate: mockTabNavigate },
          });
        }
        return React.createElement(React.Fragment, null, children);
      },
      Screen: ({ component: Component }: { component: React.ComponentType }) =>
        React.createElement(Component),
    }),
  };
});

jest.mock('@react-navigation/native-stack', () => {
  const React = require('react');
  return {
    createNativeStackNavigator: () => ({
      Navigator: ({ children }: { children: React.ReactNode }) =>
        React.createElement(React.Fragment, null, children),
      Screen: ({ component: Component }: { component: React.ComponentType }) =>
        React.createElement(Component),
    }),
  };
});

// Mock all screen components
jest.mock('@features/home/presentation/screens/HomeScreen', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    HomeScreen: () =>
      React.createElement(
        RN.View,
        { testID: 'home-screen' },
        React.createElement(RN.Text, null, 'Home Screen')
      ),
  };
});

jest.mock('@features/home/presentation/screens/MedicineFormScreen', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    MedicineFormScreen: () =>
      React.createElement(
        RN.View,
        { testID: 'medicine-form-screen' },
        React.createElement(RN.Text, null, 'Medicine Form')
      ),
  };
});

jest.mock(
  '@features/appointments/presentation/screens/AppointmentsScreen',
  () => {
    const React = require('react');
    const RN = require('react-native');
    return {
      AppointmentsScreen: () =>
        React.createElement(
          RN.View,
          { testID: 'appointments-screen' },
          React.createElement(RN.Text, null, 'Appointments Screen')
        ),
    };
  }
);

jest.mock('@features/account/navigation/AccountNavigator', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    AccountNavigator: () =>
      React.createElement(
        RN.View,
        { testID: 'account-screen' },
        React.createElement(RN.Text, null, 'Account Screen')
      ),
  };
});

jest.mock('@features/parental/presentation/screens/ParentalScreen', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    ParentalScreen: () =>
      React.createElement(
        RN.View,
        { testID: 'parental-screen' },
        React.createElement(RN.Text, null, 'Parental Screen')
      ),
  };
});

jest.mock('@features/nearby/presentation/screens/NearbyScreen', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    NearbyScreen: () =>
      React.createElement(
        RN.View,
        { testID: 'nearby-screen' },
        React.createElement(RN.Text, null, 'Nearby Screen')
      ),
  };
});

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Ionicons: (props: { name: string; size: number; color: string }) =>
      React.createElement(
        RN.View,
        {
          testID: `icon-${props.name}`,
          style: { width: props.size, height: props.size },
        },
        React.createElement(
          RN.Text,
          { style: { color: props.color } },
          props.name
        )
      ),
  };
});

describe('AppNavigator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockTabNavigate.mockClear();
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('renders without crashing', () => {
    expect(() => renderWithProviders(<AppNavigator />)).not.toThrow();
  });

  it('should have correct structure', () => {
    const { toJSON } = renderWithProviders(<AppNavigator />);
    expect(toJSON()).toBeTruthy();
  });

  it('should render all screens', () => {
    const { getByTestId } = renderWithProviders(<AppNavigator />);
    expect(getByTestId('home-screen')).toBeTruthy();
    expect(getByTestId('appointments-screen')).toBeTruthy();
    expect(getByTestId('account-screen')).toBeTruthy();
    expect(getByTestId('parental-screen')).toBeTruthy();
    expect(getByTestId('nearby-screen')).toBeTruthy();
  });

  it('should render all screen texts', () => {
    const { getByText } = renderWithProviders(<AppNavigator />);
    expect(getByText('Home Screen')).toBeTruthy();
    expect(getByText('Appointments Screen')).toBeTruthy();
    expect(getByText('Account Screen')).toBeTruthy();
    expect(getByText('Parental Screen')).toBeTruthy();
    expect(getByText('Nearby Screen')).toBeTruthy();
  });
});
