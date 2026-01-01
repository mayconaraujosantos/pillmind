import '@testing-library/jest-native/extend-expect';
import React from 'react';
import { render } from '@testing-library/react-native';

// Mock AsyncStorage globally
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve('automatic')),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
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
global.renderWithTheme = (component) => {
  const { ThemeProvider } = require('./src/shared/theme');
  return render(<ThemeProvider>{component}</ThemeProvider>);
};
