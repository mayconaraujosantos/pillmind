const createReactNativeMock = (width: number, height: number) => ({
  Dimensions: {
    get: jest.fn(() => ({ width, height })),
  },
  Platform: { OS: 'ios' },
  PixelRatio: {
    roundToNearestPixel: (value: number) => value,
    get: () => 2,
    getFontScale: () => 1,
  },
});

const loadDimensionsModule = (width: number, height: number) => {
  jest.resetModules();
  jest.doMock('react-native', () => createReactNativeMock(width, height));

  return require('@shared/utils/dimensions') as typeof import('@shared/utils/dimensions');
};

describe('dimensions utilities', () => {
  it('should calculate base scales correctly', () => {
    const dimensions = loadDimensionsModule(375, 812);

    expect(dimensions.SCREEN_WIDTH).toBe(375);
    expect(dimensions.SCREEN_HEIGHT).toBe(812);
    expect(dimensions.widthScale).toBeCloseTo(1);
    expect(dimensions.heightScale).toBeCloseTo(1);

    expect(dimensions.wp(50)).toBeCloseTo(187.5);
    expect(dimensions.hp(25)).toBeCloseTo(203);
    expect(dimensions.fs(16)).toBe(16);
    expect(dimensions.scaleWidth(12)).toBe(12);
    expect(dimensions.scaleHeight(14)).toBe(14);
    expect(dimensions.scale(20)).toBe(20);
  });

  it('should detect device size categories', () => {
    const small = loadDimensionsModule(360, 680);
    expect(small.isSmallDevice()).toBe(true);
    expect(small.isMediumDevice()).toBe(false);
    expect(small.isLargeDevice()).toBe(false);

    const medium = loadDimensionsModule(390, 820);
    expect(medium.isSmallDevice()).toBe(false);
    expect(medium.isMediumDevice()).toBe(true);
    expect(medium.isLargeDevice()).toBe(false);

    const large = loadDimensionsModule(430, 940);
    expect(large.isSmallDevice()).toBe(false);
    expect(large.isMediumDevice()).toBe(false);
    expect(large.isLargeDevice()).toBe(true);
  });

  it('should return device-size specific values', () => {
    const small = loadDimensionsModule(360, 680);
    expect(small.deviceSize('s', 'm', 'l')).toBe('s');

    const medium = loadDimensionsModule(390, 820);
    expect(medium.deviceSize('s', 'm', 'l')).toBe('m');

    const large = loadDimensionsModule(430, 940);
    expect(large.deviceSize('s', 'm', 'l')).toBe('l');
  });

  it('should use fallback value when device size is unknown', () => {
    const dimensions = loadDimensionsModule(375, 812);
    expect(dimensions.deviceSize('s', 'm', 'l', 'fallback')).toBe('m');
  });

  it('should expose adaptive tokens and device info', () => {
    const dimensions = loadDimensionsModule(360, 680);

    expect(dimensions.adaptiveSpacing.sm).toBe(8);
    expect(dimensions.adaptiveFontSizes.md).toBe(14);

    expect(dimensions.deviceInfo).toEqual(
      expect.objectContaining({
        width: 360,
        height: 680,
        isSmall: true,
        isMedium: false,
        isLarge: false,
        platform: 'ios',
        pixelRatio: 2,
        fontScale: 1,
      })
    );
  });

  it('should log device info with size label', () => {
    const dimensions = loadDimensionsModule(360, 680);
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    dimensions.logDeviceInfo();

    expect(consoleSpy).toHaveBeenCalledWith(
      '📱 Device Info:',
      expect.objectContaining({
        width: 360,
        height: 680,
        size: 'Small',
        platform: 'ios',
      })
    );

    consoleSpy.mockRestore();
  });
});
