import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { OnboardingChoice } from '../OnboardingChoice';

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ isDark: false }),
}));

describe('OnboardingChoice', () => {
  const step = {
    id: 'choice',
    title: 'Welcome',
    description: 'Choose an option',
    image: 'https://example.com/image.png',
    type: 'info',
  };

  it('renders content and handles button actions', () => {
    const onCreateAccount = jest.fn();
    const onLogin = jest.fn();

    const { getByText } = render(
      <OnboardingChoice
        step={step as never}
        onCreateAccount={onCreateAccount}
        onLogin={onLogin}
      />
    );

    fireEvent.press(getByText('Create an account'));
    fireEvent.press(getByText('Login'));

    expect(onCreateAccount).toHaveBeenCalled();
    expect(onLogin).toHaveBeenCalled();
  });
});
