import React from 'react';
import { Alert } from 'react-native';
import { act, fireEvent, render, waitFor } from '@testing-library/react-native';
import { OnboardingSignUp } from '../OnboardingSignUp';

const mockSignUp = jest.fn();
const mockLogin = jest.fn();
const mockOpenSocialAuth = jest.fn();

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    signUp: mockSignUp,
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
};

jest.mock('../OnboardingAuth', () => {
  const { View, TouchableOpacity } = require('react-native');
  return {
    OnboardingAuth: ({
      fields,
      onPrimaryPress,
      onGooglePress,
    }: MockOnboardingAuthProps) => (
      <View>
        <TouchableOpacity
          testID="fill-fields"
          onPress={() => {
            fields[0].onChangeText('User');
            fields[1].onChangeText('user@example.com');
            fields[2].onChangeText('password');
          }}
        />
        <TouchableOpacity testID="submit" onPress={onPrimaryPress} />
        <TouchableOpacity testID="google" onPress={onGooglePress} />
      </View>
    ),
  };
});

jest.mock('../SocialAuthModal', () => ({
  SocialAuthModal: () => null,
}));

describe('OnboardingSignUp', () => {
  beforeEach(() => {
    jest.spyOn(Alert, 'alert').mockImplementation(jest.fn());
    mockSignUp.mockReset();
    mockLogin.mockReset();
    mockOpenSocialAuth.mockReset();
  });

  it('shows alert when fields are missing', async () => {
    const { getByTestId } = render(<OnboardingSignUp />);

    fireEvent.press(getByTestId('submit'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'common.error',
      'errors.pleaseFieldAllFields'
    );
  });

  it('submits sign up and calls completion', async () => {
    mockSignUp.mockResolvedValue({
      success: true,
      data: { user: { id: '1', email: 'user@example.com' }, token: 'token' },
    });
    const onComplete = jest.fn();
    const { getByTestId } = render(
      <OnboardingSignUp onSignUpComplete={onComplete} />
    );

    await act(async () => {
      fireEvent.press(getByTestId('fill-fields'));
    });
    await act(async () => {
      fireEvent.press(getByTestId('submit'));
    });

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalled();
      expect(mockLogin).toHaveBeenCalled();
      expect(onComplete).toHaveBeenCalled();
    });
  });

  it('opens social auth modal on google press', () => {
    const { getByTestId } = render(<OnboardingSignUp />);

    fireEvent.press(getByTestId('google'));

    expect(mockOpenSocialAuth).toHaveBeenCalledWith('google');
  });
});
