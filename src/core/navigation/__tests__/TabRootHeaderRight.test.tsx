import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Alert } from 'react-native';
import { TabRootHeaderRight } from '../TabRootHeaderRight';

const mockNavigate = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    getParent: () => ({
      navigate: mockNavigate,
    }),
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
    mockNavigate.mockClear();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('navigates to AccountTab when profile icon is pressed', () => {
    const { getAllByRole } = render(<TabRootHeaderRight />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[1]);
    expect(mockNavigate).toHaveBeenCalledWith('AccountTab');
  });

  it('shows alert when notifications icon is pressed', () => {
    const { getAllByRole } = render(<TabRootHeaderRight />);
    const buttons = getAllByRole('button');
    fireEvent.press(buttons[0]);
    expect(Alert.alert).toHaveBeenCalled();
  });
});
