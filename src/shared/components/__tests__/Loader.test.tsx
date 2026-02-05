import React from 'react';
import { render } from '@testing-library/react-native';
import { Loader } from '../Loader';

jest.mock('@shared/theme', () => ({
  useTheme: () => ({
    theme: {
      colors: {
        primary: '#00f',
        textSecondary: '#666',
      },
    },
  }),
}));

describe('Loader', () => {
  it('renders default loader with message', () => {
    const { getByTestId, getByText } = render(<Loader message="Loading..." />);

    expect(getByTestId('loader')).toBeTruthy();
    expect(getByTestId('loader-indicator')).toBeTruthy();
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('supports custom testID and variant', () => {
    const { getByTestId } = render(
      <Loader testID="custom-loader" variant="fullscreen" />
    );

    expect(getByTestId('custom-loader')).toBeTruthy();
    expect(getByTestId('custom-loader-indicator')).toBeTruthy();
  });
});
