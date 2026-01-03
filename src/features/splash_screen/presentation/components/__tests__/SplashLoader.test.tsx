import React from 'react';
import { render } from '@testing-library/react-native';
import { SplashLoader } from '../SplashLoader';

describe('SplashLoader', () => {
  it('renders activity indicator', () => {
    const { getByTestId } = render(<SplashLoader />);
    const indicator = getByTestId('splash-loader-indicator');
    expect(indicator).toBeTruthy();
  });
});
