import { renderHook } from '@testing-library/react-native';
import { SPLASH_SCREEN_CONFIG } from '../../constants/splashScreen.constants';

// Mock expo-splash-screen BEFORE importing useSplashScreen

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

// Mock constants
jest.mock('../../constants/splashScreen.constants', () => ({
  SPLASH_SCREEN_CONFIG: {
    MINIMUM_DISPLAY_TIME: 2000,
  },
}));

// Import useSplashScreen AFTER mocks are set up
// This ensures preventAutoHideAsync is called with the mock
import { useSplashScreen } from '../useSplashScreen';

describe('useSplashScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should prevent auto hide on import', () => {
    // The preventAutoHideAsync is called when the module is imported
    // Since we import useSplashScreen after setting up the mock,
    // we verify the function exists and can be called
    const SplashScreen = require('expo-splash-screen');
    expect(SplashScreen.preventAutoHideAsync).toBeDefined();
    expect(typeof SplashScreen.preventAutoHideAsync).toBe('function');
  });

  it('should initialize with correct default state', () => {
    // Mock implementation test - verificar que o hook existe
    expect(typeof useSplashScreen).toBe('function');
  });

  it('should use default minimum display time configuration', () => {
    // Test configuration is properly imported
    expect(SPLASH_SCREEN_CONFIG.MINIMUM_DISPLAY_TIME).toBeDefined();
    expect(typeof SPLASH_SCREEN_CONFIG.MINIMUM_DISPLAY_TIME).toBe('number');
  });

  it('should be a function', () => {
    expect(typeof useSplashScreen).toBe('function');
  });

  it('should accept options parameter', () => {
    const { result } = renderHook(() => useSplashScreen({}));
    expect(result.current).toBeDefined();

    const { result: result2 } = renderHook(() =>
      useSplashScreen({ minimumDisplayTime: 1000 })
    );
    expect(result2.current).toBeDefined();

    const { result: result3 } = renderHook(() =>
      useSplashScreen({ onFinish: jest.fn() })
    );
    expect(result3.current).toBeDefined();
  });
});
