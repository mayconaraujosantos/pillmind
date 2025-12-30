import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('should render input without label', () => {
    const { getByPlaceholderText } = render(<Input placeholder="Enter text" />);

    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render input with label', () => {
    const { getByText, getByPlaceholderText } = render(
      <Input label="Email" placeholder="Enter email" />
    );

    expect(getByText('Email')).toBeTruthy();
    expect(getByPlaceholderText('Enter email')).toBeTruthy();
  });

  it('should display error message when error prop is provided', () => {
    const { getByText } = render(<Input label="Email" error="Invalid email" />);

    expect(getByText('Invalid email')).toBeTruthy();
  });

  it('should call onChangeText when text is entered', () => {
    const onChangeText = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" onChangeText={onChangeText} />
    );

    fireEvent.changeText(getByPlaceholderText('Enter text'), 'test');
    expect(onChangeText).toHaveBeenCalledWith('test');
  });

  it('should apply custom style', () => {
    const customStyle = { marginTop: 10 };
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" style={customStyle} />
    );

    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should handle all TextInput props', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter text"
        value="test value"
        keyboardType="email-address"
        secureTextEntry
      />
    );

    const input = getByPlaceholderText('Enter text');
    expect(input.props.value).toBe('test value');
    expect(input.props.keyboardType).toBe('email-address');
    expect(input.props.secureTextEntry).toBe(true);
  });
});
