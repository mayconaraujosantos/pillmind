import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeProvider } from '../ThemeContext';
import { useTheme } from '../useTheme';
import { Text } from 'react-native';

const TestComponent = () => {
  const { theme, themeMode, isDark } = useTheme();

  return (
    <>
      <Text testID="theme-mode">{themeMode}</Text>
      <Text testID="is-dark">{isDark ? 'dark' : 'light'}</Text>
      <Text testID="primary-color">{theme.colors.primary}</Text>
    </>
  );
};

describe('ThemeProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with automatic theme by default', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-mode')).toBeTruthy();
    });

    expect(getByTestId('theme-mode').props.children).toBe('automatic');
  });

  it('should load saved theme from storage', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('theme-mode').props.children).toBe('dark');
    });
  });

  it('should use light colors for light theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('light');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('is-dark').props.children).toBe('light');
      expect(getByTestId('primary-color').props.children).toBe('#007AFF');
    });
  });

  it('should use dark colors for dark theme', async () => {
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue('dark');

    const { getByTestId } = render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(getByTestId('is-dark').props.children).toBe('dark');
      expect(getByTestId('primary-color').props.children).toBe('#0A84FF');
    });
  });

  it('should throw error when useTheme is used outside ThemeProvider', () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    expect(() => {
      render(<TestComponent />);
    }).toThrow('useTheme must be used within a ThemeProvider');

    consoleError.mockRestore();
  });
});
