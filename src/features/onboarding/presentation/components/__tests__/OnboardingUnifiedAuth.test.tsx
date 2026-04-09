import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { OnboardingUnifiedAuth } from '../OnboardingUnifiedAuth';

const mockSignInComplete = jest.fn();
const mockSignUpComplete = jest.fn();

jest.mock('../OnboardingSignIn', () => {
  const { TouchableOpacity } = require('react-native');
  return {
    OnboardingSignIn: ({
      onSignInComplete,
      onGoToSignUp,
    }: {
      onSignInComplete?: () => void;
      onGoToSignUp?: () => void;
    }) => (
      <>
        <TouchableOpacity testID="signin-complete" onPress={onSignInComplete} />
        <TouchableOpacity testID="go-signup" onPress={onGoToSignUp} />
      </>
    ),
  };
});

jest.mock('../OnboardingSignUp', () => {
  const { TouchableOpacity } = require('react-native');
  return {
    OnboardingSignUp: ({
      onSignUpComplete,
      onGoToSignIn,
    }: {
      onSignUpComplete?: () => void;
      onGoToSignIn?: () => void;
    }) => (
      <>
        <TouchableOpacity testID="signup-complete" onPress={onSignUpComplete} />
        <TouchableOpacity testID="go-signin" onPress={onGoToSignIn} />
      </>
    ),
  };
});

describe('OnboardingUnifiedAuth', () => {
  beforeEach(() => {
    mockSignInComplete.mockReset();
    mockSignUpComplete.mockReset();
  });

  it('renders sign-in by default and can switch to sign-up', () => {
    const { getByTestId, queryByTestId } = render(
      <OnboardingUnifiedAuth onAuthComplete={mockSignInComplete} />
    );

    fireEvent.press(getByTestId('signin-complete'));
    expect(mockSignInComplete).toHaveBeenCalled();

    fireEvent.press(getByTestId('go-signup'));
    expect(queryByTestId('signup-complete')).toBeTruthy();
  });

  it('renders sign-up when defaultScreen is signUp and can switch back', () => {
    const { getByTestId, queryByTestId } = render(
      <OnboardingUnifiedAuth
        defaultScreen="signUp"
        onAuthComplete={mockSignUpComplete}
      />
    );

    fireEvent.press(getByTestId('signup-complete'));
    expect(mockSignUpComplete).toHaveBeenCalled();

    fireEvent.press(getByTestId('go-signin'));
    expect(queryByTestId('signin-complete')).toBeTruthy();
  });
});
