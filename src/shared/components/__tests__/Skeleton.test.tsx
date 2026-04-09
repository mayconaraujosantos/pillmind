import React from 'react';
import { render } from '@testing-library/react-native';
import { Skeleton, SkeletonCard } from '../Skeleton';

jest.mock('@shared/theme', () => ({
  useTheme: () => ({ theme: { colors: { border: '#E5E5E5' } } }),
}));

describe('Skeleton', () => {
  it('renders skeleton with default testID', () => {
    const { getByTestId } = render(<Skeleton />);

    expect(getByTestId('skeleton')).toBeTruthy();
  });

  it('renders skeleton card with expected number of lines', () => {
    const { getAllByTestId } = render(<SkeletonCard lines={2} />);

    expect(getAllByTestId('skeleton')).toHaveLength(2);
  });

  it('renders skeleton card with avatar', () => {
    const { getAllByTestId } = render(<SkeletonCard lines={1} showAvatar />);

    expect(getAllByTestId('skeleton')).toHaveLength(2);
  });
});
