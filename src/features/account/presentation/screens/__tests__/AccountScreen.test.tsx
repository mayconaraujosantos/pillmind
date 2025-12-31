import React from 'react';
import { render } from '@testing-library/react-native';
import { AccountScreen } from '../AccountScreen';

describe('AccountScreen', () => {
  it('should render correctly', () => {
    const { getByText } = render(<AccountScreen />);

    expect(getByText('Account')).toBeTruthy();
    expect(getByText('Account Screen Content')).toBeTruthy();
  });
});
