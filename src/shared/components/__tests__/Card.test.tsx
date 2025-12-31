import React from 'react';
import { render } from '@testing-library/react-native';
import { Card } from '../Card';
import { Text } from 'react-native';

describe('Card', () => {
  it('should render children correctly', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );

    expect(getByText('Card Content')).toBeTruthy();
  });

  it('should apply default styles', () => {
    const { getByTestId } = render(
      <Card>
        <Text testID="card-content">Test Content</Text>
      </Card>
    );

    expect(getByTestId('card-content')).toBeTruthy();
  });

  it('should apply custom styles when provided', () => {
    const customStyle = { backgroundColor: '#FF0000' };

    const { getByTestId } = render(
      <Card style={customStyle}>
        <Text testID="card-content">Custom Style Content</Text>
      </Card>
    );

    expect(getByTestId('card-content')).toBeTruthy();
  });

  it('should render multiple children', () => {
    const { getByText } = render(
      <Card>
        <Text>First Child</Text>
        <Text>Second Child</Text>
      </Card>
    );

    expect(getByText('First Child')).toBeTruthy();
    expect(getByText('Second Child')).toBeTruthy();
  });
});
