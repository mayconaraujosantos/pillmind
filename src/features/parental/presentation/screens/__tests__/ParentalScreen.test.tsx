import React from 'react';
import { render } from '@testing-library/react-native';
import { ParentalScreen } from '../ParentalScreen';

describe('ParentalScreen', () => {
  it('should render correctly', () => {
    const { getByText } = render(<ParentalScreen />);

    expect(getByText('Parental')).toBeTruthy();
    expect(getByText('Parental Screen Content')).toBeTruthy();
  });
});
