/* eslint-disable no-undef, @typescript-eslint/no-require-imports */
import '@testing-library/jest-native/extend-expect';
import { render } from '@testing-library/react-native';

// Mock AsyncStorage globally
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('automatic')),
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

// Global render helper with ThemeProvider
globalThis.renderWithTheme = (component) => {
  const { ThemeProvider } = require('./src/shared/theme');
  return render(<ThemeProvider>{component}</ThemeProvider>);
};
