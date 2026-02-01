import React from 'react';
import { Button, Text } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { usePostLoginPreparation } from '../usePostLoginPreparation';

const mockAuthContext = {
  isAuthenticated: true,
  user: { id: 'user-1' },
};

jest.mock('../../contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

jest.mock('@shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
}));

const TestComponent = () => {
  const { isPreparing, progress, error, retry } = usePostLoginPreparation();

  return (
    <>
      <Text testID="isPreparing">{String(isPreparing)}</Text>
      <Text testID="progress">{String(progress)}</Text>
      <Text testID="error">{error ?? ''}</Text>
      <Button title="retry" onPress={retry} />
    </>
  );
};

describe('usePostLoginPreparation', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockAuthContext.isAuthenticated = true;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('prepares session and updates progress', async () => {
    const { getByTestId } = render(<TestComponent />);

    await waitFor(() => {
      expect(getByTestId('progress').props.children).toBe('0');
    });

    jest.advanceTimersByTime(600);

    await waitFor(() => {
      expect(getByTestId('progress').props.children).toBe('100');
      expect(getByTestId('isPreparing').props.children).toBe('false');
    });
  });

  it('retries preparation when retry is pressed', async () => {
    const { getByText, getByTestId } = render(<TestComponent />);

    jest.advanceTimersByTime(600);

    await waitFor(() => {
      expect(getByTestId('progress').props.children).toBe('100');
    });

    fireEvent.press(getByText('retry'));
    jest.advanceTimersByTime(600);

    await waitFor(() => {
      expect(getByTestId('progress').props.children).toBe('100');
    });
  });

  it('does not start when not authenticated', async () => {
    mockAuthContext.isAuthenticated = false;
    const { getByTestId } = render(<TestComponent />);

    jest.advanceTimersByTime(600);

    await waitFor(() => {
      expect(getByTestId('progress').props.children).toBe('0');
    });
  });
});
