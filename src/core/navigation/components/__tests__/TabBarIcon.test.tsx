import React from 'react';
import { render } from '@testing-library/react-native';
import { TabBarIcon } from '../TabBarIcon';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const RN = require('react-native');
  return {
    Ionicons: (props: { name: string; size: number; color: string }) =>
      React.createElement(
        RN.View,
        {
          testID: `icon-${props.name}`,
          style: { width: props.size, height: props.size },
        },
        React.createElement(
          RN.Text,
          { style: { color: props.color } },
          props.name
        )
      ),
  };
});

describe('TabBarIcon', () => {
  it('should render home icon when focused', () => {
    const { getByTestId } = render(
      <TabBarIcon
        routeName="HomeTab"
        focused={true}
        color="#007AFF"
        size={24}
      />
    );

    expect(getByTestId('icon-home')).toBeTruthy();
  });

  it('should render home-outline icon when not focused', () => {
    const { getByTestId } = render(
      <TabBarIcon
        routeName="HomeTab"
        focused={false}
        color="#8E8E93"
        size={24}
      />
    );

    expect(getByTestId('icon-home-outline')).toBeTruthy();
  });

  it('should render appointments icon when focused', () => {
    const { getByTestId } = render(
      <TabBarIcon
        routeName="AppointmentsTab"
        focused={true}
        color="#007AFF"
        size={24}
      />
    );

    expect(getByTestId('icon-calendar')).toBeTruthy();
  });

  it('should render appointments-outline icon when not focused', () => {
    const { getByTestId } = render(
      <TabBarIcon
        routeName="AppointmentsTab"
        focused={false}
        color="#8E8E93"
        size={24}
      />
    );

    expect(getByTestId('icon-calendar-outline')).toBeTruthy();
  });

  it('should render account icon when focused', () => {
    const { getByTestId } = render(
      <TabBarIcon
        routeName="AccountTab"
        focused={true}
        color="#007AFF"
        size={24}
      />
    );

    expect(getByTestId('icon-person')).toBeTruthy();
  });

  it('should render parental icon when focused', () => {
    const { getByTestId } = render(
      <TabBarIcon
        routeName="ParentalTab"
        focused={true}
        color="#007AFF"
        size={24}
      />
    );

    expect(getByTestId('icon-shield')).toBeTruthy();
  });

  it('should render nearby icon when focused', () => {
    const { getByTestId } = render(
      <TabBarIcon
        routeName="NearbyTab"
        focused={true}
        color="#007AFF"
        size={24}
      />
    );

    expect(getByTestId('icon-location')).toBeTruthy();
  });

  it('should render with correct size', () => {
    const { getByTestId } = render(
      <TabBarIcon
        routeName="HomeTab"
        focused={true}
        color="#007AFF"
        size={32}
      />
    );

    const icon = getByTestId('icon-home');
    expect(icon).toBeTruthy();
    expect(icon.props.style).toMatchObject({ width: 32, height: 32 });
  });
});
