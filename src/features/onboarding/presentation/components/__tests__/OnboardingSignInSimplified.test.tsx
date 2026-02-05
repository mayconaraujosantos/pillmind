import React from 'react';
import { render } from '@testing-library/react-native';
import { OnboardingSignInSimplified } from '../OnboardingSignInSimplified';

const mockOnboardingSignIn = jest.fn((_: OnboardingSignInProps) => null);

type OnboardingSignInProps = {
  onSignInComplete?: () => void;
};

jest.mock('../OnboardingSignIn', () => ({
  OnboardingSignIn: (props: OnboardingSignInProps) => {
    mockOnboardingSignIn(props);
    return null;
  },
}));

describe('OnboardingSignInSimplified', () => {
  it('forwards props to OnboardingSignIn', () => {
    const onComplete = jest.fn();

    render(<OnboardingSignInSimplified onSignInComplete={onComplete} />);

    expect(mockOnboardingSignIn).toHaveBeenCalledWith(
      expect.objectContaining({ onSignInComplete: onComplete })
    );
  });
});
