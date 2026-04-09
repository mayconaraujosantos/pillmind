import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { OnboardingSignIn } from '../OnboardingSignIn';

const mockSignIn = jest.fn();
const mockLogin = jest.fn();
const mockOpenSocialAuth = jest.fn();

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    loading: false,
    error: null,
  }),
}));

jest.mock('../../hooks/useSocialAuth', () => ({
  useSocialAuth: () => ({
    modalState: { visible: false, provider: 'google', loading: false },
    openSocialAuth: mockOpenSocialAuth,
    closeSocialAuth: jest.fn(),
    confirmSocialAuth: jest.fn(),
  }),
}));

jest.mock('../../contexts/AuthContext', () => ({
  useAuthContext: () => ({
    login: mockLogin,
  }),
}));

type MockAuthField = {
  onChangeText: (value: string) => void;
};

type MockOnboardingAuthProps = {
  fields: MockAuthField[];
  onPrimaryPress: () => void;
  onGooglePress: () => void;
  onApplePress: () => void;
};

jest.mock('../OnboardingAuth', () => {
  const { View, TouchableOpacity } = require('react-native');
  return {
    OnboardingAuth: ({
      fields,
      onPrimaryPress,
      onGooglePress,
      onApplePress,
    }: MockOnboardingAuthProps) => (
      <View>
        <TouchableOpacity
          testID="fill-fields"
          onPress={() => {
            fields[0].onChangeText('user@example.com');
            fields[1].onChangeText('password');
          }}
        />
        <TouchableOpacity testID="submit" onPress={onPrimaryPress} />
        <TouchableOpacity testID="google" onPress={onGooglePress} />
        <TouchableOpacity testID="apple" onPress={onApplePress} />
      </View>
    ),
  };
});

jest.mock('../SocialAuthModal', () => ({
  SocialAuthModal: () => null,
}));

describe('OnboardingSignIn', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    mockSignIn.mockReset();
    mockLogin.mockReset();
    mockOpenSocialAuth.mockReset();
  });

  it('shows alert when fields are missing', async () => {
    const { getByTestId } = render(<OnboardingSignIn />);

    fireEvent.press(getByTestId('submit'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'common.error',
      'errors.pleaseFieldAllFields'
    );
  });

  it('signs in and calls completion', async () => {
    mockSignIn.mockResolvedValue({
      success: true,
      data: { user: { id: '1', email: 'user@example.com' }, token: 'token' },
    });
    const onComplete = jest.fn();
    const { getByTestId } = render(
      <OnboardingSignIn onSignInComplete={onComplete} />
    );

    await act(async () => {
      fireEvent.press(getByTestId('fill-fields'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('shows error when sign in fails', async () => {
    mockSignIn.mockResolvedValue({
      success: false,
      error: { message: 'Invalid credentials', code: 'INVALID' },
    });

    const { getByTestId } = render(<OnboardingSignIn />);

    await act(async () => {
      fireEvent.press(getByTestId('fill-fields'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        'common.error',
        'Invalid credentials'
      );
    });
  });

  it('opens social auth modal on google press', () => {
    const { getByTestId } = render(<OnboardingSignIn />);

    fireEvent.press(getByTestId('google'));

    expect(mockOpenSocialAuth).toHaveBeenCalledWith('google');
  });

  it('opens social auth modal on apple press', () => {
    const { getByTestId } = render(<OnboardingSignIn />);

    fireEvent.press(getByTestId('apple'));

    expect(mockOpenSocialAuth).toHaveBeenCalledWith('apple');
  });
});
