import React from 'react';
import { act, render, waitFor } from '@testing-library/react-native';
import { PerformanceMonitor } from '../PerformanceMonitor';

const mockGetLogs = jest.fn();
const mockGetLogStats = jest.fn();

jest.mock('@shared/utils/logger', () => ({
  logger: {
    getLogs: () => mockGetLogs(),
    getLogStats: () => mockGetLogStats(),
  },
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ isDark: false }),
}));

describe('PerformanceMonitor', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockGetLogs.mockReset();
    mockGetLogStats.mockReset();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('renders calculated metrics from logs', async () => {
    mockGetLogs.mockReturnValue([
      { duration: 100 },
      { duration: 200 },
      { duration: 0 },
    ]);
    mockGetLogStats.mockReturnValue({
      total: 3,
      byLevel: { ERROR: 1 },
    });

    const { getByText } = render(<PerformanceMonitor />);

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(getByText('150ms')).toBeTruthy();
      expect(getByText('200ms')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('33%')).toBeTruthy();
    });
  });
});
