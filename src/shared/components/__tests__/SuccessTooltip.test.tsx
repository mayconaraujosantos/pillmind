import React from 'react';
import { render } from '@testing-library/react-native';
import { act } from 'react-test-renderer';
import { SuccessTooltip } from '../SuccessTooltip';

jest.mock('@shared/theme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#000',
        text: '#000',
        textSecondary: '#666',
        background: '#fff',
        border: '#ccc',
        surface: '#f5f5f5',
        placeholder: '#999',
        error: '#f00',
        success: '#0f0',
        warning: '#ff0',
        info: '#00f',
        disabled: '#999',
      },
    },
    isDark: false,
    setThemeMode: jest.fn(),
    toggleTheme: jest.fn(),
  }),
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return {
    Ionicons: ({ name }: { name: string }) =>
      React.createElement(Text, null, name),
  };
});

describe('SuccessTooltip', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('renders title and message when visible', () => {
    const { getByText } = render(
      <SuccessTooltip visible={true} title="Success" message="Saved" />
    );

    expect(getByText('Success')).toBeTruthy();
    expect(getByText('Saved')).toBeTruthy();
  });

  it('auto hides after duration', () => {
    const onDismiss = jest.fn();

    render(
      <SuccessTooltip
        visible={true}
        title="Success"
        onDismiss={onDismiss}
        duration={4000}
      />
    );

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('returns null when not visible', () => {
    const { toJSON } = render(
      <SuccessTooltip visible={false} title="Hidden" />
    );

    expect(toJSON()).toBeNull();
  });
});
