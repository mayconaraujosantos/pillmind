import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { useSplashScreen } from '../useSplashScreen';
import { SPLASH_SCREEN_CONFIG } from '../../constants/splashScreen.constants';

jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(),
  hideAsync: jest.fn(),
}));

const splash = jest.requireMock('expo-splash-screen');

const HookTester = ({
  options,
  onState,
}: {
  options?: Parameters<typeof useSplashScreen>[0];
  onState: (state: ReturnType<typeof useSplashScreen>) => void;
}) => {
  const state = useSplashScreen(options);

  React.useEffect(() => {
    onState(state);
  }, [state, onState]);

  return null;
};

describe('useSplashScreen', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  it('hides splash after minimum display time and calls onFinish', async () => {
    const onFinish = jest.fn();
    (splash.hideAsync as jest.Mock).mockResolvedValue(undefined);
    const onState = jest.fn();

    render(<HookTester onState={onState} options={{ onFinish }} />);

    await act(async () => {
      jest.advanceTimersByTime(SPLASH_SCREEN_CONFIG.MINIMUM_DISPLAY_TIME);
    });

    await waitFor(() => {
      expect(splash.hideAsync).toHaveBeenCalled();
      expect(onFinish).toHaveBeenCalled();
      expect(onState).toHaveBeenLastCalledWith({
        isAppReady: true,
        isSplashReady: true,
      });
    });
  });

  it('does not hide splash before app is ready', () => {
    (splash.hideAsync as jest.Mock).mockResolvedValue(undefined);

    render(<HookTester onState={() => {}} />);

    // Before advancing timers, splash should not be hidden
    expect(splash.hideAsync).not.toHaveBeenCalled();
  });

  it('still calls onFinish when hideAsync throws', async () => {
    const onFinish = jest.fn();
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    (splash.hideAsync as jest.Mock).mockRejectedValue(new Error('boom'));

    render(<HookTester onState={() => {}} options={{ onFinish }} />);

    await act(async () => {
      jest.advanceTimersByTime(SPLASH_SCREEN_CONFIG.MINIMUM_DISPLAY_TIME);
    });

    await waitFor(() => {
      expect(onFinish).toHaveBeenCalled();
      expect(warnSpy).toHaveBeenCalled();
    });

    warnSpy.mockRestore();
  });
});
