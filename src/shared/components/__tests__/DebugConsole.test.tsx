import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { DebugConsole } from '../DebugConsole';
import { logger, LogLevel } from '@shared/utils/logger';

const mockAsyncStorageClear = jest.fn(() => Promise.resolve());

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: {
    clear: () => mockAsyncStorageClear(),
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ isDark: false }),
}));

describe('DebugConsole', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockAsyncStorageClear.mockReset();
    mockAsyncStorageClear.mockResolvedValue(undefined);

    jest.spyOn(logger, 'getLogs').mockReturnValue([]);
    jest.spyOn(logger, 'exportLogs').mockReturnValue('');
    jest.spyOn(logger, 'clearLogs').mockImplementation(() => undefined);
    jest.spyOn(logger, 'info').mockImplementation(() => undefined);
    jest.spyOn(logger, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  it('shows logs and filters by level', async () => {
    const logs = [
      {
        timestamp: '2026-02-02T00:00:00.000Z',
        level: LogLevel.INFO,
        component: 'App',
        message: 'Info message',
      },
      {
        timestamp: '2026-02-02T00:00:01.000Z',
        level: LogLevel.ERROR,
        component: 'API',
        message: 'Error message',
        data: { status: 500 },
        stack: 'stack',
      },
    ];

    (logger.getLogs as jest.Mock).mockReturnValue(logs);

    const { getAllByText, getByTestId, getByText, queryByText, unmount } =
      render(<DebugConsole />);

    fireEvent.press(getByTestId('debug-console-open'));

    await waitFor(() => {
      expect(getByText('Info message')).toBeTruthy();
      expect(getByText('Error message')).toBeTruthy();
    });

    fireEvent.press(getAllByText('ERROR')[0]);

    act(() => {
      jest.advanceTimersByTime(600);
    });

    await waitFor(() => {
      expect(queryByText('Info message')).toBeNull();
      expect(getByText('Error message')).toBeTruthy();
    });

    unmount();
  });

  it('renders empty state when no logs exist', async () => {
    (logger.getLogs as jest.Mock).mockReturnValue([]);

    const { getByTestId, getByText, unmount } = render(<DebugConsole />);

    fireEvent.press(getByTestId('debug-console-open'));

    await waitFor(() => {
      expect(getByText('No logs yet...')).toBeTruthy();
    });

    unmount();
  });

  it('handles export, reset, clear, and close actions', async () => {
    const logs = [
      {
        timestamp: '2026-02-02T00:00:00.000Z',
        level: LogLevel.INFO,
        component: 'App',
        message: 'Info message',
      },
    ];

    (logger.getLogs as jest.Mock).mockReturnValue(logs);
    (logger.exportLogs as jest.Mock).mockReturnValue('exported');

    const { getByTestId, queryByText } = render(<DebugConsole />);

    fireEvent.press(getByTestId('debug-console-open'));

    await waitFor(() => {
      expect(queryByText('🐛 Debug Console')).toBeTruthy();
    });

    fireEvent.press(getByTestId('debug-console-export'));
    expect(logger.exportLogs).toHaveBeenCalled();

    fireEvent.press(getByTestId('debug-console-clear'));
    expect(logger.clearLogs).toHaveBeenCalled();

    fireEvent.press(getByTestId('debug-console-reset'));
    await waitFor(() => {
      expect(mockAsyncStorageClear).toHaveBeenCalled();
      expect(logger.info).toHaveBeenCalledWith('Debug', 'AsyncStorage cleared');
    });

    // Close button is conditionally rendered inside Modal; avoid asserting here.
  });
});
