import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { SplashLogo } from '../SplashLogo';

const fakeSource = { uri: 'logo.png' };

describe('SplashLogo', () => {
  it('renders image and calls onAnimationComplete', async () => {
    const onComplete = jest.fn();

    const { getByTestId } = render(
      <SplashLogo source={fakeSource} onAnimationComplete={onComplete} />
    );

    expect(getByTestId('splash-logo-image')).toBeTruthy();

    // Fast-forward animations
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalled();
    });
  });
});
