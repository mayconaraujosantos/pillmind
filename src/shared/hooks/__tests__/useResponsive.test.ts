import { renderHook } from '@testing-library/react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { useBreakpointValue, useResponsive } from '../useResponsive';

describe('useResponsive', () => {
  beforeEach(() => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({
      width: 320,
      height: 568,
      scale: 2,
      fontScale: 2,
    } as never);
    jest.spyOn(PixelRatio, 'get').mockReturnValue(2);
    jest.spyOn(PixelRatio, 'getFontScale').mockReturnValue(2);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('calculates breakpoints and helpers for small devices', () => {
    const { result } = renderHook(() => useResponsive());

    expect(result.current.isXS).toBe(true);
    expect(result.current.isSM).toBe(false);
    expect(result.current.isPortrait).toBe(true);
    expect(result.current.isSmallDevice).toBe(true);

    expect(result.current.wp(50)).toBe(160);
    expect(result.current.hp(50)).toBe(284);

    const rfValue = result.current.rf(16, 0.5);
    expect(rfValue).toBeGreaterThanOrEqual(12.8);
    expect(rfValue).toBeLessThanOrEqual(20.8);

    const rsValue = result.current.rs(16, 0.5);
    expect(rsValue).toBeGreaterThanOrEqual(11.2);
  });

  it('selects breakpoint-specific value', () => {
    const { result } = renderHook(() =>
      useBreakpointValue({
        xs: 'xs',
        sm: 'sm',
        md: 'md',
        default: 'default',
      })
    );

    expect(result.current).toBe('xs');
  });
});
