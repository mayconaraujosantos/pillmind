import React from 'react';
import { render } from '@testing-library/react-native';
import { ScreenWrapper } from '../ScreenWrapper';
import { Text } from 'react-native';

describe('ScreenWrapper', () => {
  it('should render children correctly', () => {
    const { getByText } = render(
      <ScreenWrapper>
        <Text>Screen Content</Text>
      </ScreenWrapper>
    );

    expect(getByText('Screen Content')).toBeTruthy();
  });

  it('should apply custom styles when provided', () => {
    const customStyle = { backgroundColor: '#F0F0F0' };
    const { getByText } = render(
      <ScreenWrapper style={customStyle}>
        <Text>Content</Text>
      </ScreenWrapper>
    );

    expect(getByText('Content')).toBeTruthy();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <ScreenWrapper>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </ScreenWrapper>
    );

    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });
});
