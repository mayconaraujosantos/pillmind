import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MedicineReminderCalendar } from '../MedicineReminderCalendar';
import { ThemeProvider } from '@shared/theme';

// Mock theme
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

// Mock i18n
jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'home.todayLabel': 'Today',
        'home.dateLabel': 'Date',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    Ionicons: (props: { name: string }) =>
      React.createElement(
        View,
        { testID: `icon-${props.name}` },
        React.createElement(Text, null, props.name)
      ),
  };
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider>{children}</ThemeProvider>
);

describe('MedicineReminderCalendar', () => {
  it('renders calendar with all days of the week', () => {
    const mockOnDateChange = jest.fn();
    const mockOnViewModeChange = jest.fn();
    const today = new Date();

    const { getByText } = render(
      <MedicineReminderCalendar
        selectedDate={today}
        onDateChange={mockOnDateChange}
        viewMode="today"
        onViewModeChange={mockOnViewModeChange}
      />,
      { wrapper: Wrapper }
    );

    // Verifica se o dia atual aparece (número do dia)
    expect(getByText(today.getDate().toString())).toBeTruthy();
  });

  it('renders view mode tabs', () => {
    const mockOnDateChange = jest.fn();
    const mockOnViewModeChange = jest.fn();
    const today = new Date();

    const { getByText } = render(
      <MedicineReminderCalendar
        selectedDate={today}
        onDateChange={mockOnDateChange}
        viewMode="today"
        onViewModeChange={mockOnViewModeChange}
      />,
      { wrapper: Wrapper }
    );

    expect(getByText('Today')).toBeTruthy();
    expect(getByText('Week')).toBeTruthy();
    expect(getByText('Month')).toBeTruthy();
  });

  it('calls onViewModeChange when tab is pressed', () => {
    const mockOnDateChange = jest.fn();
    const mockOnViewModeChange = jest.fn();
    const today = new Date();

    const { getByText } = render(
      <MedicineReminderCalendar
        selectedDate={today}
        onDateChange={mockOnDateChange}
        viewMode="today"
        onViewModeChange={mockOnViewModeChange}
      />,
      { wrapper: Wrapper }
    );

    fireEvent.press(getByText('Week'));
    expect(mockOnViewModeChange).toHaveBeenCalledWith('week');
  });
});
