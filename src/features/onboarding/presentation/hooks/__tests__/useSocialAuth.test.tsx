import React from 'react';
import { Alert, Button, Text } from 'react-native';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useSocialAuth } from '../useSocialAuth';

const mockAuthContext = {
  signInWithGoogle: jest.fn(),
};

jest.mock('../../contexts/AuthContext', () => ({
  useAuthContext: () => mockAuthContext,
}));

jest.mock('@shared/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());

const TestComponent = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { modalState, openSocialAuth, closeSocialAuth, confirmSocialAuth } =
    useSocialAuth(onSuccess);

  return (
    <>
      <Text testID="visible">{String(modalState.visible)}</Text>
      <Text testID="provider">{modalState.provider}</Text>
      <Text testID="loading">{String(modalState.loading)}</Text>
      <Button title="open-google" onPress={() => openSocialAuth('google')} />
      <Button title="open-apple" onPress={() => openSocialAuth('apple')} />
      <Button title="close" onPress={closeSocialAuth} />
      <Button title="confirm" onPress={() => void confirmSocialAuth()} />
    </>
  );
};

describe('useSocialAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy.mockClear();
    mockAuthContext.signInWithGoogle.mockResolvedValue({ success: true });
  });

  it('opens and closes modal', () => {
    const { getByText, getByTestId } = render(<TestComponent />);

    fireEvent.press(getByText('open-google'));
    expect(getByTestId('visible').props.children).toBe('true');
    expect(getByTestId('provider').props.children).toBe('google');

    fireEvent.press(getByText('close'));
    expect(getByTestId('visible').props.children).toBe('false');
  });

  it('confirms google auth and calls onSuccess', async () => {
    const onSuccess = jest.fn();
    const { getByText } = render(<TestComponent onSuccess={onSuccess} />);

    fireEvent.press(getByText('open-google'));
    fireEvent.press(getByText('confirm'));

    await waitFor(() => {
      expect(mockAuthContext.signInWithGoogle).toHaveBeenCalledTimes(1);
      expect(onSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('alerts when google auth fails (non-cancel)', async () => {
    const { Alert } = require('react-native');
    mockAuthContext.signInWithGoogle.mockResolvedValue({
      success: false,
      error: 'Invalid credentials',
    });

    const { getByText } = render(<TestComponent />);

    fireEvent.press(getByText('open-google'));
    fireEvent.press(getByText('confirm'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });

  it('does not alert when user cancels', async () => {
    const { Alert } = require('react-native');
    mockAuthContext.signInWithGoogle.mockResolvedValue({
      success: false,
      error: 'Login cancelado pelo usuário',
    });

    const { getByText } = render(<TestComponent />);

    fireEvent.press(getByText('open-google'));
    fireEvent.press(getByText('confirm'));

    await waitFor(() => {
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  it('shows alert for apple auth', async () => {
    const { Alert } = require('react-native');
    const { getByText } = render(<TestComponent />);

    fireEvent.press(getByText('open-apple'));
    fireEvent.press(getByText('confirm'));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalled();
    });
  });
});
