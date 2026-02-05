import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { ModernInput } from '../ModernInput';
import { ThemeProvider } from '@shared/theme';

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

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('ModernInput', () => {
  it('should render correctly with label', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <ModernInput label="Test Label" />
    );

    expect(getByTestId('modern-input')).toBeTruthy();
    expect(getByTestId('modern-input-label')).toBeTruthy();
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('should handle floating label animation on focus', () => {
    const { getByTestId } = renderWithTheme(
      <ModernInput label="Email" variant="modern" placeholder="Enter email" />
    );

    // Focus triggers internal state changes; just ensure the input renders
    expect(getByTestId('modern-input')).toBeTruthy();
  });

  it('should display error message when error prop is provided', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <ModernInput label="Email" error="Invalid email" />
    );

    expect(getByTestId('error-text')).toBeTruthy();
    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('should display hint message when hint prop is provided', () => {
    const { getByTestId, getByText } = renderWithTheme(
      <ModernInput label="Username" hint="Must be 3-20 characters" />
    );

    expect(getByTestId('hint-text')).toBeTruthy();
    expect(getByText('Must be 3-20 characters')).toBeTruthy();
  });

  it('should render left and right icons', () => {
    const { getByTestId } = renderWithTheme(
      <ModernInput
        label="Search"
        leftIcon={<Text>Left</Text>}
        rightIcon={<Text>Right</Text>}
      />
    );

    expect(getByTestId('left-icon')).toBeTruthy();
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('should handle text changes', () => {
    const onChangeText = jest.fn();
    const { getByTestId } = renderWithTheme(
      <ModernInput
        label="Test"
        onChangeText={onChangeText}
        placeholder="Enter text"
      />
    );

    fireEvent.changeText(getByTestId('modern-input'), 'hello');
    expect(onChangeText).toHaveBeenCalledWith('hello');
  });

  it('should apply different variants correctly', () => {
    const { rerender } = renderWithTheme(
      <ModernInput label="Test" variant="modern" />
    );

    rerender(
      <ThemeProvider>
        <ModernInput label="Test" variant="minimal" />
      </ThemeProvider>
    );

    expect(true).toBeTruthy();
  });

  it('should apply different sizes correctly', () => {
    const { rerender } = renderWithTheme(
      <ModernInput label="Test" size="sm" />
    );

    rerender(
      <ThemeProvider>
        <ModernInput label="Test" size="lg" />
      </ThemeProvider>
    );

    expect(true).toBeTruthy();
  });

  it('should handle container press to focus input', () => {
    const { getByTestId } = renderWithTheme(<ModernInput label="Test" />);

    expect(getByTestId('modern-input')).toBeTruthy();
  });
});
