import React from 'react';
import { render } from '@testing-library/react-native';
import { NearbyScreen } from '../NearbyScreen';

describe('NearbyScreen', () => {
  it('should render correctly', () => {
    const { getByText } = render(<NearbyScreen />);

    expect(getByText('Nearby')).toBeTruthy();
    expect(getByText('Nearby Screen Content')).toBeTruthy();
  });
});
