import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Header } from '../Header';

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mock expo vector icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: ({ name }: { name: string }) => {
    const React = require('react');
    const { View, Text } = require('react-native');
    return React.createElement(
      View,
      { testID: `icon-${name}` },
      React.createElement(Text, null, name)
    );
  },
}));

describe('Header', () => {
  it('should render with default userName', () => {
    const { getByText } = render(<Header />);

    expect(getByText('Usuário')).toBeTruthy();
  });

  it('should render with custom userName', () => {
    const { getByText } = render(<Header userName="John Doe" />);

    expect(getByText('John Doe')).toBeTruthy();
  });

  it('should render avatar with first letter of userName', () => {
    const { getByText } = render(<Header userName="John" />);

    expect(getByText('J')).toBeTruthy();
  });

  it('should render avatar when userAvatar is provided', () => {
    const { getByText } = render(
      <Header userName="John" userAvatar="avatar-url" />
    );

    // Should still show first letter when avatar is provided but not rendered as Image
    expect(getByText('J')).toBeTruthy();
  });

  it('should call onProfilePress when user section is pressed', () => {
    const onProfilePress = jest.fn();
    const { getByText } = render(
      <Header userName="John" onProfilePress={onProfilePress} />
    );

    fireEvent.press(getByText('John'));
    expect(onProfilePress).toHaveBeenCalledTimes(1);
  });

  it('should call onNotificationPress when notification button is pressed', () => {
    const onNotificationPress = jest.fn();
    const { getByTestId } = render(
      <Header onNotificationPress={onNotificationPress} />
    );

    fireEvent.press(getByTestId('icon-notifications-outline'));
    expect(onNotificationPress).toHaveBeenCalledTimes(1);
  });

  it('should render notification icon', () => {
    const { getByTestId } = render(<Header />);

    expect(getByTestId('icon-notifications-outline')).toBeTruthy();
  });
});
