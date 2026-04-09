import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { OnboardingSuccess } from '../OnboardingSuccess';

jest.mock('@expo/vector-icons', () => ({
  Ionicons: () => null,
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ isDark: false }),
}));

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock('../OnboardingTitleBlock', () => ({
  OnboardingTitleBlock: () => null,
}));

jest.mock('../OnboardingPrimaryButton', () => {
  const { TouchableOpacity } = require('react-native');
  return {
    OnboardingPrimaryButton: ({ onPress }: { onPress?: () => void }) => (
      <TouchableOpacity testID="finish" onPress={onPress} />
    ),
  };
});

describe('OnboardingSuccess', () => {
  it('calls onFinish when pressing primary button', () => {
    const onFinish = jest.fn();

    const { getByTestId } = render(<OnboardingSuccess onFinish={onFinish} />);

    fireEvent.press(getByTestId('finish'));

    expect(onFinish).toHaveBeenCalled();
  });
});
