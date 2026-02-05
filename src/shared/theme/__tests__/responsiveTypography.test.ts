import { renderHook } from '@testing-library/react-native';
import { Dimensions, PixelRatio } from 'react-native';
import { display, heading, useResponsiveTypography } from '../typography';

describe('useResponsiveTypography', () => {
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

  it('creates responsive typography with base sizes at reference dimensions', () => {
    const { result } = renderHook(() => useResponsiveTypography());

    expect(result.current.responsive.display.display1.fontSize).toBe(
      display.display1.fontSize
    );
    expect(result.current.responsive.heading.h1.fontSize).toBe(
      heading.h1.fontSize
    );
  });
});
