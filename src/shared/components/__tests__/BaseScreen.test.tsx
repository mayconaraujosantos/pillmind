import React from 'react';
import { render } from '@testing-library/react-native';
import { BaseScreen } from '../BaseScreen';
import { Text } from 'react-native';

describe('BaseScreen', () => {
  it('should render correctly with title and children', () => {
    const { getByText } = render(
      <BaseScreen title="Test Screen">
        <Text>Test Content</Text>
      </BaseScreen>
    );

    expect(getByText('Test Screen')).toBeTruthy();
    expect(getByText('Test Content')).toBeTruthy();
  });

  it('should apply custom styles when provided', () => {
    const customStyle = { backgroundColor: '#FFFFFF' };

    const { getByTestId } = render(
      <BaseScreen title="Test Screen" style={customStyle}>
        <Text testID="content">Test Content</Text>
      </BaseScreen>
    );

    expect(getByTestId('content')).toBeTruthy();
  });
});
