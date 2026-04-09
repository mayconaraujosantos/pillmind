import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { TabRootHeaderRight } from '../TabRootHeaderRight';

const mockPush = jest.fn();

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@shared/theme', () => ({
  useTheme: () => ({
    theme: {
      colors: { text: '#000', primary: '#00f' },
    },
    isDark: false,
  }),
}));

jest.mock('@shared/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Ionicons: () =>
      React.createElement(RN.Text, { testID: 'mock-ionicon' }, 'icon'),
  };
});

describe('TabRootHeaderRight', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  it('navigates to account route when profile icon is pressed', () => {
    const { getAllByRole } = render(<TabRootHeaderRight />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[1]);
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/account');
  });

  it('opens notifications settings when notifications icon is pressed', () => {
    const { getAllByRole } = render(<TabRootHeaderRight />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(mockPush).toHaveBeenCalledWith('/(tabs)/account/notifications');
  });
});
