/* eslint-disable no-undef, @typescript-eslint/no-require-imports */
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native';

// ============================================================================
// GLOBAL MOCKS - Applied to all test files
// ============================================================================

// Mock AsyncStorage globally
jest.mock('@react-native-async-storage/async-storage', () => ({
  // Default to null; individual tests can override per-key as needed
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock react-native useColorScheme
jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(() => 'light'),
}));

// Mock react-native Appearance API
jest.mock('react-native/Libraries/Utilities/Appearance', () => ({
  getColorScheme: jest.fn(() => 'light'),
  addChangeListener: jest.fn(() => ({ remove: jest.fn() })),
}));

// Mock SafeAreaContext globally
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  return {
    SafeAreaProvider: ({ children }) =>
      React.createElement(React.Fragment, null, children),
    useSafeAreaInsets: () => ({
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    }),
  };
});

// ============================================================================
// GLOBAL RENDER HELPERS - For common provider patterns
// ============================================================================

/**
 * Render component with ThemeProvider
 * @param {React.ReactElement} component
 * @returns {import('@testing-library/react-native').RenderResult}
 */
globalThis.renderWithTheme = (component) => {
  const { ThemeProvider } = require('./src/shared/theme');
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

/**
 * Render component with ThemeProvider + AuthProvider
 * @param {React.ReactElement} component
 * @returns {import('@testing-library/react-native').RenderResult}
 */
globalThis.renderWithProviders = (component) => {
  const React = require('react');
  const { ThemeProvider } = require('./src/shared/theme');
  const {
    AuthProvider,
  } = require('./src/features/onboarding/presentation/contexts/AuthContext');

  return render(
    <ThemeProvider>
      <AuthProvider>{component}</AuthProvider>
    </ThemeProvider>
  );
};

/**
 * Render component with custom providers array
 * Useful for custom provider combinations
 * @param {React.ReactElement} component
 * @param {Array<(children: React.ReactNode) => React.ReactElement>} providers
 * @returns {import('@testing-library/react-native').RenderResult}
 */
globalThis.renderWithCustomProviders = (component, providers = []) => {
  let wrapped = component;

  // Apply providers in reverse order (last provider becomes outermost)
  for (let i = providers.length - 1; i >= 0; i--) {
    wrapped = providers[i](wrapped);
  }

  return render(wrapped);
};
