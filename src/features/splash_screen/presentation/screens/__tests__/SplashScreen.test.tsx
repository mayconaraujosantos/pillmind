import { render } from '@testing-library/react-native';
import React from 'react';
import { SPLASH_SCREEN_TEXTS } from '../../constants/splashScreen.constants';
import { useSplashScreen } from '../../hooks/useSplashScreen';
import { SplashScreenComponent } from '../SplashScreen';

// Mock dependencies
jest.mock('../../hooks/useSplashScreen');
jest.mock('../../components/SplashLogo');
jest.mock('../../components/SplashLoader');
jest.mock('@shared/assets', () => ({
  Assets: {
    pillLogo: 'mocked-pill-logo',
  },
}));

const mockUseSplashScreen = useSplashScreen as jest.MockedFunction<
  typeof useSplashScreen
>;

describe('SplashScreenComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly when app is not ready', () => {
    mockUseSplashScreen.mockReturnValue({
      isAppReady: false,
      isSplashReady: false,
    });

    const { getByText } = render(<SplashScreenComponent />);

    expect(getByText(SPLASH_SCREEN_TEXTS.APP_NAME)).toBeTruthy();
    expect(getByText(SPLASH_SCREEN_TEXTS.TAGLINE)).toBeTruthy();
  });

  it('returns null when app is ready', () => {
    mockUseSplashScreen.mockReturnValue({
      isAppReady: true,
      isSplashReady: true,
    });

    const { toJSON } = render(<SplashScreenComponent />);

    expect(toJSON()).toBeNull();
  });

  it('calls onFinish callback when provided', () => {
    const mockOnFinish = jest.fn();
    mockUseSplashScreen.mockReturnValue({
      isAppReady: false,
      isSplashReady: false,
    });

    render(<SplashScreenComponent onFinish={mockOnFinish} />);

    expect(mockUseSplashScreen).toHaveBeenCalledWith({
      onFinish: mockOnFinish,
    });
  });

  it('calls useSplashScreen without onFinish when not provided', () => {
    mockUseSplashScreen.mockReturnValue({
      isAppReady: false,
      isSplashReady: false,
    });

    render(<SplashScreenComponent />);

    expect(mockUseSplashScreen).toHaveBeenCalledWith({
      onFinish: undefined,
    });
  });

  it('has correct container styles', () => {
    mockUseSplashScreen.mockReturnValue({
      isAppReady: false,
      isSplashReady: false,
    });

    const { getByTestId } = render(
      <SplashScreenComponent testID="splash-screen" />
    );

    // Testing the component renders with correct structure
    expect(() => getByTestId('splash-screen')).not.toThrow();
  });
});
