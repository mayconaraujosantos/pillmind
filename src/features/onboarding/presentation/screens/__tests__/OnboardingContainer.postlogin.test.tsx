import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OnboardingContainer } from '../OnboardingContainer';
import { WithThemeProvider } from '../../components/WithThemeProvider';
import { AuthProvider } from '../../contexts/AuthContext';

jest.mock('../../hooks/useOnboardingScroll', () => ({
  useOnboardingScroll: jest.fn(() => ({
    currentStep: 2,
    handleScroll: jest.fn(),
  })),
}));

jest.mock('../../components/OnboardingUnifiedAuth', () => {
  const ReactNs = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    OnboardingUnifiedAuth: ({
      onAuthComplete,
    }: {
      onAuthComplete?: () => void;
    }) =>
      ReactNs.createElement(
        Pressable,
        {
          accessibilityRole: 'button',
          testID: 'mock-auth-complete',
          onPress: () => onAuthComplete?.(),
        },
        ReactNs.createElement(Text, null, 'Mock auth complete')
      ),
  };
});

jest.mock('../PostLoginLoadingScreen', () => {
  const ReactNs = require('react');
  const { Pressable, Text } = require('react-native');
  return {
    PostLoginLoadingScreen: ({ onComplete }: { onComplete: () => void }) =>
      ReactNs.createElement(
        Pressable,
        {
          accessibilityRole: 'button',
          testID: 'mock-post-login-done',
          onPress: () => onComplete(),
        },
        ReactNs.createElement(Text, null, 'Mock post login')
      ),
  };
});

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <WithThemeProvider>
      <AuthProvider>{ui}</AuthProvider>
    </WithThemeProvider>
  );

describe('OnboardingContainer post-login flow', () => {
  it('navigates carousel → auth → post-login loading', async () => {
    const { getByText, getByTestId } = renderWithProviders(
      <OnboardingContainer />
    );

    await waitFor(() => expect(getByText('Login')).toBeTruthy());
    fireEvent.press(getByText('Login'));

    await waitFor(() => expect(getByTestId('mock-auth-complete')).toBeTruthy());
    fireEvent.press(getByTestId('mock-auth-complete'));

    await waitFor(() =>
      expect(getByTestId('mock-post-login-done')).toBeTruthy()
    );
  });

  it('calls onFinish when post-login screen completes', async () => {
    const onFinish = jest.fn();
    const { getByText, getByTestId } = renderWithProviders(
      <OnboardingContainer onFinish={onFinish} />
    );

    await waitFor(() => expect(getByText('Login')).toBeTruthy());
    fireEvent.press(getByText('Login'));
    await waitFor(() => expect(getByTestId('mock-auth-complete')).toBeTruthy());
    fireEvent.press(getByTestId('mock-auth-complete'));
    await waitFor(() =>
      expect(getByTestId('mock-post-login-done')).toBeTruthy()
    );
    fireEvent.press(getByTestId('mock-post-login-done'));

    expect(onFinish).toHaveBeenCalledTimes(1);
  });
});
