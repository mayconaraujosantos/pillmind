import { renderHook } from '@testing-library/react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { spacing, useResponsiveSpacing } from '../spacing';

describe('useResponsiveSpacing', () => {
  beforeEach(() => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 414,
      height: 896,
      scale: 2,
      fontScale: 2,
    } as never);
    jest.spyOn(PixelRatio, 'get').mockReturnValue(2);
    jest.spyOn(PixelRatio, 'getFontScale').mockReturnValue(2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns responsive spacing helpers and presets', () => {
    const { result } = renderHook(() => useResponsiveSpacing());

    expect(result.current.pad('lg')).toBe(spacing.lg);
    expect(result.current.margin('sm')).toBe(spacing.sm);
    expect(result.current.gap('xs')).toBe(spacing.xs);

    expect(result.current.containerPadding.paddingHorizontal).toBe(spacing.lg);
    expect(result.current.containerPadding.paddingVertical).toBe(spacing.md);
    expect(result.current.cardPadding.padding).toBe(spacing.lg);
  });
});
