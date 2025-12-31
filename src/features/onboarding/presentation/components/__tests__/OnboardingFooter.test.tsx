import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { OnboardingFooter } from '../OnboardingFooter';

describe('OnboardingFooter', () => {
  const mockProps = {
    onSignIn: jest.fn(),
    onSignUp: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar botões Sign In e Sign Up', () => {
    const { getByText } = render(<OnboardingFooter {...mockProps} />);

    expect(getByText('SIGN IN')).toBeTruthy();
    expect(getByText('SIGN UP')).toBeTruthy();
  });

  it('deve chamar onSignIn ao pressionar botão Sign In', () => {
    const { getByText } = render(<OnboardingFooter {...mockProps} />);

    fireEvent.press(getByText('SIGN IN'));

    expect(mockProps.onSignIn).toHaveBeenCalledTimes(1);
    expect(mockProps.onSignUp).not.toHaveBeenCalled();
  });

  it('deve chamar onSignUp ao pressionar botão Sign Up', () => {
    const { getByText } = render(<OnboardingFooter {...mockProps} />);

    fireEvent.press(getByText('SIGN UP'));

    expect(mockProps.onSignUp).toHaveBeenCalledTimes(1);
    expect(mockProps.onSignIn).not.toHaveBeenCalled();
  });

  it('deve renderizar corretamente sem erros visuais', () => {
    const { toJSON } = render(<OnboardingFooter {...mockProps} />);

    expect(toJSON()).toMatchSnapshot();
  });
});
