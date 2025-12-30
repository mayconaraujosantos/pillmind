import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('should render with title', () => {
    const { getByText } = render(
      <Button title="Click me" onPress={jest.fn()} />
    );

    expect(getByText('Click me')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Click me" onPress={onPress} />);

    fireEvent.press(getByText('Click me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('should render with primary variant by default', () => {
    const { getByText } = render(
      <Button title="Primary" onPress={jest.fn()} />
    );

    expect(getByText('Primary')).toBeTruthy();
  });

  it('should render with secondary variant', () => {
    const { getByText } = render(
      <Button title="Secondary" onPress={jest.fn()} variant="secondary" />
    );

    expect(getByText('Secondary')).toBeTruthy();
  });

  it('should render with outline variant', () => {
    const { getByText } = render(
      <Button title="Outline" onPress={jest.fn()} variant="outline" />
    );

    expect(getByText('Outline')).toBeTruthy();
  });

  it('should not call onPress when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button title="Disabled" onPress={onPress} disabled />
    );

    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('should apply custom styles', () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <Button title="Custom" onPress={jest.fn()} style={customStyle} />
    );

    expect(getByText('Custom')).toBeTruthy();
  });
});
