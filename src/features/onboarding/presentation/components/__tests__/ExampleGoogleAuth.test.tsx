import React from 'react';
import { act, fireEvent, render } from '@testing-library/react-native';
import { ExampleAuthScreen } from '../ExampleGoogleAuth';

const mockSignIn = jest.fn();
const mockSignUp = jest.fn();
const mockOpenSocialAuth = jest.fn();
const mockCloseSocialAuth = jest.fn();
const mockConfirmSocialAuth = jest.fn();

type AuthField = {
  key: string;
  onChangeText: (value: string) => void;
};

type OnboardingAuthProps = {
  fields: AuthField[];
  onPrimaryPress?: () => void;
  onGooglePress?: () => void;
  onApplePress?: () => void;
  linkCta?: { onPress?: () => void };
};

type SocialAuthModalProps = {
  visible: boolean;
  provider: string;
  loading: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
};

let lastAuthProps: OnboardingAuthProps | undefined;
let lastModalProps: SocialAuthModalProps | undefined;

jest.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    signUp: mockSignUp,
  }),
}));

jest.mock('../../hooks/useSocialAuth', () => ({
  useSocialAuth: () => ({
    modalState: { visible: true, provider: 'google', loading: true },
    openSocialAuth: mockOpenSocialAuth,
    closeSocialAuth: mockCloseSocialAuth,
    confirmSocialAuth: mockConfirmSocialAuth,
  }),
}));

jest.mock('../OnboardingAuth', () => {
  const { View, TouchableOpacity } = require('react-native');
  return {
    OnboardingAuth: (props: OnboardingAuthProps) => {
      lastAuthProps = props;
      return (
        <View>
          <TouchableOpacity
            testID="fill-fields"
            onPress={() => {
              props.fields.forEach((field) => {
                if (field.key === 'name') {
                  field.onChangeText('User');
                  return;
                }
                if (field.key === 'email') {
                  field.onChangeText('user@example.com');
                  return;
                }
                if (field.key === 'password') {
                  field.onChangeText('password');
                }
              });
            }}
          />
          <TouchableOpacity testID="primary" onPress={props.onPrimaryPress} />
          <TouchableOpacity testID="google" onPress={props.onGooglePress} />
          <TouchableOpacity testID="apple" onPress={props.onApplePress} />
          <TouchableOpacity testID="switch" onPress={props.linkCta?.onPress} />
        </View>
      );
    },
  };
});

jest.mock('../SocialAuthModal', () => ({
  SocialAuthModal: (props: SocialAuthModalProps) => {
    lastModalProps = props;
    return null;
  },
}));

describe('ExampleAuthScreen', () => {
  beforeEach(() => {
    mockSignIn.mockReset();
    mockSignUp.mockReset();
    mockOpenSocialAuth.mockReset();
    mockCloseSocialAuth.mockReset();
    mockConfirmSocialAuth.mockReset();
    lastAuthProps = undefined;
    lastModalProps = undefined;
  });

  it('signs in with traditional auth', async () => {
    mockSignIn.mockResolvedValue({ success: true });
    const onSuccess = jest.fn();

    const { getByTestId } = render(
      <ExampleAuthScreen
        mode="signin"
        onSuccess={onSuccess}
        onSwitchMode={jest.fn()}
      />
    );

    fireEvent.press(getByTestId('fill-fields'));

    await act(async () => {
      fireEvent.press(getByTestId('primary'));
    });

    expect(mockSignIn).toHaveBeenCalledWith({
      email: 'user@example.com',
      password: 'password',
    });
    expect(mockSignUp).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it('signs up with traditional auth', async () => {
    mockSignUp.mockResolvedValue({ success: true });
    const onSuccess = jest.fn();

    const { getByTestId } = render(
      <ExampleAuthScreen
        mode="signup"
        onSuccess={onSuccess}
        onSwitchMode={jest.fn()}
      />
    );

    fireEvent.press(getByTestId('fill-fields'));

    await act(async () => {
      fireEvent.press(getByTestId('primary'));
    });

    expect(mockSignUp).toHaveBeenCalledWith({
      name: 'User',
      email: 'user@example.com',
      password: 'password',
    });
    expect(mockSignIn).not.toHaveBeenCalled();
    expect(onSuccess).toHaveBeenCalled();
  });

  it('opens social auth and switches mode', () => {
    const onSwitchMode = jest.fn();

    const { getByTestId } = render(
      <ExampleAuthScreen
        mode="signin"
        onSuccess={jest.fn()}
        onSwitchMode={onSwitchMode}
      />
    );

    fireEvent.press(getByTestId('google'));
    fireEvent.press(getByTestId('apple'));
    fireEvent.press(getByTestId('switch'));

    expect(mockOpenSocialAuth).toHaveBeenCalledWith('google');
    expect(mockOpenSocialAuth).toHaveBeenCalledWith('apple');
    expect(onSwitchMode).toHaveBeenCalled();
  });

  it('passes modal state to SocialAuthModal', () => {
    render(
      <ExampleAuthScreen
        mode="signin"
        onSuccess={jest.fn()}
        onSwitchMode={jest.fn()}
      />
    );

    expect(lastModalProps).toMatchObject({
      visible: true,
      provider: 'google',
      loading: true,
      onConfirm: mockConfirmSocialAuth,
      onCancel: mockCloseSocialAuth,
    });
    expect(lastAuthProps).toBeDefined();
  });
});
