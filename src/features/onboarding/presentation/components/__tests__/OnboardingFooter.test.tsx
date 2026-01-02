import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { OnboardingFooter } from '../OnboardingFooter';
import { WithThemeProvider } from '../WithThemeProvider';

describe('OnboardingFooter', () => {
  const mockProps = {
    onSignIn: jest.fn(),
    onSignUp: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar botões Sign In e Sign Up', async () => {
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingFooter {...mockProps} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      expect(getByText('SIGN IN')).toBeTruthy();
      expect(getByText('SIGN UP')).toBeTruthy();
    });
  });

  it('deve chamar onSignIn ao pressionar botão Sign In', async () => {
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingFooter {...mockProps} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByText('SIGN IN'));
    });

    expect(mockProps.onSignIn).toHaveBeenCalledTimes(1);
    expect(mockProps.onSignUp).not.toHaveBeenCalled();
  });

  it('deve chamar onSignUp ao pressionar botão Sign Up', async () => {
    const { getByText } = render(
      <WithThemeProvider>
        <OnboardingFooter {...mockProps} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      fireEvent.press(getByText('SIGN UP'));
    });

    expect(mockProps.onSignUp).toHaveBeenCalledTimes(1);
    expect(mockProps.onSignIn).not.toHaveBeenCalled();
  });

  it('deve renderizar corretamente sem erros visuais', async () => {
    const { toJSON } = render(
      <WithThemeProvider>
        <OnboardingFooter {...mockProps} />
      </WithThemeProvider>
    );

    await waitFor(() => {
      expect(toJSON()).toMatchSnapshot();
    });
  });
});
