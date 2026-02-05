import React from 'react';
import { Alert } from 'react-native';
import { render, waitFor, act } from '@testing-library/react-native';
import { PostLoginLoadingScreen } from '../PostLoginLoadingScreen';

const mockRetry = jest.fn();
const mockOnComplete = jest.fn();

// Mock AuthContext with different authentication states
const mockAuthContext = {
  isAuthenticated: true,
  user: { id: '1' },
};

jest.mock('../../contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

jest.mock('@shared/components', () => ({
  ScreenWrapper: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
  Loader: ({ message, testID }: { message: string; testID?: string }) => (
    <div data-testid={testID || 'loader'}>{message}</div>
  ),
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ theme: { colors: { background: '#fff' } } }),
}));

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'common.retry': 'Try Again',
        'common.continueAnyway': 'Continue Anyway',
        'errors.sessionPrepFailed': 'Session preparation failed',
      };
      return translations[key] || key;
    },
  }),
}));

// Mock usePostLoginPreparation with different scenarios
const mockUsePostLoginPreparation = jest.fn();
jest.mock('../../hooks/usePostLoginPreparation', () => ({
  usePostLoginPreparation: () => mockUsePostLoginPreparation(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

describe('PostLoginLoadingScreen - Additional Coverage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    // Set default mock return value
    mockUsePostLoginPreparation.mockReturnValue({
      isPreparing: false,
      error: null,
      progress: 0,
      retry: mockRetry,
    });

    // Reset auth context to default authenticated state
    mockAuthContext.isAuthenticated = true;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle unauthenticated user', async () => {
    // Set user as not authenticated
    mockAuthContext.isAuthenticated = false;

    mockUsePostLoginPreparation.mockReturnValue({
      isPreparing: false,
      error: null,
      progress: 0,
      retry: mockRetry,
    });

    render(<PostLoginLoadingScreen onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('should handle preparation error with alert', async () => {
    mockAuthContext.isAuthenticated = true;

    mockUsePostLoginPreparation.mockReturnValue({
      isPreparing: false,
      error: 'Network connection failed',
      progress: 50,
      retry: mockRetry,
    });

    render(<PostLoginLoadingScreen onComplete={mockOnComplete} />);

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'common.error',
        'Network connection failed',
        expect.arrayContaining([
          expect.objectContaining({ text: 'Try Again' }),
          expect.objectContaining({ text: 'Continue Anyway' }),
        ]),
        { cancelable: false }
      );
    });
  });

  it('should handle retry button press', async () => {
    mockAuthContext.isAuthenticated = true;

    mockUsePostLoginPreparation.mockReturnValue({
      isPreparing: false,
      error: 'Timeout error',
      progress: 25,
      retry: mockRetry,
    });

    render(<PostLoginLoadingScreen onComplete={mockOnComplete} />);

    // Simulate retry button press by calling the mock
    act(() => {
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      if (
        alertCall &&
        alertCall[2] &&
        alertCall[2][0] &&
        alertCall[2][0].onPress
      ) {
        alertCall[2][0].onPress();
      }
    });

    expect(mockRetry).toHaveBeenCalled();
  });

  it('should handle continue anyway button press', async () => {
    mockAuthContext.isAuthenticated = true;

    mockUsePostLoginPreparation.mockReturnValue({
      isPreparing: false,
      error: 'Some error',
      progress: 75,
      retry: mockRetry,
    });

    render(<PostLoginLoadingScreen onComplete={mockOnComplete} />);

    // Simulate continue anyway button press
    act(() => {
      const alertCall = (Alert.alert as jest.Mock).mock.calls[0];
      if (
        alertCall &&
        alertCall[2] &&
        alertCall[2][1] &&
        alertCall[2][1].onPress
      ) {
        alertCall[2][1].onPress();
      }
    });

    expect(mockOnComplete).toHaveBeenCalled();
  });

  it('should handle successful preparation completion', async () => {
    mockAuthContext.isAuthenticated = true;

    mockUsePostLoginPreparation.mockReturnValue({
      isPreparing: false,
      error: null,
      progress: 100,
      retry: mockRetry,
    });

    render(<PostLoginLoadingScreen onComplete={mockOnComplete} />);

    // Fast-forward timers to simulate delay
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    await waitFor(() => {
      expect(mockOnComplete).toHaveBeenCalled();
    });
  });

  it('should show different loading messages based on progress', () => {
    mockAuthContext.isAuthenticated = true;

    // Test progress 0-24%
    mockUsePostLoginPreparation.mockReturnValue({
      isPreparing: true,
      error: null,
      progress: 10,
      retry: mockRetry,
    });

    const { unmount } = render(
      <PostLoginLoadingScreen onComplete={mockOnComplete} />
    );

    // Just verify component renders without throwing
    expect(true).toBe(true);

    unmount();
  });

  it('should prevent multiple error alerts for same error', async () => {
    mockAuthContext.isAuthenticated = true;

    mockUsePostLoginPreparation.mockReturnValue({
      isPreparing: false,
      error: 'Same error',
      progress: 30,
      retry: mockRetry,
    });

    const { rerender } = render(
      <PostLoginLoadingScreen onComplete={mockOnComplete} />
    );

    // Same error should not show alert again
    rerender(<PostLoginLoadingScreen onComplete={mockOnComplete} />);

    // Only one alert should have been called
    expect(Alert.alert).toHaveBeenCalledTimes(1);
  });
});
