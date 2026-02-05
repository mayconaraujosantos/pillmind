import React from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
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
  const getBackgroundColor = (node: ReactTestInstance) => {
    let current: ReactTestInstance | null = node;
    while (current && !current.props?.style) {
      current = current.parent;
    }

    if (!current?.props?.style) return undefined;

    const style = current.props.style as
      | { backgroundColor?: string }
      | Array<{ backgroundColor?: string }>;

    return Array.isArray(style)
      ? Object.assign({}, ...style).backgroundColor
      : style.backgroundColor;
  };
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2025-02-05T12:00:00.000Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders calendar with all days of the week', () => {
    const mockOnDateChange = jest.fn();
    const mockOnViewModeChange = jest.fn();
    const today = new Date('2025-02-05T12:00:00.000Z');

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
    expect(getByText('5')).toBeTruthy();
  });

  it('renders view mode tabs', () => {
    const mockOnDateChange = jest.fn();
    const mockOnViewModeChange = jest.fn();
    const today = new Date('2025-02-05T12:00:00.000Z');

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
    const today = new Date('2025-02-05T12:00:00.000Z');

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

  it('calls onDateChange when navigating weeks', () => {
    const mockOnDateChange = jest.fn();
    const mockOnViewModeChange = jest.fn();
    const today = new Date('2025-02-05T12:00:00.000Z');

    const { getByTestId } = render(
      <MedicineReminderCalendar
        selectedDate={today}
        onDateChange={mockOnDateChange}
        viewMode="week"
        onViewModeChange={mockOnViewModeChange}
      />,
      { wrapper: Wrapper }
    );

    fireEvent.press(getByTestId('icon-chevron-back'));
    fireEvent.press(getByTestId('icon-chevron-forward'));

    expect(mockOnDateChange).toHaveBeenCalledTimes(2);
  });

  it('applies theme colors to today and default days', () => {
    const mockOnDateChange = jest.fn();
    const mockOnViewModeChange = jest.fn();
    const today = new Date('2025-02-05T12:00:00.000Z');

    const { getByTestId } = render(
      <MedicineReminderCalendar
        selectedDate={today}
        onDateChange={mockOnDateChange}
        viewMode="week"
        onViewModeChange={mockOnViewModeChange}
      />,
      { wrapper: Wrapper }
    );

    const todayItem = getByTestId('calendar-day-2025-02-05');
    expect(getBackgroundColor(todayItem)).toBe('#000');

    const nonTodayItem = getByTestId('calendar-day-2025-02-03');
    expect(getBackgroundColor(nonTodayItem)).toBe('#f5f5f5');
  });
});
