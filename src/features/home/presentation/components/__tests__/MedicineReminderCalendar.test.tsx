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
        'home.quickStatScheduled': 'Scheduled today',
        'home.quickStatNextDose': 'Next dose',
        'home.quickStatAdherence': 'Adherence',
        'home.quickStatNoNextDose': 'No time',
        'home.quickStatPastDay': '—',
        'home.viewModeToday': 'Today',
        'home.viewModeWeek': 'Week',
        'home.viewModeMonth': 'Month',
        'home.calendarPrevWeekA11y': 'Previous week',
        'home.calendarNextWeekA11y': 'Next week',
        'home.cardStatMenuA11y': 'Menu',
        'home.statCardMenuTitle': 'Soon',
        'home.statCardMenuMessage': 'Later',
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
        quickStats={{
          scheduled: 3,
          nextDoseLabel: '02:00h',
          adherencePct: 80,
        }}
      />,
      { wrapper: Wrapper }
    );

    // Verifica se o dia atual aparece (número do dia)
    expect(getByText('5')).toBeTruthy();
    expect(getByText('80%')).toBeTruthy();
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

  it('calls onDateChange when another day in the strip is pressed', () => {
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

    fireEvent.press(getByTestId('calendar-day-2025-02-04'));

    expect(mockOnDateChange).toHaveBeenCalledTimes(1);
    expect(mockOnDateChange.mock.calls[0][0].toISOString().split('T')[0]).toBe(
      '2025-02-04'
    );
  });

  it('applies theme primary to selected pill and white to unselected', () => {
    const mockOnDateChange = jest.fn();
    const mockOnViewModeChange = jest.fn();
    const selected = new Date('2025-02-04T12:00:00.000Z');

    const { getByTestId } = render(
      <MedicineReminderCalendar
        selectedDate={selected}
        onDateChange={mockOnDateChange}
        viewMode="week"
        onViewModeChange={mockOnViewModeChange}
      />,
      { wrapper: Wrapper }
    );

    const selectedPill = getByTestId('calendar-day-2025-02-04');
    expect(getBackgroundColor(selectedPill)).toBe('#000');

    const idleItem = getByTestId('calendar-day-2025-02-03');
    expect(getBackgroundColor(idleItem)).toBe('#FFFFFF');
  });
});
